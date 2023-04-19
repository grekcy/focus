/**
 * @fileoverview gRPC-Web generated client stub for api.sample.v1alpha1
 * @enhanceable
 * @public
 */

// Code generated by protoc-gen-grpc-web. DO NOT EDIT.
// versions:
// 	protoc-gen-grpc-web v1.4.2
// 	protoc              v3.21.12
// source: sample_v1alpha1.proto


/* eslint-disable */
// @ts-nocheck


import * as grpcWeb from 'grpc-web';

import * as google_protobuf_wrappers_pb from 'google-protobuf/google/protobuf/wrappers_pb';


export class SampleClient {
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

  methodDescriptorecho = new grpcWeb.MethodDescriptor(
    '/api.sample.v1alpha1.Sample/echo',
    grpcWeb.MethodType.UNARY,
    google_protobuf_wrappers_pb.StringValue,
    google_protobuf_wrappers_pb.StringValue,
    (request: google_protobuf_wrappers_pb.StringValue) => {
      return request.serializeBinary();
    },
    google_protobuf_wrappers_pb.StringValue.deserializeBinary
  );

  echo(
    request: google_protobuf_wrappers_pb.StringValue,
    metadata: grpcWeb.Metadata | null): Promise<google_protobuf_wrappers_pb.StringValue>;

  echo(
    request: google_protobuf_wrappers_pb.StringValue,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.RpcError,
               response: google_protobuf_wrappers_pb.StringValue) => void): grpcWeb.ClientReadableStream<google_protobuf_wrappers_pb.StringValue>;

  echo(
    request: google_protobuf_wrappers_pb.StringValue,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.RpcError,
               response: google_protobuf_wrappers_pb.StringValue) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/api.sample.v1alpha1.Sample/echo',
        request,
        metadata || {},
        this.methodDescriptorecho,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/api.sample.v1alpha1.Sample/echo',
    request,
    metadata || {},
    this.methodDescriptorecho);
  }

}

