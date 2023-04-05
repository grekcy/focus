import { Card } from "./focus_pb";

// returns new card object
export function newCard(cardNo: number, objective: string): Card.AsObject {
  const card = new Card();
  card.setCardNo(cardNo);
  card.setObjective(objective);
  return card.toObject();
}
