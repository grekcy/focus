export class Card {
  id: string = "";
  subject: string = "";
  dueDate: Date | null = null;

  constructor(initializer: any) {
    if (!initializer) return;
    if (initializer.id) this.id = initializer.id;
    if (initializer.subject) this.subject = initializer.subject;
    if (initializer.dueDate) this.dueDate = initializer.dueDate;
  }
}

const MOCK_CARDS = [
  new Card({
    id: 1,
    subject: "focus: setup dev site",
    dueDate: new Date(),
  }),
  new Card({
    id: 2,
    subject: "implement gRPC client and server",
    dueDate: new Date(),
  }),
  new Card({
    id: 3,
    subject: "authentication with oAuth service(google)",
    dueDate: new Date(),
  }),
];

export const focusAPI = {
  getCards() {
    return MOCK_CARDS;
  },

  addCard(card: Card) {
    card.id = `${MOCK_CARDS.length + 1}`;
    MOCK_CARDS.push(card);
  },
};
