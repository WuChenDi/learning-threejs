#!/usr/bin/env bash

DIRS_TO_DELETE=(
  ".nuxt"
  ".output"
  "dist"
  "node_modules"
  "node-compile-cache"
  "apps/*/node_modules"
  "apps/*/node-compile-cache"
  "apps/*/dist"
  "apps/*/.nuxt"
  "apps/*/.output"
  "apps/*/.wrangler"
  "packages/*/node_modules"
)

echo "Start cleaning up directories: ${DIRS_TO_DELETE[*]}"

for dir in "${DIRS_TO_DELETE[@]}"
do
  rm -rf $dir && echo "Removed $dir directory."
done

echo "Cleanup completed successfully!"
