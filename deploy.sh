#!/bin/bash
repo=$(basename $(git rev-parse --show-toplevel))
image=ho0ber/ho0ber:$repo-latest
docker build -t $image . && \
docker push $image
