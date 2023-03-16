import { Typography } from "@mui/material";
import { DataGrid, GridColDef, GridRowsProp } from "@mui/x-data-grid";
import { Empty } from "google-protobuf/google/protobuf/empty_pb";
import { useEffect, useState } from "react";
import { v1alpha1Client } from "../lib/proto/FocusServiceClientPb";

export function InboxPage() {
  const columns: GridColDef[] = [
    {
      field: "subject",
      headerName: "Subject",
      flex: 1,
    },
  ];

  const [rows, setRows] = useState<GridRowsProp>([]);
  useEffect(() => {
    (async () => {
      const svc = new v1alpha1Client("http://localhost:8080");
      const r = await svc
        .listCards(new Empty(), null)
        .then((r) => r.toObject());

      setRows(
        r.itemsList.map((c) => {
          return {
            id: c.no,
            subject: c.subject,
            createdAt: c.createdat,
            rank: c.rank,
            completedAt: c.completedat,
            content: c.content,
            labels: c.labelsList,
          };
        })
      );
    })();
  }, []);

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
        />
      </div>
    </>
  );
}
