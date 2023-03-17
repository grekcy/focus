import * as google_protobuf_empty_pb from "google-protobuf/google/protobuf/empty_pb";
import { UInt64Value } from "google-protobuf/google/protobuf/wrappers_pb";
import { v1alpha1Client } from "../FocusServiceClientPb";
import { Card } from "../focus_pb";

const endpoint = "http://127.0.0.1:8080";

const statusInternal = 13;
const statusInvalidArgument = 3;

describe("focus API", () => {
  const service = new v1alpha1Client(endpoint);

  test("get version", async () => {
    const resp = await service
      .version(new google_protobuf_empty_pb.Empty(), null)
      .then((r) => r.toObject())
      .then((got) => {
        expect(got.value).toEqual("v1alpha1");
      });
  });

  test("quick add: empty subject", async () => {
    const card = new Card();
    const got = await service
      .quickAddCard(card, null)
      .then((r) => r.toObject())
      .catch((e) => e);
    expect(got.code).toEqual(statusInvalidArgument);
  });

  test("quick add", async () => {
    const card = new Card();

    card.setSubject("test subject");
    const got = await service
      .quickAddCard(card, null)
      .then((r) => r.toObject())
      .then((got) => {
        expect(got.no).not.toEqual(0);
        expect(got.subject).toEqual("test subject");
        expect(got.createdat?.seconds).not.toEqual(0);
        return got;
      });

    const no = new UInt64Value();
    no.setValue(got.no);
    const r = await service.deleteCard(no, null);
  });
});
