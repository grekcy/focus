import { FocusAPI } from "./api";
import { Card } from "./proto/focus_pb";

const endpoint = "http://127.0.0.1:8080";

enum Status {
  Internal = 13,
  InvalidArgument = 3,
}

describe("focus API", () => {
  const service = new FocusAPI(endpoint);
  service.setToken("whitekid@gmail.com"); // TODO use jtw token

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
    expect(got.code).toEqual(Status.InvalidArgument);
  });

  test("quick add", async () => {
    const got = await service.quickAddCard("test subject for quick add");
    teardownCards.push(got.cardNo);
    expect(got.cardNo).not.toEqual(0);
    expect(got.subject).toEqual("test subject for quick add");
    expect(got.createdAt?.seconds).not.toEqual(0);
  });

  test("completed", async () => {
    const card = new Card();
    card.setSubject("test subject for completed");

    const got = await service.quickAddCard("test subject for completed");
    teardownCards.push(got.cardNo);

    // set completed
    await service.completeCard(got.cardNo, true);

    // again
    await service
      .completeCard(got.cardNo, true)
      .then((r) => {
        throw Error("should not called");
      })
      .catch((e) => expect(e.message).toMatch("already completed"));
  });
});
