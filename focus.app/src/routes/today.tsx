import { Box, Typography } from "@mui/material";
import update from "immutability-helper";
import { useEffect, useRef, useState } from "react";
import { useFocusApp, useFocusClient } from "../FocusProvider";
import { CardBar, ICardBar } from "../lib/components/CardBar";
import { CardListView } from "../lib/components/CardList";
import { Card } from "../lib/proto/focus_pb";

export function TodayPage() {
  const app = useFocusApp();
  const api = useFocusClient();

  const cardBarRef = useRef<ICardBar>(null);
  const [items, setItems] = useState<Card.AsObject[]>([]);

  useEffect(() => {
    (async () => {
      api
        .listCards(true, false)
        .then((r) => setItems(r))
        .catch((e) => app.toast(e.message, "error"));
    })();
  }, [api]);

  function onDragOver(dragIndex: number, hoverIndex: number) {
    setItems((prevItems: Card.AsObject[]) =>
      update(prevItems, {
        $splice: [
          [dragIndex, 1],
          [hoverIndex, 0, prevItems[dragIndex] as Card.AsObject],
        ],
      })
    );
  }

  function handleCardChange(index: number, subject: string) {
    (async () => {
      const card = items[index];
      await api
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
        <Box flexGrow={0}></Box>
      </Box>

      <CardListView
        items={items}
        onChange={handleCardChange}
        onDragOver={onDragOver}
      />
      <CardBar ref={cardBarRef} />
    </>
  );
}
