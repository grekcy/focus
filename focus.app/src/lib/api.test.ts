import { FocusAPI } from "./api";
import { Card } from "./proto/focus_v1alpha1_pb";

const endpoint = "http://127.0.0.1:8080";

enum Status {
  Internal = 13,
  InvalidArgument = 3,
}

describe("focus API: not require authenticate", () => {
  const service = new FocusAPI(endpoint, () => "");

  test("get version", async () => {
    const got = await service.version();
    expect(got.value).toEqual("v1alpha1");
  });
});

describe("focus API", () => {
  let token = "";
  const service = new FocusAPI(endpoint, () => token);

  beforeAll(async () => {
    const got = await service.loginWithGoogle(
      "eyJhbGciOiJSUzI1NiIsImtpZCI6ImFjZGEzNjBmYjM2Y2QxNWZmODNhZjgzZTE3M2Y0N2ZmYzM2ZDExMWMiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJuYmYiOjE2ODEyMDk3NzMsImF1ZCI6IjI0MzE1Mzg1NTMyOS1obmxtYW5oczk5M2Q0YnF2ODRpMzlrN2o3N2JoMTlmcC5hcHBzLmdvb2dsZXVzZXJjb250ZW50LmNvbSIsInN1YiI6IjExMDUwMDI0OTM2MjM0ODQyOTU4OSIsImVtYWlsIjoid2hpdGVraWRAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImF6cCI6IjI0MzE1Mzg1NTMyOS1obmxtYW5oczk5M2Q0YnF2ODRpMzlrN2o3N2JoMTlmcC5hcHBzLmdvb2dsZXVzZXJjb250ZW50LmNvbSIsIm5hbWUiOiJDaGVuZy1EYWUgQ2hvZSIsInBpY3R1cmUiOiJodHRwczovL2xoMy5nb29nbGV1c2VyY29udGVudC5jb20vYS9BR05teXhZXzNYTEFPXzRZUXJ4TzE5d09yU0ptMmtqNEVyVUV2UG94anR0M2ZXWT1zOTYtYyIsImdpdmVuX25hbWUiOiJDaGVuZy1EYWUiLCJmYW1pbHlfbmFtZSI6IkNob2UiLCJpYXQiOjE2ODEyMTAwNzMsImV4cCI6MTY4MTIxMzY3MywianRpIjoiMDNiMGZkZDdiZDMxZTJmZWI5ZTQ5MDAwOTEzOWNlODdkN2UzNDYyZCJ9.CqUsFvwPBsmrMF5oJlOgiXkqhecXp9VSHprywV0szAbsMgMpCID9VIbUkEti10xbwdnBs0tlk0M8pTtSvs7ZP6WT9rbxmkbl-VNrTUnPE4mEooTi3cFm8MUkovNpp6reKsROOX6yVIJpX3ZmgYbPWpj9gKcvbjUwM9LrIfJ_B7YQf2LPt8Wz1DFDkIrBbVm_JVH57rEwPH5u-1tbZEg0ODg__oUCaCdQCGI1u0bDTVKawlnQNkccquNwbGrxXyxo_-tcLe0OIU_wPfgRoTBM5kK-UqgRAswuau15jJNjpbX99h6gvaif9PCDzDN4Kz3WlJ9O8HmgBe1C9witUGeLww",
      "243153855329-hnlmanhs993d4bqv84i39k7j77bh19fp.apps.googleusercontent.com",
      "__charlie__"
    );
    expect(got.value).not.toEqual("");
    token = got.value;
  });

  test("versionEx", async () => {
    const got = await service.versionEx();
    expect(got.value).toEqual("v1alpha1.ex");
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
