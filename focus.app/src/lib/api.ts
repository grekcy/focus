import { Empty } from "google-protobuf/google/protobuf/empty_pb";
import { Timestamp } from "google-protobuf/google/protobuf/timestamp_pb";
import {
  StringValue,
  UInt64Value,
} from "google-protobuf/google/protobuf/wrappers_pb";
import { V1Alpha1Client } from "./proto/FocusServiceClientPb";
import {
  Card,
  CardField,
  GetCardReq,
  ListCardReq,
  PatchCardReq,
  RankCardReq,
} from "./proto/focus_pb";

export class FocusAPI {
  s: V1Alpha1Client;
  token: string = "";
  listeners: { [event: string]: EventListener[] };

  constructor(endpoint: string) {
    const authInterceptor = new AuthInterceptor(this.getToken);
    const options = {
      unaryInterceptors: [authInterceptor],
      streamInterceptors: [authInterceptor],
    };
    this.s = new V1Alpha1Client(endpoint, null, options);
    this.listeners = {};
  }

  setToken = (token: string) => {
    this.token = token;
  };

  getToken = (): string => {
    return this.token;
  };

  version = async () => {
    return await this.s.version(new Empty(), null).then((r) => r.toObject());
  };

  quickAddCard = async (subject: string) => {
    const s = new StringValue();
    s.setValue(subject);

    return await this.s
      .quickAddCard(s, null)
      .then((r) => r.toObject())
      .then((r) => {
        this.notify(r, "card.created", r.cardNo);
        return r;
      });
  };

  listCards = async (excludeCompleted = true, excludeChallenges = true) => {
    const req = new ListCardReq();
    req.setExcludeCompleted(excludeCompleted);
    req.setExcludeChallenges(excludeChallenges);
    return await this.s
      .listCards(req, null)
      .then((r) => r.toObject())
      .then((r) => r.itemsList);
  };

  getCard = async (cardNo: number) => {
    const resp = await this.getCards(cardNo);
    return resp[cardNo];
  };

  getCards = async (...cardNo: number[]) => {
    const req = new GetCardReq();
    req.setCardNosList(cardNo);
    return await this.s
      .getCards(req, null)
      .then((r) => Object.fromEntries(r.toObject().itemsMap));
  };

  completeCard = async (cardNo: number, complete: boolean) => {
    const card = new Card();
    card.setCardNo(cardNo);
    if (complete) card.setCompletedAt(Timestamp.fromDate(new Date()));
    else card.clearCreatedAt();

    const req = new PatchCardReq();
    req.addFields(CardField.COMPLETED_AT);
    req.setCard(card);

    return await this.s.patchCard(req, null).then((r) => r.toObject());
  };

  updateCardSubject = async (cardNo: number, subject: string) => {
    const card = new Card();
    card.setCardNo(cardNo);
    card.setSubject(subject);

    return await this.patchCard(card.toObject(), CardField.SUBJECT);
  };

  updateCardContent = async (cardNo: number, content: string) => {
    const card = new Card();
    card.setCardNo(cardNo);
    card.setContent(content);

    return await this.patchCard(card.toObject(), CardField.CONTENT);
  };

  patchCard = async (card: Card.AsObject, ...fields: CardField[]) => {
    const req = new PatchCardReq();
    const c = new Card();
    c.setCardNo(card.cardNo);
    fields.forEach((field) => {
      switch (field) {
        case CardField.SUBJECT:
          c.setSubject(card.subject);
          break;
        case CardField.CONTENT:
          c.setContent(card.content);
          break;
        default:
          throw new Error(`not supported: ${field.toString()}`);
      }
    });
    req.setCard(c);
    req.setFieldsList(fields);

    return await this.s.patchCard(req, null).then((r) => {
      this.notify(r, "card.updated", card.cardNo);
      return r;
    });
  };

  rerankCard = async (cardNo: number, targetCardNo: number) => {
    const req = new RankCardReq();
    req.setCardNo(cardNo);
    req.setTargetCardNo(targetCardNo);
    return await this.s.rerankCard(req, null);
  };

  deleteCard = async (cardNo: number) => {
    const no = new UInt64Value();
    no.setValue(cardNo);
    await this.s.deleteCard(no, null);
  };

  addEventListener = (event: Event, handler: EventListener) => {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(handler);
    return handler;
  };

  removeEventListener = (listener: EventListener) => {
    this.listeners = Object.fromEntries(
      Object.entries(this.listeners).map(([k, v]) => {
        return [k, v.filter((h) => h !== listener)];
      })
    );
  };

  notify = (r: any, event: Event, cardNo: number) => {
    const listeners = this.listeners[event];
    if (listeners) listeners.forEach((h) => h(cardNo));
    return r;
  };
}

class AuthInterceptor {
  getToken: () => string;

  constructor(tokenGetter: () => string) {
    this.getToken = tokenGetter;
  }

  intercept = (request: any, invoker: any) => {
    const metadata = request.getMetadata();
    const token = this.getToken();

    if (token) {
      metadata["Access-Control-Allow-Origin"] = "*";
      metadata.Authorization = "Bearer " + token;
    }
    
    return invoker(request);
  };
}

export type Event = "card.created" | "card.updated";

type EventListener = (resId: number) => void;
