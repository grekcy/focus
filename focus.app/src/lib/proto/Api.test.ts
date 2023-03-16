import * as google_protobuf_empty_pb from "google-protobuf/google/protobuf/empty_pb";
import { v1alpha1Client } from "./FocusServiceClientPb";
import { Card } from "./focus_pb";

const endpoint = "http://localhost:8080";

describe("focus API", () => {
  test("get version", async () => {
    const svc = new v1alpha1Client(endpoint);
    const resp = await svc.version(new google_protobuf_empty_pb.Empty(), null);
    expect(resp.toObject().value).toEqual("v1alpha1");
  });

  test("quick add", async () => {
    const svc = new v1alpha1Client(endpoint);
    const card = new Card();
    card.setSubject("test subject");
    await svc
      .quickAddCard(card, null)
      .then((r) => r.toObject())
      .then((got) => {
        expect(got.no).not.toEqual(0);
        expect(got.subject).toEqual("test subject");
        expect(got.createdat?.seconds).not.toEqual(0);
      });
  });
});
