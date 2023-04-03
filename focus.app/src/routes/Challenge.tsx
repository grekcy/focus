import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { useRef } from "react";
import CardBar, { ICardBar } from "../lib/components/CardBar";

function ChallengePage() {
  const cardBarRef = useRef<ICardBar>(null);
  function cardBarToggle() {
    cardBarRef.current && cardBarRef.current.toggle();
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
export default ChallengePage;
