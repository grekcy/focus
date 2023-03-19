import { Empty } from "google-protobuf/google/protobuf/empty_pb";
import { Timestamp } from "google-protobuf/google/protobuf/timestamp_pb";
import {
  StringValue,
  UInt64Value,
} from "google-protobuf/google/protobuf/wrappers_pb";
import { V1Alpha1Client } from "./proto/FocusServiceClientPb";
import { Card, PatchCardReq, RankCardReq } from "./proto/focus_pb";

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
    const card = new Card();
    card.setCardNo(cardNo);
    if (complete) card.setCompletedAt(Timestamp.fromDate(new Date()));
    else card.clearCreatedAt();

    const req = new PatchCardReq();
    req.addFields("completed_at");
    req.setCard(card);

    return await this.s.patchCard(req, null);
  };

  updateCardSubject = async (cardNo: number, subject: string) => {
    const card = new Card();
    card.setCardNo(cardNo);
    card.setSubject(subject);

    const req = new PatchCardReq();
    req.addFields("subject");
    req.setCard(card);

    return await this.s.patchCard(req, null);
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
