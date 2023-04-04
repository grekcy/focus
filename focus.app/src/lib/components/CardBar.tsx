import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import RefreshIcon from "@mui/icons-material/Refresh";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Dayjs } from "dayjs";
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
import { Card, Label } from "../proto/focus_pb";
import useAction from "./Action";
import DatePickerEx from "./DatePickerEx";
import InlineEdit from "./InlineEdit";
import LabelSelector from "./LabelSelector";

export interface ICardBar {
  toggle: () => void;
  setCardNo: (cardNo: number) => void;
}

interface CardBarProp {
  open?: boolean;
  cardNo?: number;
}

const CardBar = forwardRef(
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

    function handleSubjectChanged(subject: string) {
      if (!card) return;

      api
        .updateCardSubject(card.cardNo, subject)
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

    const labelSelectorRef = useRef<HTMLDivElement>(null);

    function CardPanel() {
      return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Typography variant="h6">Subject: </Typography>
          <InlineEdit
            value={card!.subject}
            onSubmit={(target, value) => handleSubjectChanged(value)}
          />

          <Typography variant="h6">Labels:</Typography>
          <LabelSelector
            ref={labelSelectorRef}
            labels={labels}
            selected={editingLabel}
            onSelectionChange={handleLabelChange}
          />

          <Typography variant="h6">Description:</Typography>
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
              <DatePickerEx
                value={
                  card!.deferUntil ? new Dayjs(card!.deferUntil.seconds) : null
                }
                sx={{ pl: "0.5rem" }}
              />
            </Box>
            <Box>
              Due date:
              <DatePickerEx
                value={card!.dueDate ? new Dayjs(card!.dueDate.seconds) : null}
                sx={{ pl: "0.5rem" }}
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
export default CardBar;
