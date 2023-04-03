import { Container, Divider, Grid, Paper } from "@mui/material";

export function PlayLayout() {
  return (
    <>
      <Divider textAlign="left">Grid</Divider>
      <Grid container>
        <Grid item xs={2}>
          <Filled />
        </Grid>
        <Grid item xs={4}>
          <Filled />
        </Grid>
        <Grid item xs={6}>
          <Filled />
        </Grid>
      </Grid>

      <Divider textAlign="left">Container</Divider>
      <Container maxWidth={false}>
        <Filled color="#cfe8fc" />
      </Container>
    </>
  );
}

interface FilledProp {
  color?: string;
  text?: string;
}

export function Filled({ color = "#cfe8fc", text = "text" }: FilledProp) {
  return (
    <Paper
      sx={{
        border: "1px dashed gray",
        bgcolor: color,
        height: "5vh",
        padding: 1,
        textAlign: "center",
      }}
    >
      {text}
    </Paper>
  );
}
