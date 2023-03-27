import { Box, Typography } from "@mui/material";
import update from "immutability-helper";
import { useEffect, useRef, useState } from "react";
import { useFocusApp, useFocusClient } from "../FocusProvider";
import { CardBar, ICardBar } from "../lib/components/CardBar";
import { CardListView } from "../lib/components/CardList";
import { Card } from "../lib/proto/focus_pb";

export function InboxPage() {
  const app = useFocusApp();
  const api = useFocusClient();

  useEffect(() => {
    const handler = api.addEventListener(
      "card.created",
      async (cardNo: number) => {
        await api
          .getCard(cardNo)
          .then((r) => setCards((p) => update(p, { $push: [r] })))
          .catch((e) => app.toast(e.message, "error"));
      }
    );
    const handler2 = api.addEventListener(
      "card.updated",
      async (cardNo: number) => {
        // FIXME 여기서 업데이트하면 Inbox.card가 업데이트 되면서
        // CardView의 state를 망가트림.. 일단 제거함
        return;
        await api
          .getCard(cardNo)
          .then((r) =>
            setCards((p) => p.map((c) => (c.cardNo === cardNo ? r : c)))
          )
          .catch((e) => app.toast(e.message, "error"));
      }
    );

    return () => {
      api.removeEventListener(handler);
      api.removeEventListener(handler2);
    };
  }, [api]);

  const [cards, setCards] = useState<Card.AsObject[]>([]);
  useEffect(() => {
    (async () => {
      await api
        .listCards()
        .then((r) => setCards(r))
        .catch((e) => app.toast(e.message, "error"));
    })();
  }, []);

  function handleCardChange(index: number, subject: string) {
    (async () => {
      const card = cards[index];
      await api
        .updateCardSubject(card.cardNo, subject)
        .then(() => {
          card.subject = subject;

          setCards((prevItems: Card.AsObject[]) =>
            update(prevItems, { index: { $set: card } })
          );
        })
        .catch((e) => app.toast(e.message, "error"));
    })();
  }

  const cardBarRef = useRef<ICardBar>(null);

  const [dragStartIndex, setDragStartIndex] = useState(-1);
  const [dragStartCard, setDragStartCard] = useState<Card.AsObject | null>(
    null
  );
  const [dragging, setDragging] = useState(false);

  function onDragOver(dragIndex: number, hoverIndex: number) {
    const dragCard = cards[dragIndex];
    const hoverCard = cards[hoverIndex];

    let draggigCard = dragStartCard;
    if (!dragging) {
      draggigCard = dragCard;
      setDragStartCard(dragCard);
      setDragStartIndex(dragIndex);
    }
    setDragging(true);

    let chunk: number[] = [dragIndex];
    if (hasChild(dragIndex)) {
      chunk.push(...getChildCards(dragIndex));
    }

    setCards((p: Card.AsObject[]) =>
      update(p, {
        $splice: [
          [dragIndex, chunk.length],
          [hoverIndex, 0, ...chunk.map((i) => p[i])],
        ],
      })
    );
  }

  function hasChild(index: number): boolean {
    return (
      cards.findIndex((c) => c.parentCardNo === cards[index].cardNo) !== -1
    );
  }

  function getChildCards(index: number): number[] {
    const r: number[] = [];
    cards.forEach((c, i) => isParent(index, i) && r.push(i));
    return r;
  }

  function isParent(i: number, j: number): boolean {
    if (cards[i].cardNo === cards[j].parentCardNo) return true;

    if (cards[j].parentCardNo === 0) return false;
    const p = cards.findIndex((c) => c.cardNo === cards[j].parentCardNo);
    if (p === -1) return false;

    return isParent(i, p);
  }

  // update rank to server
  async function onDragDrop(dragIndex: number, dropIndex: number) {
    setDragging(false);
    setDragStartCard(null);
    setDragStartIndex(-1);

    if (!dragStartCard) return;

    const srcCard = dragStartCard;
    const srcIndex = cards.findIndex((c) => c === srcCard);
    if (srcIndex === -1) return;
    const chunk = getChildCards(srcIndex);
    const destCard = cards[dropIndex + chunk.length + 1];

    // 다른 parent_no로 drop되면 parent, depth 조정
    if (dragStartCard?.parentCardNo !== destCard.parentCardNo) {
      const depthBegin = destCard.depth;

      // child depth 조정
      walk(dragStartCard!.cardNo, (depth: number, card: Card.AsObject) => {
        card.depth = depthBegin + depth;
      });

      dragStartCard!.depth = destCard.depth;
      dragStartCard!.parentCardNo = destCard.parentCardNo;
    }

    await api
      .rerankCard(srcCard.cardNo, destCard.cardNo)
      .catch((e) => app.toast(e.message, "error"));
  }

  function walk(
    cardNo: number,
    callback: (depth: number, card: Card.AsObject) => void
  ) {
    function walk_(depth: number, cardNo: number) {
      cards
        .filter((c) => c.parentCardNo === cardNo)
        .forEach((c) => {
          callback(depth, c);
          walk_(depth + 1, c.cardNo);
        });
    }

    walk_(1, cardNo);
  }

  return (
    <>
      <Box display="flex">
        <Typography variant="h5" flexGrow={1}>
          Inbox cards
        </Typography>
        <Box flexGrow={0}></Box>
      </Box>

      <CardListView
        items={cards}
        showCardNo={false}
        onDoubleClick={() => cardBarRef.current && cardBarRef.current.toggle()}
        onSelect={(index) =>
          cardBarRef.current &&
          cardBarRef.current.setCardNo(cards[index].cardNo)
        }
        onChange={handleCardChange}
        onDragOver={onDragOver}
        onDragDrop={onDragDrop}
      />
      <CardBar ref={cardBarRef} />
    </>
  );
}
