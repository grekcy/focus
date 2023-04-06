import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  LinearProgress,
  LinearProgressProps,
  Table,
  TableCell,
  TableContainer,
  TableRow,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useFocusApp, useFocusClient } from "../FocusProvider";
import { InlineEdit } from "../lib/components/InlineEdit";
import { LabelSelector } from "../lib/components/LabelSelector";
import { Card } from "../lib/proto/focus_pb";

export function CardPage() {
  const app = useFocusApp();
  const api = useFocusClient();

  const { cardNo } = useParams();
  const [card, setCard] = useState<Card.AsObject | null>(null);

  useEffect(() => {
    const cardNoAsNumber = parseInt(cardNo!, 10);
    api
      .getCard(cardNoAsNumber)
      .then((r) => setCard(r))
      .catch((e) => app.toast(e.message, "error"));
  }, [cardNo]);

  function handleDescriptionChanged(content: string) {
    if (!card) return;

    api
      .updateCardContent(card.cardNo, content)
      .then((r) => setCard(r))
      .catch((e) => app.toast(e.message, "error"));
  }

  function renderCard() {
    if (!card) return;

    return (
      <>
        <Box display="flex">
          <Typography variant="h5" sx={{ pr: 1 }}>
            CARD-#{cardNo}
          </Typography>
          <Box sx={{ flexGrow: 1, pt: 0.5 }}>
            <InlineEdit value={card.objective} />
          </Box>
        </Box>

        <Accordion defaultExpanded>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6">Status</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <TableContainer>
              <Table>
                <TableRow>
                  <TableCell variant="head">Responsibility</TableCell>
                  <TableCell>{card.creatorId}</TableCell>
                  <TableCell variant="head">Status</TableCell>
                  <TableCell>In progress</TableCell>
                  <TableCell variant="head">Completed at</TableCell>
                  <TableCell>
                    {card.completedAt
                      ? new Date(
                          card.completedAt.seconds * 1000
                        ).toLocaleString()
                      : "not completed"}
                  </TableCell>
                  <TableCell variant="head">Created at</TableCell>
                  <TableCell>
                    Created at:
                    {new Date(card.createdAt!.seconds * 1000).toLocaleString()}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell variant="head">Created by</TableCell>
                  <TableCell>{card.creatorId}</TableCell>
                  <TableCell variant="head">Parent</TableCell>
                  <TableCell>{card.parentCardNo}</TableCell>
                  <TableCell variant="head">Labels</TableCell>
                  <TableCell colSpan={3}>
                    <LabelSelector labels={[]} />
                  </TableCell>
                </TableRow>
              </Table>
            </TableContainer>
          </AccordionDetails>
        </Accordion>

        <Accordion defaultExpanded>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6">Description</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <InlineEdit
              value={card.content}
              multiline
              onSubmit={(target, value) => handleDescriptionChanged(value)}
            />
          </AccordionDetails>
        </Accordion>

        <Accordion defaultExpanded>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6">Cards</Typography>
            <LinearProgressWithLabel
              value={20}
              valueBuffer={30}
              color="success"
            />
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              Suspendisse malesuada lacus ex, sit amet blandit leo lobortis
              eget.
            </Typography>
          </AccordionDetails>
        </Accordion>

        <Accordion defaultExpanded>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6">Update history</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              Suspendisse malesuada lacus ex, sit amet blandit leo lobortis
              eget.
            </Typography>
          </AccordionDetails>
        </Accordion>
      </>
    );
  }

  return <>{renderCard()}</>;
}

function LinearProgressWithLabel(
  props: LinearProgressProps & { value: number }
) {
  return (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <Box sx={{ width: "100%", mr: 1 }}>
        <LinearProgress variant="buffer" {...props} />
      </Box>
      <Box sx={{ minWidth: 35 }}>
        <Typography variant="body2" color="text.secondary">{`${Math.round(
          props.value
        )}%`}</Typography>
      </Box>
    </Box>
  );
}
