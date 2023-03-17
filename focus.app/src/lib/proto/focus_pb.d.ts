import * as jspb from 'google-protobuf'

import * as google_protobuf_wrappers_pb from 'google-protobuf/google/protobuf/wrappers_pb';
import * as google_protobuf_empty_pb from 'google-protobuf/google/protobuf/empty_pb';
import * as google_protobuf_timestamp_pb from 'google-protobuf/google/protobuf/timestamp_pb';


export class Card extends jspb.Message {
  getNo(): number;
  setNo(value: number): Card;

  getSubject(): string;
  setSubject(value: string): Card;

  getRank(): number;
  setRank(value: number): Card;

  getCreatedat(): google_protobuf_timestamp_pb.Timestamp | undefined;
  setCreatedat(value?: google_protobuf_timestamp_pb.Timestamp): Card;
  hasCreatedat(): boolean;
  clearCreatedat(): Card;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Card.AsObject;
  static toObject(includeInstance: boolean, msg: Card): Card.AsObject;
  static serializeBinaryToWriter(message: Card, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Card;
  static deserializeBinaryFromReader(message: Card, reader: jspb.BinaryReader): Card;
}

export namespace Card {
  export type AsObject = {
    no: number,
    subject: string,
    rank: number,
    createdat?: google_protobuf_timestamp_pb.Timestamp.AsObject,
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

