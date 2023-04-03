import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import InputLabel from "@mui/material/InputLabel";
import Popover from "@mui/material/Popover";
import Stack from "@mui/material/Stack";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import update from "immutability-helper";
import { ChangeEvent, useEffect, useState } from "react";
import { useFocusApp, useFocusClient } from "../FocusProvider";
import LabelChip, { LabelColors } from "../lib/components/LabelChip";
import { Label } from "../lib/proto/focus_pb";

function LabelsPage() {
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

  const [choosingColorItem, setChoosingColorItem] = useState(-1);
  function openColorChooser(index: number, target: HTMLElement) {
    setChoosingColorItem(index);
    setColorAnchor(target);
    setColorOpen(true);
  }

  function closeColorChooser() {
    setColorOpen(false);
    setColorAnchor(null);
    setChoosingColorItem(-1);
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
                          id={label.id}
                          color={label.color}
                          label="Click to choose a color"
                          onClick={(e) => openColorChooser(i, e.currentTarget)}
                        />
                      </Box>
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Button onClick={() => handleOkClick(i)}>OK</Button>
                    <Button onClick={() => handleEditCancelClick(i)}>
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
        onClose={closeColorChooser}
      >
        <Box sx={{ display: "flex", flexWrap: "wrap", p: 1, width: "167px" }}>
          {LabelColors.map((c) => (
            <Box
              onClick={() => {
                if (choosingColorItem !== -1) {
                  const x = labels[choosingColorItem];
                  x.color = c;

                  setLabels((p) => p.slice());
                }
                closeColorChooser();
              }}
              sx={{
                border: "0.1px solid #000000",
                backgroundColor: c,
                width: "50px",
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
export default LabelsPage;
