import { Empty } from "google-protobuf/google/protobuf/empty_pb";
import { UInt64Value } from "google-protobuf/google/protobuf/wrappers_pb";
import { V1Alpha1Client } from "./proto/FocusServiceClientPb";
import { Card as pCard, CompleteCardReq } from "./proto/focus_pb";

export class FocusAPI {
  s: V1Alpha1Client;

  constructor(endpoint: string) {
    this.s = new V1Alpha1Client(endpoint);
  }

  version = async () => {
    return await this.s.version(new Empty(), null).then((r) => r.toObject());
  };

  quickAddCard = async (subject: string) => {
    const pcard = new pCard();
    pcard.setSubject(subject);

    return await this.s.quickAadCard(pcard, null).then((r) => r.toObject());
  };

  listCards = async () => {
    return await this.s
      .listCards(new Empty(), null)
      .then((r) => r.toObject())
      .then((r) => r.itemsList);
  };

  completeCard = async (cardNo: number, complete: boolean) => {
    const req = new CompleteCardReq();
    req.setCardNo(cardNo);
    req.setComplted(complete);
    await this.s.completeCard(req, null);
  };

  deleteCard = async (cardNo: number) => {
    const no = new UInt64Value();
    no.setValue(cardNo);
    await this.s.deleteCard(no, null);
  };
}
