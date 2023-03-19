import { Empty } from "google-protobuf/google/protobuf/empty_pb";
import {
  StringValue,
  UInt64Value,
} from "google-protobuf/google/protobuf/wrappers_pb";
import { V1Alpha1Client } from "./proto/FocusServiceClientPb";
import { CompleteCardReq, RankCardReq } from "./proto/focus_pb";

export class FocusAPI {
  s: V1Alpha1Client;

  constructor(endpoint: string) {
    this.s = new V1Alpha1Client(endpoint);
  }

  version = async () => {
    return await this.s.version(new Empty(), null).then((r) => r.toObject());
  };

  quickAddCard = async (subject: string) => {
    const s = new StringValue();
    s.setValue(subject);

    return await this.s.quickAddCard(s, null).then((r) => r.toObject());
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
    return await this.s.completeCard(req, null);
  };

  rankUpCard = async (cardNo: number, targetCardNo: number) => {
    const req = new RankCardReq();
    req.setCardNo(cardNo);
    req.setTargetCardNo(targetCardNo);
    return await this.s.rankUpCard(req, null);
  };

  rankDownCard = async (cardNo: number, targetCardNo: number) => {
    const req = new RankCardReq();
    req.setCardNo(cardNo);
    req.setTargetCardNo(targetCardNo);
    return await this.s.rankDownCard(req, null);
  };

  deleteCard = async (cardNo: number) => {
    const no = new UInt64Value();
    no.setValue(cardNo);
    await this.s.deleteCard(no, null);
  };
}
