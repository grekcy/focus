import { FocusAPI } from "./api";
import { Card } from "./proto/focus_v1alpha1_pb";

const endpoint = "http://127.0.0.1:8080";

enum Status {
  Internal = 13,
  InvalidArgument = 3,
}

describe("focus API", () => {
  // TODO use jtw token
  const service = new FocusAPI(endpoint, () => "whitekid@gmail.com");

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

  test("quick add: empty objective", async () => {
    const got = await service.addCard("").catch((e) => e);
    expect(got.code).toEqual(Status.InvalidArgument);
  });

  test("quick add", async () => {
    const got = await service.addCard("test objective for quick add");
    teardownCards.push(got.cardNo);
    expect(got.cardNo).not.toEqual(0);
    expect(got.objective).toEqual("test objective for quick add");
    expect(got.createdAt?.seconds).not.toEqual(0);
  });

  test("completed", async () => {
    const card = new Card();
    card.setObjective("test objective for completed");

    const got = await service.addCard("test objective for completed");
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

  test("list cards: for sub card", async () => {
    const got = await service.listCards({
      parentCardNo: 2017,
      excludeCompleted: false,
    });
    expect(got.length).not.toEqual(0);
  });

  test("labels: list", async () => {
    const got = await service.listLabels();
    expect(got.length).not.toEqual(0);
    got.forEach((e) => {
      expect(e.id).not.toEqual(0);
      expect(e.label).not.toEqual("");
    });
  });
});
