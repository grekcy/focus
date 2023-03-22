import { Box, Tab, Tabs } from "@mui/material";
import { useState } from "react";
import { DragAndDropCancel } from "./dndCancel";
import { DragAndDropSortable } from "./dndSotrable";
import { DragAndDropTesting } from "./dndTesting";

export function DemoPage() {
  const [value, setValue] = useState(0);

  const handleChange = (event: any, newValue: any) => {
    setValue(newValue);
  };

  return (
    <>
      <h1>Demo</h1>

      <Tabs value={value} onChange={handleChange}>
        <Tab label="Drag: Testing" {...a11yProps(0)}></Tab>
        <Tab label="Drag: Sortable" {...a11yProps(1)}></Tab>
        <Tab label="Drag: Cancel" {...a11yProps(2)}></Tab>
      </Tabs>

      <TabPanel value={value} index={0}>
        <DragAndDropTesting />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <DragAndDropSortable />
      </TabPanel>
      <TabPanel value={value} index={2}>
        <DragAndDropCancel />
      </TabPanel>
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
