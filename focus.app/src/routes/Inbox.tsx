import { Box, Typography } from "@mui/material";
import update from "immutability-helper";
import { useEffect, useRef, useState } from "react";
import { useFocusApp, useFocusClient } from "../FocusProvider";
import { Event } from "../lib/api";
import { CardBar, ICardBar } from "../lib/components/CardBar";
import { CardListView, ICardListView } from "../lib/components/CardList";
import {
  ContextMenu,
  IContextMenu,
  PopupContextMenu,
} from "../lib/components/ContextMenu";
import { LabelSelector } from "../lib/components/LabelSelector";
import { Card, Label } from "../lib/proto/focus_pb";

export function InboxPage() {
  const app = useFocusApp();
  const api = useFocusClient();

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
  function handleSelectCard(cardNo: number) {
    cardBarRef.current && cardBarRef.current.setCardNo(cardNo);
  }

  const [selectedLabels, setSelectedLabels] = useState<number[]>([]);
  function handleLabelChange(labels: number[]) {
    setSelectedLabels(labels);
  }

  const [cards, setCards] = useState<Card.AsObject[]>([]);
  useEffect(() => {
    api
      .listCards({ labels: selectedLabels })
      .then((r) => setCards(r))
      .catch((e) => app.toast(e.message, "error"));
  }, [selectedLabels]);

  function handleLabelClick(id: number) {
    if (selectedLabels.indexOf(id) === -1)
      setSelectedLabels((p) => update(p, { $push: [id] }));
  }

  const cardListRef = useRef<ICardListView>(null);
  const contextMenuRef = useRef<IContextMenu>(null);
  const deferMenuRef = useRef<IContextMenu>(null);

  return (
    <>
      <Box display="flex">
        <Typography variant="h5" flexGrow={1}>
          Inbox cards
        </Typography>
        <Box flexGrow={0}>
          <LabelSelector
            labels={labels}
            selected={selectedLabels}
            sx={{ minWidth: { md: "300px" } }}
            onSelectionChange={handleLabelChange}
          />
        </Box>
      </Box>

      <CardListView
        ref={cardListRef}
        cards={cards}
        showCardNo={false}
        onDoubleClick={() => cardBarRef.current && cardBarRef.current.toggle()}
        onSelect={handleSelectCard}
        onContextMenu={(e) => PopupContextMenu(e, contextMenuRef)}
        onLabelClick={handleLabelClick}
      />
      <ContextMenu
        ref={contextMenuRef}
        items={[
          {
            label: "Challenge this...",
            hotkey: "⌘+Ctrl+C",
            onClick: () => app.toast("not implemented"),
          },
          { label: "-" },
          {
            label: "defer until...",
            onClick: (e) => PopupContextMenu(e, deferMenuRef),
          },
          { label: "due to...", onClick: () => app.toast("not implemented") },
        ]}
      />
      <ContextMenu
        ref={deferMenuRef}
        items={[
          {
            label: "defer until Tomorrow",
            hotkey: "⌘+Ctrl+T",
            onClick: () => app.toast("not implemented"),
          },
          {
            label: "defer until next Week",
            hotkey: "⌘+Ctrl+W",
            onClick: () => app.toast("not implemented"),
          },
          {
            label: "defer until next Month",
            onClick: () => app.toast("not implemented"),
          },
        ]}
      />
      <CardBar ref={cardBarRef} />
    </>
  );
}
