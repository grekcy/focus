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
import { useAction } from "../lib/components/Action";
import { CardBar, ICardBar } from "../lib/components/CardBar";
import { CardListView } from "../lib/components/CardList";
import {
  ContextMenu,
  IContextMenu,
  popupContextMenu,
} from "../lib/components/ContextMenu";
import { LabelChip } from "../lib/components/LabelChip";
import { LabelSelector } from "../lib/components/LabelSelector";
import { datetime } from "../lib/datetime";
import { Card, Label } from "../lib/proto/focus_v1alpha1_pb";

export function TodayPage() {
  const app = useFocusApp();
  const api = useFocusClient();

  const [searchParams, setSearchParams] = useSearchParams();

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
      .listCards({
        startCardType: "",
        labels: selectedLabels,
        excludeCompleted: true,
        includeDeferred: withDeferred,
      })
      .then((r) => setCards(r))
      .catch((e) => app.toast(e.message, "error"));
  }, [withDeferred, selectedLabels]);

  const cardBarRef = useRef<ICardBar>(null);

  const [cardNo, setCardNo] = useState(-1);
  function handleSelectCard(cardNo: number) {
    if (cardBarRef.current) cardBarRef.current.setCardNo(cardNo);
    setCardNo(cardNo);
  }

  const [labels, setLabels] = useState<Label.AsObject[]>([]);
  const [urgentLabels, setUrgentLabels] = useState<Label.AsObject[]>([]);
  useEffect(() => {
    api
      .listLabels(["urgent", "important"])
      .then((r) => {
        setLabels(r);
        setUrgentLabels(
          r.filter((x) => ["urgent", "important"].indexOf(x.label) > -1)
        );
      })
      .catch((e) => app.toast(e.message, "error"));
  }, []);

  function addSelectedLabel(id: number) {
    if (selectedLabels.indexOf(id) === -1)
      setSelectedLabels((p) => update(p, { $push: [id] }));
  }

  const selectedCard = useMemo(() => {
    if (cardNo === -1) return;
    return cards.find((c) => c.cardNo === cardNo);
  }, [cardNo, cards]);

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

  const [actClearDefer] = useAction({
    label: "clear defer",
    onEnabled: () => !!selectedCard && !!selectedCard.deferUntil,
    onExecute: () => updateDeferUntil(null),
  });

  const contextMenuRef = useRef<IContextMenu>(null);

  return (
    <>
      <Box display="flex">
        <Typography variant="h5" flexGrow={1}>
          Today
          <Typography display="inline" sx={{ pl: "1rem" }}>
            focus today. please consider&nbsp;
            {urgentLabels.map((label) => (
              <LabelChip
                label={label.label}
                color={label.color}
                size="small"
                onClick={() => addSelectedLabel(label.id)}
              />
            ))}
            &nbsp;first.
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

      <CardListView
        cards={cards}
        onSelect={handleSelectCard}
        onDoubleClick={() => cardBarRef.current && cardBarRef.current.toggle()}
        onContextMenu={(e) => popupContextMenu(e, contextMenuRef)}
        onLabelClick={(id: number) => addSelectedLabel(id)}
      />

      <ContextMenu
        ref={contextMenuRef}
        actions={[
          // TODO context menu를 상황에 맞게 처리해야할 듯.
          // actChallengeThis,
          // actDivider,
          actDeferUntilTomorrow,
          actDeferUntilNextWeek,
          actDeferUntilNextMonth,
          actClearDefer,
          // actDivider,
          // actDueToTomorrow,
          // actDueToNextWeek,
          // actDueToLater,
          // actClearDueDate,
        ]}
      />

      <CardBar ref={cardBarRef} />
    </>
  );
}
