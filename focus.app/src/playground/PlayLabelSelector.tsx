import { useEffect, useState } from "react";
import { useFocusApp, useFocusClient } from "../FocusProvider";
import { LabelSelector } from "../lib/components/LabelSelector";
import { Label } from "../lib/proto/focus_pb";

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
  return (
    <>
      <LabelSelector labels={labels}></LabelSelector>
    </>
  );
}
