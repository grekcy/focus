import * as jspb from 'google-protobuf'

import * as google_protobuf_wrappers_pb from 'google-protobuf/google/protobuf/wrappers_pb';
import * as google_protobuf_empty_pb from 'google-protobuf/google/protobuf/empty_pb';
import * as google_protobuf_timestamp_pb from 'google-protobuf/google/protobuf/timestamp_pb';


export class Card extends jspb.Message {
  getCardNo(): number;
  setCardNo(value: number): Card;

  getSubject(): string;
  setSubject(value: string): Card;

  getRank(): number;
  setRank(value: number): Card;

  getCreatedAt(): google_protobuf_timestamp_pb.Timestamp | undefined;
  setCreatedAt(value?: google_protobuf_timestamp_pb.Timestamp): Card;
  hasCreatedAt(): boolean;
  clearCreatedAt(): Card;

  getCompletedAt(): google_protobuf_timestamp_pb.Timestamp | undefined;
  setCompletedAt(value?: google_protobuf_timestamp_pb.Timestamp): Card;
  hasCompletedAt(): boolean;
  clearCompletedAt(): Card;

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
    subject: string,
    rank: number,
    createdAt?: google_protobuf_timestamp_pb.Timestamp.AsObject,
    completedAt?: google_protobuf_timestamp_pb.Timestamp.AsObject,
  }

  export enum CompletedAtCase { 
    _COMPLETED_AT_NOT_SET = 0,
    COMPLETED_AT = 5,
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

