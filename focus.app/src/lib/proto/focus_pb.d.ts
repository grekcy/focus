import * as jspb from 'google-protobuf'

import * as google_protobuf_wrappers_pb from 'google-protobuf/google/protobuf/wrappers_pb';
import * as google_protobuf_empty_pb from 'google-protobuf/google/protobuf/empty_pb';
import * as google_protobuf_timestamp_pb from 'google-protobuf/google/protobuf/timestamp_pb';


export class Card extends jspb.Message {
  getCardno(): number;
  setCardno(value: number): Card;

  getSubject(): string;
  setSubject(value: string): Card;

  getRank(): number;
  setRank(value: number): Card;

  getCreatedat(): google_protobuf_timestamp_pb.Timestamp | undefined;
  setCreatedat(value?: google_protobuf_timestamp_pb.Timestamp): Card;
  hasCreatedat(): boolean;
  clearCreatedat(): Card;

  getCompletedat(): google_protobuf_timestamp_pb.Timestamp | undefined;
  setCompletedat(value?: google_protobuf_timestamp_pb.Timestamp): Card;
  hasCompletedat(): boolean;
  clearCompletedat(): Card;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Card.AsObject;
  static toObject(includeInstance: boolean, msg: Card): Card.AsObject;
  static serializeBinaryToWriter(message: Card, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Card;
  static deserializeBinaryFromReader(message: Card, reader: jspb.BinaryReader): Card;
}

export namespace Card {
  export type AsObject = {
    cardno: number,
    subject: string,
    rank: number,
    createdat?: google_protobuf_timestamp_pb.Timestamp.AsObject,
    completedat?: google_protobuf_timestamp_pb.Timestamp.AsObject,
  }

  export enum CompletedatCase { 
    _COMPLETEDAT_NOT_SET = 0,
    COMPLETEDAT = 5,
  }
}

export class completeCardReq extends jspb.Message {
  getCardno(): number;
  setCardno(value: number): completeCardReq;

  getComplted(): boolean;
  setComplted(value: boolean): completeCardReq;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): completeCardReq.AsObject;
  static toObject(includeInstance: boolean, msg: completeCardReq): completeCardReq.AsObject;
  static serializeBinaryToWriter(message: completeCardReq, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): completeCardReq;
  static deserializeBinaryFromReader(message: completeCardReq, reader: jspb.BinaryReader): completeCardReq;
}

export namespace completeCardReq {
  export type AsObject = {
    cardno: number,
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

