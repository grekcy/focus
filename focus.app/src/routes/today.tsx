import { Box, Button, Typography } from "@mui/material";
import update from "immutability-helper";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { FocusContext, IFocusApp } from "../FocusProvider";
import { CardBar, ICardBar } from "../lib/components/CardBar";
import { CardListView } from "../lib/components/CardList";
import { Card } from "../lib/proto/focus_pb";

export function TodayPage() {
  const app: IFocusApp = useContext(FocusContext);

  const cardBarRef = useRef<ICardBar>(null);
  function cardBarToggle() {
    cardBarRef.current && cardBarRef.current.toggle();
  }

  const [items, setItems] = useState<Card.AsObject[]>([]);

  useEffect(() => {
    (async () => {
      app
        .client()!
        .listCards(true, false)
        .then((r) => setItems(r))
        .catch((e) => app.toast(e.message, "error"));
    })();
  }, []);

  const moveCard = useCallback((dragIndex: number, hoverIndex: number) => {
    setItems((prevItems: Card.AsObject[]) =>
      update(prevItems, {
        $splice: [
          [dragIndex, 1],
          [hoverIndex, 0, prevItems[dragIndex] as Card.AsObject],
        ],
      })
    );
  }, []);

  function handleCardChange(index: number, subject: string) {
    (async () => {
      const card = items[index];
      await app
        .client()!
        .updateCardSubject(card.cardNo, subject)
        .then(() => {
          card.subject = subject;

          setItems((prevItems: Card.AsObject[]) =>
            update(prevItems, { index: { $set: card } })
          );
        })
        .catch((e) => app.toast(e.message, "error"));
    })();
  }

  return (
    <>
      <Box display="flex">
        <Typography variant="h5" flexGrow={1}>
          Today
        </Typography>
        <Box flexGrow={0}>
          <Button onClick={() => cardBarToggle()}>Show Card</Button>
        </Box>
      </Box>

      <CardListView
        items={items}
        onChange={handleCardChange}
        onHoverCard={moveCard}
      />
      <CardBar ref={cardBarRef} />
    </>
  );
}
