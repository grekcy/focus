import { FocusAPI } from "./api";
import { Card } from "./proto/focus_pb";

const endpoint = "http://127.0.0.1:8080";

const statusInternal = 13;
const statusInvalidArgument = 3;

describe("focus API", () => {
  const service = new FocusAPI(endpoint);

  test("get version", async () => {
    const got = await service.version();
    expect(got.value).toEqual("v1alpha1");
  });

  let teardownCards: number[] = [];
  afterEach(() => {
    teardownCards.forEach(async (id) => {
      await service.deleteCard(id);
      teardownCards = [];
    });
  });

  test("quick add: empty subject", async () => {
    const card = new Card();
    const got = await service.quickAddCard("").catch((e) => e);
    expect(got.code).toEqual(statusInvalidArgument);
  });

  test("quick add", async () => {
    const got = await service.quickAddCard("test subject for quick add");
    teardownCards.push(got.cardno);
    expect(got.cardno).not.toEqual(0);
    expect(got.subject).toEqual("test subject for quick add");
    expect(got.createdat?.seconds).not.toEqual(0);
  });

  test("completed", async () => {
    const card = new Card();
    card.setSubject("test subject for completed");

    const got = await service.quickAddCard("test subject for completed");
    teardownCards.push(got.cardno);

    // set completed
    await service.completeCard(got.cardno, true);

    // again
    await service
      .completeCard(got.cardno, true)
      .then((r) => {
        throw Error("should not called");
      })
      .catch((e) => expect(e.message).toMatch("already completed"));
  });
});
