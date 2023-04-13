import {
  Box,
  Button,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { CardListView } from "../lib/components/CardList";
import { DatePickButton } from "../lib/components/DatePickButton";
import { useFocusApp, useFocusClient } from "../lib/components/FocusProvider";
import { Card, Challenge } from "../lib/proto/focus_v1alpha1_pb";
import { newChallenge } from "../lib/proto/helper";

export function ChallengeIndex() {
  const { id } = useParams();

  const challengeId = parseInt(id!);

  return (
    <>
      {challengeId ? (
        <ChallengeView challengeId={challengeId} />
      ) : (
        <ChallengeList />
      )}
    </>
  );
}

// https://mui.com/material-ui/react-masonry/
function ChallengeList() {
  const app = useFocusApp();
  const api = useFocusClient();

  const [challenges, setChallenges] = useState<Challenge.AsObject[]>([]);
  useEffect(() => {
    api
      .listChallenges()
      .then((r) => setChallenges(r))
      .catch((e) => app.toast(e.message, "error"));
  }, []);

  return (
    <>
      <Box display="flex">
        <Typography variant="h5" flexGrow={1}>
          Challenges
        </Typography>
        <Box flexGrow={1}></Box>
        <Box flexGrow={0}>
          <Button
            onClick={() => app.toast("new challenge: not implemented", "error")}
          >
            New Challenge
          </Button>
        </Box>
      </Box>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell></TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {challenges.map((ch) => (
              <TableRow>
                <TableCell>
                  <Link to={ch.card!.cardNo.toString()}>
                    <Typography variant="h6">{ch.card!.objective}</Typography>
                  </Link>
                  <Typography>
                    Due:{" "}
                    {ch.card!.dueDate
                      ? new Date(
                          ch.card!.dueDate!.seconds * 1000
                        ).toLocaleDateString()
                      : "None"}
                  </Typography>
                </TableCell>
                <TableCell>
                  <ChallengeProgress
                    done={ch.completedCards}
                    total={ch.totalCards}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}

interface ChallengeViewProps {
  challengeId: number | undefined;
}

function ChallengeView({ challengeId }: ChallengeViewProps) {
  const app = useFocusApp();
  const api = useFocusClient();

  const [challenge, setChallenge] = useState<Challenge.AsObject | null>(null);
  useEffect(() => {
    if (challengeId) {
      api
        .getChallenge(challengeId)
        .then((r) => {
          setChallenge(r);
          setCompletedCards(r.completedCards);
          setTotalCards(r.totalCards);
        })
        .catch((e) => app.toast(e.message, "error"));
    } else {
      setChallenge(newChallenge());
    }
  }, [challengeId]);

  const [totalCards, setTotalCards] = useState(0);
  const [completedCards, setCompletedCards] = useState(0);

  const [cards, setCards] = useState<Card.AsObject[]>([]);
  useEffect(() => {
    if (!challenge) return;

    api
      .listCards({ parentCardNo: challengeId })
      .then((r) => setCards(r))
      .catch((e) => app.toast(e.message, "error"));
  }, [challenge]);

  if (!challenge) return <></>;

  function handleCardChange(cardNo: number) {
    if (!challengeId) return;
    api
      .getCardProgressSummary(challengeId)
      .then((r) => {
        setCompletedCards(r.done);
        setTotalCards(r.total);
      })
      .catch((e) => app.toast(e.message, "error"));
  }

  return (
    <>
      <Box>
        <Typography variant="h5">
          Challenge <Link to={`/cards/${challengeId}`}>#{challengeId}</Link>:{" "}
          {challenge.card?.objective}
        </Typography>
      </Box>

      <Box sx={{ display: "flex", p: "1rem" }}>
        <Typography sx={{ flexGrow: "0", pr: "1rem" }}>
          Due to:
          <DatePickButton
            value={
              challenge.card!.dueDate
                ? new Date(challenge.card!.dueDate.seconds * 1000)
                : null
            }
          />
        </Typography>
        <Box sx={{ flexGrow: "1" }}>
          <ChallengeProgress done={completedCards} total={totalCards} />
        </Box>
      </Box>

      <CardListView
        cards={cards}
        depth={challenge.card!.depth + 1}
        onChange={handleCardChange}
      />
    </>
  );
}

interface ChallengeProgressProps {
  done: number;
  total: number;
}

function ChallengeProgress({ done, total }: ChallengeProgressProps) {
  const completedPercent = total === 0 ? 0 : Math.round((done * 100) / total);

  return (
    <>
      <LinearProgress
        variant="buffer"
        color="success"
        value={completedPercent}
        valueBuffer={0}
      />
      <Typography component="span" sx={{ mr: 1 }}>
        {completedPercent}% complete,
      </Typography>
      <Typography component="span" sx={{ mr: 1 }}>
        {done} done,
      </Typography>
      <Typography component="span" sx={{ mr: 1 }}>
        {total - done} remained.
      </Typography>
    </>
  );
}
