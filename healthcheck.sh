#!/bin/bash
curl -fI http://localhost:3000
if [[ $? -ne 0 ]]; then
    exit 1
else
    exit 0
fi