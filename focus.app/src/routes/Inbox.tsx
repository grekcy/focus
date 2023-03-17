import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import EditIcon from "@mui/icons-material/Edit";
import { Typography } from "@mui/material";
import {
  DataGrid,
  GridActionsCellItem,
  GridColDef,
  GridRowId,
  GridRowModel,
  GridRowsProp,
} from "@mui/x-data-grid";
import { Empty } from "google-protobuf/google/protobuf/empty_pb";
import { UInt64Value } from "google-protobuf/google/protobuf/wrappers_pb";
import { useContext, useEffect, useState } from "react";
import { FocusContext, IFocusApp } from "../types";

export function InboxPage() {
  const app: IFocusApp = useContext(FocusContext);

  const columns: GridColDef[] = [
    {
      field: "id",
      headerName: "#",
      flex: 0,
      width: 20,
    },
    {
      field: "subject",
      headerName: "Subject",
      flex: 1,
      editable: true,
    },
    {
      field: "actins",
      type: "actions",
      headerName: "Actions",
      width: 100,
      cellClassName: "actions",
      getActions: ({ id }) => {
        return [
          <GridActionsCellItem icon={<EditIcon />} label="Edit" />,
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label="Delete"
            onClick={(e) => {
              onDeleteClick(id);
            }}
          />,
        ];
      },
    },
  ];

  function onDeleteClick(id: GridRowId) {
    console.log(`deleting ${id}`);

    const service = app.client();
    if (!service) {
      return;
    }

    const no = new UInt64Value();
    no.setValue(parseInt(id.toString(), 10));
    (async () => {
      await service
        .deleteCard(no, null)
        .then((r) => setRows(rows.filter((row) => row.id !== id)))
        .catch((e) => app.toast(e, "error"));
    })();
  }

  const [rows, setRows] = useState<GridRowsProp>([]);
  useEffect(() => {
    (async () => {
      const service = app.client();
      if (!service) {
        return;
      }

      await service
        .listCards(new Empty(), null)
        .then((r) => r.toObject())
        .then((r) => {
          setRows(
            r.itemsList.map((c) => {
              return {
                id: c.no,
                rank: c.rank,
                subject: c.subject,
                createdAt: c.createdat,
              };
            })
          );
        })
        .catch((e) => app.toast(e, "error"));
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
        <DataGrid
          columns={columns}
          rows={rows}
          autoHeight={true}
          hideFooter={true}
          columnHeaderHeight={0}
          editMode="row"
          processRowUpdate={processRowUpdate}
        />
      </div>
    </>
  );
}
