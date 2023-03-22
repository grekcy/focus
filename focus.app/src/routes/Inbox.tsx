import { Box, Button, Typography } from "@mui/material";
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

    return () => app.client()!.removeEventListener(handler);
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
      const updated = await service.completeCard(cardNo, complete);

      setCards((p) => update(p, { index: { $set: updated } }));
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
  function cardBarToggle() {
    cardBarRef.current && cardBarRef.current.toggle();
  }

  const [dragStartCardNo, setDragStartCardNo] = useState(-1);
  const [dragging, setDragging] = useState(false);

  function onDrogOver(dragIndex: number, hoverIndex: number) {
    if (!dragging) {
      setDragStartCardNo(cards[dragIndex].cardNo);
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

  async function onDragDrop(dragIndex: number, dropIndex: number) {
    setDragging(false);

    const srcCardNo = dragStartCardNo;
    const destCardNo = cards[dropIndex + 1].cardNo;

    console.log(`onDragDrop: ${srcCardNo} ${destCardNo}`);

    setDragStartCardNo(-1);

    const r = await app
      .client()!
      .rerankCard(srcCardNo, destCardNo)
      .catch((e) => app.toast(e.message, "error"));
  }

  return (
    <>
      <Box display="flex">
        <Typography variant="h5" flexGrow={1}>
          Inbox cards
        </Typography>
        <Box flexGrow={0}>
          <Button onClick={() => cardBarToggle()}>Show Card</Button>
        </Box>
      </Box>

      <CardListView
        items={cards}
        showCardNo={true}
        onChange={handleCardChange}
        onActionClick={handleCardAction}
        onDrogOver={onDrogOver}
        onDragDrop={onDragDrop}
      />
      <CardBar ref={cardBarRef} />
    </>
  );
}
