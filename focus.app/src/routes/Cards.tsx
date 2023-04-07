import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Accordion,
  AccordionActions,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  IconButton,
  LinearProgress,
  LinearProgressProps,
  Table,
  TableCell,
  TableContainer,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useFocusApp, useFocusClient } from "../FocusProvider";
import { CardListView } from "../lib/components/CardList";
import { InlineEdit } from "../lib/components/InlineEdit";
import { LabelSelector } from "../lib/components/LabelSelector";
import { Card, User } from "../lib/proto/focus_pb";
import { newEmptyUser } from "../lib/proto/helper";

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

  const [creator, setCreator] = useState<User.AsObject>(newEmptyUser());
  const [responsibility, setResponsibility] = useState<User.AsObject>(
    newEmptyUser()
  );
  useEffect(() => {
    if (!card) {
      setCreator(newEmptyUser());
      setResponsibility(newEmptyUser());
      return;
    }

    api.getUser(card.creatorId).then((r) => setCreator(r));
    if (card.responsibilityId)
      api.getUser(card.responsibilityId).then((r) => setResponsibility(r));
    else setResponsibility(newEmptyUser());
  }, [card]);

  const [cards, setCards] = useState<Card.AsObject[]>([]);
  const [totalCards, setTotalCards] = useState(0);
  const [completedCards, setCompletedCards] = useState(0);
  useEffect(() => {
    if (!card) return;

    api
      .listCards({ parentCardNo: card.cardNo, excludeCompleted: false })
      .then((r) => setCards(r))
      .catch((e) => app.toast(e.message, "error"));

    api
      .getCardProgressSummary(card.cardNo)
      .then((r) => {
        setTotalCards(r.total);
        setCompletedCards(r.done);
      })
      .catch((e) => app.toast(e.message, "error"));
  }, [card]);

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
                  <TableCell>
                    <Button
                      onClick={() =>
                        app.toast(
                          "set responsibility: not implemented",
                          "warning"
                        )
                      }
                    >
                      {responsibility.name}
                    </Button>
                  </TableCell>
                  <TableCell variant="head" sx={{ whiteSpace: "nowrap" }}>
                    Reported by
                  </TableCell>
                  <TableCell sx={{ whiteSpace: "nowrap" }}>
                    <Button
                      onClick={() =>
                        app.toast(
                          "view user information: not implemented",
                          "warning"
                        )
                      }
                    >
                      {creator.name}
                    </Button>
                  </TableCell>
                  <TableCell variant="head">Status</TableCell>
                  <TableCell sx={{ whiteSpace: "nowrap" }}>
                    {card.status ? card.status : "None"}
                  </TableCell>
                  <TableCell variant="head" sx={{ whiteSpace: "nowrap" }}>
                    Created at
                  </TableCell>
                  <TableCell sx={{ whiteSpace: "nowrap" }}>
                    {new Date(card.createdAt!.seconds * 1000).toLocaleString()}
                  </TableCell>
                  <TableCell variant="head" sx={{ whiteSpace: "nowrap" }}>
                    Completed at
                  </TableCell>
                  <TableCell sx={{ whiteSpace: "nowrap" }}>
                    {card.completedAt ? (
                      new Date(card.completedAt.seconds * 1000).toLocaleString()
                    ) : (
                      <Button
                        onClick={() =>
                          app.toast("completed: not implemented", "warning")
                        }
                      >
                        not completed
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell variant="head" sx={{ whiteSpace: "nowrap" }}>
                    Belongs to
                  </TableCell>
                  <TableCell>
                    {card.parentCardNo! > 0 ? (
                      <Link to={`/cards/${card.parentCardNo}`}>
                        {card.parentCardNo}
                      </Link>
                    ) : (
                      "None"
                    )}
                  </TableCell>
                  <TableCell variant="head" sx={{ whiteSpace: "nowrap" }}>
                    Due to
                  </TableCell>
                  <TableCell sx={{ whiteSpace: "nowrap" }}>
                    {card.dueDate ? (
                      new Date(card.dueDate.seconds * 1000).toLocaleString()
                    ) : (
                      <Button
                        onClick={() =>
                          app.toast("set due date: not implemented", "warning")
                        }
                      >
                        None
                      </Button>
                    )}
                  </TableCell>
                  <TableCell variant="head">Labels</TableCell>
                  <TableCell colSpan={5}>
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
              value={totalCards > 0 ? (completedCards * 100) / totalCards : 0}
              color="success"
              sx={{ width: "30rem", ml: "1rem" }}
            />
          </AccordionSummary>
          <AccordionDetails>
            <CardListView cards={cards} />
          </AccordionDetails>
          <AccordionActions>
            <TextField
              variant="standard"
              placeholder="add card...."
              sx={{ width: { md: 400 } }}
            />
            <IconButton
              onClick={(e) => {
                app.toast("add card not implemented", "error");
              }}
            ></IconButton>
          </AccordionActions>
        </Accordion>

        <Accordion>
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
