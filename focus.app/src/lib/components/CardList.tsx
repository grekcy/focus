import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import CancelIcon from "@mui/icons-material/Cancel";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import TripOriginIcon from "@mui/icons-material/TripOrigin";
import { Box, IconButton } from "@mui/material";
import type { Identifier, XYCoord } from "dnd-core";
import { Ref, forwardRef, useEffect, useRef, useState } from "react";
import {
  DndProvider,
  DragSourceMonitor,
  DropTargetMonitor,
  useDrag,
  useDrop,
} from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useHotkeys } from "react-hotkeys-hook";
import { Link } from "react-router-dom";
import { Key } from "ts-key-enum";
import { useFocusApp, useFocusClient } from "../../FocusProvider";
import { Card } from "../proto/focus_pb";
import { EmptyIcon } from "./Icons";
import { IInlineEdit, InlineEdit } from "./InlineEdit";

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
  onDragOver?: (dragIndex: number, hoverIndex: number) => void;
  onDragDrop?: (dragIndex: number, dropIndex: number) => void;
}

export function CardListView({
  items,
  showCardNo = true,
  onDoubleClick,
  onSelect,
  onChange,
  onDragOver,
  onDragDrop,
}: CardListViewProp) {
  const app = useFocusApp();
  const api = useFocusClient();

  const [cards, setCards] = useState(items);
  useEffect(() => {
    setCards(items);
  }, [items]);

  function hasChild(cardNo: number): boolean {
    return cards.findIndex((item) => item.parentCardNo === cardNo) !== -1;
  }

  function getChildCards(index: number): number[] {
    const r: number[] = [];
    cards.forEach((c, i) => isParent(index, i) && r.push(i));
    return r;
  }

  // return true if items[i] is parent of items[j]
  function isParent(i: number, j: number): boolean {
    if (cards[i].cardNo === cards[j].parentCardNo) return true;

    if (cards[j].parentCardNo === 0) return false;
    const p = cards.findIndex((c) => c.cardNo === cards[j].parentCardNo);
    if (p === -1) return false;

    return isParent(i, p);
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

  useHotkeys(Key.ArrowUp, () => {
    if (selected === 0 || selected === -1) return;
    setSelected((p) => p - 1);
  });

  useHotkeys(Key.ArrowDown, () => {
    if (selected === cards.length - 1) return;
    setSelected((p) => p + 1);
  });

  // TODO parent를 변경하면 이슈가 있음..
  // parent를 변경 -> card.updated event가 발생
  // -> 해당 카드를 가져옴 -> Inbox에서 데이터 변경
  // -> Cards가 변경됨...
  // 이런 경로를 거쳐서 다시 데이터가 변경되는 현상이 발생함.
  useHotkeys("meta+ctrl+right, meta+ctrl+]", moveRight);
  async function moveRight() {
    const upward = findFirstSiblingUpward(selected);
    if (upward === -1) return;

    await api
      .setParentCard(cards[selected].cardNo, cards[upward].cardNo)
      .then(() => {
        cards[selected].depth = cards[selected].depth + 1;
        cards[selected].parentCardNo = cards[upward].cardNo;

        const child = getChildCards(selected);
        child.forEach((i) => (cards[i].depth = cards[i].depth + 1));

        setCards((p) => {
          const x = p.slice(0, selected);
          x.push(...p.slice(selected, selected + child.length + 1));
          x.push(...p.slice(selected + child.length + 1));

          return x;
        });
      })
      .catch((e) => app.toast(e.message, "error"));
  }

  useHotkeys("meta+ctrl+left, meta+ctrl+[", moveLeft);
  async function moveLeft() {
    if (selected === 0) return;
    if (cards[selected].depth === 0) return;

    const parent = cards.findIndex(
      (c) => c.cardNo === cards[selected].parentCardNo
    );

    const child = getChildCards(selected);

    // parent의 next sibling으로 rank 조정
    const nextSibling = findFirstSiblingDownward(parent);
    console.log(nextSibling);
    if (nextSibling === -1) {
      // parent의 nextSilbing이 없으면 parent의 마지막 아이템으로 변경
      await api
        .setParentCard(cards[selected].cardNo, cards[parent].parentCardNo!)
        .then((r) => {
          const siblings = getChildCards(parent);
          setCards((p) => {
            cards[selected].parentCardNo = cards[parent].parentCardNo;
            cards[selected].depth = cards[selected].depth - 1;
            child.forEach((c) => (cards[c].depth = cards[c].depth - 1));

            const x = cards.slice(0, selected); // 기존 것
            x.push(
              ...p.slice(
                selected + child.length + 1,
                selected + siblings.length - child.length
              )
            ); // 위로 이동
            x.push(...p.slice(selected, selected + child.length + 1)); // 아래로 이동
            x.push(...p.slice(selected + siblings.length)); // 나머지

            setSelected((p) => parent + siblings.length - child.length);
            return x;
          });
        })
        .catch((e) => app.toast(e.message, "error"));
      return;
    }

    await api
      .rerankCard(cards[selected].cardNo, cards[nextSibling].cardNo)
      .then((r) => {
        const siblings = findSiblings(selected);

        cards[selected].parentCardNo = cards[nextSibling].parentCardNo;
        cards[selected].depth = cards[selected].depth - 1;
        child.forEach((c) => (cards[c].depth = cards[c].depth - 1));

        setCards((p) => {
          const x = p.slice(0, selected); // 유지될 것d
          x.push(
            ...p.slice(
              selected + child.length + 1,
              selected + child.length + siblings.length + 1
            )
          ); // 위로 올라갈 것: child + siblings
          x.push(...p.slice(selected, selected + child.length + 1)); // 내려갈 것
          x.push(...p.slice(selected + child.length + siblings.length + 1)); // 나머지 유지할 것

          return x;
        });
        setSelected((p) => p + siblings.length);
      })
      .catch((e) => app.toast(e.message, "error"));
  }

  function findFirstSiblingUpward(index: number): number {
    for (let i = index - 1; i > -1; i--) {
      if (cards[index].parentCardNo === cards[i].parentCardNo) return i;
    }

    return -1;
  }

  useHotkeys("meta+ctrl+up", moveUp);
  async function moveUp() {
    const upwardIndex = findFirstSiblingUpward(selected);
    if (upwardIndex === -1) return;

    const selCard = cards[selected];
    const destCard = cards[upwardIndex];
    const child = getChildCards(selected);

    await api
      .rerankCard(selCard.cardNo, destCard.cardNo)
      .then(() => {
        setCards((p) => {
          const x = p.slice(0, upwardIndex); // 유지할 것
          x.push(...p.slice(selected, selected + child.length + 1)); // 위로 올라갈 것
          x.push(...p.slice(upwardIndex, selected)); // 밑으로 내려갈 것
          x.push(...p.slice(selected + child.length + 1)); // 나머지 유지할 것
          return x;
        });
        setSelected((p) => upwardIndex);
      })
      .catch((e: any) => app.toast(e.message, "error"));
  }

  function findFirstSiblingDownward(index: number): number {
    for (let i = index + 1; i < cards.length; i++) {
      if (cards[index].parentCardNo === cards[i].parentCardNo) return i;
    }

    return -1;
  }

  function findSiblings(index: number): number[] {
    const r: number[] = [];
    for (let i = index + 1; i < cards.length; i++) {
      if (cards[index].parentCardNo === cards[i].parentCardNo) {
        r.push(i);
        r.push(...getChildCards(i));
      }
    }

    return r;
  }

  useHotkeys("meta+ctrl+down", moveDown);
  async function moveDown() {
    let downwardIndex = findFirstSiblingDownward(selected);
    if (downwardIndex === -1) return;

    const selCard = cards[selected];
    let destCard = cards[downwardIndex];
    const child = getChildCards(selected);
    const destChild = getChildCards(downwardIndex);

    // 마지막 아이템은 마지막 것을 끌어올린다.
    if (
      downwardIndex === cards.length - 1 ||
      cards[downwardIndex + 1].parentCardNo !== cards[selected].parentCardNo
    ) {
      await api
        .rerankCard(destCard.cardNo, selCard.cardNo)
        .then((r) => {
          setCards((p) => {
            const x = p.slice(0, selected); // 유지할 것
            x.push(
              ...p.slice(
                selected + child.length + 1,
                selected + child.length + 1 + destChild.length + 1
              )
            ); // 위로 올라갈 것
            x.push(...p.slice(selected, selected + child.length + 1)); // 밑으로 내려갈 것
            x.push(
              ...p.slice(selected + child.length + 1 + destChild.length + 1)
            ); // 나머지
            return x;
          });

          setSelected((p) => p + destChild.length + 1);
        })
        .catch((e) => app.toast(e.message, "error"));
      return;
    }

    downwardIndex = findFirstSiblingDownward(downwardIndex);
    destCard = cards[downwardIndex];
    await api
      .rerankCard(selCard.cardNo, destCard.cardNo)
      .then(() => {
        setCards((p) => {
          const x = p.slice(0, selected); // 유지할 것
          x.push(p[downwardIndex - 1]); // 위로 올라갈 것
          x.push(...p.slice(selected, selected + child.length + 1)); // 밑으로 내려갈 것
          x.push(...p.slice(downwardIndex)); // 마지막에 유지할 것
          return x;
        });
        setSelected((p) => p + 1);
      })
      .catch((e: any) => app.toast(e.message, "error"));
  }

  useHotkeys(Key.Enter, () => {
    if (selected === -1) return;
    refs.current[selected].edit();
  });

  const refs = useRef<IInlineEdit[]>([]);

  function handleCardAction(index: number, action: CardAction) {
    const card = cards[index];

    switch (action) {
      case CardAction.COMPLETE:
        setCompleted(card.cardNo, true);
        break;
      case CardAction.INPROGRESS:
        setCompleted(card.cardNo, false);
        break;
      case CardAction.DELETE:
        deleteCard(card.cardNo);
        break;
      default:
        app.toast(`unknown action: ${action}`, "error");
    }
  }

  function setCompleted(cardNo: number, complete: boolean) {
    if (!cardNo) {
      app.toast(`invalid cardNo: ${cardNo}`, "error");
      return;
    }

    (async () => {
      await api
        .completeCard(cardNo, complete)
        .then((r) =>
          setCards((p) => p.map((c) => (c.cardNo === cardNo ? r : c)))
        )
        .catch((e) => app.toast(e.message));
    })();
  }

  const [deletingCard, setDeletingCard] = useState(false);

  function deleteCard(cardNo: number) {
    if (deletingCard) return;

    setDeletingCard(true);
    console.log(`deleting ${cardNo}`);

    (async () => {
      await api
        .deleteCard(cardNo)
        .then((r) => setCards((p) => p.filter((c) => c.cardNo !== cardNo)))
        .catch((e) => app.toast(e, "error"))
        .finally(() => setDeletingCard(false));
    })();
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <Box
        component="div"
        onDoubleClick={() => onDoubleClick && onDoubleClick()}
      >
        {cards.map((item, i) => (
          <CardItem
            ref={(ref) => (refs.current[i] = ref!)}
            key={item.cardNo}
            index={i}
            card={item}
            selected={selected === i}
            showCardNo={showCardNo}
            onClick={(index) => handleCardClick(index)}
            onChange={(v) => handleChange(i, v)}
            onActionClick={handleCardAction}
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

const CardItem = forwardRef(
  (
    {
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
    }: ItemProp,
    ref: Ref<IInlineEdit>
  ) => {
    //
    // Drag&Drop supports
    const containerRef = useRef<HTMLDivElement>(null);

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
        if (!containerRef.current) return;

        const dragIndex = item.index;
        const hoverIndex = index;

        // Don't replace items with themselves
        if (dragIndex === hoverIndex) {
          return;
        }

        // Determine rectangle on screen
        const hoverBoundingRect = containerRef.current?.getBoundingClientRect();

        // Get vertical middle
        const hoverMiddleY =
          (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

        // Determine mouse position
        const clientOffset = monitor.getClientOffset();

        // Get pixels to the top
        const hoverClientY =
          (clientOffset as XYCoord).y - hoverBoundingRect.top;

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
    drag(drop(containerRef));

    function handleActionClick(index: number, action: CardAction) {
      onActionClick && onActionClick(index, action);
    }

    const app = useFocusApp();

    return (
      <Box
        component="div"
        ref={containerRef}
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
        <IconButton
          size="small"
          onClick={() => app.toast("collapse: not implemented", "warning")}
        >
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
        {/* {card.parentCardNo}&nbsp; */}
        <Box sx={{ flexGrow: 1 }}>
          <InlineEdit
            ref={ref}
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
          <IconButton
            onClick={() => handleActionClick(index, CardAction.DELETE)}
          >
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
);
