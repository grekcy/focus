export class Card {
  id: number = 0; // database id
  no: number = 0; // card number to display
  parent: number | null = null;
  rank: number = 0;
  subject: string = "";
  dueDate: Date | null = null;
  completedAt: Date | null = null;
  content: string = "";

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
    subject: "quickadd를 통해서 inbox에 card를 추가한다.",
    dueDate: new Date(),
  }),
  new Card({
    id: 2,
    parent: 1,
    subject: "setup golang project",
    dueDate: new Date(),
  }),
  new Card({
    id: 3,
    parent: 1,
    subject: "setup gRPC server & client",
    dueDate: new Date(),
  }),
];

export const focusAPI = {
  getCards() {
    return MOCK_CARDS;
  },

  addCard(card: Card) {
    card.id = MOCK_CARDS.length + 1;
    card.no = card.id;
    MOCK_CARDS.push(card);
  },
};
