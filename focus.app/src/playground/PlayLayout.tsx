import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import { Container, Divider, Grid, Paper, SxProps, Theme } from "@mui/material";
import { ReactNode } from "react";

export function PlayLayout() {
  return (
    <>
      <Divider textAlign="left">CardListViewItem with FlexGrow</Divider>
      <Filled sx={{ display: "flex" }}>
        <Filled sx={{ flexGrow: 0, display: "flex" }}>
          <Filled>
            <DragIndicatorIcon fontSize="small" />
          </Filled>
          <Filled>Depth</Filled>
          <Filled>CardNo</Filled>
        </Filled>
        <Filled sx={{ flexGrow: 1 }}>
          <Filled sx={{ flexGrow: 1, display: "flex" }}>
            <Filled sx={{ flexGrow: 1 }}>Edit</Filled>
          </Filled>
          <Filled sx={{ display: "flex" }}>
            <Filled sx={{ flexGrow: 1 }}>Tag</Filled>
            <Filled sx={{ flexGrow: 0 }}>Deferred...</Filled>
            <Filled sx={{ flexGrow: 0 }}>Due...</Filled>
          </Filled>
        </Filled>
        <Filled sx={{ flexGrow: 0 }}>
          <Filled>Actions</Filled>
        </Filled>
      </Filled>

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
  sx?: SxProps<Theme>;
  children?: ReactNode;
}

export function Filled({ color = "primary.light", sx, children }: FilledProp) {
  return (
    <Paper
      sx={{
        border: "1px dashed gray",
        bgcolor: color,
        minHeight: "4vh",
        // height: "4vh",
        padding: 1,
        textAlign: "center",
        ...sx,
      }}
    >
      {children ? children : JSON.stringify(sx)}
    </Paper>
  );
}
