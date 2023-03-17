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
      width: 120,
      cellClassName: "actions",
      getActions: ({ id }) => {
        const row = rows.find((r) => r.id === id)!;

        const acts = [
          <GridActionsCellItem icon={<EditIcon />} label="Edit" />,
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label="Delete"
            onClick={() => onDeleteClick(id)}
          />,
        ];

        if (row.card.completedat) {
          acts.unshift(
            <GridActionsCellItem
              icon={<TaskAltIcon />}
              label="clear completed"
              onClick={() => setCompleted(row.card.cardno, false)}
            />
          );
        } else {
          acts.unshift(
            <GridActionsCellItem
              icon={<TripOriginIcon />}
              label="mark completed"
              onClick={() => setCompleted(row.card.cardno, true)}
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

  function onDeleteClick(id: GridRowId) {
    console.log(rows);
    return;
    console.log(`deleting ${id}`);

    const service = app.client();
    if (!service) return;

    (async () => {
      await service!
        .deleteCard(parseInt(id.toString(), 10))
        .then((r) => setRows(rows.filter((row) => row.id !== id)))
        .catch((e) => app.toast(e, "error"));
    })();
  }

  const [rows, setRows] = useState<GridRowsProp>([]);
  useEffect(() => {
    (async () => {
      const service = app.client();
      if (!service) return;

      const r = await service.listCards();
      setRows(
        r.map((c) => {
          return {
            id: c.cardno,
            cardNo: c.cardno,
            rank: c.rank,
            subject: c.subject,
            createdAt: c.createdat,
            completedAt: c.completedat,
            card: c,
          };
        })
      );
    })();
  }, []);

  // TODO updated to server
  function processRowUpdate(newRow: GridRowModel) {
    const updatedRow = { ...newRow };
    setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
    console.log(newRow);
    return updatedRow;
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
