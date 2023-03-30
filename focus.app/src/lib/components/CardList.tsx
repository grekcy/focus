import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import CancelIcon from "@mui/icons-material/Cancel";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import TripOriginIcon from "@mui/icons-material/TripOrigin";
import { Box, IconButton, Stack } from "@mui/material";
import type { Identifier, XYCoord } from "dnd-core";
import update from "immutability-helper";
import React, {
  Ref,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
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
import { Card, Label } from "../proto/focus_pb";
import { EmptyIcon } from "./Icons";
import { IInlineEdit, InlineEdit } from "./InlineEdit";
import { LabelChip } from "./LabelChip";

export enum CardAction {
  COMPLETE,
  INPROGRESS,
  DELETE,
  UNDELETE,
}

interface CardListViewProp {
  cards: Card.AsObject[];
  showCardNo?: boolean;
  onDoubleClick?: () => void;
  onSelect?: (cardNo: number) => void;
}

export interface ICardListView {
  addCard: (card: Card.AsObject) => void;
}

export const CardListView = forwardRef(
  (
    {
      cards: inCards,
      showCardNo = true,
      onDoubleClick,
      onSelect,
    }: CardListViewProp,
    ref: Ref<ICardListView>
  ) => {
    const app = useFocusApp();
    const api = useFocusClient();

    const [cards, setCards] = useState<Card.AsObject[]>([]);
    useEffect(() => setCards(inCards), [inCards]);

    const labelsMap = useMemo(() => {
      const x: { [key: number]: Label.AsObject } = {};
      try {
        api.listLabels().then((r) => r.forEach((e) => (x[e.id] = e)));
      } catch (e: any) {
        app.toast(e.message, "error");
      }
      return x;
    }, [api]);

    useImperativeHandle(ref, () => ({
      addCard(card: Card.AsObject) {
        setCards((p) => update(p, { $push: [card] }));
      },
    }));

    useEffect(() => {
      const handler = api.addEventListener("card.updated", (cardNo: number) => {
        const index = cards.findIndex((c) => c.cardNo === cardNo);
        console.log(`card updated: ${cardNo}, ${index} ${cards.length}`);
        if (index === -1) return;

        api
          .getCard(cardNo)
          .then((r) => setCards((p) => update(p, { [index]: { $set: r } })))
          .catch((e) => app.toast(e.message, "error"));
      });

      return () => {
        api.removeEventListener(handler);
      };
    }, [api, app]);

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

    function handleSubmit(index: number, subject: string) {
      const card = cards[index];
      api
        .updateCardSubject(card.cardNo, subject)
        .then(() => {
          card.subject = subject;
          setCards((p) => update(p, { index: { $set: card } }));
        })
        .catch((e) => app.toast(e.message, "error"));
    }

    const [selected, setSelected] = useState(-1);
    useEffect(() => {
      cards[selected] && onSelect && onSelect(cards[selected].cardNo);
    }, [cards, onSelect, selected]);

    function handleCardClick(index: number) {
      setSelected(index);
    }

    function handleCanDrop(dragIndex: number, hoverIndex: number): boolean {
      if (dragIndex === -1 || hoverIndex === -1) return false;
      return !isParent(dragIndex, hoverIndex);
    }

    //
    // Drag & Drop
    //
    const [dragStartCard, setDragStartCard] = useState<Card.AsObject | null>(
      null
    );
    const [dragging, setDragging] = useState(false);

    function handleDragOver(dragIndex: number, hoverIndex: number) {
      const dragCard = cards[dragIndex];

      if (!dragging) {
        setDragStartCard(dragCard);
      }
      setDragging(true);

      let chunk: number[] = [dragIndex];
      if (hasChild(dragIndex)) {
        chunk.push(...getChildCards(dragIndex));
      }

      setCards((p: Card.AsObject[]) =>
        update(p, {
          $splice: [
            [dragIndex, chunk.length],
            [hoverIndex, 0, ...chunk.map((i) => p[i])],
          ],
        })
      );
    }

    // update rank to server
    function handleDragDrop(dragIndex: number, dropIndex: number) {
      setDragging(false);
      setDragStartCard(null);

      if (!dragStartCard) return;

      const srcCard = dragStartCard;
      const srcIndex = cards.findIndex((c) => c === srcCard);
      if (srcIndex === -1) return;
      const chunk = getChildCards(srcIndex);
      const destCard = cards[dropIndex + chunk.length + 1];

      // 다른 parent_no로 drop되면 parent, depth 조정
      if (dragStartCard?.parentCardNo !== destCard.parentCardNo) {
        const depthBegin = destCard.depth;

        // child depth 조정
        walk(dragStartCard!.cardNo, (depth: number, card: Card.AsObject) => {
          card.depth = depthBegin + depth;
        });

        dragStartCard!.depth = destCard.depth;
        dragStartCard!.parentCardNo = destCard.parentCardNo;
      }

      api
        .rerankCard(srcCard.cardNo, destCard.cardNo)
        .catch((e) => app.toast(e.message, "error"));
    }

    function walk(
      cardNo: number,
      callback: (depth: number, card: Card.AsObject) => void
    ) {
      function walk_(depth: number, cardNo: number) {
        cards
          .filter((c) => c.parentCardNo === cardNo)
          .forEach((c) => {
            callback(depth, c);
            walk_(depth + 1, c.cardNo);
          });
      }

      walk_(1, cardNo);
    }

    //
    // HotKeys
    //

    useHotkeys([Key.ArrowUp], selUp, { preventDefault: false });
    function selUp() {
      if (selected === 0 || selected === -1) return;
      setSelected((p) => p - 1);
      // FIXME preventDefault=true하면서 각 아이템을 scrollIntView()하고 싶은데, 잘 안됨
      // preventDefault=false하면서 up/down 기본 동작과 같이 하니 뭐 봐줄만은 하고
      // refs.current[selected - 1] &&
      //   refs.current[selected - 1].scrollIntoView({ block: "start" });
    }

    useHotkeys([Key.ArrowDown], selDown, { preventDefault: false });
    function selDown() {
      if (selected === cards.length - 1) return;
      setSelected((p) => p + 1);
      // refs.current[selected + 1] &&
      //   refs.current[selected + 1].scrollIntoView({ block: "end" });
    }

    useHotkeys(["meta+ctrl+right", "meta+ctrl+]"], moveRight);
    function moveRight() {
      const upward = findFirstSiblingUpward(selected);
      if (upward === -1) return;

      api
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

    useHotkeys(["meta+ctrl+left", "meta+ctrl+["], moveLeft);
    function moveLeft() {
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
        api
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

      api
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
    function moveUp() {
      const upwardIndex = findFirstSiblingUpward(selected);
      if (upwardIndex === -1) return;

      const selCard = cards[selected];
      const destCard = cards[upwardIndex];
      const child = getChildCards(selected);

      api
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
        .catch((e) => app.toast(e.message, "error"));
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
    function moveDown() {
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
        api
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
      api
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
        .catch((e) => app.toast(e.message, "error"));
    }

    useHotkeys(Key.Enter, () => {
      if (selected === -1) return;
      refs.current[selected].edit();
    });

    const refs = useRef<IInlineEdit[]>([]);

    function handleCardAction(index: number, action: CardAction) {
      switch (action) {
        case CardAction.COMPLETE:
          setCompleted(index, true);
          break;
        case CardAction.INPROGRESS:
          setCompleted(index, false);
          break;
        case CardAction.DELETE:
          deleteCard(index);
          break;
        default:
          app.toast(`unknown action: ${action}`, "error");
      }
    }

    function setCompleted(index: number, complete: boolean) {
      const card = cards[index];
      if (!card) {
        app.toast(`invalid card`, "error");
        return;
      }

      api
        .completeCard(card.cardNo, complete)
        .then((r) => setCards((p) => update(p, { [index]: { $set: r } })))
        .then(() => {
          complete
            ? app.toast(`card completed: ${card.subject}`)
            : app.toast(`card set to in progress: ${card.subject}`);
        })
        .catch((e) => app.toast(e.message));
    }

    const [deletingCard, setDeletingCard] = useState(false);

    function deleteCard(index: number) {
      if (deletingCard) return;

      setDeletingCard(true);
      const card = cards[index];

      api
        .deleteCard(card.cardNo)
        .then(() => setCards((p) => p.filter((c) => c.cardNo !== card.cardNo)))
        .then(() => app.toast(`card deleted: ${card.subject}`))
        .catch((e) => app.toast(e.message, "error"))
        .finally(() => setDeletingCard(false));
    }

    return (
      <DndProvider backend={HTML5Backend}>
        <Box
          component="div"
          onDoubleClick={() => onDoubleClick && onDoubleClick()}
        >
          {cards.map((item, i) => {
            let endAdornment = item.labelsList
              .filter((i) => labelsMap[i])
              .map((i) => (
                <LabelChip
                  id={i}
                  label={labelsMap[i]?.label}
                  color={labelsMap[i].color}
                />
              ));
            if (endAdornment) {
              endAdornment = [
                <Stack direction="row" spacing="1px">
                  {endAdornment}
                </Stack>,
              ];
            }

            return (
              <CardItem
                ref={(ref) => (refs.current[i] = ref!)}
                key={item.cardNo}
                index={i}
                card={item}
                selected={selected === i}
                showCardNo={showCardNo}
                endAdornment={endAdornment}
                onClick={(index) => handleCardClick(index)}
                onSubmit={(v) => handleSubmit(i, v)}
                onActionClick={handleCardAction}
                onDragOver={handleDragOver}
                onCanDrop={handleCanDrop}
                onDragDrop={handleDragDrop}
                hasChild={hasChild}
              />
            );
          })}
        </Box>
      </DndProvider>
    );
  }
);

interface DragItem {
  index: number;
  id: string;
  type: string;
}

export const ItemTypes = {
  CARD: "card",
};

interface ItemProp {
  key?: React.Key;
  card: Card.AsObject;
  index: number; // index of items, used in dnd
  selected?: boolean;
  visible?: boolean;
  showCardNo?: boolean;
  endAdornment?: React.ReactNode;
  hasChild?: (cardNo: number) => boolean;
  onClick?: (index: number) => void;
  onSubmit?: (value: string) => void;
  onActionClick?: (index: number, action: CardAction) => void;
  onDragOver: (dragIndex: number, hoverIndex: number) => void;
  onCanDrop: (dragIndex: number, hoverIndex: number) => boolean;
  onDragDrop: (dragIndex: number, dropIndex: number) => void;
}

const CardItem = forwardRef(
  (
    {
      key,
      card,
      index,
      selected = false,
      visible = true,
      showCardNo = true,
      endAdornment,
      hasChild,
      onClick,
      onSubmit,
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
        key={key}
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
            endAdornment={endAdornment}
            onSubmit={(e, value) => onSubmit && onSubmit(value)}
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
