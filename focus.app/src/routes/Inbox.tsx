import { Box, Typography } from "@mui/material";
import update from "immutability-helper";
import { useContext, useEffect, useRef, useState } from "react";
import { FocusContext, IFocusApp } from "../FocusProvider";
import { CardBar, ICardBar } from "../lib/components/CardBar";
import { CardAction, CardListView } from "../lib/components/CardList";
import { Card } from "../lib/proto/focus_pb";

export function InboxPage() {
  const app: IFocusApp = useContext(FocusContext);

  useEffect(() => {
    const handler = app
      .client()!
      .addEventListener("card.created", async (cardNo: number) => {
        await app
          .client()
          ?.getCard(cardNo)
          .then((r) => setCards((p) => update(p, { $push: [r] })))
          .catch((e) => app.toast(e.message, "error"));
      });
    const handler2 = app
      .client()!
      .addEventListener("card.updated", async (cardNo: number) => {
        await app
          .client()
          ?.getCard(cardNo)
          .then((r) =>
            setCards((p) => p.map((c) => (c.cardNo === cardNo ? r : c)))
          )
          .catch((e) => app.toast(e.message, "error"));
      });

    return () => {
      app.client()!.removeEventListener(handler);
      app.client()!.removeEventListener(handler2);
    };
  }, []);

  const [cards, setCards] = useState<Card.AsObject[]>([]);
  useEffect(() => {
    (async () => {
      const service = app.client();
      if (!service) return;

      await service
        .listCards()
        .then((r) => setCards(r))
        .catch((e) => app.toast(e.message, "error"));
    })();
  }, []);

  function setCompleted(cardNo: number, complete: boolean) {
    if (!cardNo) {
      app.toast(`invalid cardNo: ${cardNo}`, "error");
      return;
    }

    const service = app.client();
    if (!service) return;

    (async () => {
      await service
        .completeCard(cardNo, complete)
        .then((r) =>
          setCards((p) => p.map((c) => (c.cardNo === cardNo ? r : c)))
        )
        .catch((e) => app.toast(e.message));
    })();
  }

  const [deletingCard, setDeletingCard] = useState(false);

  function deleteCard(cardNo: number) {
    if (deletingCard) return;

    setDeletingCard(true);
    console.log(`deleting ${cardNo}`);

    const service = app.client();
    if (!service) return;

    (async () => {
      await service!
        .deleteCard(cardNo)
        .then((r) => setCards((p) => p.filter((c) => c.cardNo !== cardNo)))
        .catch((e) => app.toast(e, "error"))
        .finally(() => setDeletingCard(false));
    })();
  }

  function handleCardChange(index: number, subject: string) {
    (async () => {
      const card = cards[index];
      await app
        .client()!
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

  function handleCardAction(index: number, action: CardAction) {
    const card = cards[index];
    switch (action) {
      case CardAction.COMPLETE:
        setCompleted(card.cardNo, true);
        break;
      case CardAction.INPROGRESS:
        setCompleted(card.cardNo, false);
        break;
      case CardAction.DELETE:
        deleteCard(card.cardNo);
        break;
      default:
        app.toast(`unknown action: ${action}`, "error");
    }
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

    setCards((p: Card.AsObject[]) =>
      update(p, {
        $splice: [
          [dragIndex, 1],
          [hoverIndex, 0, p[dragIndex]],
        ],
      })
    );
  }

  // update rank to server
  async function onDragDrop(dragIndex: number, dropIndex: number) {
    setDragging(false);
    setDragStartCard(null);
    setDragStartIndex(-1);

    const srcCardNo = dragStartCard!.cardNo;
    const rankUp = dragStartIndex > dropIndex;
    const destCard = rankUp ? cards[dropIndex + 1] : cards[dropIndex - 1];

    // 다른 parent_no로 drop되면 조정
    dragStartCard!.parentCardNo = destCard.parentCardNo;
    dragStartCard!.depth = destCard.depth;

    return; // TODO 일단 UI에서 작업
    await app
      .client()!
      .rerankCard(srcCardNo, destCard.cardNo)
      .catch((e) => app.toast(e.message, "error"));
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
        showCardNo={true}
        onDoubleClick={() => cardBarRef.current && cardBarRef.current.toggle()}
        onSelect={(index) =>
          cardBarRef.current &&
          cardBarRef.current.setCardNo(cards[index].cardNo)
        }
        onChange={handleCardChange}
        onActionClick={handleCardAction}
        onDragOver={onDragOver}
        onDragDrop={onDragDrop}
      />
      <CardBar ref={cardBarRef} />
    </>
  );
}
