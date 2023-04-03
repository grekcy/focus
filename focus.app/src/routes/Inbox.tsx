import Box from "@mui/material/Box";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import update from "immutability-helper";
import { useEffect, useRef, useState } from "react";
import { useFocusApp, useFocusClient } from "../FocusProvider";
import { Event } from "../lib/api";
import { actDivider, useAction } from "../lib/components/Action";
import CardBar, { ICardBar } from "../lib/components/CardBar";
import CardListView, { ICardListView } from "../lib/components/CardList";
import ContextMenu, {
  IContextMenu,
  PopupContextMenu as popupContextMenu,
} from "../lib/components/ContextMenu";
import LabelSelector from "../lib/components/LabelSelector";
import datetime from "../lib/datetime";
import { Card, Label } from "../lib/proto/focus_pb";

function InboxPage() {
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

  const actChallengeThis = useAction({
    label: "Challenge this",
    hotkey: "⌘+Ctrl+C",
    onEnabled: () => cardNo !== -1,
    onExecute: () => app.toast("challenge this: not implemented"),
  });

  function deferUntil(deferUntil: Date | null) {
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
  const actDeferUntilTomorrow = useAction({
    label: "defer until Tomorrow",
    hotkey: "⌘+Ctrl+T",
    onEnabled: () => cardNo !== -1,
    onExecute: () => deferUntil(datetime.workTime().add(1, "day").toDate()),
  });
  const actDeferUntilNextWeek = useAction({
    label: "defer until next Week",
    hotkey: "⌘+Ctrl+W",
    onEnabled: () => cardNo !== -1,
    onExecute: () => deferUntil(datetime.workTime().add(7, "day").toDate()),
  });
  const actDeferUntilNextMonth = useAction({
    label: "defer until next Month",
    onEnabled: () => cardNo !== -1,
    onExecute: () => deferUntil(datetime.workTime().add(1, "month").toDate()),
  });
  const actClearDefer = useAction({
    label: "clear defer",
    onEnabled: () => cardNo !== -1,
    onExecute: () => deferUntil(null),
  });
  const actDueTo = useAction({
    label: "Due to...",
    onExecute: () => app.toast("not implemented"),
  });

  const cardListRef = useRef<ICardListView>(null);
  const contextMenuRef = useRef<IContextMenu>(null);

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
          actDueTo,
        ]}
      />

      <CardBar ref={cardBarRef} />
    </>
  );
}
export default InboxPage;
