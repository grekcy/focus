import * as jspb from 'google-protobuf'

import * as google_protobuf_wrappers_pb from 'google-protobuf/google/protobuf/wrappers_pb';
import * as google_protobuf_empty_pb from 'google-protobuf/google/protobuf/empty_pb';
import * as google_protobuf_timestamp_pb from 'google-protobuf/google/protobuf/timestamp_pb';


export class Card extends jspb.Message {
  getCardNo(): number;
  setCardNo(value: number): Card;

  getRank(): number;
  setRank(value: number): Card;

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

  getCompletedAt(): google_protobuf_timestamp_pb.Timestamp | undefined;
  setCompletedAt(value?: google_protobuf_timestamp_pb.Timestamp): Card;
  hasCompletedAt(): boolean;
  clearCompletedAt(): Card;

  getSubject(): string;
  setSubject(value: string): Card;

  getContent(): string;
  setContent(value: string): Card;

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
    rank: number,
    parentCardNo?: number,
    depth: number,
    createdAt?: google_protobuf_timestamp_pb.Timestamp.AsObject,
    completedAt?: google_protobuf_timestamp_pb.Timestamp.AsObject,
    subject: string,
    content: string,
  }

  export enum ParentCardNoCase { 
    _PARENT_CARD_NO_NOT_SET = 0,
    PARENT_CARD_NO = 3,
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

export enum CardField { 
  SUBJECT = 0,
  COMPLETED_AT = 1,
}
