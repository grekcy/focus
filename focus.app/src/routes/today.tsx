import { Box, Typography } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { useFocusApp, useFocusClient } from "../FocusProvider";
import { CardBar, ICardBar } from "../lib/components/CardBar";
import { CardListView } from "../lib/components/CardList";
import { Card } from "../lib/proto/focus_pb";

export function TodayPage() {
  const app = useFocusApp();
  const api = useFocusClient();

  const cardBarRef = useRef<ICardBar>(null);

  const [cards, setCards] = useState<Card.AsObject[]>([]);
  useEffect(() => {
    api
      .listCards()
      .then((r) => setCards(r))
      .catch((e) => app.toast(e.message, "error"));
  }, []);

  return (
    <>
      <Box display="flex">
        <Typography variant="h5" flexGrow={1}>
          Today
        </Typography>
        <Box flexGrow={0}></Box>
      </Box>

      <CardListView cards={cards} />
      <CardBar ref={cardBarRef} />
    </>
  );
}
