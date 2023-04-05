import { Box, Typography } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { useFocusApp, useFocusClient } from "../FocusProvider";
import { CardBar, ICardBar } from "../lib/components/CardBar";
import { CardListView } from "../lib/components/CardList";
import { LabelChip } from "../lib/components/LabelChip";
import { Card, Label } from "../lib/proto/focus_pb";

export function TodayPage() {
  const app = useFocusApp();
  const api = useFocusClient();

  const cardBarRef = useRef<ICardBar>(null);

  const [cards, setCards] = useState<Card.AsObject[]>([]);
  useEffect(() => {
    api
      .listCards()
      .then((r) => setCards(r))
      .catch((e) => app.toast(e.message, "error"));
  }, []);

  const [urgentLabels, setUrgentLabels] = useState<Label.AsObject[]>([]);
  useEffect(() => {
    api
      .listLabels(["urgent", "important"])
      // FIXME please remove this
      .then((r) =>
        r.filter((x) => ["urgent", "important"].indexOf(x.label) > -1)
      )
      .then((r) => setUrgentLabels(r))
      .catch((e) => app.toast(e.message, "error"));
  }, []);

  return (
    <>
      <Box display="flex">
        <Typography variant="h5" flexGrow={1}>
          Today
          <Typography display="inline" sx={{ pl: "1rem" }}>
            focus today. please consider &nbsp;
            {urgentLabels.map((label) => (
              <LabelChip
                label={label.label}
                color={label.color}
                size="small"
                onClick={() => app.toast("not implemented", "error")}
              />
            ))}
            &nbsp;things first.
          </Typography>
        </Typography>
        <Box flexGrow={0}></Box>
      </Box>

      <CardListView cards={cards} />
      <CardBar ref={cardBarRef} />
    </>
  );
}
