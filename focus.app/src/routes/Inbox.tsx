import { Box, Typography } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { useFocusApp, useFocusClient } from "../FocusProvider";
import { CardBar, ICardBar } from "../lib/components/CardBar";
import { CardListView, ICardListView } from "../lib/components/CardList";
import { LabelOption, LabelSelector } from "../lib/components/LabelSelector";
import { Card, Label } from "../lib/proto/focus_pb";

export function InboxPage() {
  const app = useFocusApp();
  const api = useFocusClient();

  useEffect(() => {
    const handler = api.addEventListener("card.created", (cardNo: number) => {
      api
        .getCard(cardNo)
        .then((r) => cardListRef.current && cardListRef.current.addCard(r))
        .catch((e) => app.toast(e.message, "error"));
    });
    return () => api.removeEventListener(handler);
  }, [api, app]);

  const [labels, setLabels] = useState<Label.AsObject[]>([]);
  useEffect(() => {
    api
      .listLabels()
      .then((r) => setLabels(r))
      .catch((e) => app.toast(e.message, "error"));
  }, []);

  const cardBarRef = useRef<ICardBar>(null);
  function handleSelectCard(cardNo: number) {
    cardBarRef.current && cardBarRef.current.setCardNo(cardNo);
  }

  const [selectedLabels, setSelectedLabels] = useState<number[]>([]);
  function handleLabelChange(labels: LabelOption[]) {
    setSelectedLabels(labels.map((x) => x.id));
  }

  const [cards, setCards] = useState<Card.AsObject[]>([]);
  useEffect(() => {
    api
      .listCards({ labels: selectedLabels })
      .then((r) => setCards(r))
      .catch((e) => app.toast(e.message, "error"));
  }, [selectedLabels]);

  const cardListRef = useRef<ICardListView>(null);
  return (
    <>
      <Box display="flex">
        <Typography variant="h5" flexGrow={1}>
          Inbox cards
        </Typography>
        <Box flexGrow={0}>
          <LabelSelector
            labels={labels}
            selection={selectedLabels}
            sx={{ minWidth: { md: "300px" } }}
            onChange={handleLabelChange}
          />
        </Box>
      </Box>

      <CardListView
        ref={cardListRef}
        cards={cards}
        showCardNo={false}
        onDoubleClick={() => cardBarRef.current && cardBarRef.current.toggle()}
        onSelect={handleSelectCard}
      />
      <CardBar ref={cardBarRef} />
    </>
  );
}
