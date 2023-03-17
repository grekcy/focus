# Focus

## setup dev envoronment

### create PostgreSQL database

    CREATE USER focus WITH PASSWORD 'focus-pass';
    CREATE DATABASE focus_dev OWNER focus;

### start envoy proxy for gRPC api

    envoy -c envoy.yaml

### start api server

    bin/focus apiserver

### start local dev service

    cd focus.app
    yarn start
