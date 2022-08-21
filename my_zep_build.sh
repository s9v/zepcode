#!/bin/bash
set -e
sed -i '' '// DEL' main.ts
tsc -p .
npx babel main.js --out-dir=dist --extensions=.js
