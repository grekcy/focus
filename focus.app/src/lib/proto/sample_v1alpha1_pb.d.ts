import * as jspb from 'google-protobuf'

import * as google_protobuf_wrappers_pb from 'google-protobuf/google/protobuf/wrappers_pb';
import * as google_api_annotations_pb from './google/api/annotations_pb';


export class TestTypes extends jspb.Message {
  getEnumValue(): TestTypes.EnumTest;
  setEnumValue(value: TestTypes.EnumTest): TestTypes;

  getReleatedValueList(): Array<string>;
  setReleatedValueList(value: Array<string>): TestTypes;
  clearReleatedValueList(): TestTypes;
  addReleatedValue(value: string, index?: number): TestTypes;

  getMapValueMap(): jspb.Map<string, string>;
  clearMapValueMap(): TestTypes;

  getBoolValue(): boolean;
  setBoolValue(value: boolean): TestTypes;

  getStringValue(): string;
  setStringValue(value: string): TestTypes;

  getBytesValue(): Uint8Array | string;
  getBytesValue_asU8(): Uint8Array;
  getBytesValue_asB64(): string;
  setBytesValue(value: Uint8Array | string): TestTypes;

  getInt32Value(): number;
  setInt32Value(value: number): TestTypes;

  getSint32Value(): number;
  setSint32Value(value: number): TestTypes;

  getUint32Value(): number;
  setUint32Value(value: number): TestTypes;

  getFixed32Value(): number;
  setFixed32Value(value: number): TestTypes;

  getSfixed32Value(): number;
  setSfixed32Value(value: number): TestTypes;

  getInt64Value(): number;
  setInt64Value(value: number): TestTypes;

  getSint64Value(): number;
  setSint64Value(value: number): TestTypes;

  getUint64Value(): number;
  setUint64Value(value: number): TestTypes;

  getFixed64Value(): number;
  setFixed64Value(value: number): TestTypes;

  getSfixed64Value(): number;
  setSfixed64Value(value: number): TestTypes;

  getFloatValue(): number;
  setFloatValue(value: number): TestTypes;

  getDoubleValue(): number;
  setDoubleValue(value: number): TestTypes;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): TestTypes.AsObject;
  static toObject(includeInstance: boolean, msg: TestTypes): TestTypes.AsObject;
  static serializeBinaryToWriter(message: TestTypes, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): TestTypes;
  static deserializeBinaryFromReader(message: TestTypes, reader: jspb.BinaryReader): TestTypes;
}

export namespace TestTypes {
  export type AsObject = {
    enumValue: TestTypes.EnumTest,
    releatedValueList: Array<string>,
    mapValueMap: Array<[string, string]>,
    boolValue: boolean,
    stringValue: string,
    bytesValue: Uint8Array | string,
    int32Value: number,
    sint32Value: number,
    uint32Value: number,
    fixed32Value: number,
    sfixed32Value: number,
    int64Value: number,
    sint64Value: number,
    uint64Value: number,
    fixed64Value: number,
    sfixed64Value: number,
    floatValue: number,
    doubleValue: number,
  }

  export enum EnumTest { 
    V0 = 0,
    V1 = 1,
    V2 = 2,
  }
}

