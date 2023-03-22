import { Card } from "./focus_pb";

// returns new card object
export function newCard(cardNo: number, subject: string): Card.AsObject {
  const card = new Card();
  card.setCardNo(cardNo);
  card.setSubject(subject);
  return card.toObject();
}
