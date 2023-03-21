import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import TripOriginIcon from "@mui/icons-material/TripOrigin";

import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import { Box, Button, Container, IconButton, Typography } from "@mui/material";
import { useContext, useRef } from "react";
import { Link } from "react-router-dom";
import { FocusContext, IFocusApp } from "../FocusProvider";
import { InlineEdit } from "../lib/components/InlineEdit";
import { CardBar, ICardBar } from "../lib/components/cardbar";

export function TodayPage() {
  const app: IFocusApp = useContext(FocusContext);

  const cardBarRef = useRef<ICardBar>(null);
  function cardBarToggle() {
    cardBarRef.current && cardBarRef.current.toggle();
  }

  return (
    <>
      <Box display="flex">
        <Typography variant="h5" flexGrow={1}>
          Today
        </Typography>
        <Box flexGrow={0}>
          <Button onClick={() => cardBarToggle()}>Show Card</Button>
        </Box>
      </Box>

      <Container disableGutters>
        <Item cardNo={12346} onChange={(v) => app.toast(v)} />
        <Item cardNo={567} selected onChange={(v) => app.toast(v)} />
        <Item cardNo={123} onChange={(v) => app.toast(v)} />
        <Item cardNo={3495} onChange={(v) => app.toast(v)} />
        <Item cardNo={9834} onChange={(v) => app.toast(v)} />
      </Container>
      <CardBar ref={cardBarRef} />
    </>
  );
}

interface ItemProp {
  cardNo: number;
  selected?: boolean;
  onChange?: (value: string) => void;
}

function Item({ cardNo, selected = false, onChange }: ItemProp) {
  return (
    <Box
      sx={{
        display: "flex",
        border: "1px solid gray",
        padding: "0.5rem 1rem",
        cursor: "move",
        backgroundColor: selected ? "action.selected" : "",
      }}
      width={1}
    >
      <Box sx={{ flexGrow: 0, color: "GrayText", height: 0 }}>
        <DragIndicatorIcon />
      </Box>
      <Box sx={{ flexGrow: 0, pr: 1 }}>
        <Link to={`/cards/` + cardNo}>{cardNo}</Link>
      </Box>
      <Box sx={{ flexGrow: 1 }}>
        <InlineEdit
          value="hello"
          onSubmit={(e, value) => onChange && onChange(value)}
        />
      </Box>
      <Box sx={{ flexGrow: 0, color: "GrayText", height: 0 }}>
        <IconButton>
          <TaskAltIcon fontSize="small" />
        </IconButton>
        <IconButton>
          <TripOriginIcon fontSize="small" />
        </IconButton>
        <IconButton>
          <DeleteIcon fontSize="small" />
        </IconButton>
      </Box>
    </Box>
  );
}
