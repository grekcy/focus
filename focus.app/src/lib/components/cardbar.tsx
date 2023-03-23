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
import { DrawerHeader } from "../../SideBar";
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

    function handleSubjectChanged(subject: string) {
      cardNo && app.client()!.updateCardSubject(cardNo, subject);
    }

    function handleDescriptionChanged(content: string) {
      cardNo && app.client()!.updateCardContent(cardNo, content);
    }

    function CardPanel() {
      return (
        <>
          <Typography variant="h6">Subject: </Typography>
          <InlineEdit
            value={card?.subject}
            onSubmit={(target, value) => handleSubjectChanged(value)}
          />
          <Typography variant="h6">Description:</Typography>
          <InlineEdit
            multiline
            value={card?.content}
            onSubmit={(target, value) => handleDescriptionChanged(value)}
          />
          <Box>
            Created:
            {card?.createdAt &&
              new Date(card?.createdAt.seconds * 1000).toLocaleString()}
          </Box>
        </>
      );
    }

    return (
      <>
        <Drawer open={open} anchor="right" variant="persistent">
          <DrawerHeader />
          <DrawerHeader>
            <Typography>Card-{cardNo}</Typography>
            <IconButton key="x" onClick={() => setOpen((p) => !p)}>
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
      </>
    );
  }
);
