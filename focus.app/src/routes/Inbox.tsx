import { Box, Button, Typography } from "@mui/material";
import update from "immutability-helper";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
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

  function setCompleted(cardNo: number, complete: boolean) {
    if (!cardNo) {
      app.toast(`invalid cardNo: ${cardNo}`, "error");
      return;
    }

    const service = app.client();
    if (!service) return;

    (async () => {
      const updated = await service.completeCard(cardNo, complete);

      setCards((prev) => update(prev, { index: { $set: updated } }));
    })();
  }

  const [ranking, setRanking] = useState(false);
  async function rankUp(cardNo: number) {
    if (ranking) return;
    const index = cards.findIndex((c) => c.cardNo === cardNo);
    if (index === 0) {
      app.toast("can't not move up top card", "info");
      return;
    }

    setRanking(true);
    await app
      .client()!
      .rankUpCard(cardNo, cards[index - 1].cardNo)
      .then(() => {
        throw new Error("update()로 변경");
      })
      .catch((e: any) => app.toast(e.message, "error"))
      .finally(() => setRanking(false));
  }

  async function rankDown(cardNo: number) {
    if (ranking) return;
    const index = cards.findIndex((c) => c.cardNo === cardNo);
    if (index === cards.length - 1) {
      app.toast("can't not move down last card", "info");
      return;
    }

    setRanking(true);
    await app
      .client()!
      .rankDownCard(cardNo, cards[index + 1].cardNo)
      .then(() => {
        throw new Error("update()로 변경");
      })
      .catch((e: any) => app.toast(e.message, "error"))
      .finally(() => setRanking(false));
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
        .then((r) =>
          setCards((prev) => prev.filter((item) => item.cardNo !== cardNo))
        )
        .catch((e) => app.toast(e, "error"))
        .finally(() => setDeletingCard(false));
    })();
  }

  const [cards, setCards] = useState<Card.AsObject[]>([]);
  useEffect(() => {
    refreshCards();
  }, []);

  function refreshCards() {
    (async () => {
      const service = app.client();
      if (!service) return;

      await service
        .listCards()
        .then((r) => setCards(r))
        .catch((e) => app.toast(e.message, "error"));
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

  const onHover = useCallback((dragIndex: number, hoverIndex: number) => {
    console.log(`hover: dragIndex: ${dragIndex}, hoverIndex: ${hoverIndex}`);

    setCards((prevItems: Card.AsObject[]) =>
      update(prevItems, {
        $splice: [
          [dragIndex, 1],
          [hoverIndex, 0, prevItems[dragIndex] as Card.AsObject],
        ],
      })
    );
  }, []);

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
        showCardNo={false}
        onChange={handleCardChange}
        onActionClick={handleCardAction}
        onHoverCard={onHover}
      />
      <CardBar ref={cardBarRef} />
    </>
  );
}
