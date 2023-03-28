import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import {
  Box,
  Button,
  Chip,
  IconButton,
  InputLabel,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import update from "immutability-helper";
import { ChangeEvent, useEffect, useState } from "react";
import { useFocusApp, useFocusClient } from "../FocusProvider";
import { Label } from "../lib/proto/focus_pb";

export function LabelsPage() {
  const app = useFocusApp();
  const api = useFocusClient();

  const [labels, setLabels] = useState<Label.AsObject[]>([]);
  useEffect(() => {
    (async () => {
      api
        .listLabels()
        .then((r) => setLabels(r))
        .catch((e) => app.toast(e.message, "error"));
    })();
  }, []);

  const colors = [
    "primary.light",
    "secondary.light",
    "error.light",
    "warning.light",
    "info.light",
    "success.light",
    "primary.main",
    "secondary.main",
    "error.main",
    "warning.main",
    "info.main",
    "success.main",
    "primary.dark",
    "secondary.dark",
    "error.dark",
    "warning.dark",
    "info.dark",
    "success.dark",
  ];

  const textColors: { [key: string]: string } = {};

  const [editingItem, setEditingItem] = useState<{ [key: number]: boolean }>(
    {}
  );
  const [prevValue, setPreValue] = useState<{
    [key: number]: { label: string; desc: string; color: string };
  }>({});
  const [deletingItem, setDeletingItem] = useState(-1);

  function handleLabelChange(
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    index: number
  ) {
    const x = labels[index];
    x.label = e.currentTarget.value;

    setLabels((p) => p.slice());
  }

  function handleDescriptionChange(
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    index: number
  ) {
    const x = labels[index];
    x.description = e.currentTarget.value;

    setLabels((p) => p.slice());
  }

  return (
    <>
      <Typography variant="h5" flexGrow={1}>
        Labels
      </Typography>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Workspace</TableCell>
              <TableCell>Label</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {labels.map((label, i) => (
              <>
                <TableRow key={label.id}>
                  <TableCell>{label.workspaceId}</TableCell>
                  <TableCell>
                    <Chip
                      label={label.label}
                      sx={{
                        color: textColors[label.color]
                          ? textColors[label.color]
                          : "white",
                        backgroundColor: label.color,
                      }}
                    />
                  </TableCell>
                  <TableCell>{label.description}</TableCell>
                  <TableCell align="right">
                    <IconButton
                      sx={{ display: !!editingItem[i] ? "none" : "" }}
                      onClick={() => {
                        setPreValue((p) =>
                          update(p, {
                            [i]: {
                              $set: {
                                label: label.label,
                                desc: label.description,
                                color: label.color,
                              },
                            },
                          })
                        );

                        setEditingItem((p) =>
                          update(p, { [i]: { $set: true } })
                        );
                        setDeletingItem(-1);
                      }}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => {
                        setEditingItem((p) =>
                          update(p, { [i]: { $set: false } })
                        );
                        setDeletingItem(i);
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
                <TableRow
                  sx={{
                    display: editingItem[i] ? "" : "none",
                  }}
                >
                  <TableCell>&nbsp; </TableCell>
                  <TableCell colSpan={2}>
                    <Stack direction="row" spacing={1}>
                      <Box sx={{ width: "xl" }}>
                        <InputLabel htmlFor={`edit_label_${i}`}>
                          Label
                        </InputLabel>
                        <TextField
                          id={`edit_label_${i}`}
                          size="small"
                          value={label.label}
                          onChange={(e) => handleLabelChange(e, i)}
                        />
                      </Box>
                      <Box sx={{ width: 1 }}>
                        <InputLabel htmlFor={`edit_desc_${i}`}>
                          Description
                        </InputLabel>
                        <TextField
                          id={`edit_desc_${i}`}
                          size="small"
                          value={label.description}
                          fullWidth
                          onChange={(e) => handleDescriptionChange(e, i)}
                        />
                      </Box>
                      <Box>
                        <InputLabel htmlFor={`edit_color_${i}`}>
                          Color
                        </InputLabel>
                        <Chip
                          id={`edit_color_${i}`}
                          sx={{
                            color: label.color,
                            backgroundColor: label.color,
                          }}
                          label="Please select a color"
                          clickable
                        />
                      </Box>
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Button
                      onClick={() =>
                        setEditingItem((p) =>
                          update(p, { [i]: { $set: false } })
                        )
                      }
                    >
                      OK
                    </Button>
                    <Button
                      onClick={() => {
                        const x = labels[i];
                        x.label = prevValue[i].label;
                        x.description = prevValue[i].desc;
                        x.color = prevValue[i].color;

                        setLabels((p) => p.slice());

                        setEditingItem((p) =>
                          update(p, { [i]: { $set: false } })
                        );
                      }}
                    >
                      Cancel
                    </Button>
                  </TableCell>
                </TableRow>
              </>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
