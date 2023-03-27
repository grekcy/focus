import { Box, Typography } from "@mui/material";
import { useRef } from "react";
import { useFocusClient } from "../FocusProvider";
import { CardBar, ICardBar } from "../lib/components/CardBar";
import { CardListView } from "../lib/components/CardList";

export function TodayPage() {
  const api = useFocusClient();

  const cardBarRef = useRef<ICardBar>(null);

  function queryCardList() {
    return api.listCards();
  }

  return (
    <>
      <Box display="flex">
        <Typography variant="h5" flexGrow={1}>
          Today
        </Typography>
        <Box flexGrow={0}></Box>
      </Box>

      <CardListView queryCardList={queryCardList} />
      <CardBar ref={cardBarRef} />
    </>
  );
}
