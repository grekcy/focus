import * as jspb from 'google-protobuf'

import * as google_protobuf_wrappers_pb from 'google-protobuf/google/protobuf/wrappers_pb';
import * as google_protobuf_empty_pb from 'google-protobuf/google/protobuf/empty_pb';
import * as google_protobuf_timestamp_pb from 'google-protobuf/google/protobuf/timestamp_pb';


export class Card extends jspb.Message {
  getCardNo(): number;
  setCardNo(value: number): Card;

  getRank(): number;
  setRank(value: number): Card;

  getParent(): number;
  setParent(value: number): Card;
  hasParent(): boolean;
  clearParent(): Card;

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
    parent?: number,
    depth: number,
    createdAt?: google_protobuf_timestamp_pb.Timestamp.AsObject,
    completedAt?: google_protobuf_timestamp_pb.Timestamp.AsObject,
    subject: string,
    content: string,
  }

  export enum ParentCase { 
    _PARENT_NOT_SET = 0,
    PARENT = 3,
  }

  export enum CompletedAtCase { 
    _COMPLETED_AT_NOT_SET = 0,
    COMPLETED_AT = 6,
  }
}

export class CompleteCardReq extends jspb.Message {
  getCardNo(): number;
  setCardNo(value: number): CompleteCardReq;

  getComplted(): boolean;
  setComplted(value: boolean): CompleteCardReq;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CompleteCardReq.AsObject;
  static toObject(includeInstance: boolean, msg: CompleteCardReq): CompleteCardReq.AsObject;
  static serializeBinaryToWriter(message: CompleteCardReq, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CompleteCardReq;
  static deserializeBinaryFromReader(message: CompleteCardReq, reader: jspb.BinaryReader): CompleteCardReq;
}

export namespace CompleteCardReq {
  export type AsObject = {
    cardNo: number,
    complted: boolean,
  }
}

export class CardListResp extends jspb.Message {
  getItemsList(): Array<Card>;
  setItemsList(value: Array<Card>): CardListResp;
  clearItemsList(): CardListResp;
  addItems(value?: Card, index?: number): Card;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CardListResp.AsObject;
  static toObject(includeInstance: boolean, msg: CardListResp): CardListResp.AsObject;
  static serializeBinaryToWriter(message: CardListResp, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CardListResp;
  static deserializeBinaryFromReader(message: CardListResp, reader: jspb.BinaryReader): CardListResp;
}

export namespace CardListResp {
  export type AsObject = {
    itemsList: Array<Card.AsObject>,
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
