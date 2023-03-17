import { Typography } from "@mui/material";
import {
  DataGrid,
  GridColDef,
  GridRowModel,
  GridRowsProp,
} from "@mui/x-data-grid";
import { Empty } from "google-protobuf/google/protobuf/empty_pb";
import { useEffect, useState } from "react";
import { v1alpha1Client } from "../lib/proto/FocusServiceClientPb";

export function InboxPage() {
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
  ];

  const [rows, setRows] = useState<GridRowsProp>([]);
  useEffect(() => {
    (async () => {
      const svc = new v1alpha1Client("http://localhost:8080");
      await svc
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
        .catch((e) => Error(e))
        .finally(() => {});
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
