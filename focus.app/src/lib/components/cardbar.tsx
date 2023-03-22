import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { Box, Divider, Drawer, IconButton, Typography } from "@mui/material";
import {
  Ref,
  forwardRef,
  useContext,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import { FocusContext, IFocusApp } from "../../FocusProvider";
import { DrawerHeader } from "../../sidebar";
import { Card } from "../proto/focus_pb";
import { InlineEdit } from "./InlineEdit";

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

    const app: IFocusApp = useContext(FocusContext);

    useImperativeHandle(ref, () => ({
      toggle() {
        setOpen((p) => !p);
      },
      setCardNo(cardNo: number) {
        setOpen(true);
        setCardNo(cardNo);
      },
    }));

    useEffect(() => {
      if (!cardNo) {
        setCard(null);
        return;
      }

      (async () => {
        await app
          .client()!
          .getCard(cardNo)
          .then((r) => setCard(r))
          .catch((e) => app.toast(e.message, "error"));
      })();
    }, [cardNo]);

    return (
      <>
        <Drawer
          open={open}
          anchor="right"
          variant="persistent"
          sx={{ width: 400 }}
        >
          <DrawerHeader />
          <DrawerHeader>
            <Typography>Card: {cardNo}</Typography>
            <IconButton key="x" onClick={() => setOpen((p) => !p)}>
              <ChevronRightIcon />
            </IconButton>
          </DrawerHeader>
          <Divider />
          <Box sx={{ p: 1, width: 300 }}>
            <Typography variant="overline">Subject:</Typography>
            <InlineEdit value={card?.subject} />
            <Typography variant="overline">Description:</Typography>
            <InlineEdit multiline value={card?.content} />
          </Box>
        </Drawer>
      </>
    );
  }
);
