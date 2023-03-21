import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import TripOriginIcon from "@mui/icons-material/TripOrigin";
import { Box, IconButton } from "@mui/material";
import type { Identifier, XYCoord } from "dnd-core";
import { useRef } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Link } from "react-router-dom";
import { Card } from "../proto/focus_pb";
import { InlineEdit } from "./InlineEdit";

interface CardListViewProp {
  items: Card.AsObject[];
  onChange?: (value: string) => void;
  moveCard?: (dragIndex: number, hoverIndex: number) => void;
}

export function CardListView({ items, onChange, moveCard }: CardListViewProp) {
  return (
    <DndProvider backend={HTML5Backend}>
      <Box width={1}>
        {items.map((item, i) => (
          <CardItem
            key={item.cardNo}
            index={i}
            cardNo={item.cardNo}
            text={item.subject}
            onChange={onChange}
            moveCard={moveCard}
          />
        ))}
      </Box>
    </DndProvider>
  );
}

interface DragItem {
  index: number;
  id: string;
  type: string;
}

export const ItemTypes = {
  CARD: "card",
};

interface ItemProp {
  cardNo: number;
  index: number; // index of items, used in dnd
  text?: string;
  selected?: boolean;
  onChange?: (value: string) => void;
  moveCard?: (dragIndex: number, hoverIndex: number) => void; // QUESTION: 여기에? 있는게 이상한 느낌? 더 공부 필요
}

function CardItem({
  cardNo,
  text = "",
  index,
  selected = false,
  onChange,
  moveCard,
}: ItemProp) {
  const ref = useRef<HTMLDivElement>(null);

  const [{ handlerId }, drop] = useDrop<
    DragItem,
    void,
    { handlerId: Identifier | null }
  >({
    accept: ItemTypes.CARD,
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      };
    },
    hover(item: DragItem, monitor) {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;

      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return;
      }

      // Determine rectangle on screen
      const hoverBoundingRect = ref.current?.getBoundingClientRect();

      // Get vertical middle
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

      // Determine mouse position
      const clientOffset = monitor.getClientOffset();

      // Get pixels to the top
      const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top;

      // Only perform the move when the mouse has crossed half of the items height
      // When dragging downwards, only move when the cursor is below 50%
      // When dragging upwards, only move when the cursor is above 50%

      // Dragging downwards
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }

      // Dragging upwards
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }

      // Time to actually perform the action
      moveCard && moveCard(dragIndex, hoverIndex);

      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      item.index = hoverIndex;
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.CARD,
    item: () => {
      return { cardNo, index };
    },
    collect: (monitor: any) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const opacity = isDragging ? 0 : 1;
  drag(drop(ref));

  return (
    <Box
      component="div"
      ref={ref}
      sx={{
        display: "flex",
        border: "1px solid lightgray",
        padding: "0.5rem 1rem",
        cursor: "move",
        backgroundColor: selected ? "action.selected" : "",
        opacity: opacity,
      }}
      width={1}
    >
      <Box
        sx={{
          flexGrow: 0,
          color: "GrayText",
          height: 0,
        }}
      >
        <DragIndicatorIcon />
      </Box>
      <Box sx={{ flexGrow: 0, pr: 1 }}>
        <Link to={`/cards/` + cardNo}>{cardNo}</Link>
      </Box>
      <Box sx={{ flexGrow: 1 }}>
        <InlineEdit
          value={text}
          onSubmit={(e, value) => onChange && onChange(value)}
        />
      </Box>
      <Box sx={{ flexGrow: 0, color: "grey", height: 0 }}>
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
