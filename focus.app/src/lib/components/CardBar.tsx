import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import RefreshIcon from "@mui/icons-material/Refresh";
import {
  Box,
  Divider,
  Drawer,
  IconButton,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  Typography,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import {
  Ref,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import { Link } from "react-router-dom";
import { Key } from "ts-key-enum";
import { useFocusApp, useFocusClient } from "../../FocusProvider";
import { DrawerHeader } from "../../SideBar";
import { arrayContentEquals } from "../lib";
import { Card, Challenge, Label } from "../proto/focus_v1alpha1_pb";
import { useAction } from "./Action";
import { DatePickButton } from "./DatePickButton";
import { InlineEdit } from "./InlineEdit";
import { LabelSelector } from "./LabelSelector";

export interface ICardBar {
  toggle: () => void;
  setCardNo: (cardNo: number) => void;
}

interface CardBarProp {
  open?: boolean;
  cardNo?: number;
}

export const CardBar = forwardRef(
  ({ open: inOpen, cardNo: inCardNo }: CardBarProp, ref: Ref<ICardBar>) => {
    const [open, setOpen] = useState(inOpen);
    const [cardNo, setCardNo] = useState(inCardNo);
    const [card, setCard] = useState<Card.AsObject | null>(null);

    const app = useFocusApp();
    const api = useFocusClient();

    useImperativeHandle(ref, () => ({
      toggle() {
        setOpen((p) => !p);
      },
      setCardNo(cardNo: number) {
        setCardNo(cardNo);
      },
    }));

    useEffect(() => {
      if (!cardNo) {
        setCard(null);
        return;
      }

      api
        .getCard(cardNo)
        .then((r) => setCard(r))
        .catch((e) => app.toast(e.message, "error"));
    }, [cardNo]);

    useEffect(() => {
      open && cardRef.current && cardRef.current.focus();
    }, [open]);

    const [actClose, cardRef] = useAction({
      label: "close",
      hotkey: Key.Escape,
      onExecute: () => setOpen(false),
    });

    function handleObjectiveChanged(objective: string) {
      if (!card) return;

      api
        .updateCardObjective(card.cardNo, objective)
        .then((r) => setCard(r))
        .catch((e) => app.toast(e.message, "error"));
    }

    function handleDescriptionChanged(content: string) {
      if (!card) return;

      api
        .updateCardContent(card.cardNo, content)
        .then((r) => setCard(r))
        .catch((e) => app.toast(e.message, "error"));
    }

    const labels = useMemo(() => {
      const x: Label.AsObject[] = [];
      try {
        api.listLabels().then((r) => x.push(...r));
      } catch (e: any) {
        app.toast(e.message, "error");
      }
      return x;
    }, []);

    const [editingLabel, setEditingLabel] = useState<number[]>([]);
    useEffect(() => {
      setEditingLabel(card ? card.labelsList : []);
    }, [card]);

    function handleLabelChange(selected: number[]) {
      if (!card) return;

      setEditingLabel(selected);

      setTimeout(() => {
        labelSelectorRef.current && labelSelectorRef.current.focus();
      }, 100);

      if (arrayContentEquals(selected, card.labelsList)) return;

      api
        .updateCardLabel(card.cardNo, selected)
        .then((r) => setCard(r))
        .catch((e) => app.toast(e.message, "error"));
    }

    function handleDeferUntilChange(value: Date | null) {
      if (!card) return;

      api
        .updateCardDeferUntil(card.cardNo, value)
        .then((r) => setCard(r))
        .catch((e) => app.toast(e.message, "error"));
    }

    function handleDueDateChange(value: Date | null) {
      if (!card) return;

      api
        .updateCardDueDate(card.cardNo, value)
        .then((r) => setCard(r))
        .catch((e) => app.toast(e.message, "error"));
    }

    const [challenges, setChallenges] = useState<Challenge.AsObject[]>([]);
    useEffect(() => {
      api
        .listChallenges()
        .then((r) => setChallenges(r))
        .catch((e) => app.toast(e.message, "error"));
    }, []);

    function onChallengeChange(event: SelectChangeEvent) {
      const value = parseInt(event.target.value);

      if (!isNaN(value)) {
        api
          .setParentCard(cardNo!, value)
          .then((r) => setCard(r))
          .catch((e) => app.toast(e.message, "error"));
      }
    }

    const labelSelectorRef = useRef<HTMLDivElement>(null);

    function CardPanel() {
      return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <InlineEdit
            value={card!.objective}
            onSubmit={(target, value) => handleObjectiveChanged(value)}
          />

          <Stack direction="row">
            <Typography variant="subtitle1">Labels:</Typography>
            <LabelSelector
              ref={labelSelectorRef}
              labels={labels}
              selected={editingLabel}
              onSelectionChange={handleLabelChange}
              sx={{ width: 1 }}
            />
          </Stack>

          <Stack direction="row">
            <Typography variant="subtitle1">Challenge:</Typography>
            <Select
              size="small"
              value={
                card!.parentCardNo ? card!.parentCardNo.toString() : undefined
              }
              onChange={onChallengeChange}
              sx={{ width: 1 }}
            >
              {challenges.map((ch) => (
                <MenuItem value={ch.card!.cardNo}>
                  {ch.card!.objective}
                </MenuItem>
              ))}
              <MenuItem value="">None</MenuItem>
            </Select>
          </Stack>

          <Typography variant="subtitle1">Description:</Typography>
          <InlineEdit
            multiline
            value={card!.content}
            onSubmit={(target, value) => handleDescriptionChanged(value)}
          />
          <Divider textAlign="left">Dates</Divider>
          <Stack direction="column">
            <Box>
              {/* TODO 가로 정렬이 약간 안맞군 */}
              Deferred until:
              <DatePickButton
                value={
                  card!.deferUntil
                    ? new Date(card!.deferUntil.seconds * 1000)
                    : null
                }
                onChange={(value) => handleDeferUntilChange(value)}
              />
            </Box>
            <Box>
              Due date:
              <DatePickButton
                value={
                  card!.dueDate ? new Date(card!.dueDate.seconds * 1000) : null
                }
                onChange={(value) => handleDueDateChange(value)}
              />
            </Box>
            <Box>
              Created:
              {card!.createdAt &&
                new Date(card!.createdAt.seconds * 1000).toLocaleString()}
            </Box>
            <Box>
              Updated:
              {card?.updatedAt &&
                new Date(card?.updatedAt.seconds * 1000).toLocaleString()}
            </Box>
            <Box>
              Completed at:
              {card!.completedAt
                ? new Date(card!.completedAt.seconds * 1000).toLocaleString()
                : "N/A"}
            </Box>
          </Stack>
        </LocalizationProvider>
      );
    }

    return (
      <Drawer open={open} anchor="right" variant="persistent">
        {/* FIXME 이렇게 DrawerHeader를 2개 넣어서 간격 맞추는 건 좋지 않음 */}
        <DrawerHeader />
        <DrawerHeader>
          <IconButton
            onClick={() =>
              app.toast("refresh card: not implemented", "warning")
            }
          >
            <RefreshIcon fontSize="small" />
          </IconButton>
          <Typography>
            <Link to={`/cards/${cardNo}`}>CARD-#{cardNo}</Link>
          </Typography>
          <IconButton onClick={() => setOpen((p) => !p)}>
            <ChevronRightIcon />
          </IconButton>
        </DrawerHeader>
        <Divider />
        <Box
          ref={cardRef}
          tabIndex={-1}
          sx={{ p: 1, width: 400, outline: "0px solid transparent" }}
        >
          {card ? <CardPanel /> : <Typography>Please select card!</Typography>}
        </Box>
      </Drawer>
    );
  }
);
