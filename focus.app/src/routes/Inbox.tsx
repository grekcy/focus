import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import EditIcon from "@mui/icons-material/Edit";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import TripOriginIcon from "@mui/icons-material/TripOrigin";
import { Typography } from "@mui/material";
import {
  GridActionsCellItem,
  GridColDef,
  GridRowId,
  GridRowModel,
  GridRowsProp,
} from "@mui/x-data-grid";
import { useContext, useEffect, useState } from "react";
import { FocusContext, IFocusApp } from "../types";
import { DataGridEx } from "./DataGridEx";

export function InboxPage() {
  const app: IFocusApp = useContext(FocusContext);

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
      await service.completeCard(cardNo, complete);
      setRows(
        rows.map((r) => {
          if (r.cardNo === cardNo) {
            r.card.completedat = !r.card.completedat;
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
      .rankUpCard(cardNo, rows[index + 1].card.cardNo)
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

  const [rows, setRows] = useState<GridRowsProp>([]);
  useEffect(() => {
    refreshRows();
  }, []);

  function refreshRows() {
    (async () => {
      const service = app.client();
      if (!service) return;

      const r = await service.listCards();
      setRows(
        r.map((c) => {
          return {
            id: c.cardNo,
            cardNo: c.cardNo,
            rank: c.rank,
            subject: c.subject,
            createdAt: c.createdAt,
            completedAt: c.completedAt,
            depth: c.depth,
            card: c,
          };
        })
      );
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
        setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
        return updatedRow;
      })
      .catch((e: any) => app.toast(e.message, "error"))
      .finally(() => setUpdating(false));
  }

  return (
    <>
      <Typography variant="h5">Inbox</Typography>

      <div style={{ height: 300, width: "100%" }}>
        <DataGridEx
          columns={columns}
          rows={rows}
          autoHeight={true}
          hideFooter={true}
          columnHeaderHeight={0}
          editMode="row"
          processRowUpdate={processRowUpdate}
          getRowClassName={(params) =>
            `super-app-theme--${params.row.card.completedat ? "Filled" : ""}`
          }
        />
      </div>
    </>
  );
}
