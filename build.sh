#!/bin/bash

docker build -t datanel/gtfs-rust-wasm .
docker push datanel/gtfs-rust-wasm
