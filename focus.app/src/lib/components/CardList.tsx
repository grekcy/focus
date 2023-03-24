import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import CancelIcon from "@mui/icons-material/Cancel";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import TripOriginIcon from "@mui/icons-material/TripOrigin";
import { Box, IconButton } from "@mui/material";
import type { Identifier, XYCoord } from "dnd-core";
import { useContext, useRef, useState } from "react";
import {
  DndProvider,
  DragSourceMonitor,
  DropTargetMonitor,
  useDrag,
  useDrop,
} from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Link } from "react-router-dom";
import { FocusContext, IFocusApp } from "../../FocusProvider";
import { Card } from "../proto/focus_pb";
import { EmptyIcon } from "./Icons";
import { InlineEdit } from "./InlineEdit";

export enum CardAction {
  COMPLETE,
  INPROGRESS,
  DELETE,
  UNDELETE,
}

interface CardListViewProp {
  items: Card.AsObject[];
  showCardNo?: boolean;
  onDoubleClick?: () => void;
  onSelect?: (index: number) => void;
  onChange?: (index: number, value: string) => void;
  onActionClick?: (index: number, action: CardAction) => void;
  onDragOver?: (dragIndex: number, hoverIndex: number) => void;
  onDragDrop?: (dragIndex: number, dropIndex: number) => void;
}

export function CardListView({
  items,
  showCardNo = true,
  onDoubleClick,
  onSelect,
  onChange,
  onActionClick,
  onDragOver,
  onDragDrop,
}: CardListViewProp) {
  const app: IFocusApp = useContext(FocusContext);

  function hasChild(cardNo: number): boolean {
    return items.findIndex((item) => item.parentCardNo === cardNo) !== -1;
  }

  function handleChange(index: number, subject: string) {
    onChange && onChange(index, subject);
  }

  const [selected, setSelected] = useState(-1);
  function handleCardClick(index: number) {
    setSelected(index);
    if (index !== selected && onSelect) onSelect(index);
  }

  function handleCanDrop(dragIndex: number, hoverIndex: number): boolean {
    if (dragIndex === -1 || hoverIndex === -1) return false;
    return !isParent(dragIndex, hoverIndex);
  }

  // return true if items[i] is parent of items[j]
  function isParent(i: number, j: number): boolean {
    if (items[i].cardNo === items[j].parentCardNo) return true;

    if (items[j].parentCardNo === 0) return false;
    const p = items.findIndex((c) => c.cardNo === items[j].parentCardNo);
    if (p === -1) return false;

    return isParent(i, p);
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <Box
        component="div"
        onDoubleClick={() => onDoubleClick && onDoubleClick()}
      >
        {items.map((item, i) => (
          <CardItem
            key={item.cardNo}
            index={i}
            card={item}
            selected={selected === i}
            showCardNo={showCardNo}
            onClick={(index) => handleCardClick(index)}
            onChange={(v) => handleChange(i, v)}
            onActionClick={onActionClick}
            onDragOver={(dragIndex, hoverIndex) =>
              onDragOver && onDragOver(dragIndex, hoverIndex)
            }
            onCanDrop={handleCanDrop}
            onDragDrop={(dragIndex, dropIndex) =>
              onDragDrop && onDragDrop(dragIndex, dropIndex)
            }
            hasChild={hasChild}
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
  card: Card.AsObject;
  index: number; // index of items, used in dnd
  selected?: boolean;
  visible?: boolean;
  showCardNo?: boolean;
  hasChild?: (cardNo: number) => boolean;
  onClick?: (index: number) => void;
  onChange?: (value: string) => void;
  onActionClick?: (index: number, action: CardAction) => void;
  onDragOver: (dragIndex: number, hoverIndex: number) => void;
  onCanDrop: (dragIndex: number, hoverIndex: number) => boolean;
  onDragDrop: (dragIndex: number, dropIndex: number) => void;
}

function CardItem({
  card,
  index,
  selected = false,
  visible = true,
  showCardNo = true,
  hasChild,
  onClick,
  onChange,
  onActionClick,
  onDragOver,
  onCanDrop,
  onDragDrop,
}: ItemProp) {
  //
  // Drag&Drop supports
  const ref = useRef<HTMLDivElement>(null);

  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.CARD,
    item: () => {
      const id = card.cardNo;
      return { id, index };
    },
    collect: (monitor: DragSourceMonitor<{ id: number; index: number }>) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  const [{ handlerId }, drop] = useDrop<
    DragItem,
    void,
    { handlerId: Identifier | null }
  >({
    accept: ItemTypes.CARD,
    collect(monitor: DropTargetMonitor<DragItem, void>) {
      return {
        handlerId: monitor.getHandlerId(),
      };
    },
    hover(item: DragItem, monitor: DropTargetMonitor<DragItem, void>) {
      if (!ref.current) return;

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

      if (!onCanDrop(dragIndex, hoverIndex)) return;

      // Time to actually perform the action
      onDragOver(dragIndex, hoverIndex);

      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      item.index = hoverIndex;
    },
    drop: (item, monitor) => onDragDrop && onDragDrop(index, item.index),
  });

  const opacity = isDragging ? 0 : 1;
  drag(drop(ref));

  function handleActionClick(index: number, action: CardAction) {
    onActionClick && onActionClick(index, action);
  }

  const app: IFocusApp = useContext(FocusContext);

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
        width: 1,
      }}
      onClick={() => onClick && onClick(index)}
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
      {card.depth > 0 && (
        <Box sx={{ flexGrow: 0, width: card.depth * 20 }}></Box>
      )}
      <IconButton size="small" onClick={() => app.toast("not implemented")}>
        {hasChild && hasChild(card.cardNo) ? (
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
            onClick={() => handleActionClick(index, CardAction.INPROGRESS)}
          >
            <TaskAltIcon fontSize="small" />
          </IconButton>
        ) : (
          <IconButton
            onClick={() => handleActionClick(index, CardAction.COMPLETE)}
          >
            <TripOriginIcon fontSize="small" />
          </IconButton>
        )}
        <IconButton onClick={() => handleActionClick(index, CardAction.DELETE)}>
          <DeleteIcon fontSize="small" />
        </IconButton>
        {false && (
          <IconButton
            onClick={() => handleActionClick(index, CardAction.DELETE)}
          >
            <CancelIcon fontSize="small" />
          </IconButton>
        )}
      </Box>
    </Box>
  );
}
