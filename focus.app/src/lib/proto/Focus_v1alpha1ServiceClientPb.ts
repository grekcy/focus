/**
 * @fileoverview gRPC-Web generated client stub for api.v1alpha1
 * @enhanceable
 * @public
 */

// Code generated by protoc-gen-grpc-web. DO NOT EDIT.
// versions:
// 	protoc-gen-grpc-web v1.4.2
// 	protoc              v4.23.3
// source: focus_v1alpha1.proto


/* eslint-disable */
// @ts-nocheck


import * as grpcWeb from 'grpc-web';

import * as focus_v1alpha1_pb from './focus_v1alpha1_pb';
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

  methodDescriptorVersion = new grpcWeb.MethodDescriptor(
    '/api.v1alpha1.Focus/Version',
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
          '/api.v1alpha1.Focus/Version',
        request,
        metadata || {},
        this.methodDescriptorVersion,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/api.v1alpha1.Focus/Version',
    request,
    metadata || {},
    this.methodDescriptorVersion);
  }

  methodDescriptorVersionEx = new grpcWeb.MethodDescriptor(
    '/api.v1alpha1.Focus/VersionEx',
    grpcWeb.MethodType.UNARY,
    google_protobuf_empty_pb.Empty,
    google_protobuf_wrappers_pb.StringValue,
    (request: google_protobuf_empty_pb.Empty) => {
      return request.serializeBinary();
    },
    google_protobuf_wrappers_pb.StringValue.deserializeBinary
  );

  versionEx(
    request: google_protobuf_empty_pb.Empty,
    metadata: grpcWeb.Metadata | null): Promise<google_protobuf_wrappers_pb.StringValue>;

  versionEx(
    request: google_protobuf_empty_pb.Empty,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.RpcError,
               response: google_protobuf_wrappers_pb.StringValue) => void): grpcWeb.ClientReadableStream<google_protobuf_wrappers_pb.StringValue>;

  versionEx(
    request: google_protobuf_empty_pb.Empty,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.RpcError,
               response: google_protobuf_wrappers_pb.StringValue) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/api.v1alpha1.Focus/VersionEx',
        request,
        metadata || {},
        this.methodDescriptorVersionEx,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/api.v1alpha1.Focus/VersionEx',
    request,
    metadata || {},
    this.methodDescriptorVersionEx);
  }

  methodDescriptorLoginWithGoogleOauth = new grpcWeb.MethodDescriptor(
    '/api.v1alpha1.Focus/LoginWithGoogleOauth',
    grpcWeb.MethodType.UNARY,
    focus_v1alpha1_pb.GoogleLoginReq,
    google_protobuf_wrappers_pb.StringValue,
    (request: focus_v1alpha1_pb.GoogleLoginReq) => {
      return request.serializeBinary();
    },
    google_protobuf_wrappers_pb.StringValue.deserializeBinary
  );

  loginWithGoogleOauth(
    request: focus_v1alpha1_pb.GoogleLoginReq,
    metadata: grpcWeb.Metadata | null): Promise<google_protobuf_wrappers_pb.StringValue>;

  loginWithGoogleOauth(
    request: focus_v1alpha1_pb.GoogleLoginReq,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.RpcError,
               response: google_protobuf_wrappers_pb.StringValue) => void): grpcWeb.ClientReadableStream<google_protobuf_wrappers_pb.StringValue>;

  loginWithGoogleOauth(
    request: focus_v1alpha1_pb.GoogleLoginReq,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.RpcError,
               response: google_protobuf_wrappers_pb.StringValue) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/api.v1alpha1.Focus/LoginWithGoogleOauth',
        request,
        metadata || {},
        this.methodDescriptorLoginWithGoogleOauth,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/api.v1alpha1.Focus/LoginWithGoogleOauth',
    request,
    metadata || {},
    this.methodDescriptorLoginWithGoogleOauth);
  }

  methodDescriptorGetProfile = new grpcWeb.MethodDescriptor(
    '/api.v1alpha1.Focus/GetProfile',
    grpcWeb.MethodType.UNARY,
    google_protobuf_empty_pb.Empty,
    focus_v1alpha1_pb.User,
    (request: google_protobuf_empty_pb.Empty) => {
      return request.serializeBinary();
    },
    focus_v1alpha1_pb.User.deserializeBinary
  );

  getProfile(
    request: google_protobuf_empty_pb.Empty,
    metadata: grpcWeb.Metadata | null): Promise<focus_v1alpha1_pb.User>;

  getProfile(
    request: google_protobuf_empty_pb.Empty,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.RpcError,
               response: focus_v1alpha1_pb.User) => void): grpcWeb.ClientReadableStream<focus_v1alpha1_pb.User>;

  getProfile(
    request: google_protobuf_empty_pb.Empty,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.RpcError,
               response: focus_v1alpha1_pb.User) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/api.v1alpha1.Focus/GetProfile',
        request,
        metadata || {},
        this.methodDescriptorGetProfile,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/api.v1alpha1.Focus/GetProfile',
    request,
    metadata || {},
    this.methodDescriptorGetProfile);
  }

  methodDescriptorGetUser = new grpcWeb.MethodDescriptor(
    '/api.v1alpha1.Focus/GetUser',
    grpcWeb.MethodType.UNARY,
    google_protobuf_wrappers_pb.UInt64Value,
    focus_v1alpha1_pb.User,
    (request: google_protobuf_wrappers_pb.UInt64Value) => {
      return request.serializeBinary();
    },
    focus_v1alpha1_pb.User.deserializeBinary
  );

  getUser(
    request: google_protobuf_wrappers_pb.UInt64Value,
    metadata: grpcWeb.Metadata | null): Promise<focus_v1alpha1_pb.User>;

  getUser(
    request: google_protobuf_wrappers_pb.UInt64Value,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.RpcError,
               response: focus_v1alpha1_pb.User) => void): grpcWeb.ClientReadableStream<focus_v1alpha1_pb.User>;

  getUser(
    request: google_protobuf_wrappers_pb.UInt64Value,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.RpcError,
               response: focus_v1alpha1_pb.User) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/api.v1alpha1.Focus/GetUser',
        request,
        metadata || {},
        this.methodDescriptorGetUser,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/api.v1alpha1.Focus/GetUser',
    request,
    metadata || {},
    this.methodDescriptorGetUser);
  }

  methodDescriptorAddCard = new grpcWeb.MethodDescriptor(
    '/api.v1alpha1.Focus/AddCard',
    grpcWeb.MethodType.UNARY,
    focus_v1alpha1_pb.AddCardReq,
    focus_v1alpha1_pb.Card,
    (request: focus_v1alpha1_pb.AddCardReq) => {
      return request.serializeBinary();
    },
    focus_v1alpha1_pb.Card.deserializeBinary
  );

  addCard(
    request: focus_v1alpha1_pb.AddCardReq,
    metadata: grpcWeb.Metadata | null): Promise<focus_v1alpha1_pb.Card>;

  addCard(
    request: focus_v1alpha1_pb.AddCardReq,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.RpcError,
               response: focus_v1alpha1_pb.Card) => void): grpcWeb.ClientReadableStream<focus_v1alpha1_pb.Card>;

  addCard(
    request: focus_v1alpha1_pb.AddCardReq,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.RpcError,
               response: focus_v1alpha1_pb.Card) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/api.v1alpha1.Focus/AddCard',
        request,
        metadata || {},
        this.methodDescriptorAddCard,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/api.v1alpha1.Focus/AddCard',
    request,
    metadata || {},
    this.methodDescriptorAddCard);
  }

  methodDescriptorListCards = new grpcWeb.MethodDescriptor(
    '/api.v1alpha1.Focus/ListCards',
    grpcWeb.MethodType.UNARY,
    focus_v1alpha1_pb.ListCardReq,
    focus_v1alpha1_pb.ListCardResp,
    (request: focus_v1alpha1_pb.ListCardReq) => {
      return request.serializeBinary();
    },
    focus_v1alpha1_pb.ListCardResp.deserializeBinary
  );

  listCards(
    request: focus_v1alpha1_pb.ListCardReq,
    metadata: grpcWeb.Metadata | null): Promise<focus_v1alpha1_pb.ListCardResp>;

  listCards(
    request: focus_v1alpha1_pb.ListCardReq,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.RpcError,
               response: focus_v1alpha1_pb.ListCardResp) => void): grpcWeb.ClientReadableStream<focus_v1alpha1_pb.ListCardResp>;

  listCards(
    request: focus_v1alpha1_pb.ListCardReq,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.RpcError,
               response: focus_v1alpha1_pb.ListCardResp) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/api.v1alpha1.Focus/ListCards',
        request,
        metadata || {},
        this.methodDescriptorListCards,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/api.v1alpha1.Focus/ListCards',
    request,
    metadata || {},
    this.methodDescriptorListCards);
  }

  methodDescriptorGetCard = new grpcWeb.MethodDescriptor(
    '/api.v1alpha1.Focus/GetCard',
    grpcWeb.MethodType.UNARY,
    google_protobuf_wrappers_pb.UInt64Value,
    focus_v1alpha1_pb.Card,
    (request: google_protobuf_wrappers_pb.UInt64Value) => {
      return request.serializeBinary();
    },
    focus_v1alpha1_pb.Card.deserializeBinary
  );

  getCard(
    request: google_protobuf_wrappers_pb.UInt64Value,
    metadata: grpcWeb.Metadata | null): Promise<focus_v1alpha1_pb.Card>;

  getCard(
    request: google_protobuf_wrappers_pb.UInt64Value,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.RpcError,
               response: focus_v1alpha1_pb.Card) => void): grpcWeb.ClientReadableStream<focus_v1alpha1_pb.Card>;

  getCard(
    request: google_protobuf_wrappers_pb.UInt64Value,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.RpcError,
               response: focus_v1alpha1_pb.Card) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/api.v1alpha1.Focus/GetCard',
        request,
        metadata || {},
        this.methodDescriptorGetCard,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/api.v1alpha1.Focus/GetCard',
    request,
    metadata || {},
    this.methodDescriptorGetCard);
  }

  methodDescriptorGetCards = new grpcWeb.MethodDescriptor(
    '/api.v1alpha1.Focus/GetCards',
    grpcWeb.MethodType.UNARY,
    focus_v1alpha1_pb.GetCardReq,
    focus_v1alpha1_pb.GetCardResp,
    (request: focus_v1alpha1_pb.GetCardReq) => {
      return request.serializeBinary();
    },
    focus_v1alpha1_pb.GetCardResp.deserializeBinary
  );

  getCards(
    request: focus_v1alpha1_pb.GetCardReq,
    metadata: grpcWeb.Metadata | null): Promise<focus_v1alpha1_pb.GetCardResp>;

  getCards(
    request: focus_v1alpha1_pb.GetCardReq,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.RpcError,
               response: focus_v1alpha1_pb.GetCardResp) => void): grpcWeb.ClientReadableStream<focus_v1alpha1_pb.GetCardResp>;

  getCards(
    request: focus_v1alpha1_pb.GetCardReq,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.RpcError,
               response: focus_v1alpha1_pb.GetCardResp) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/api.v1alpha1.Focus/GetCards',
        request,
        metadata || {},
        this.methodDescriptorGetCards,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/api.v1alpha1.Focus/GetCards',
    request,
    metadata || {},
    this.methodDescriptorGetCards);
  }

  methodDescriptorGetCardProgressSummary = new grpcWeb.MethodDescriptor(
    '/api.v1alpha1.Focus/GetCardProgressSummary',
    grpcWeb.MethodType.UNARY,
    google_protobuf_wrappers_pb.UInt64Value,
    focus_v1alpha1_pb.CardProgressSummaryResp,
    (request: google_protobuf_wrappers_pb.UInt64Value) => {
      return request.serializeBinary();
    },
    focus_v1alpha1_pb.CardProgressSummaryResp.deserializeBinary
  );

  getCardProgressSummary(
    request: google_protobuf_wrappers_pb.UInt64Value,
    metadata: grpcWeb.Metadata | null): Promise<focus_v1alpha1_pb.CardProgressSummaryResp>;

  getCardProgressSummary(
    request: google_protobuf_wrappers_pb.UInt64Value,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.RpcError,
               response: focus_v1alpha1_pb.CardProgressSummaryResp) => void): grpcWeb.ClientReadableStream<focus_v1alpha1_pb.CardProgressSummaryResp>;

  getCardProgressSummary(
    request: google_protobuf_wrappers_pb.UInt64Value,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.RpcError,
               response: focus_v1alpha1_pb.CardProgressSummaryResp) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/api.v1alpha1.Focus/GetCardProgressSummary',
        request,
        metadata || {},
        this.methodDescriptorGetCardProgressSummary,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/api.v1alpha1.Focus/GetCardProgressSummary',
    request,
    metadata || {},
    this.methodDescriptorGetCardProgressSummary);
  }

  methodDescriptorPatchCard = new grpcWeb.MethodDescriptor(
    '/api.v1alpha1.Focus/PatchCard',
    grpcWeb.MethodType.UNARY,
    focus_v1alpha1_pb.PatchCardReq,
    focus_v1alpha1_pb.Card,
    (request: focus_v1alpha1_pb.PatchCardReq) => {
      return request.serializeBinary();
    },
    focus_v1alpha1_pb.Card.deserializeBinary
  );

  patchCard(
    request: focus_v1alpha1_pb.PatchCardReq,
    metadata: grpcWeb.Metadata | null): Promise<focus_v1alpha1_pb.Card>;

  patchCard(
    request: focus_v1alpha1_pb.PatchCardReq,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.RpcError,
               response: focus_v1alpha1_pb.Card) => void): grpcWeb.ClientReadableStream<focus_v1alpha1_pb.Card>;

  patchCard(
    request: focus_v1alpha1_pb.PatchCardReq,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.RpcError,
               response: focus_v1alpha1_pb.Card) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/api.v1alpha1.Focus/PatchCard',
        request,
        metadata || {},
        this.methodDescriptorPatchCard,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/api.v1alpha1.Focus/PatchCard',
    request,
    metadata || {},
    this.methodDescriptorPatchCard);
  }

  methodDescriptorRerankCard = new grpcWeb.MethodDescriptor(
    '/api.v1alpha1.Focus/RerankCard',
    grpcWeb.MethodType.UNARY,
    focus_v1alpha1_pb.RankCardReq,
    google_protobuf_empty_pb.Empty,
    (request: focus_v1alpha1_pb.RankCardReq) => {
      return request.serializeBinary();
    },
    google_protobuf_empty_pb.Empty.deserializeBinary
  );

  rerankCard(
    request: focus_v1alpha1_pb.RankCardReq,
    metadata: grpcWeb.Metadata | null): Promise<google_protobuf_empty_pb.Empty>;

  rerankCard(
    request: focus_v1alpha1_pb.RankCardReq,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.RpcError,
               response: google_protobuf_empty_pb.Empty) => void): grpcWeb.ClientReadableStream<google_protobuf_empty_pb.Empty>;

  rerankCard(
    request: focus_v1alpha1_pb.RankCardReq,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.RpcError,
               response: google_protobuf_empty_pb.Empty) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/api.v1alpha1.Focus/RerankCard',
        request,
        metadata || {},
        this.methodDescriptorRerankCard,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/api.v1alpha1.Focus/RerankCard',
    request,
    metadata || {},
    this.methodDescriptorRerankCard);
  }

  methodDescriptorDeleteCard = new grpcWeb.MethodDescriptor(
    '/api.v1alpha1.Focus/DeleteCard',
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
          '/api.v1alpha1.Focus/DeleteCard',
        request,
        metadata || {},
        this.methodDescriptorDeleteCard,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/api.v1alpha1.Focus/DeleteCard',
    request,
    metadata || {},
    this.methodDescriptorDeleteCard);
  }

  methodDescriptorCreateLabel = new grpcWeb.MethodDescriptor(
    '/api.v1alpha1.Focus/CreateLabel',
    grpcWeb.MethodType.UNARY,
    focus_v1alpha1_pb.Label,
    focus_v1alpha1_pb.Label,
    (request: focus_v1alpha1_pb.Label) => {
      return request.serializeBinary();
    },
    focus_v1alpha1_pb.Label.deserializeBinary
  );

  createLabel(
    request: focus_v1alpha1_pb.Label,
    metadata: grpcWeb.Metadata | null): Promise<focus_v1alpha1_pb.Label>;

  createLabel(
    request: focus_v1alpha1_pb.Label,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.RpcError,
               response: focus_v1alpha1_pb.Label) => void): grpcWeb.ClientReadableStream<focus_v1alpha1_pb.Label>;

  createLabel(
    request: focus_v1alpha1_pb.Label,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.RpcError,
               response: focus_v1alpha1_pb.Label) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/api.v1alpha1.Focus/CreateLabel',
        request,
        metadata || {},
        this.methodDescriptorCreateLabel,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/api.v1alpha1.Focus/CreateLabel',
    request,
    metadata || {},
    this.methodDescriptorCreateLabel);
  }

  methodDescriptorListLabels = new grpcWeb.MethodDescriptor(
    '/api.v1alpha1.Focus/ListLabels',
    grpcWeb.MethodType.UNARY,
    focus_v1alpha1_pb.ListLabelsReq,
    focus_v1alpha1_pb.ListLabelsResp,
    (request: focus_v1alpha1_pb.ListLabelsReq) => {
      return request.serializeBinary();
    },
    focus_v1alpha1_pb.ListLabelsResp.deserializeBinary
  );

  listLabels(
    request: focus_v1alpha1_pb.ListLabelsReq,
    metadata: grpcWeb.Metadata | null): Promise<focus_v1alpha1_pb.ListLabelsResp>;

  listLabels(
    request: focus_v1alpha1_pb.ListLabelsReq,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.RpcError,
               response: focus_v1alpha1_pb.ListLabelsResp) => void): grpcWeb.ClientReadableStream<focus_v1alpha1_pb.ListLabelsResp>;

  listLabels(
    request: focus_v1alpha1_pb.ListLabelsReq,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.RpcError,
               response: focus_v1alpha1_pb.ListLabelsResp) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/api.v1alpha1.Focus/ListLabels',
        request,
        metadata || {},
        this.methodDescriptorListLabels,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/api.v1alpha1.Focus/ListLabels',
    request,
    metadata || {},
    this.methodDescriptorListLabels);
  }

  methodDescriptorUpdateLabel = new grpcWeb.MethodDescriptor(
    '/api.v1alpha1.Focus/UpdateLabel',
    grpcWeb.MethodType.UNARY,
    focus_v1alpha1_pb.Label,
    focus_v1alpha1_pb.Label,
    (request: focus_v1alpha1_pb.Label) => {
      return request.serializeBinary();
    },
    focus_v1alpha1_pb.Label.deserializeBinary
  );

  updateLabel(
    request: focus_v1alpha1_pb.Label,
    metadata: grpcWeb.Metadata | null): Promise<focus_v1alpha1_pb.Label>;

  updateLabel(
    request: focus_v1alpha1_pb.Label,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.RpcError,
               response: focus_v1alpha1_pb.Label) => void): grpcWeb.ClientReadableStream<focus_v1alpha1_pb.Label>;

  updateLabel(
    request: focus_v1alpha1_pb.Label,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.RpcError,
               response: focus_v1alpha1_pb.Label) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/api.v1alpha1.Focus/UpdateLabel',
        request,
        metadata || {},
        this.methodDescriptorUpdateLabel,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/api.v1alpha1.Focus/UpdateLabel',
    request,
    metadata || {},
    this.methodDescriptorUpdateLabel);
  }

  methodDescriptorDeleteLabel = new grpcWeb.MethodDescriptor(
    '/api.v1alpha1.Focus/DeleteLabel',
    grpcWeb.MethodType.UNARY,
    google_protobuf_wrappers_pb.UInt64Value,
    google_protobuf_empty_pb.Empty,
    (request: google_protobuf_wrappers_pb.UInt64Value) => {
      return request.serializeBinary();
    },
    google_protobuf_empty_pb.Empty.deserializeBinary
  );

  deleteLabel(
    request: google_protobuf_wrappers_pb.UInt64Value,
    metadata: grpcWeb.Metadata | null): Promise<google_protobuf_empty_pb.Empty>;

  deleteLabel(
    request: google_protobuf_wrappers_pb.UInt64Value,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.RpcError,
               response: google_protobuf_empty_pb.Empty) => void): grpcWeb.ClientReadableStream<google_protobuf_empty_pb.Empty>;

  deleteLabel(
    request: google_protobuf_wrappers_pb.UInt64Value,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.RpcError,
               response: google_protobuf_empty_pb.Empty) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/api.v1alpha1.Focus/DeleteLabel',
        request,
        metadata || {},
        this.methodDescriptorDeleteLabel,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/api.v1alpha1.Focus/DeleteLabel',
    request,
    metadata || {},
    this.methodDescriptorDeleteLabel);
  }

  methodDescriptorListChallenges = new grpcWeb.MethodDescriptor(
    '/api.v1alpha1.Focus/ListChallenges',
    grpcWeb.MethodType.UNARY,
    focus_v1alpha1_pb.ListChallengesReq,
    focus_v1alpha1_pb.ListChallengesResp,
    (request: focus_v1alpha1_pb.ListChallengesReq) => {
      return request.serializeBinary();
    },
    focus_v1alpha1_pb.ListChallengesResp.deserializeBinary
  );

  listChallenges(
    request: focus_v1alpha1_pb.ListChallengesReq,
    metadata: grpcWeb.Metadata | null): Promise<focus_v1alpha1_pb.ListChallengesResp>;

  listChallenges(
    request: focus_v1alpha1_pb.ListChallengesReq,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.RpcError,
               response: focus_v1alpha1_pb.ListChallengesResp) => void): grpcWeb.ClientReadableStream<focus_v1alpha1_pb.ListChallengesResp>;

  listChallenges(
    request: focus_v1alpha1_pb.ListChallengesReq,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.RpcError,
               response: focus_v1alpha1_pb.ListChallengesResp) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/api.v1alpha1.Focus/ListChallenges',
        request,
        metadata || {},
        this.methodDescriptorListChallenges,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/api.v1alpha1.Focus/ListChallenges',
    request,
    metadata || {},
    this.methodDescriptorListChallenges);
  }

  methodDescriptorGetChallenge = new grpcWeb.MethodDescriptor(
    '/api.v1alpha1.Focus/GetChallenge',
    grpcWeb.MethodType.UNARY,
    google_protobuf_wrappers_pb.UInt64Value,
    focus_v1alpha1_pb.Challenge,
    (request: google_protobuf_wrappers_pb.UInt64Value) => {
      return request.serializeBinary();
    },
    focus_v1alpha1_pb.Challenge.deserializeBinary
  );

  getChallenge(
    request: google_protobuf_wrappers_pb.UInt64Value,
    metadata: grpcWeb.Metadata | null): Promise<focus_v1alpha1_pb.Challenge>;

  getChallenge(
    request: google_protobuf_wrappers_pb.UInt64Value,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.RpcError,
               response: focus_v1alpha1_pb.Challenge) => void): grpcWeb.ClientReadableStream<focus_v1alpha1_pb.Challenge>;

  getChallenge(
    request: google_protobuf_wrappers_pb.UInt64Value,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.RpcError,
               response: focus_v1alpha1_pb.Challenge) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/api.v1alpha1.Focus/GetChallenge',
        request,
        metadata || {},
        this.methodDescriptorGetChallenge,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/api.v1alpha1.Focus/GetChallenge',
    request,
    metadata || {},
    this.methodDescriptorGetChallenge);
  }

}

