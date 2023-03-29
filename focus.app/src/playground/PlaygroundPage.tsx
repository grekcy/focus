import { Box, Tab, Tabs, Typography } from "@mui/material";
import { useState } from "react";
import { useFocusClient } from "../FocusProvider";
import { Cursors } from "./Cursors";
import { DragAndDropCancel } from "./dndCancel";
import { DragAndDropSortable } from "./dndSotrable";
import { DragAndDropTesting } from "./dndTesting";

const plays = [
  {
    label: "Drag: Testing",
    children: <DragAndDropTesting />,
  },
  {
    label: "Drag: Sortable",
    children: <DragAndDropSortable />,
  },
  {
    label: "Drag: Cancel",
    children: <DragAndDropCancel />,
  },
  {
    label: "Drag: Cursors",
    children: <Cursors />,
  },
];

export function PlaygroundPage() {
  const [value, setValue] = useState(0);

  const [playId, setPlayId] = useState(window.location.hash.replace(/^#/, ""));

  const handleChange = (event: any, newValue: any) => {
    setValue(newValue);
  };

  const api = useFocusClient();

  return (
    <>
      <Typography variant="h5">Playground{playId && `: ${playId}`}</Typography>

      <Tabs value={value} onChange={handleChange}>
        {plays.map((play, i) => (
          <Tab label={play.label} {...a11yProps(i)} />
        ))}
      </Tabs>

      {plays.map((play, i) => (
        <TabPanel value={value} index={i}>
          {play.children}
        </TabPanel>
      ))}
    </>
  );
}

function TabPanel(props: any) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 1 }}> {children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `full-width-tab-${index}`,
    "aria-controls": `full-width-tabpanel-${index}`,
  };
}
