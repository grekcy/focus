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
import { datetime } from "../lib/datetime";
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
  const [cardNo, setCardNo] = useState(-1);
  function handleSelectCard(cardNo: number) {
    if (cardBarRef.current) {
      cardBarRef.current.setCardNo(cardNo);
      setCardNo(cardNo);
    }
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

  function deferUntilTomorrow() {
    if (cardNo === -1) return;

    const deferUntil = datetime
      .now()
      .set("hour", 9)
      .set("minute", 0)
      .set("second", 0)
      .add(1, "day")
      .toDate();

    api
      .updateCardDeferUntil(cardNo, deferUntil)
      .then((r) =>
        app.toast(`card ${cardNo} defered until ${deferUntil.toLocaleString()}`)
      )
      .catch((e) => app.toast(e.message, "error"));
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
        actions={[
          {
            label: "Challenge this...",
            hotkey: "⌘+Ctrl+C",
            onExecute: () => app.toast("not implemented"),
          },
          { label: "-" },
          {
            label: "defer until...",
            onExecute: (e) => PopupContextMenu(e, deferMenuRef),
          },
          { label: "due to...", onExecute: () => app.toast("not implemented") },
        ]}
      />
      <ContextMenu
        ref={deferMenuRef}
        actions={[
          {
            label: "defer until Tomorrow",
            hotkey: "⌘+Ctrl+T",
            onExecute: () => deferUntilTomorrow(),
          },
          {
            label: "defer until next Week",
            hotkey: "⌘+Ctrl+W",
            onExecute: () => app.toast("not implemented"),
          },
          {
            label: "defer until next Month",
            onExecute: () => app.toast("not implemented"),
          },
        ]}
      />
      <CardBar ref={cardBarRef} />
    </>
  );
}
