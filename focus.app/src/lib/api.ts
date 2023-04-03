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
  Label,
  ListCardReq,
  PatchCardReq,
  RankCardReq,
} from "./proto/focus_pb";

export class FocusAPI {
  s: V1Alpha1Client;
  listeners: { [event: string]: EventListener[] };

  constructor(endpoint: string, getToken: () => string) {
    const authInterceptor = new AuthInterceptor(getToken);
    const options = {
      unaryInterceptors: [authInterceptor],
      streamInterceptors: [authInterceptor],
    };
    this.s = new V1Alpha1Client(endpoint, null, options);
    this.listeners = {};
  }

  //
  // listeners
  //
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

  version = () => {
    return this.s.version(new Empty(), null).then((r) => r.toObject());
  };

  //
  // FocusAPI
  //
  quickAddCard = (subject: string) => {
    const s = new StringValue();
    s.setValue(subject);

    return this.s
      .quickAddCard(s, null)
      .then((r) => r.toObject())
      .then((r) => {
        this.notify(r, Event.CARD_CREATED, r.cardNo);
        return r;
      });
  };

  listCards = ({
    excludeCompleted = true,
    excludeChallenges = true,
    labels = [],
  }: listCardsParams = {}) => {
    const req = new ListCardReq();
    req.setExcludeCompleted(excludeCompleted);
    req.setExcludeChallenges(excludeChallenges);

    const card = new Card();
    labels && card.setLabelsList(labels);
    req.setCard(card);

    return this.s.listCards(req, null).then((r) => r.toObject().itemsList);
  };

  getCard = (cardNo: number) => {
    return this.getCards(cardNo).then((r) => r[cardNo]);
  };

  getCards = (...cardNo: number[]) => {
    const req = new GetCardReq();
    req.setCardNosList(cardNo);
    return this.s
      .getCards(req, null)
      .then((r) => Object.fromEntries(r.toObject().itemsMap));
  };

  completeCard = (cardNo: number, complete: boolean) => {
    const card = new Card();
    card.setCardNo(cardNo);
    if (complete) card.setCompletedAt(Timestamp.fromDate(new Date()));
    else card.clearCreatedAt();

    const req = new PatchCardReq();
    req.addFields(CardField.COMPLETED_AT);
    req.setCard(card);

    return this.s.patchCard(req, null).then((r) => r.toObject());
  };

  updateCardSubject = (cardNo: number, subject: string) => {
    const card = new Card();
    card.setCardNo(cardNo);
    card.setSubject(subject);

    return this.patchCard(card.toObject(), CardField.SUBJECT).then((r) =>
      r.toObject()
    );
  };

  updateCardContent = (cardNo: number, content: string) => {
    const card = new Card();
    card.setCardNo(cardNo);
    card.setContent(content);

    return this.patchCard(card.toObject(), CardField.CONTENT).then((r) =>
      r.toObject()
    );
  };

  setParentCard = (cardNo: number, parent: number) => {
    const card = new Card();
    card.setCardNo(cardNo);
    card.setParentCardNo(parent);

    return this.patchCard(card.toObject(), CardField.PARENT_CARD).then((r) =>
      r.toObject()
    );
  };

  updateCardLabel = (cardNo: number, labels: number[]) => {
    const card = new Card();
    card.setCardNo(cardNo);
    card.setLabelsList(labels);

    return this.patchCard(card.toObject(), CardField.LABEL).then((r) =>
      r.toObject()
    );
  };

  updateCardDeferUntil = (cardNo: number, deferUntil: Date | null) => {
    const card = new Card();
    card.setCardNo(cardNo);
    if (deferUntil) card.setDeferUntil(Timestamp.fromDate(deferUntil));

    return this.patchCard(card.toObject(), CardField.DEFER_UNTIL).then((r) =>
      r.toObject()
    );
  };

  patchCard = (card: Card.AsObject, ...fields: CardField[]) => {
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
        case CardField.PARENT_CARD:
          card.parentCardNo
            ? c.setParentCardNo(card.parentCardNo)
            : c.clearParentCardNo();
          break;
        case CardField.LABEL:
          c.setLabelsList(card.labelsList);
          break;
        case CardField.DEFER_UNTIL:
          if (card.deferUntil) {
            const defer = Timestamp.fromDate(
              new Date(card.deferUntil.seconds * 1000)
            );
            c.setDeferUntil(defer);
          } else {
            c.clearDeferUntil()
          }
          break;
        default:
          throw new Error(`not implemented patch: ${field}`);
      }
    });
    req.setCard(c);
    req.setFieldsList(fields);

    return this.s.patchCard(req, null).then((r) => {
      this.notify(r, Event.CARD_UPDATED, card.cardNo);
      return r;
    });
  };

  rerankCard = (cardNo: number, targetCardNo: number) => {
    const req = new RankCardReq();
    req.setCardNo(cardNo);
    req.setTargetCardNo(targetCardNo);
    return this.s.rerankCard(req, null);
  };

  deleteCard = (cardNo: number) => {
    const no = new UInt64Value();
    no.setValue(cardNo);
    return this.s.deleteCard(no, null);
  };

  listLabels = () => {
    return this.s
      .listLabels(new Empty(), null)
      .then((r) => r.toObject().labelsList);
  };

  updateLabel = (label: Label.AsObject) => {
    const req = new Label();
    req.setId(label.id);
    req.setLabel(label.label);
    req.setDescription(label.description);
    req.setColor(label.color);
    return this.s.updateLabel(req, null).then((r) => r.toObject());
  };

  deleteLabel = (id: number) => {
    const req = new UInt64Value();
    req.setValue(id);
    return this.s.deleteLabel(req, null).then((r) => r.toObject());
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

export enum Event {
  CARD_CREATED,
  CARD_UPDATED,
}

type EventListener = (resId: number) => void;

interface listCardsParams {
  excludeCompleted?: boolean;
  excludeChallenges?: boolean;
  labels?: number[];
}
