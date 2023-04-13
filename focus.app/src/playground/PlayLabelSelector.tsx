import { Button, List, ListItem } from "@mui/material";
import update from "immutability-helper";
import { useEffect, useState } from "react";
import { useFocusApp, useFocusClient } from "../lib/components/FocusProvider";
import { LabelSelector } from "../lib/components/LabelSelector";
import { Label } from "../lib/proto/focus_v1alpha1_pb";

export function PlayLabelSelector() {
  const app = useFocusApp();
  const api = useFocusClient();

  const [labels, setLabels] = useState<Label.AsObject[]>([]);
  useEffect(() => {
    api
      .listLabels()
      .then((r) => setLabels(r))
      .catch((e) => app.toast(e.message, "error"));
  }, []);

  const [selected, setSelected] = useState<number[]>([]);

  function handleChange(selected: number[]) {
    setSelected(selected);
  }

  function addLabel(id: number) {
    if (selected.indexOf(id) !== -1) return;
    setSelected((p) => update(p, { $push: [id] }));
  }

  function removeLabel(id: number) {
    const idx = selected.indexOf(id);
    if (idx === -1) return;

    setSelected((p) => update(p, { $splice: [[idx, 1]] }));
  }

  return (
    <>
      <LabelSelector
        labels={labels}
        selected={selected}
        onSelectionChange={handleChange}
      ></LabelSelector>
      selected: {selected}
      <List>
        {labels.map((label) => {
          const index = selected.indexOf(label.id);

          return (
            <ListItem key={label.id}>
              {index === -1 && (
                <Button onClick={() => addLabel(label.id)}>
                  Add: {label.label}
                </Button>
              )}
              {index !== -1 && (
                <Button onClick={() => removeLabel(label.id)}>
                  Remove: {label.label}
                </Button>
              )}
            </ListItem>
          );
        })}
      </List>
    </>
  );
}
