import { Card } from "./focus_pb";

// returns new card object
export function newCard(
  cardNo: number,
  subject: string,
  depth: number = 0
): Card.AsObject {
  const card = new Card();
  card.setCardNo(cardNo);
  card.setSubject(subject);
  card.setDepth(depth);
  return card.toObject();
}
