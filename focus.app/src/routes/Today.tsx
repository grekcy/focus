import { Box, Typography } from "@mui/material";
import { useEffect, useMemo, useRef, useState } from "react";
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
import { datetime } from "../lib/datetime";
import { Card, Label } from "../lib/proto/focus_pb";

export function TodayPage() {
  const app = useFocusApp();
  const api = useFocusClient();

  const cardBarRef = useRef<ICardBar>(null);

  const [cards, setCards] = useState<Card.AsObject[]>([]);
  useEffect(() => {
    api
      .listCards({
        startCardType: "",
        excludeCompleted: true,
        includeDeferred: false,
      })
      .then((r) => setCards(r))
      .catch((e) => app.toast(e.message, "error"));
  }, []);

  const [cardNo, setCardNo] = useState(-1);
  function handleSelectCard(cardNo: number) {
    setCardNo(cardNo);
  }
  const [urgentLabels, setUrgentLabels] = useState<Label.AsObject[]>([]);
  useEffect(() => {
    api
      .listLabels(["urgent", "important"])
      // FIXME please remove this
      .then((r) =>
        r.filter((x) => ["urgent", "important"].indexOf(x.label) > -1)
      )
      .then((r) => setUrgentLabels(r))
      .catch((e) => app.toast(e.message, "error"));
  }, []);

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
                onClick={() =>
                  app.toast("not implemented: select label", "error")
                }
              />
            ))}
            &nbsp;first.
          </Typography>
        </Typography>
        <Box flexGrow={0}></Box>
      </Box>

      <CardListView
        cards={cards}
        onSelect={handleSelectCard}
        onContextMenu={(e) => popupContextMenu(e, contextMenuRef)}
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
