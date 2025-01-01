#!/bin/sh

set -e # Exit early if any commands fail

# Run this script with a directory argument for file uploads, e.g ./your_program.sh --directory app/tmp/
exec bun run $(dirname $0)/app/main.ts "$@"
