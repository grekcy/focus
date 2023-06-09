import * as jspb from 'google-protobuf'

import * as google_protobuf_empty_pb from 'google-protobuf/google/protobuf/empty_pb';
import * as google_protobuf_timestamp_pb from 'google-protobuf/google/protobuf/timestamp_pb';
import * as google_protobuf_wrappers_pb from 'google-protobuf/google/protobuf/wrappers_pb';


export class GoogleLoginReq extends jspb.Message {
  getCredential(): string;
  setCredential(value: string): GoogleLoginReq;

  getClientId(): string;
  setClientId(value: string): GoogleLoginReq;

  getExtra(): string;
  setExtra(value: string): GoogleLoginReq;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GoogleLoginReq.AsObject;
  static toObject(includeInstance: boolean, msg: GoogleLoginReq): GoogleLoginReq.AsObject;
  static serializeBinaryToWriter(message: GoogleLoginReq, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GoogleLoginReq;
  static deserializeBinaryFromReader(message: GoogleLoginReq, reader: jspb.BinaryReader): GoogleLoginReq;
}

export namespace GoogleLoginReq {
  export type AsObject = {
    credential: string,
    clientId: string,
    extra: string,
  }
}

export class User extends jspb.Message {
  getId(): number;
  setId(value: number): User;

  getUid(): string;
  setUid(value: string): User;

  getEmail(): string;
  setEmail(value: string): User;

  getName(): string;
  setName(value: string): User;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): User.AsObject;
  static toObject(includeInstance: boolean, msg: User): User.AsObject;
  static serializeBinaryToWriter(message: User, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): User;
  static deserializeBinaryFromReader(message: User, reader: jspb.BinaryReader): User;
}

export namespace User {
  export type AsObject = {
    id: number,
    uid: string,
    email: string,
    name: string,
  }
}

export class Card extends jspb.Message {
  getUid(): string;
  setUid(value: string): Card;

  getCardNo(): number;
  setCardNo(value: number): Card;

  getParentCardNo(): number;
  setParentCardNo(value: number): Card;
  hasParentCardNo(): boolean;
  clearParentCardNo(): Card;

  getDepth(): number;
  setDepth(value: number): Card;

  getCreatedAt(): google_protobuf_timestamp_pb.Timestamp | undefined;
  setCreatedAt(value?: google_protobuf_timestamp_pb.Timestamp): Card;
  hasCreatedAt(): boolean;
  clearCreatedAt(): Card;

  getUpdatedAt(): google_protobuf_timestamp_pb.Timestamp | undefined;
  setUpdatedAt(value?: google_protobuf_timestamp_pb.Timestamp): Card;
  hasUpdatedAt(): boolean;
  clearUpdatedAt(): Card;

  getDeferUntil(): google_protobuf_timestamp_pb.Timestamp | undefined;
  setDeferUntil(value?: google_protobuf_timestamp_pb.Timestamp): Card;
  hasDeferUntil(): boolean;
  clearDeferUntil(): Card;

  getDueDate(): google_protobuf_timestamp_pb.Timestamp | undefined;
  setDueDate(value?: google_protobuf_timestamp_pb.Timestamp): Card;
  hasDueDate(): boolean;
  clearDueDate(): Card;

  getCompletedAt(): google_protobuf_timestamp_pb.Timestamp | undefined;
  setCompletedAt(value?: google_protobuf_timestamp_pb.Timestamp): Card;
  hasCompletedAt(): boolean;
  clearCompletedAt(): Card;

  getCreatorId(): number;
  setCreatorId(value: number): Card;

  getResponsibilityId(): number;
  setResponsibilityId(value: number): Card;
  hasResponsibilityId(): boolean;
  clearResponsibilityId(): Card;

  getCardType(): string;
  setCardType(value: string): Card;

  getStatus(): string;
  setStatus(value: string): Card;

  getObjective(): string;
  setObjective(value: string): Card;

  getContent(): string;
  setContent(value: string): Card;

  getLabelsList(): Array<number>;
  setLabelsList(value: Array<number>): Card;
  clearLabelsList(): Card;
  addLabels(value: number, index?: number): Card;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Card.AsObject;
  static toObject(includeInstance: boolean, msg: Card): Card.AsObject;
  static serializeBinaryToWriter(message: Card, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Card;
  static deserializeBinaryFromReader(message: Card, reader: jspb.BinaryReader): Card;
}

export namespace Card {
  export type AsObject = {
    uid: string,
    cardNo: number,
    parentCardNo?: number,
    depth: number,
    createdAt?: google_protobuf_timestamp_pb.Timestamp.AsObject,
    updatedAt?: google_protobuf_timestamp_pb.Timestamp.AsObject,
    deferUntil?: google_protobuf_timestamp_pb.Timestamp.AsObject,
    dueDate?: google_protobuf_timestamp_pb.Timestamp.AsObject,
    completedAt?: google_protobuf_timestamp_pb.Timestamp.AsObject,
    creatorId: number,
    responsibilityId?: number,
    cardType: string,
    status: string,
    objective: string,
    content: string,
    labelsList: Array<number>,
  }

  export enum ParentCardNoCase { 
    _PARENT_CARD_NO_NOT_SET = 0,
    PARENT_CARD_NO = 3,
  }

  export enum DeferUntilCase { 
    _DEFER_UNTIL_NOT_SET = 0,
    DEFER_UNTIL = 7,
  }

  export enum DueDateCase { 
    _DUE_DATE_NOT_SET = 0,
    DUE_DATE = 8,
  }

  export enum CompletedAtCase { 
    _COMPLETED_AT_NOT_SET = 0,
    COMPLETED_AT = 9,
  }

  export enum ResponsibilityIdCase { 
    _RESPONSIBILITY_ID_NOT_SET = 0,
    RESPONSIBILITY_ID = 11,
  }
}

export class AddCardReq extends jspb.Message {
  getObjective(): string;
  setObjective(value: string): AddCardReq;

  getAddAfter(): number;
  setAddAfter(value: number): AddCardReq;
  hasAddAfter(): boolean;
  clearAddAfter(): AddCardReq;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): AddCardReq.AsObject;
  static toObject(includeInstance: boolean, msg: AddCardReq): AddCardReq.AsObject;
  static serializeBinaryToWriter(message: AddCardReq, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): AddCardReq;
  static deserializeBinaryFromReader(message: AddCardReq, reader: jspb.BinaryReader): AddCardReq;
}

export namespace AddCardReq {
  export type AsObject = {
    objective: string,
    addAfter?: number,
  }

  export enum AddAfterCase { 
    _ADD_AFTER_NOT_SET = 0,
    ADD_AFTER = 2,
  }
}

export class ListCardReq extends jspb.Message {
  getStartCond(): Card | undefined;
  setStartCond(value?: Card): ListCardReq;
  hasStartCond(): boolean;
  clearStartCond(): ListCardReq;

  getCond(): Card | undefined;
  setCond(value?: Card): ListCardReq;
  hasCond(): boolean;
  clearCond(): ListCardReq;

  getExcludeCompleted(): boolean;
  setExcludeCompleted(value: boolean): ListCardReq;

  getIncludeDeferred(): boolean;
  setIncludeDeferred(value: boolean): ListCardReq;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ListCardReq.AsObject;
  static toObject(includeInstance: boolean, msg: ListCardReq): ListCardReq.AsObject;
  static serializeBinaryToWriter(message: ListCardReq, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ListCardReq;
  static deserializeBinaryFromReader(message: ListCardReq, reader: jspb.BinaryReader): ListCardReq;
}

export namespace ListCardReq {
  export type AsObject = {
    startCond?: Card.AsObject,
    cond?: Card.AsObject,
    excludeCompleted: boolean,
    includeDeferred: boolean,
  }
}

export class ListCardResp extends jspb.Message {
  getItemsList(): Array<Card>;
  setItemsList(value: Array<Card>): ListCardResp;
  clearItemsList(): ListCardResp;
  addItems(value?: Card, index?: number): Card;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ListCardResp.AsObject;
  static toObject(includeInstance: boolean, msg: ListCardResp): ListCardResp.AsObject;
  static serializeBinaryToWriter(message: ListCardResp, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ListCardResp;
  static deserializeBinaryFromReader(message: ListCardResp, reader: jspb.BinaryReader): ListCardResp;
}

export namespace ListCardResp {
  export type AsObject = {
    itemsList: Array<Card.AsObject>,
  }
}

export class GetCardReq extends jspb.Message {
  getCardNosList(): Array<number>;
  setCardNosList(value: Array<number>): GetCardReq;
  clearCardNosList(): GetCardReq;
  addCardNos(value: number, index?: number): GetCardReq;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetCardReq.AsObject;
  static toObject(includeInstance: boolean, msg: GetCardReq): GetCardReq.AsObject;
  static serializeBinaryToWriter(message: GetCardReq, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetCardReq;
  static deserializeBinaryFromReader(message: GetCardReq, reader: jspb.BinaryReader): GetCardReq;
}

export namespace GetCardReq {
  export type AsObject = {
    cardNosList: Array<number>,
  }
}

export class GetCardResp extends jspb.Message {
  getItemsMap(): jspb.Map<number, Card>;
  clearItemsMap(): GetCardResp;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetCardResp.AsObject;
  static toObject(includeInstance: boolean, msg: GetCardResp): GetCardResp.AsObject;
  static serializeBinaryToWriter(message: GetCardResp, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetCardResp;
  static deserializeBinaryFromReader(message: GetCardResp, reader: jspb.BinaryReader): GetCardResp;
}

export namespace GetCardResp {
  export type AsObject = {
    itemsMap: Array<[number, Card.AsObject]>,
  }
}

export class RankCardReq extends jspb.Message {
  getCardNo(): number;
  setCardNo(value: number): RankCardReq;

  getTargetCardNo(): number;
  setTargetCardNo(value: number): RankCardReq;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): RankCardReq.AsObject;
  static toObject(includeInstance: boolean, msg: RankCardReq): RankCardReq.AsObject;
  static serializeBinaryToWriter(message: RankCardReq, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): RankCardReq;
  static deserializeBinaryFromReader(message: RankCardReq, reader: jspb.BinaryReader): RankCardReq;
}

export namespace RankCardReq {
  export type AsObject = {
    cardNo: number,
    targetCardNo: number,
  }
}

export class PatchCardReq extends jspb.Message {
  getFieldsList(): Array<PatchCardReq.Field>;
  setFieldsList(value: Array<PatchCardReq.Field>): PatchCardReq;
  clearFieldsList(): PatchCardReq;
  addFields(value: PatchCardReq.Field, index?: number): PatchCardReq;

  getCard(): Card | undefined;
  setCard(value?: Card): PatchCardReq;
  hasCard(): boolean;
  clearCard(): PatchCardReq;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): PatchCardReq.AsObject;
  static toObject(includeInstance: boolean, msg: PatchCardReq): PatchCardReq.AsObject;
  static serializeBinaryToWriter(message: PatchCardReq, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): PatchCardReq;
  static deserializeBinaryFromReader(message: PatchCardReq, reader: jspb.BinaryReader): PatchCardReq;
}

export namespace PatchCardReq {
  export type AsObject = {
    fieldsList: Array<PatchCardReq.Field>,
    card?: Card.AsObject,
  }

  export enum Field { 
    OBJECTIVE = 0,
    COMPLETED_AT = 1,
    CONTENT = 2,
    PARENT_CARD_NO = 3,
    LABEL = 4,
    DEFER_UNTIL = 5,
    DUE_DATE = 6,
    CARD_TYPE = 7,
  }
}

export class Label extends jspb.Message {
  getId(): number;
  setId(value: number): Label;

  getUid(): string;
  setUid(value: string): Label;

  getWorkspaceId(): number;
  setWorkspaceId(value: number): Label;

  getLabel(): string;
  setLabel(value: string): Label;

  getDescription(): string;
  setDescription(value: string): Label;

  getColor(): string;
  setColor(value: string): Label;

  getCreatedAt(): google_protobuf_timestamp_pb.Timestamp | undefined;
  setCreatedAt(value?: google_protobuf_timestamp_pb.Timestamp): Label;
  hasCreatedAt(): boolean;
  clearCreatedAt(): Label;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Label.AsObject;
  static toObject(includeInstance: boolean, msg: Label): Label.AsObject;
  static serializeBinaryToWriter(message: Label, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Label;
  static deserializeBinaryFromReader(message: Label, reader: jspb.BinaryReader): Label;
}

export namespace Label {
  export type AsObject = {
    id: number,
    uid: string,
    workspaceId: number,
    label: string,
    description: string,
    color: string,
    createdAt?: google_protobuf_timestamp_pb.Timestamp.AsObject,
  }
}

export class CardProgressSummaryResp extends jspb.Message {
  getTotal(): number;
  setTotal(value: number): CardProgressSummaryResp;

  getDone(): number;
  setDone(value: number): CardProgressSummaryResp;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CardProgressSummaryResp.AsObject;
  static toObject(includeInstance: boolean, msg: CardProgressSummaryResp): CardProgressSummaryResp.AsObject;
  static serializeBinaryToWriter(message: CardProgressSummaryResp, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CardProgressSummaryResp;
  static deserializeBinaryFromReader(message: CardProgressSummaryResp, reader: jspb.BinaryReader): CardProgressSummaryResp;
}

export namespace CardProgressSummaryResp {
  export type AsObject = {
    total: number,
    done: number,
  }
}

export class ListLabelsReq extends jspb.Message {
  getLabelsList(): Array<string>;
  setLabelsList(value: Array<string>): ListLabelsReq;
  clearLabelsList(): ListLabelsReq;
  addLabels(value: string, index?: number): ListLabelsReq;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ListLabelsReq.AsObject;
  static toObject(includeInstance: boolean, msg: ListLabelsReq): ListLabelsReq.AsObject;
  static serializeBinaryToWriter(message: ListLabelsReq, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ListLabelsReq;
  static deserializeBinaryFromReader(message: ListLabelsReq, reader: jspb.BinaryReader): ListLabelsReq;
}

export namespace ListLabelsReq {
  export type AsObject = {
    labelsList: Array<string>,
  }
}

export class ListLabelsResp extends jspb.Message {
  getLabelsList(): Array<Label>;
  setLabelsList(value: Array<Label>): ListLabelsResp;
  clearLabelsList(): ListLabelsResp;
  addLabels(value?: Label, index?: number): Label;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ListLabelsResp.AsObject;
  static toObject(includeInstance: boolean, msg: ListLabelsResp): ListLabelsResp.AsObject;
  static serializeBinaryToWriter(message: ListLabelsResp, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ListLabelsResp;
  static deserializeBinaryFromReader(message: ListLabelsResp, reader: jspb.BinaryReader): ListLabelsResp;
}

export namespace ListLabelsResp {
  export type AsObject = {
    labelsList: Array<Label.AsObject>,
  }
}

export class ListChallengesReq extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ListChallengesReq.AsObject;
  static toObject(includeInstance: boolean, msg: ListChallengesReq): ListChallengesReq.AsObject;
  static serializeBinaryToWriter(message: ListChallengesReq, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ListChallengesReq;
  static deserializeBinaryFromReader(message: ListChallengesReq, reader: jspb.BinaryReader): ListChallengesReq;
}

export namespace ListChallengesReq {
  export type AsObject = {
  }
}

export class Challenge extends jspb.Message {
  getCard(): Card | undefined;
  setCard(value?: Card): Challenge;
  hasCard(): boolean;
  clearCard(): Challenge;

  getTotalCards(): number;
  setTotalCards(value: number): Challenge;

  getCompletedCards(): number;
  setCompletedCards(value: number): Challenge;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Challenge.AsObject;
  static toObject(includeInstance: boolean, msg: Challenge): Challenge.AsObject;
  static serializeBinaryToWriter(message: Challenge, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Challenge;
  static deserializeBinaryFromReader(message: Challenge, reader: jspb.BinaryReader): Challenge;
}

export namespace Challenge {
  export type AsObject = {
    card?: Card.AsObject,
    totalCards: number,
    completedCards: number,
  }
}

export class ListChallengesResp extends jspb.Message {
  getItemsList(): Array<Challenge>;
  setItemsList(value: Array<Challenge>): ListChallengesResp;
  clearItemsList(): ListChallengesResp;
  addItems(value?: Challenge, index?: number): Challenge;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ListChallengesResp.AsObject;
  static toObject(includeInstance: boolean, msg: ListChallengesResp): ListChallengesResp.AsObject;
  static serializeBinaryToWriter(message: ListChallengesResp, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ListChallengesResp;
  static deserializeBinaryFromReader(message: ListChallengesResp, reader: jspb.BinaryReader): ListChallengesResp;
}

export namespace ListChallengesResp {
  export type AsObject = {
    itemsList: Array<Challenge.AsObject>,
  }
}

