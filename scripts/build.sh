#!/bin/bash
printf "Migrating all code into build directory for building\n"

# we make a build directory with the contents because we produce .esm.js and .js.map files so we don't want to pollute
# the main development space
mkdir build/
cp -rf src/* build/
printf "Done.\n\n"


node scripts/build.js

echo  "Building index files in build/ directory"

# First we build the index.js which imports then exports each component in the src/
output=$(npm run build:index 2>&1)

# then we build the index.esm.js which imports everything from index.js and defines a Vue.use plugin
output=$(npm run build:index:esm 2>&1)

# then we build the browser version
output=$(npm run build:library 2>&1)

node scripts/postbuild.js