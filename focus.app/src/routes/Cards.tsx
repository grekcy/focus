import { Divider, Typography } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FocusContext, IFocusApp } from "../FocusProvider";
import { InlineEdit } from "../lib/components/InlineEdit";
import { Card } from "../lib/proto/focus_pb";

export function CardPage() {
  const app: IFocusApp = useContext(FocusContext);

  const { cardNo } = useParams();
  const [card, setCard] = useState<Card.AsObject | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const cardNoAsNumber = parseInt(cardNo!, 10);
    (async () => {
      setLoading(true);
      await app
        .client()!
        .getCard(cardNoAsNumber)
        .then((r) => setCard(r))
        .catch((e) => app.toast(e.message, "error"))
        .finally(() => setLoading(false));
    })();
  }, []);

  function renderCard() {
    if (!card) return;
    return (
      <>
        <Typography variant="h5">Card #{cardNo}</Typography>
        <InlineEdit value={card.subject} />
        <InlineEdit value={card.content} multiline />
        <Divider textAlign="left">Date</Divider>
        <ul>
          <li>
            Completed at:
            {card.completedAt
              ? new Date(card.completedAt.seconds * 1000).toLocaleString()
              : "not completed"}
          </li>
          <li>
            Created at:
            {new Date(card.createdAt!.seconds * 1000).toLocaleString()}
            &nbsp; by &nbsp; {card?.creatorId}
          </li>
          <li>
            Last update:
            {new Date(card.updatedAt!.seconds * 1000).toLocaleString()}
          </li>
        </ul>
      </>
    );
  }

  return <>{!loading ? renderCard() : <Typography>Loading...</Typography>}</>;
}
