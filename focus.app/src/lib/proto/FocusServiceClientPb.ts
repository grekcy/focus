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


export class focusClient {
  client_: grpcWeb.AbstractClientBase;
  hostname_: string;
  credentials_: null | { [index: string]: string; };
  options_: null | { [index: string]: any; };

  constructor (hostname: string,
               credentials?: null | { [index: string]: string; },
               options?: null | { [index: string]: any; }) {
    if (!options) options = {};
    if (!credentials) credentials = {};
    options['format'] = 'text';

    this.client_ = new grpcWeb.GrpcWebClientBase(options);
    this.hostname_ = hostname.replace(/\/+$/, '');
    this.credentials_ = credentials;
    this.options_ = options;
  }

}

export class v1alpha1Client {
  client_: grpcWeb.AbstractClientBase;
  hostname_: string;
  credentials_: null | { [index: string]: string; };
  options_: null | { [index: string]: any; };

  constructor (hostname: string,
               credentials?: null | { [index: string]: string; },
               options?: null | { [index: string]: any; }) {
    if (!options) options = {};
    if (!credentials) credentials = {};
    options['format'] = 'text';

    this.client_ = new grpcWeb.GrpcWebClientBase(options);
    this.hostname_ = hostname.replace(/\/+$/, '');
    this.credentials_ = credentials;
    this.options_ = options;
  }

  methodDescriptorversion = new grpcWeb.MethodDescriptor(
    '/v1alpha1/version',
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
          '/v1alpha1/version',
        request,
        metadata || {},
        this.methodDescriptorversion,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/v1alpha1/version',
    request,
    metadata || {},
    this.methodDescriptorversion);
  }

  methodDescriptorquickAddCard = new grpcWeb.MethodDescriptor(
    '/v1alpha1/quickAddCard',
    grpcWeb.MethodType.UNARY,
    focus_pb.Card,
    focus_pb.Card,
    (request: focus_pb.Card) => {
      return request.serializeBinary();
    },
    focus_pb.Card.deserializeBinary
  );

  quickAddCard(
    request: focus_pb.Card,
    metadata: grpcWeb.Metadata | null): Promise<focus_pb.Card>;

  quickAddCard(
    request: focus_pb.Card,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.RpcError,
               response: focus_pb.Card) => void): grpcWeb.ClientReadableStream<focus_pb.Card>;

  quickAddCard(
    request: focus_pb.Card,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.RpcError,
               response: focus_pb.Card) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/v1alpha1/quickAddCard',
        request,
        metadata || {},
        this.methodDescriptorquickAddCard,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/v1alpha1/quickAddCard',
    request,
    metadata || {},
    this.methodDescriptorquickAddCard);
  }

  methodDescriptorlistCards = new grpcWeb.MethodDescriptor(
    '/v1alpha1/listCards',
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
          '/v1alpha1/listCards',
        request,
        metadata || {},
        this.methodDescriptorlistCards,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/v1alpha1/listCards',
    request,
    metadata || {},
    this.methodDescriptorlistCards);
  }

  methodDescriptorcompleteCard = new grpcWeb.MethodDescriptor(
    '/v1alpha1/completeCard',
    grpcWeb.MethodType.UNARY,
    focus_pb.completeCardReq,
    google_protobuf_empty_pb.Empty,
    (request: focus_pb.completeCardReq) => {
      return request.serializeBinary();
    },
    google_protobuf_empty_pb.Empty.deserializeBinary
  );

  completeCard(
    request: focus_pb.completeCardReq,
    metadata: grpcWeb.Metadata | null): Promise<google_protobuf_empty_pb.Empty>;

  completeCard(
    request: focus_pb.completeCardReq,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.RpcError,
               response: google_protobuf_empty_pb.Empty) => void): grpcWeb.ClientReadableStream<google_protobuf_empty_pb.Empty>;

  completeCard(
    request: focus_pb.completeCardReq,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.RpcError,
               response: google_protobuf_empty_pb.Empty) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/v1alpha1/completeCard',
        request,
        metadata || {},
        this.methodDescriptorcompleteCard,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/v1alpha1/completeCard',
    request,
    metadata || {},
    this.methodDescriptorcompleteCard);
  }

  methodDescriptordeleteCard = new grpcWeb.MethodDescriptor(
    '/v1alpha1/deleteCard',
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
          '/v1alpha1/deleteCard',
        request,
        metadata || {},
        this.methodDescriptordeleteCard,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/v1alpha1/deleteCard',
    request,
    metadata || {},
    this.methodDescriptordeleteCard);
  }

}
