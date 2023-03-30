import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import RefreshIcon from "@mui/icons-material/Refresh";
import { Box, Divider, Drawer, IconButton, Typography } from "@mui/material";
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
import { useFocusApp, useFocusClient } from "../../FocusProvider";
import { DrawerHeader } from "../../SideBar";
import { arrayContentEquals } from "../lib";
import { Card, Label } from "../proto/focus_pb";
import { InlineEdit } from "./InlineEdit";
import { LabelOption, LabelSelector } from "./LabelSelector";

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

    function handleLabelChange(selection: LabelOption[]) {
      if (!card) return;

      const updated = selection.map((x) => x.id);
      setEditingLabel(updated);

      // NOTE setEditingLabel()하면서 입력 포커스를 잃어버리네...
      setTimeout(() => {
        labelSelectorRef.current && labelSelectorRef.current.focus();
      }, 100);

      if (arrayContentEquals(updated, card.labelsList)) return;

      api
        .updateCardLabel(card.cardNo, updated)
        .then((r) => setCard(r))
        .catch((e) => app.toast(e.message, "error"));
    }

    const labelSelectorRef = useRef<HTMLDivElement>(null);

    function CardPanel() {
      return (
        <>
          <Typography variant="h6">Subject: </Typography>
          <InlineEdit
            value={card?.subject}
            onSubmit={(target, value) => handleSubjectChanged(value)}
          />

          <Typography variant="h6">Labels:</Typography>
          <LabelSelector
            ref={labelSelectorRef}
            labels={labels}
            selection={editingLabel}
            onChange={handleLabelChange}
          />

          <Typography variant="h6">Description:</Typography>
          <InlineEdit
            multiline
            value={card?.content}
            onSubmit={(target, value) => handleDescriptionChanged(value)}
          />
          <Divider textAlign="left">Dates</Divider>
          <Box>
            Created:
            {card?.createdAt &&
              new Date(card?.createdAt.seconds * 1000).toLocaleString()}
          </Box>
          <Box>
            Updated:
            {card?.updatedAt &&
              new Date(card?.updatedAt.seconds * 1000).toLocaleString()}
          </Box>
        </>
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
        <Box sx={{ p: 1, width: 400 }}>
          {cardNo ? (
            <CardPanel />
          ) : (
            <Typography>Please select card!</Typography>
          )}
        </Box>
      </Drawer>
    );
  }
);
