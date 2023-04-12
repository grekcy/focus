import { Card, Challenge, User } from "./focus_v1alpha1_pb";

// returns new card object
export function newCard(cardNo: number, objective: string): Card.AsObject {
  const card = new Card();
  card.setCardNo(cardNo);
  card.setObjective(objective);
  return card.toObject();
}

export function newEmptyUser() {
  const user = new User();
  user.setName("None");
  return user.toObject();
}

export function newGuestUser() {
  const user = new User();
  return user.toObject();
}

export function newChallenge() {
  const challenge = new Challenge();
  return challenge.toObject();
}
