import {
  Box,
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
import { useFocusApp, useFocusClient } from "../FocusProvider";
import { CardListView } from "../lib/components/CardList";
import { Card, Challenge } from "../lib/proto/focus_pb";
import { newChallenge } from "../lib/proto/helper";

export function ChallengeIndex() {
  const { challengeId: challengeIdParam } = useParams();

  const challengeId = parseInt(challengeIdParam!);

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

const challenges = [
  {
    id: 1,
    objective: "[MOCK] hello world",
    done: 20,
    inProgress: 10,
    total: 200,
    dueDate: new Date(2023, 4, 1),
  },
  {
    id: 2,
    objective: "[MOCK]: focus for personal usage",
    done: 40,
    inProgress: 5,
    total: 60,
    dueDate: new Date(2023, 3, 21),
  },
];

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
            {challenges.map((ch) => {
              const completedPercent =
                ch.totalcards === 0
                  ? 0
                  : Math.round((ch.completedcards * 100) / ch.totalcards);
              return (
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
                      done={ch.completedcards}
                      total={ch.totalcards}
                    />
                  </TableCell>
                </TableRow>
              );
            })}
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
        .then((r) => setChallenge(r))
        .catch((e) => app.toast(e.message, "error"));
    } else {
      setChallenge(newChallenge());
    }
  }, [challengeId]);

  const [cards, setCards] = useState<Card.AsObject[]>([]);
  useEffect(() => {
    if (!challenge) return;

    api
      .listCards({ parentCardNo: challengeId })
      .then((r) => setCards(r))
      .catch((e) => app.toast(e.message, "error"));
  }, [challenge]);

  if (!challenge) return <></>;

  return (
    <>
      <Box>
        <Typography variant="h5" flexGrow={1}>
          Challenge #{challengeId}: {challenge.card?.objective}
        </Typography>
      </Box>

      <Box sx={{ display: "flex", p: "1rem" }}>
        <Typography sx={{ flexGrow: "0", pr: "1rem" }}>
          Due to:{" "}
          {challenge.card!.dueDate
            ? new Date(
                challenge.card!.dueDate.seconds * 1000
              ).toLocaleDateString()
            : "None"}
        </Typography>
        <Box sx={{ flexGrow: "1" }}>
          <ChallengeProgress
            done={challenge.completedcards}
            total={challenge.totalcards}
          />
        </Box>
      </Box>

      <CardListView cards={cards} />

      <ul>
        <li>Objective</li>
      </ul>
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
