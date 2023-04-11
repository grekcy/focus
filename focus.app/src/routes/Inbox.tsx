import {
  Box,
  Checkbox,
  FormControlLabel,
  Stack,
  Typography,
} from "@mui/material";
import update from "immutability-helper";
import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useFocusApp, useFocusClient } from "../FocusProvider";
import { Event } from "../lib/api";
import { CardBar, ICardBar } from "../lib/components/CardBar";
import { CardListView, ICardListView } from "../lib/components/CardList";
import { LabelSelector } from "../lib/components/LabelSelector";
import { Card, Label } from "../lib/proto/focus_v1alpha1_pb";

export function InboxPage() {
  const app = useFocusApp();
  const api = useFocusClient();

  // TODO useSearchParamsState
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const handler = api.addEventListener(
      Event.CARD_CREATED,
      (cardNo: number) => {
        api
          .getCard(cardNo)
          .then((r) => cardListRef.current && cardListRef.current.addCard(r))
          .catch((e) => app.toast(e.message, "error"));
      }
    );
    return () => api.removeEventListener(handler);
  }, []);

  const [labels, setLabels] = useState<Label.AsObject[]>([]);
  useEffect(() => {
    api
      .listLabels()
      .then((r) => setLabels(r))
      .catch((e) => app.toast(e.message, "error"));
  }, []);

  const cardBarRef = useRef<ICardBar>(null);
  const [cardNo, setCardNo] = useState(-1);
  function handleSelectCard(cardNo: number) {
    if (cardBarRef.current) cardBarRef.current.setCardNo(cardNo);
    setCardNo(cardNo);
  }

  const [selectedLabels, setSelectedLabels] = useState<number[]>(
    searchParams
      .getAll("label")
      .map((x) => parseInt(x))
      .filter((x) => !isNaN(x))
  );

  const [withDeferred, setWithDeferred] = useState(
    searchParams.get("deferred") === "true"
  );

  const [cards, setCards] = useState<Card.AsObject[]>([]);
  useEffect(() => {
    setSearchParams((p) => {
      if (withDeferred) p.set("deferred", withDeferred.toString());
      else p.delete("deferred");

      p.delete("label");
      selectedLabels.forEach((x) => p.append("label", x.toString()));
      return p;
    });

    api
      .listCards({ labels: selectedLabels, includeDeferred: withDeferred })
      .then((r) => setCards(r))
      .catch((e) => app.toast(e.message, "error"));
  }, [selectedLabels, withDeferred]);

  function handleLabelClick(id: number) {
    if (selectedLabels.indexOf(id) === -1)
      setSelectedLabels((p) => update(p, { $push: [id] }));
  }

  const cardListRef = useRef<ICardListView>(null);

  return (
    <>
      <Box display="flex">
        <Typography variant="h5" flexGrow={1}>
          Inbox cards
          <Typography display="inline" sx={{ pl: "1rem" }}>
            collect idea, organize and make Inbox to zero.
          </Typography>
        </Typography>
        <Box flexGrow={0}>
          <Stack direction="row">
            <FormControlLabel
              label="show deferred"
              control={
                <Checkbox
                  checked={withDeferred}
                  onChange={() => setWithDeferred((p) => !p)}
                />
              }
            />
            <LabelSelector
              labels={labels}
              selected={selectedLabels}
              onSelectionChange={(labels) => setSelectedLabels(labels)}
              sx={{ minWidth: { md: "300px" } }}
            />
          </Stack>
        </Box>
      </Box>

      {cards.length === 0 && <>There is no card in INBOX!</>}

      <CardListView
        ref={cardListRef}
        cards={cards}
        showCardNo={false}
        onDoubleClick={() => cardBarRef.current && cardBarRef.current.toggle()}
        onSelect={handleSelectCard}
        onLabelClick={handleLabelClick}
      />

      <CardBar ref={cardBarRef} />
    </>
  );
}
