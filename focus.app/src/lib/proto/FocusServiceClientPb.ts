/**
 * @fileoverview gRPC-Web generated client stub for 
 * @enhanceable
 * @public
 */

// Code generated by protoc-gen-grpc-web. DO NOT EDIT.
// versions:
// 	protoc-gen-grpc-web v1.4.2
// 	protoc              v3.21.12
// source: focus.proto


/* eslint-disable */
// @ts-nocheck


import * as grpcWeb from 'grpc-web';

import * as focus_pb from './focus_pb';
import * as google_protobuf_empty_pb from 'google-protobuf/google/protobuf/empty_pb';
import * as google_protobuf_wrappers_pb from 'google-protobuf/google/protobuf/wrappers_pb';


export class FocusClient {
  client_: grpcWeb.AbstractClientBase;
  hostname_: string;
  credentials_: null | { [index: string]: string; };
  options_: null | { [index: string]: any; };

  constructor (hostname: string,
               credentials?: null | { [index: string]: string; },
               options?: null | { [index: string]: any; }) {
    if (!options) options = {};
    if (!credentials) credentials = {};
    options['format'] = 'binary';

    this.client_ = new grpcWeb.GrpcWebClientBase(options);
    this.hostname_ = hostname.replace(/\/+$/, '');
    this.credentials_ = credentials;
    this.options_ = options;
  }

}

export class V1Alpha1Client {
  client_: grpcWeb.AbstractClientBase;
  hostname_: string;
  credentials_: null | { [index: string]: string; };
  options_: null | { [index: string]: any; };

  constructor (hostname: string,
               credentials?: null | { [index: string]: string; },
               options?: null | { [index: string]: any; }) {
    if (!options) options = {};
    if (!credentials) credentials = {};
    options['format'] = 'binary';

    this.client_ = new grpcWeb.GrpcWebClientBase(options);
    this.hostname_ = hostname.replace(/\/+$/, '');
    this.credentials_ = credentials;
    this.options_ = options;
  }

  methodDescriptorversion = new grpcWeb.MethodDescriptor(
    '/V1Alpha1/version',
    grpcWeb.MethodType.UNARY,
    google_protobuf_empty_pb.Empty,
    google_protobuf_wrappers_pb.StringValue,
    (request: google_protobuf_empty_pb.Empty) => {
      return request.serializeBinary();
    },
    google_protobuf_wrappers_pb.StringValue.deserializeBinary
  );

  version(
    request: google_protobuf_empty_pb.Empty,
    metadata: grpcWeb.Metadata | null): Promise<google_protobuf_wrappers_pb.StringValue>;

  version(
    request: google_protobuf_empty_pb.Empty,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.RpcError,
               response: google_protobuf_wrappers_pb.StringValue) => void): grpcWeb.ClientReadableStream<google_protobuf_wrappers_pb.StringValue>;

  version(
    request: google_protobuf_empty_pb.Empty,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.RpcError,
               response: google_protobuf_wrappers_pb.StringValue) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/V1Alpha1/version',
        request,
        metadata || {},
        this.methodDescriptorversion,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/V1Alpha1/version',
    request,
    metadata || {},
    this.methodDescriptorversion);
  }

  methodDescriptorquickAddCard = new grpcWeb.MethodDescriptor(
    '/V1Alpha1/quickAddCard',
    grpcWeb.MethodType.UNARY,
    google_protobuf_wrappers_pb.StringValue,
    focus_pb.Card,
    (request: google_protobuf_wrappers_pb.StringValue) => {
      return request.serializeBinary();
    },
    focus_pb.Card.deserializeBinary
  );

  quickAddCard(
    request: google_protobuf_wrappers_pb.StringValue,
    metadata: grpcWeb.Metadata | null): Promise<focus_pb.Card>;

  quickAddCard(
    request: google_protobuf_wrappers_pb.StringValue,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.RpcError,
               response: focus_pb.Card) => void): grpcWeb.ClientReadableStream<focus_pb.Card>;

  quickAddCard(
    request: google_protobuf_wrappers_pb.StringValue,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.RpcError,
               response: focus_pb.Card) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/V1Alpha1/quickAddCard',
        request,
        metadata || {},
        this.methodDescriptorquickAddCard,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/V1Alpha1/quickAddCard',
    request,
    metadata || {},
    this.methodDescriptorquickAddCard);
  }

  methodDescriptorlistCards = new grpcWeb.MethodDescriptor(
    '/V1Alpha1/listCards',
    grpcWeb.MethodType.UNARY,
    google_protobuf_empty_pb.Empty,
    focus_pb.CardListResp,
    (request: google_protobuf_empty_pb.Empty) => {
      return request.serializeBinary();
    },
    focus_pb.CardListResp.deserializeBinary
  );

  listCards(
    request: google_protobuf_empty_pb.Empty,
    metadata: grpcWeb.Metadata | null): Promise<focus_pb.CardListResp>;

  listCards(
    request: google_protobuf_empty_pb.Empty,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.RpcError,
               response: focus_pb.CardListResp) => void): grpcWeb.ClientReadableStream<focus_pb.CardListResp>;

  listCards(
    request: google_protobuf_empty_pb.Empty,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.RpcError,
               response: focus_pb.CardListResp) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/V1Alpha1/listCards',
        request,
        metadata || {},
        this.methodDescriptorlistCards,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/V1Alpha1/listCards',
    request,
    metadata || {},
    this.methodDescriptorlistCards);
  }

  methodDescriptorgetCard = new grpcWeb.MethodDescriptor(
    '/V1Alpha1/getCard',
    grpcWeb.MethodType.UNARY,
    google_protobuf_wrappers_pb.UInt64Value,
    focus_pb.Card,
    (request: google_protobuf_wrappers_pb.UInt64Value) => {
      return request.serializeBinary();
    },
    focus_pb.Card.deserializeBinary
  );

  getCard(
    request: google_protobuf_wrappers_pb.UInt64Value,
    metadata: grpcWeb.Metadata | null): Promise<focus_pb.Card>;

  getCard(
    request: google_protobuf_wrappers_pb.UInt64Value,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.RpcError,
               response: focus_pb.Card) => void): grpcWeb.ClientReadableStream<focus_pb.Card>;

  getCard(
    request: google_protobuf_wrappers_pb.UInt64Value,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.RpcError,
               response: focus_pb.Card) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/V1Alpha1/getCard',
        request,
        metadata || {},
        this.methodDescriptorgetCard,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/V1Alpha1/getCard',
    request,
    metadata || {},
    this.methodDescriptorgetCard);
  }

  methodDescriptorpatchCard = new grpcWeb.MethodDescriptor(
    '/V1Alpha1/patchCard',
    grpcWeb.MethodType.UNARY,
    focus_pb.PatchCardReq,
    google_protobuf_empty_pb.Empty,
    (request: focus_pb.PatchCardReq) => {
      return request.serializeBinary();
    },
    google_protobuf_empty_pb.Empty.deserializeBinary
  );

  patchCard(
    request: focus_pb.PatchCardReq,
    metadata: grpcWeb.Metadata | null): Promise<google_protobuf_empty_pb.Empty>;

  patchCard(
    request: focus_pb.PatchCardReq,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.RpcError,
               response: google_protobuf_empty_pb.Empty) => void): grpcWeb.ClientReadableStream<google_protobuf_empty_pb.Empty>;

  patchCard(
    request: focus_pb.PatchCardReq,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.RpcError,
               response: google_protobuf_empty_pb.Empty) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/V1Alpha1/patchCard',
        request,
        metadata || {},
        this.methodDescriptorpatchCard,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/V1Alpha1/patchCard',
    request,
    metadata || {},
    this.methodDescriptorpatchCard);
  }

  methodDescriptorrankUpCard = new grpcWeb.MethodDescriptor(
    '/V1Alpha1/rankUpCard',
    grpcWeb.MethodType.UNARY,
    focus_pb.RankCardReq,
    google_protobuf_empty_pb.Empty,
    (request: focus_pb.RankCardReq) => {
      return request.serializeBinary();
    },
    google_protobuf_empty_pb.Empty.deserializeBinary
  );

  rankUpCard(
    request: focus_pb.RankCardReq,
    metadata: grpcWeb.Metadata | null): Promise<google_protobuf_empty_pb.Empty>;

  rankUpCard(
    request: focus_pb.RankCardReq,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.RpcError,
               response: google_protobuf_empty_pb.Empty) => void): grpcWeb.ClientReadableStream<google_protobuf_empty_pb.Empty>;

  rankUpCard(
    request: focus_pb.RankCardReq,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.RpcError,
               response: google_protobuf_empty_pb.Empty) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/V1Alpha1/rankUpCard',
        request,
        metadata || {},
        this.methodDescriptorrankUpCard,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/V1Alpha1/rankUpCard',
    request,
    metadata || {},
    this.methodDescriptorrankUpCard);
  }

  methodDescriptorrankDownCard = new grpcWeb.MethodDescriptor(
    '/V1Alpha1/rankDownCard',
    grpcWeb.MethodType.UNARY,
    focus_pb.RankCardReq,
    google_protobuf_empty_pb.Empty,
    (request: focus_pb.RankCardReq) => {
      return request.serializeBinary();
    },
    google_protobuf_empty_pb.Empty.deserializeBinary
  );

  rankDownCard(
    request: focus_pb.RankCardReq,
    metadata: grpcWeb.Metadata | null): Promise<google_protobuf_empty_pb.Empty>;

  rankDownCard(
    request: focus_pb.RankCardReq,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.RpcError,
               response: google_protobuf_empty_pb.Empty) => void): grpcWeb.ClientReadableStream<google_protobuf_empty_pb.Empty>;

  rankDownCard(
    request: focus_pb.RankCardReq,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.RpcError,
               response: google_protobuf_empty_pb.Empty) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/V1Alpha1/rankDownCard',
        request,
        metadata || {},
        this.methodDescriptorrankDownCard,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/V1Alpha1/rankDownCard',
    request,
    metadata || {},
    this.methodDescriptorrankDownCard);
  }

  methodDescriptordeleteCard = new grpcWeb.MethodDescriptor(
    '/V1Alpha1/deleteCard',
    grpcWeb.MethodType.UNARY,
    google_protobuf_wrappers_pb.UInt64Value,
    google_protobuf_empty_pb.Empty,
    (request: google_protobuf_wrappers_pb.UInt64Value) => {
      return request.serializeBinary();
    },
    google_protobuf_empty_pb.Empty.deserializeBinary
  );

  deleteCard(
    request: google_protobuf_wrappers_pb.UInt64Value,
    metadata: grpcWeb.Metadata | null): Promise<google_protobuf_empty_pb.Empty>;

  deleteCard(
    request: google_protobuf_wrappers_pb.UInt64Value,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.RpcError,
               response: google_protobuf_empty_pb.Empty) => void): grpcWeb.ClientReadableStream<google_protobuf_empty_pb.Empty>;

  deleteCard(
    request: google_protobuf_wrappers_pb.UInt64Value,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.RpcError,
               response: google_protobuf_empty_pb.Empty) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/V1Alpha1/deleteCard',
        request,
        metadata || {},
        this.methodDescriptordeleteCard,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/V1Alpha1/deleteCard',
    request,
    metadata || {},
    this.methodDescriptordeleteCard);
  }

}

