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
import { Link, useParams } from "react-router-dom";

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

function ChallengeList() {
  // https://mui.com/material-ui/react-masonry/
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
            </TableRow>
          </TableHead>
          <TableBody>
            {challenges.map((ch) => {
              const completedPercent = Math.round((ch.done * 100) / ch.total);
              const inProgressPercent = Math.round(
                ((ch.done + ch.inProgress) * 100) / ch.total
              );
              return (
                <TableRow>
                  <TableCell>
                    <Link to={ch.id.toString()}>
                      <Typography variant="h6">{ch.objective}</Typography>
                    </Link>
                    <Typography>
                      Due: {ch.dueDate.toLocaleDateString()}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <LinearProgress
                      variant="buffer"
                      color="success"
                      value={completedPercent}
                      valueBuffer={inProgressPercent}
                    />
                    <Typography component="span" sx={{ mr: 1 }}>
                      {completedPercent}% complete,
                    </Typography>
                    <Typography component="span" sx={{ mr: 1 }}>
                      {ch.done} cards completed,
                    </Typography>
                    <Typography component="span" sx={{ mr: 1 }}>
                      {ch.total - ch.done} cards are remained.
                    </Typography>
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
  const challenge = challenges.find((c) => c.id === challengeId)!;

  return (
    <>
      <Box display="flex">
        <Typography variant="h5" flexGrow={1}>
          Challenge #{challengeId}: {challenge.objective}
        </Typography>
      </Box>

      <ul>
        <li>Objective</li>
        <li>Cards</li>
      </ul>
    </>
  );
}
