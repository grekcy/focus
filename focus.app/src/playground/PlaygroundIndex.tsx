import {
  Collapse,
  Grid,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
} from "@mui/material";
import { ReactNode, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Cursors } from "./Cursors";
import { PlayAutocomplete } from "./PlayAutocomplete";
import { PlayCardBar } from "./PlayCardBar";
import { PlayDateTimePicker } from "./PlayDateTimePicker";
import { PlayFocus } from "./PlayFocus";
import { PlayLabelSelector } from "./PlayLabelSelector";
import { PlayLayout } from "./PlayLayout";
import { PlayTextField } from "./PlayTextField";
import { DragAndDropCancel } from "./dndCancel";
import { DragAndDropSortable } from "./dndSotrable";
import { DragAndDropTesting } from "./dndTesting";

interface IPlay {
  id: string;
  label: string;
  children: ReactNode;
}

const plays = [
  {
    id: "focus-app",
    label: "Focus",
    items: [
      {
        id: "card-bar",
        label: "Card Bar",
        children: <PlayCardBar />,
      },
      {
        id: "focus",
        label: "Focus App",
        children: <PlayFocus />,
      },
      {
        id: "label-selector",
        label: "Label selector",
        children: <PlayLabelSelector />,
      },
    ],
  },
  {
    id: "mui",
    label: "Material UI",
    items: [
      {
        id: "datetime-picker",
        label: "DateTime Picker",
        children: <PlayDateTimePicker />,
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
        id: "layout",
        label: "Layout",
        children: <PlayLayout />,
      },
    ],
  },
  {
    id: "dnd",
    label: "Drag & Drop",
    items: [
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
    ],
  },
];

export function PlaygroundIndex() {
  const { playId } = useParams();

  const [play, setPlay] = useState<IPlay | null>(null);
  const [sectionId, setSectionId] = useState("");

  useEffect(() => {
    plays.forEach((s) => {
      const p = s.items.find((item) => item.id === playId);
      if (p) {
        setPlay(p);
        setSectionId(s.id);
      }
    });
  }, [playId]);

  function handleClick(id: string) {
    setSectionId(id);
  }

  return (
    <>
      <Typography variant="h5">
        Playground{play && `: ${play.label}`}
      </Typography>

      <Grid container>
        <Grid item xs={2}>
          <List component="nav" disablePadding sx={{ width: 1, maxWidth: 150 }}>
            {plays.map((section) => (
              <>
                <ListItem disablePadding>
                  <ListItemButton
                    key={section.id}
                    onClick={() => handleClick(section.id)}
                  >
                    <ListItemText primary={section.label} />
                  </ListItemButton>
                </ListItem>
                <Collapse
                  in={section.id === sectionId}
                  timeout="auto"
                  unmountOnExit
                >
                  <List component="div" dense disablePadding>
                    {section.items.map((item) => (
                      <ListItemButton
                        key={item.id}
                        selected={playId === item.id}
                        component={Link}
                        to={`/playground/${item.id}`}
                        sx={{ pl: 4 }}
                      >
                        <ListItemText primary={item.label} />
                      </ListItemButton>
                    ))}
                  </List>
                </Collapse>
              </>
            ))}
          </List>
        </Grid>
        <Grid item xs={10}>
          {play && play.children}
        </Grid>
      </Grid>
    </>
  );
}
