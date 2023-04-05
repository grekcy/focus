import {
  Box,
  Checkbox,
  FormControlLabel,
  Stack,
  Typography,
} from "@mui/material";
import update from "immutability-helper";
import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useFocusApp, useFocusClient } from "../FocusProvider";
import { Event } from "../lib/api";
import { actDivider, useAction } from "../lib/components/Action";
import { CardBar, ICardBar } from "../lib/components/CardBar";
import { CardListView, ICardListView } from "../lib/components/CardList";
import {
  ContextMenu,
  IContextMenu,
  popupContextMenu,
} from "../lib/components/ContextMenu";
import { LabelSelector } from "../lib/components/LabelSelector";
import { datetime } from "../lib/datetime";
import { Card, Label } from "../lib/proto/focus_pb";

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
    if (cardBarRef.current) {
      cardBarRef.current.setCardNo(cardNo);
      setCardNo(cardNo);
    }
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

  const [actChallengeThis] = useAction({
    label: "Challenge this",
    hotkey: "⌘+Ctrl+C",
    onEnabled: () => cardNo !== -1,
    onExecute: () => app.toast("challenge this: not implemented"),
  });

  function updateDeferUntil(deferUntil: Date | null) {
    if (cardNo === -1) return;

    api
      .updateCardDeferUntil(cardNo, deferUntil)
      .then((r) =>
        deferUntil
          ? app.toast(
              `card ${cardNo} defered until ${deferUntil.toLocaleString()}`
            )
          : app.toast(`card ${cardNo} clear defered`)
      )
      .catch((e) => app.toast(e.message, "error"));
  }
  const [actDeferUntilTomorrow] = useAction({
    label: "defer until Tomorrow",
    hotkey: "⌘+Ctrl+T",
    onEnabled: () => !!selectedCard,
    onExecute: () =>
      updateDeferUntil(datetime.workTime().add(1, "day").toDate()),
  });
  const [actDeferUntilNextWeek] = useAction({
    label: "defer until next Week",
    hotkey: "⌘+Ctrl+W",
    onEnabled: () => !!selectedCard,
    onExecute: () =>
      updateDeferUntil(datetime.workTime().add(7, "day").toDate()),
  });
  const [actDeferUntilNextMonth] = useAction({
    label: "defer later...",
    onEnabled: () => !!selectedCard,
    onExecute: () =>
      updateDeferUntil(
        datetime
          .workTime()
          .add(Math.random() * 30 + 7, "day")
          .toDate()
      ),
  });

  const selectedCard = useMemo(() => {
    if (cardNo === -1) return;
    return cards.find((c) => c.cardNo === cardNo);
  }, [cardNo, cards]);

  const [actClearDefer] = useAction({
    label: "clear defer",
    onEnabled: () => !!selectedCard && !!selectedCard.deferUntil,
    onExecute: () => updateDeferUntil(null),
  });

  function updateDueDate(dueDate: Date | null) {
    if (cardNo === -1) return;

    api
      .updateCardDueDate(cardNo, dueDate)
      .then((r) =>
        dueDate
          ? app.toast(
              `set card ${cardNo} due date to ${dueDate.toLocaleString()}`
            )
          : app.toast(`card ${cardNo} due date cleared`)
      )
      .catch((e) => app.toast(e.message, "error"));
  }

  const [actDueToTomorrow] = useAction({
    label: "due to Tomorrow",
    onEnabled: () => !!selectedCard,
    onExecute: () => updateDueDate(datetime.workTime().add(1, "day").toDate()),
  });

  const [actDueToNextWeek] = useAction({
    label: "due to next Week",
    onEnabled: () => !!selectedCard,
    onExecute: () => updateDueDate(datetime.workTime().add(7, "day").toDate()),
  });

  const [actDueToLater] = useAction({
    label: "due to later...",
    onEnabled: () => !!selectedCard,
    onExecute: () =>
      updateDueDate(
        datetime
          .workTime()
          .add(Math.random() * 30 + 7, "day")
          .toDate()
      ),
  });

  const [actClearDueDate] = useAction({
    label: "clear due date",
    onEnabled: () => !!selectedCard && !!selectedCard.dueDate,
    onExecute: () => updateDueDate(null),
  });

  const cardListRef = useRef<ICardListView>(null);
  const contextMenuRef = useRef<IContextMenu>(null);

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
        onContextMenu={(e) => popupContextMenu(e, contextMenuRef)}
        onLabelClick={handleLabelClick}
      />
      <ContextMenu
        ref={contextMenuRef}
        actions={[
          actChallengeThis,
          actDivider,
          actDeferUntilTomorrow,
          actDeferUntilNextWeek,
          actDeferUntilNextMonth,
          actClearDefer,
          actDivider,
          actDueToTomorrow,
          actDueToNextWeek,
          actDueToLater,
          actClearDueDate,
        ]}
      />

      <CardBar ref={cardBarRef} />
    </>
  );
}
