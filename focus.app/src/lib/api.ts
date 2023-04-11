import { Empty } from "google-protobuf/google/protobuf/empty_pb";
import { Timestamp } from "google-protobuf/google/protobuf/timestamp_pb";
import { UInt64Value } from "google-protobuf/google/protobuf/wrappers_pb";
import { v1alpha1Client } from "./proto/FocusServiceClientPb";
import {
  AddCardReq,
  Card,
  CardField,
  GetCardReq,
  Label,
  ListCardReq,
  ListChallengesReq,
  ListLabelsReq,
  PatchCardReq,
  RankCardReq,
} from "./proto/focus_pb";

export enum Event {
  CARD_CREATED,
  CARD_UPDATED,
}

export class FocusAPI {
  s: v1alpha1Client;
  listeners: { [event: string]: EventListener[] };

  constructor(endpoint: string, getToken: () => string) {
    const authInterceptor = new AuthInterceptor(getToken);
    const options = {
      unaryInterceptors: [authInterceptor],
      streamInterceptors: [authInterceptor],
    };
    this.s = new v1alpha1Client(endpoint, null, options);
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
  getUser = (id: number) => {
    const userId = new UInt64Value();
    userId.setValue(id);

    return this.s.getUser(userId, null).then((r) => r.toObject());
  };

  addCard = (objective: string, addAfter?: number) => {
    const req = new AddCardReq();
    req.setObjective(objective);
    if (addAfter) req.setAddAfter(addAfter);
    return this.s
      .addCard(req, null)
      .then((r) => r.toObject())
      .then((r) => {
        this.notify(r, Event.CARD_CREATED, r.cardNo);
        return r;
      });
  };

  listCards = ({
    startCardType = "card",
    parentCardNo,
    excludeCompleted = true,
    includeDeferred = false,
    labels = [],
  }: listCardsParams = {}) => {
    const req = new ListCardReq();

    const startCond = new Card();
    startCond.setCardType(startCardType);
    parentCardNo && startCond.setParentCardNo(parentCardNo);
    req.setStartCond(startCond);

    const cond = new Card();
    labels && cond.setLabelsList(labels);
    req.setCond(cond);

    req.setExcludeCompleted(excludeCompleted);
    req.setIncludeDeferred(includeDeferred);

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

  getCardProgressSummary = (cardNo: number) => {
    const req = new UInt64Value();
    req.setValue(cardNo);
    return this.s.getCardProgressSummary(req, null).then((r) => r.toObject());
  };

  completeCard = (cardNo: number, complete: boolean) => {
    const card = new Card();
    card.setCardNo(cardNo);
    if (complete) card.setCompletedAt(Timestamp.fromDate(new Date()));
    else card.clearCreatedAt();

    return this.patchCard(card.toObject(), CardField.COMPLETED_AT);
  };

  updateCardObjective = (cardNo: number, objective: string) => {
    const card = new Card();
    card.setCardNo(cardNo);
    card.setObjective(objective);

    return this.patchCard(card.toObject(), CardField.OBJECTIVE);
  };

  updateCardContent = (cardNo: number, content: string) => {
    const card = new Card();
    card.setCardNo(cardNo);
    card.setContent(content);

    return this.patchCard(card.toObject(), CardField.CONTENT);
  };

  setParentCard = (cardNo: number, parent: number) => {
    const card = new Card();
    card.setCardNo(cardNo);
    card.setParentCardNo(parent);

    return this.patchCard(card.toObject(), CardField.PARENT_CARD);
  };

  updateCardLabel = (cardNo: number, labels: number[]) => {
    const card = new Card();
    card.setCardNo(cardNo);
    card.setLabelsList(labels);

    return this.patchCard(card.toObject(), CardField.LABEL);
  };

  updateCardDeferUntil = (cardNo: number, deferUntil: Date | null) => {
    const card = new Card();
    card.setCardNo(cardNo);
    if (deferUntil) card.setDeferUntil(Timestamp.fromDate(deferUntil));

    return this.patchCard(card.toObject(), CardField.DEFER_UNTIL);
  };

  updateCardDueDate = (cardNo: number, dueDate: Date | null) => {
    const card = new Card();
    card.setCardNo(cardNo);
    if (dueDate) card.setDueDate(Timestamp.fromDate(dueDate));

    return this.patchCard(card.toObject(), CardField.DUE_DATE);
  };

  updateCardType = (cardNo: number, cardType: string) => {
    const card = new Card();
    card.setCardNo(cardNo);
    card.setCardType(cardType);

    return this.patchCard(card.toObject(), CardField.CARD_TYPE);
  };

  patchCard = (card: Card.AsObject, ...fields: CardField[]) => {
    const req = new PatchCardReq();
    const c = new Card();
    c.setCardNo(card.cardNo);
    fields.forEach((field) => {
      switch (field) {
        case CardField.OBJECTIVE:
          c.setObjective(card.objective);
          break;
        case CardField.COMPLETED_AT:
          if (card.completedAt)
            c.setCompletedAt(
              Timestamp.fromDate(new Date(card.completedAt!.seconds * 1000))
            );
          else c.clearCompletedAt();
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
          }
          break;
        case CardField.DUE_DATE:
          if (card.dueDate) {
            const defer = Timestamp.fromDate(
              new Date(card.dueDate.seconds * 1000)
            );
            c.setDueDate(defer);
          }
          break;
        case CardField.CARD_TYPE:
          c.setCardType(card.cardType);
          break;
        default:
          throw new Error(`not implemented patch: ${field}`);
      }
    });
    req.setCard(c);
    req.setFieldsList(fields);

    return this.s.patchCard(req, null).then((r) => {
      this.notify(r, Event.CARD_UPDATED, card.cardNo);
      return r.toObject();
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

  listLabels = (labels?: string[]) => {
    const req = new ListLabelsReq();
    if (labels && labels.length > 0) req.setLabelsList(labels);
    return this.s.listLabels(req, null).then((r) => r.toObject().labelsList);
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

  listChallenges = () => {
    const req = new ListChallengesReq();
    return this.s.listChallenges(req, null).then((r) => r.toObject().itemsList);
  };

  getChallenge = (id: number) => {
    const req = new UInt64Value();
    req.setValue(id);
    return this.s.getChallenge(req, null).then((r) => r.toObject());
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

type EventListener = (resId: number) => void;

interface listCardsParams {
  startCardType?: string;
  parentCardNo?: number;
  labels?: number[];

  excludeCompleted?: boolean;
  includeDeferred?: boolean;
}
