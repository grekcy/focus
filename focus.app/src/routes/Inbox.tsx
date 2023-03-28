import { Box, Typography } from "@mui/material";
import { useEffect, useRef } from "react";
import { useFocusApp, useFocusClient } from "../FocusProvider";
import { CardBar, ICardBar } from "../lib/components/CardBar";
import { CardListView, ICardListView } from "../lib/components/CardList";

export function InboxPage() {
  const app = useFocusApp();
  const api = useFocusClient();

  useEffect(() => {
    const handler = api.addEventListener("card.created", (cardNo: number) => {
      api
        .getCard(cardNo)
        .then((r) => cardListRef.current && cardListRef.current.addCard(r))
        .catch((e) => app.toast(e.message, "error"));
    });
    return () => api.removeEventListener(handler);
  }, [api, app]);

  function queryCardList() {
    console.log(`INBOX: queryCardList()`);
    return api.listCards();
  }

  const cardBarRef = useRef<ICardBar>(null);
  function handleSelectCard(cardNo: number) {
    cardBarRef.current && cardBarRef.current.setCardNo(cardNo);
  }

  const cardListRef = useRef<ICardListView>(null);
  return (
    <>
      <Box display="flex">
        <Typography variant="h5" flexGrow={1}>
          Inbox cards
        </Typography>
        <Box flexGrow={0}></Box>
      </Box>

      <CardListView
        ref={cardListRef}
        queryCardList={queryCardList}
        showCardNo={false}
        onDoubleClick={() => cardBarRef.current && cardBarRef.current.toggle()}
        onSelect={handleSelectCard}
      />
      <CardBar ref={cardBarRef} />
    </>
  );
}
