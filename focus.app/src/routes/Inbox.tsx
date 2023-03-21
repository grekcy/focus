import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import EditIcon from "@mui/icons-material/Edit";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import TripOriginIcon from "@mui/icons-material/TripOrigin";
import { Box, Button, Typography } from "@mui/material";
import {
  GridActionsCellItem,
  GridColDef,
  GridRowId,
  GridRowModel,
  GridRowsProp,
} from "@mui/x-data-grid";
import update from "immutability-helper";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { FocusContext, IFocusApp } from "../FocusProvider";
import { CardBar, ICardBar } from "../lib/components/CardBar";
import { CardAction, CardListView } from "../lib/components/CardList";
import { Card } from "../lib/proto/focus_pb";

export function InboxPage() {
  const app: IFocusApp = useContext(FocusContext);
  useEffect(() => {
    const handler = app
      .client()!
      .addEventListener("card.created", async (cardNo: number) => {
        await app
          .client()
          ?.getCard(cardNo)
          .then((r) => setItems((p) => update(p, { $push: [r] })))
          .catch((e) => app.toast(e.message, "error"));
      });

    return () => app.client()!.removeEventListener(handler);
  }, []);

  const columns: GridColDef[] = [
    {
      field: "id",
      headerName: "#",
      flex: 0,
      width: 60,
    },
    {
      field: "subject",
      headerName: "Subject",
      flex: 1,
      editable: true,
    },
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      width: 180,
      cellClassName: "actions",
      getActions: ({ id }) => {
        const row = rows.find((r) => r.id === id)!;

        const acts = [
          <GridActionsCellItem
            icon={<ArrowUpwardIcon />}
            label="Move up"
            disabled={ranking}
            onClick={() => rankUp(row.card.cardNo)}
          />,
          <GridActionsCellItem
            icon={<ArrowDownwardIcon />}
            label="Move down"
            disabled={ranking}
            onClick={() => rankDown(row.card.cardNo)}
          />,
          <GridActionsCellItem icon={<EditIcon />} label="Edit" />,
          <GridActionsCellItem
            icon={<DeleteIcon />}
            disabled={deletingCard}
            label="Delete"
            onClick={() => onDeleteClick(id)}
          />,
        ];

        if (row.card.completedat) {
          acts.unshift(
            <GridActionsCellItem
              icon={<TaskAltIcon />}
              label="clear completed"
              onClick={() => setCompleted(row.card.cardNo, false)}
            />
          );
        } else {
          acts.unshift(
            <GridActionsCellItem
              icon={<TripOriginIcon />}
              label="mark completed"
              onClick={() => setCompleted(row.card.cardNo, true)}
            />
          );
        }

        return acts;
      },
    },
  ];

  function setCompleted(cardNo: number, complete: boolean) {
    if (!cardNo) {
      app.toast(`invalid cardNo: ${cardNo}`);
      return;
    }

    const service = app.client();
    if (!service) return;

    (async () => {
      const updated = await service.completeCard(cardNo, complete);

      setRows(
        rows.map((r) => {
          if (r.cardNo === cardNo) {
            r.card = updated;
          }
          return r;
        })
      );
    })();
  }

  const [ranking, setRanking] = useState(false);
  async function rankUp(cardNo: number) {
    const index = rows.findIndex((r) => r.card.cardNo === cardNo);
    if (index === 0) {
      app.toast("can't not move up top card", "info");
      return;
    }

    setRanking(true);
    await app
      .client()!
      .rankUpCard(cardNo, rows[index - 1].card.cardNo)
      .then(() => refreshRows())
      .catch((e: any) => app.toast(e.message, "error"))
      .finally(() => setRanking(false));
  }

  async function rankDown(cardNo: number) {
    const index = rows.findIndex((r) => r.card.cardNo === cardNo);
    if (index === rows.length - 1) {
      app.toast("can't not move down last card", "info");
      return;
    }

    setRanking(true);
    await app
      .client()!
      .rankDownCard(cardNo, rows[index + 1].card.cardNo)
      .then(() => refreshRows())
      .catch((e: any) => app.toast(e.message, "error"))
      .finally(() => setRanking(false));
  }

  const [deletingCard, setDeletingCard] = useState(false);

  function onDeleteClick(id: GridRowId) {
    if (deletingCard) return;

    setDeletingCard(true);
    console.log(`deleting ${id}`);

    const service = app.client();
    if (!service) return;

    (async () => {
      await service!
        .deleteCard(parseInt(id.toString(), 10))
        .then((r) => setRows(rows.filter((row) => row.id !== id)))
        .catch((e) => app.toast(e, "error"))
        .finally(() => setDeletingCard(false));
    })();
  }

  function deleteCard(cardNo: number) {
    if (deletingCard) return;

    setDeletingCard(true);
    console.log(`deleting ${cardNo}`);

    const service = app.client();
    if (!service) return;

    (async () => {
      await service!
        .deleteCard(cardNo)
        .then((r) =>
          setItems((prev) => prev.filter((item) => item.cardNo !== cardNo))
        )
        .catch((e) => app.toast(e, "error"))
        .finally(() => setDeletingCard(false));
    })();
  }

  const [items, setItems] = useState<Card.AsObject[]>([]);
  const [rows, setRows] = useState<GridRowsProp>([]);
  useEffect(() => {
    refreshRows();
  }, []);

  function refreshRows() {
    (async () => {
      const service = app.client();
      if (!service) return;

      await service
        .listCards()
        .then((r) => {
          setItems(r);
          setRows(
            r.map((c) => {
              return {
                id: c.cardNo,
                cardNo: c.cardNo,
                subject: c.subject,
                card: c,
              };
            })
          );
        })
        .catch((e) => app.toast(e.message, "error"));
    })();
  }

  const [updating, setUpdating] = useState(false);
  function processRowUpdate(newRow: GridRowModel) {
    newRow.subject = newRow.subject.trim();
    newRow.card.subject = newRow.subject.trim();

    setUpdating(true);
    return app
      .client()!
      .updateCardSubject(newRow.card.cardNo, newRow.subject)
      .then((r) => {
        const updatedRow = { ...newRow };
        const index = rows.findIndex((row) => row.id === newRow.id);

        setRows((prevItems) =>
          update(prevItems, { index: { $set: updatedRow } })
        );
        return updatedRow;
      })
      .catch((e: any) => app.toast(e.message, "error"))
      .finally(() => setUpdating(false));
  }

  function handleCardChange(index: number, subject: string) {
    (async () => {
      const card = items[index];
      await app
        .client()!
        .updateCardSubject(card.cardNo, subject)
        .then(() => {
          card.subject = subject;

          setItems((prevItems: Card.AsObject[]) =>
            update(prevItems, { index: { $set: card } })
          );
        })
        .catch((e) => app.toast(e.message));
    })();
  }

  function handleCardAction(index: number, action: CardAction) {
    const card = items[index];
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

  const cardBarRef = useRef<ICardBar>(null);
  function cardBarToggle() {
    cardBarRef.current && cardBarRef.current.toggle();
  }

  const moveCard = useCallback((dragIndex: number, hoverIndex: number) => {
    setItems((prevItems: Card.AsObject[]) =>
      update(prevItems, {
        $splice: [
          [dragIndex, 1],
          [hoverIndex, 0, prevItems[dragIndex] as Card.AsObject],
        ],
      })
    );
  }, []);

  return (
    <>
      <Box display="flex">
        <Typography variant="h5" flexGrow={1}>
          Inbox cards
        </Typography>
        <Box flexGrow={0}>
          <Button onClick={() => cardBarToggle()}>Show Card</Button>
        </Box>
      </Box>

      <CardListView
        items={items}
        showCardNo={false}
        onChange={handleCardChange}
        onActionClick={handleCardAction}
        moveCard={moveCard}
      />
      <CardBar ref={cardBarRef} />
    </>
  );
}
