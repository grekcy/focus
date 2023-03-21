import { Box, Button, Typography } from "@mui/material";
import { useContext, useRef } from "react";
import { FocusContext, IFocusApp } from "../FocusProvider";
import { CardBar, ICardBar } from "../lib/components/CardBar";

export function ChallengePage() {
  const app: IFocusApp = useContext(FocusContext);

  const cardBarRef = useRef<ICardBar>(null);
  function cardBarToggle() {
    cardBarRef.current && cardBarRef.current.toggle();
  }

  function onCardDoubleClick(cardNo: number) {
    cardBarRef.current && cardBarRef.current.setCardNo(cardNo);
  }

  return (
    <>
      <Box display="flex">
        <Typography variant="h5" flexGrow={1}>
          Challenges
        </Typography>
        <Box flexGrow={0}>
          <Button onClick={() => cardBarToggle()}>Show Card</Button>
        </Box>
      </Box>

      <Box sx={{ width: 1 }}></Box>
      <CardBar ref={cardBarRef} />
    </>
  );
}
