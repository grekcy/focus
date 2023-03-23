import { Box, Tab, Tabs, Typography } from "@mui/material";
import { useState } from "react";
import { Cursors } from "./Cursors";
import { DragAndDropCancel } from "./dndCancel";
import { DragAndDropSortable } from "./dndSotrable";
import { DragAndDropTesting } from "./dndTesting";

const demos = [
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

export function DemoPage() {
  const [value, setValue] = useState(0);

  const handleChange = (event: any, newValue: any) => {
    setValue(newValue);
  };

  return (
    <>
      <Typography variant="h5">Demo</Typography>

      <Tabs value={value} onChange={handleChange}>
        {demos.map((demo, i) => (
          <Tab label={demo.label} {...a11yProps(i)} />
        ))}
      </Tabs>

      {demos.map((demo, i) => (
        <TabPanel value={value} index={i}>
          {demo.children}
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
