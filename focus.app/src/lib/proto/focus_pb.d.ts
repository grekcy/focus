import * as jspb from 'google-protobuf'

import * as google_protobuf_wrappers_pb from 'google-protobuf/google/protobuf/wrappers_pb';
import * as google_protobuf_empty_pb from 'google-protobuf/google/protobuf/empty_pb';
import * as google_protobuf_timestamp_pb from 'google-protobuf/google/protobuf/timestamp_pb';


export class User extends jspb.Message {
  getId(): number;
  setId(value: number): User;

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
    email: string,
    name: string,
  }
}

export class Card extends jspb.Message {
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

  getCompletedAt(): google_protobuf_timestamp_pb.Timestamp | undefined;
  setCompletedAt(value?: google_protobuf_timestamp_pb.Timestamp): Card;
  hasCompletedAt(): boolean;
  clearCompletedAt(): Card;

  getCreatorId(): number;
  setCreatorId(value: number): Card;

  getSubject(): string;
  setSubject(value: string): Card;

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
    cardNo: number,
    parentCardNo?: number,
    depth: number,
    createdAt?: google_protobuf_timestamp_pb.Timestamp.AsObject,
    updatedAt?: google_protobuf_timestamp_pb.Timestamp.AsObject,
    completedAt?: google_protobuf_timestamp_pb.Timestamp.AsObject,
    creatorId: number,
    subject: string,
    content: string,
    labelsList: Array<number>,
  }

  export enum ParentCardNoCase { 
    _PARENT_CARD_NO_NOT_SET = 0,
    PARENT_CARD_NO = 2,
  }

  export enum CompletedAtCase { 
    _COMPLETED_AT_NOT_SET = 0,
    COMPLETED_AT = 6,
  }
}

export class ListCardReq extends jspb.Message {
  getExcludeCompleted(): boolean;
  setExcludeCompleted(value: boolean): ListCardReq;

  getExcludeChallenges(): boolean;
  setExcludeChallenges(value: boolean): ListCardReq;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ListCardReq.AsObject;
  static toObject(includeInstance: boolean, msg: ListCardReq): ListCardReq.AsObject;
  static serializeBinaryToWriter(message: ListCardReq, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ListCardReq;
  static deserializeBinaryFromReader(message: ListCardReq, reader: jspb.BinaryReader): ListCardReq;
}

export namespace ListCardReq {
  export type AsObject = {
    excludeCompleted: boolean,
    excludeChallenges: boolean,
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
  getFieldsList(): Array<CardField>;
  setFieldsList(value: Array<CardField>): PatchCardReq;
  clearFieldsList(): PatchCardReq;
  addFields(value: CardField, index?: number): PatchCardReq;

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
    fieldsList: Array<CardField>,
    card?: Card.AsObject,
  }
}

export class Label extends jspb.Message {
  getId(): number;
  setId(value: number): Label;

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
    workspaceId: number,
    label: string,
    description: string,
    color: string,
    createdAt?: google_protobuf_timestamp_pb.Timestamp.AsObject,
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

export enum CardField { 
  SUBJECT = 0,
  COMPLETED_AT = 1,
  CONTENT = 2,
  PARENT = 3,
}
