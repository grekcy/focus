import { Empty } from 'google-protobuf/google/protobuf/empty_pb';
import { Timestamp } from 'google-protobuf/google/protobuf/timestamp_pb';
import { UInt64Value } from 'google-protobuf/google/protobuf/wrappers_pb';
import { IAuthProvider } from './components/AuthProvider';
import { FocusClient } from './proto/Focus_v1alpha1ServiceClientPb';
import {
  AddCardReq,
  Card,
  GetCardReq,
  GoogleLoginReq,
  Label,
  ListCardReq,
  ListChallengesReq,
  ListLabelsReq,
  PatchCardReq,
  RankCardReq,
} from './proto/focus_v1alpha1_pb';

export enum Event {
  CARD_CREATED,
  CARD_UPDATED,
}

export class FocusAPI {
  s: FocusClient;
  token: string = ''; // apikey
  listeners: { [event: string]: EventListener[] };

  constructor(endpoint: string, auth: IAuthProvider) {
    const authInterceptor = new AuthInterceptor(auth.getToken);
    const options = {
      unaryInterceptors: [authInterceptor],
      streamInterceptors: [authInterceptor],
    };
    this.s = new FocusClient(endpoint, null, options);
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

  versionEx = () => {
    return this.s.versionEx(new Empty(), null).then((r) => r.toObject());
  };

  //
  // FocusAPI
  //

  loginWithGoogle = (credential: string, clientId: string, extra?: string) => {
    const req = new GoogleLoginReq();
    req.setCredential(credential);
    req.setClientId(clientId);
    extra && req.setExtra(extra);
    return this.s.loginWithGoogleOauth(req, null).then((r) => r.toObject());
  };

  getProfile = () => {
    return this.s.getProfile(new Empty(), null).then((r) => r.toObject());
  };

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
    startCardType = 'card',
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
    return this.s.getCards(req, null).then((r) => Object.fromEntries(r.toObject().itemsMap));
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

    return this.patchCard(card.toObject(), PatchCardReq.Field.COMPLETED_AT);
  };

  updateCardObjective = (cardNo: number, objective: string) => {
    const card = new Card();
    card.setCardNo(cardNo);
    card.setObjective(objective);

    return this.patchCard(card.toObject(), PatchCardReq.Field.OBJECTIVE);
  };

  updateCardContent = (cardNo: number, content: string) => {
    const card = new Card();
    card.setCardNo(cardNo);
    card.setContent(content);

    return this.patchCard(card.toObject(), PatchCardReq.Field.CONTENT);
  };

  setParentCard = (cardNo: number, parent: number) => {
    const card = new Card();
    card.setCardNo(cardNo);
    card.setParentCardNo(parent);

    return this.patchCard(card.toObject(), PatchCardReq.Field.PARENT_CARD_NO);
  };

  updateCardLabel = (cardNo: number, labels: number[]) => {
    const card = new Card();
    card.setCardNo(cardNo);
    card.setLabelsList(labels);

    return this.patchCard(card.toObject(), PatchCardReq.Field.LABEL);
  };

  updateCardDeferUntil = (cardNo: number, deferUntil: Date | null) => {
    const card = new Card();
    card.setCardNo(cardNo);
    if (deferUntil) card.setDeferUntil(Timestamp.fromDate(deferUntil));

    return this.patchCard(card.toObject(), PatchCardReq.Field.DEFER_UNTIL);
  };

  updateCardDueDate = (cardNo: number, dueDate: Date | null) => {
    const card = new Card();
    card.setCardNo(cardNo);
    if (dueDate) card.setDueDate(Timestamp.fromDate(dueDate));

    return this.patchCard(card.toObject(), PatchCardReq.Field.DUE_DATE);
  };

  updateCardType = (cardNo: number, cardType: string) => {
    const card = new Card();
    card.setCardNo(cardNo);
    card.setCardType(cardType);

    return this.patchCard(card.toObject(), PatchCardReq.Field.CARD_TYPE);
  };

  moveCardToInbox = (cardNo: number) => {
    const card = new Card();
    card.setCardNo(cardNo);
    card.setCardType('card');
    card.clearParentCardNo();

    return this.patchCard(card.toObject(), PatchCardReq.Field.CARD_TYPE, PatchCardReq.Field.PARENT_CARD_NO);
  };

  patchCard = (card: Card.AsObject, ...fields: PatchCardReq.Field[]) => {
    const req = new PatchCardReq();
    const c = new Card();
    c.setCardNo(card.cardNo);
    fields.forEach((field) => {
      switch (field) {
        case PatchCardReq.Field.OBJECTIVE:
          c.setObjective(card.objective);
          break;
        case PatchCardReq.Field.COMPLETED_AT:
          if (card.completedAt) c.setCompletedAt(Timestamp.fromDate(new Date(card.completedAt!.seconds * 1000)));
          else c.clearCompletedAt();
          break;
        case PatchCardReq.Field.CONTENT:
          c.setContent(card.content);
          break;
        case PatchCardReq.Field.PARENT_CARD_NO:
          card.parentCardNo ? c.setParentCardNo(card.parentCardNo) : c.clearParentCardNo();
          break;
        case PatchCardReq.Field.LABEL:
          c.setLabelsList(card.labelsList);
          break;
        case PatchCardReq.Field.DEFER_UNTIL:
          if (card.deferUntil) {
            const defer = Timestamp.fromDate(new Date(card.deferUntil.seconds * 1000));
            c.setDeferUntil(defer);
          }
          break;
        case PatchCardReq.Field.DUE_DATE:
          if (card.dueDate) {
            const defer = Timestamp.fromDate(new Date(card.dueDate.seconds * 1000));
            c.setDueDate(defer);
          }
          break;
        case PatchCardReq.Field.CARD_TYPE:
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

  createLabel = (label: string, description: string, color: string) => {
    const req = new Label();
    req.setLabel(label);
    req.setDescription(description);
    req.setColor(color);
    return this.s.createLabel(req, null).then((r) => r.toObject());
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
  getToken: () => string | null;

  constructor(tokenGetter: () => string | null) {
    this.getToken = tokenGetter;
  }

  intercept = (request: any, invoker: any) => {
    const metadata = request.getMetadata();
    const token = this.getToken();

    if (token) {
      metadata['Access-Control-Allow-Origin'] = '*';
      metadata.Authorization = 'Bearer ' + token;
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
