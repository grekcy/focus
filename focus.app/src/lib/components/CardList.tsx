import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
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
import { EmptyIcon } from "./Icons";
import { InlineEdit } from "./InlineEdit";

export enum CardAction {
  COMPLETE = 1,
  INPROGRESS = 1,
  DELETE = 3,
}

interface CardListViewProp {
  items: Card.AsObject[];
  showCardNo?: boolean;
  onChange?: (index: number, value: string) => void;
  onHoverCard?: (dragIndex: number, hoverIndex: number) => void;
  onActionClick?: (index: number, action: CardAction) => void;
}

export function CardListView({
  items,
  showCardNo = true,
  onChange,
  onHoverCard,
  onActionClick,
}: CardListViewProp) {
  function hasChild(cardNo: number): boolean {
    return items.findIndex((item) => item.parentCardNo === cardNo) !== -1;
  }

  function handleChange(index: number, subject: string) {
    onChange && onChange(index, subject);
  }

  return (
    <DndProvider backend={HTML5Backend}>
      {items.map((item, i) => (
        <CardItem
          key={item.cardNo}
          index={i}
          card={item}
          showCardNo={showCardNo}
          onChange={(v) => handleChange(i, v)}
          onActionClick={onActionClick}
          onHoverCard={onHoverCard}
          hasChild={hasChild}
        />
      ))}
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
  card: Card.AsObject;
  index: number; // index of items, used in dnd
  selected?: boolean;
  visible?: boolean;
  showCardNo?: boolean;
  hasChild?: (cardNo: number) => boolean;
  onChange?: (value: string) => void;
  onActionClick?: (index: number, action: CardAction) => void;
  onHoverCard?: (dragIndex: number, hoverIndex: number) => void;
}

function CardItem({
  card,
  index,
  selected = false,
  visible = true,
  showCardNo = true,
  hasChild,
  onChange,
  onActionClick,
  onHoverCard,
}: ItemProp) {
  //
  // Drag&Drop supports
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
      onHoverCard && onHoverCard(dragIndex, hoverIndex);

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
      const cardNo = card.cardNo;
      return { cardNo, index };
    },
    collect: (monitor: any) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const opacity = isDragging ? 0 : 1;
  drag(drop(ref));

  function handleActionClick(index: number, action: CardAction) {
    onActionClick && onActionClick(index, action);
  }

  const _hasChild = hasChild && hasChild(card.cardNo);

  return (
    <Box
      component="div"
      ref={ref}
      visibility={visible ? "inherit" : "hidden"}
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
      {/* {card.depth > 0 && (
        <Box sx={{ flexGrow: 0, width: card.depth * 20 }}></Box>
      )} */}
      <IconButton size="small">
        {_hasChild ? (
          <ArrowDropDownIcon fontSize="small" />
        ) : (
          <EmptyIcon fontSize="small" />
        )}
      </IconButton>
      {showCardNo && (
        <>
          <Box sx={{ flexGrow: 0, pr: 1 }}>
            <Link to={`/cards/` + card.cardNo}>{card.cardNo}</Link>
          </Box>
        </>
      )}
      <Box sx={{ flexGrow: 1 }}>
        <InlineEdit
          value={card.subject}
          onSubmit={(e, value) => onChange && onChange(value)}
        />
      </Box>
      <Box sx={{ flexGrow: 0, color: "grey", height: 0 }}>
        {card.completedAt ? (
          <IconButton
            onClick={() => {
              handleActionClick(index, CardAction.COMPLETE);
            }}
          >
            <TaskAltIcon fontSize="small" />
          </IconButton>
        ) : (
          <IconButton
            onClick={() => {
              handleActionClick(index, CardAction.INPROGRESS);
            }}
          >
            <TripOriginIcon fontSize="small" />
          </IconButton>
        )}
        <IconButton
          onClick={() => {
            handleActionClick(index, CardAction.DELETE);
          }}
        >
          <DeleteIcon fontSize="small" />
        </IconButton>
      </Box>
    </Box>
  );
}
