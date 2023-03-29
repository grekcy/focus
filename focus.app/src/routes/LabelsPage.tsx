import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import {
  Box,
  Button,
  IconButton,
  InputLabel,
  Popover,
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
import { LabelChip, LabelColors } from "../lib/components/Labels";
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

  const [editing, setEditing] = useState<{ [key: number]: boolean }>({});
  const [prevValue, setPreValue] = useState<{
    [key: number]: { label: string; desc: string; color: string };
  }>({});
  const [colorOpen, setColorOpen] = useState(false);
  const [colorAnchor, setColorAnchor] = useState<Element | null>(null);
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

  function handleOkClick(index: number) {
    const label = labels[index];
    api
      .updateLabel(label)
      .then((r) => {
        setLabels((p) =>
          update(p, {
            $splice: [
              [index, 1],
              [index, 0, r],
            ],
          })
        );
        setEditing((p) => update(p, { [index]: { $set: false } }));
      })
      .catch((e) => app.toast(e.message, "error"));
  }

  function handleEditCancelClick(i: number) {
    const x = labels[i];
    x.label = prevValue[i].label;
    x.description = prevValue[i].desc;
    x.color = prevValue[i].color;

    setLabels((p) => p.slice());

    setEditing((p) => update(p, { [i]: { $set: false } }));
  }

  function handleDeleteClick(index: number) {
    if (!window.confirm(`delete label? ${labels[index].label}`)) return;

    api
      .deleteLabel(labels[index].id)
      .then(() => {
        setLabels((p) => update(p, { $splice: [[index, 1]] }));
        setEditing((p) => update(p, { [index]: { $set: false } }));
        setDeletingItem(index);
      })
      .catch((e) => app.toast(e.message, "error"));
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
                    <LabelChip label={label.label} color={label.color} />
                  </TableCell>
                  <TableCell>{label.description}</TableCell>
                  <TableCell align="right">
                    <IconButton
                      sx={{ display: !!editing[i] ? "none" : "" }}
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

                        setEditing((p) => update(p, { [i]: { $set: true } }));
                        setDeletingItem(-1);
                      }}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDeleteClick(i)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
                <TableRow
                  sx={{
                    display: editing[i] ? "" : "none",
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
                        <InputLabel>Color</InputLabel>
                        <LabelChip
                          id={`color_choose_${i}`}
                          color={label.color}
                          label="Please select a color"
                          onClick={(e) => {
                            setColorAnchor(e.currentTarget);
                            setColorOpen(true);
                          }}
                        />
                      </Box>
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Button onClick={() => handleOkClick(i)}>OK</Button>
                    <Button onClick={() => handleEditCancelClick}>
                      Cancel
                    </Button>
                  </TableCell>
                </TableRow>
              </>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Popover
        open={colorOpen}
        anchorEl={colorAnchor}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        onClose={() => {
          setColorOpen(false);
          setColorAnchor(null);
        }}
      >
        <Box sx={{ display: "flex", flexWrap: "wrap", p: 1, width: "180px" }}>
          {LabelColors.map((c) => (
            <Box
              sx={{
                backgroundColor: c,
                width: "50px",
                m: "1px",
                cursor: "crosshair",
              }}
            >
              &nbsp;
            </Box>
          ))}
        </Box>
      </Popover>
    </>
  );
}
