import {
  Box,
  Checkbox,
  FormControlLabel,
  Stack,
  Typography,
} from "@mui/material";
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
  const [withDeferred, setWithDeferred] = useState(false);

  const [cards, setCards] = useState<Card.AsObject[]>([]);
  useEffect(() => {
    api
      .listCards({ labels: selectedLabels, includeDeferred: withDeferred })
      .then((r) => setCards(r))
      .catch((e) => app.toast(e.message, "error"));
  }, [selectedLabels, withDeferred]);

  function handleLabelClick(id: number) {
    if (selectedLabels.indexOf(id) === -1)
      setSelectedLabels((p) => update(p, { $push: [id] }));
  }

  function deferUntil(deferUntil: Date | null) {
    if (cardNo === -1) return;

    api
      .updateCardDeferredUntil(cardNo, deferUntil)
      .then((r) =>
        deferUntil
          ? app.toast(
              `card ${cardNo} defered until ${deferUntil.toLocaleString()}`
            )
          : app.toast(`card ${cardNo} clear defered`)
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
          <Stack direction="row">
            <FormControlLabel
              label="with defered"
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
              sx={{ minWidth: { md: "300px" } }}
              onSelectionChange={(labels) => setSelectedLabels(labels)}
            />
          </Stack>
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
            onExecute: () =>
              deferUntil(datetime.workTime().add(1, "day").toDate()),
          },
          {
            label: "defer until next Week",
            hotkey: "⌘+Ctrl+W",
            onExecute: () =>
              deferUntil(datetime.workTime().add(7, "day").toDate()),
          },
          {
            label: "defer until next Month",
            onExecute: () =>
              deferUntil(datetime.workTime().add(1, "month").toDate()),
          },
          {
            label: "clear defer until",
            onExecute: () => deferUntil(null),
          },
        ]}
      />
      <CardBar ref={cardBarRef} />
    </>
  );
}
