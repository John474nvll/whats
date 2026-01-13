#!/bin/bash

# Test for nodejs
if ! command -v node &> /dev/null
then
    echo "node could not be found"
    exit 1
fi

NODE_VERSION=$(node --version)
EXPECTED_NODE_VERSION="v22"
if [[ "$NODE_VERSION" != $EXPECTED_NODE_VERSION* ]]; then
    echo "Incorrect node version. Expected $EXPECTED_NODE_VERSION, but got $NODE_VERSION"
    exit 1
fi

# Test for npm
if ! command -v npm &> /dev/null
then
    echo "npm could not be found"
    exit 1
fi

# Test for postgresql
if ! command -v psql &> /dev/null
then
    echo "psql could not be found"
    exit 1
fi

# Test for tsx
if ! command -v tsx &> /dev/null
then
    echo "tsx could not be found"
    exit 1
fi

# Test for drizzle-kit
if ! command -v drizzle-kit &> /dev/null
then
    echo "drizzle-kit could not be found"
    exit 1
fi

echo "All tests passed!"
exit 0
