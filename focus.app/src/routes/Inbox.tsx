import { Typography } from "@mui/material";
import { DataGrid, GridColDef, GridRowsProp } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { focusAPI } from "../lib/api";

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
    const cards = focusAPI.getCards();
    const updatedRows = cards.map((c) => {
      return {
        id: c.id,
        subject: c.subject,
        dueDate: c.dueDate?.toLocaleString(),
      };
    });
    setRows(updatedRows);
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
