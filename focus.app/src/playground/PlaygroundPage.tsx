import { Typography } from "@mui/material";
import { Link, useParams } from "react-router-dom";
import { Cursors } from "./Cursors";
import { PlayAutocomplete } from "./PlayAutocomplete";
import { PlayLabelSelector } from "./PlayLabelSelector";
import { PlayTextField } from "./PlayTextField";
import { DragAndDropCancel } from "./dndCancel";
import { DragAndDropSortable } from "./dndSotrable";
import { DragAndDropTesting } from "./dndTesting";

const plays = [
  {
    id: "label-selector",
    label: "label selector",
    children: <PlayLabelSelector />,
  },
  {
    id: "autocomplete",
    label: "Autocomplete ",
    children: <PlayAutocomplete />,
  },
  {
    id: "textfield",
    label: "TextField",
    children: <PlayTextField />,
  },
  {
    id: "dnd-testing",
    label: "Drag: Testing",
    children: <DragAndDropTesting />,
  },
  {
    id: "dnd-sortable",
    label: "Drag: Sortable",
    children: <DragAndDropSortable />,
  },
  {
    id: "drag-cancel",
    label: "Drag: Cancel",
    children: <DragAndDropCancel />,
  },
  {
    id: "drag-cursors",
    label: "Drag: Cursors",
    children: <Cursors />,
  },
];

export function PlaygroundPage() {
  const { playId } = useParams();

  const play = plays.find((p) => p.id === playId);

  return (
    <>
      <Typography variant="h5">Playground{playId && `: ${playId}`}</Typography>

      {play && play.children}
      {!play && (
        <ul>
          {plays.map((p) => (
            <li key={p.id}>
              <Link to={p.id}>{p.label}</Link>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
