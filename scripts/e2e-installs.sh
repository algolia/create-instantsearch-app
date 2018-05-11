#!/bin/bash

# App temporary locations
# See http://unix.stackexchange.com/a/84980
temp_app_path=`mktemp -d 2>/dev/null || mktemp -d -t 'temp_app_path'`

# Function to test a feature
# Exits with return code if fails
# See https://ouep.eu/shell/fonction-assert/
function assert {
  # First parameter is the name of the test
  message="$1"

  # The remaining arguments are the command to execute
  shift

  # Run the command
  # $@ ensures arguments will remain in the same position (equivalent to "$1" "$2" "$3", etc.)
  "$@"

  # Get the return code
  rc=$?

  # If everything is okay, we return with a success
  [ $rc -eq 0 ] && echo "✅  $message" && return 0

  # An error occured, retrieved the line and the name of the script where it happened
  set $(caller)

  # Output an error message on the standard error
  echo -e "❎  $message\n   at $2 line $1" >&2

  exit $rc
}

echo '🛠  Running end-to-end tests'
echo

# **********************************************************************
# Test project installs dependencies
# **********************************************************************

mkdir "$temp_app_path"/test-app-should-install-deps

yarn start \
  "$temp_app_path"/test-app-should-install-deps \
  --appId appId \
  --apiKey apiKey \
  --indexName indexName \
  --template "InstantSearch.js" \
  &>/dev/null

assert "Project installs dependencies" \
  test -e "$temp_app_path"/test-app-should-install-deps/node_modules

# **********************************************************************
# Test project doesn't install dependencies
# **********************************************************************

mkdir "$temp_app_path"/test-app-should-ignore-deps

yarn start \
  "$temp_app_path"/test-app-should-ignore-deps \
  --appId appId \
  --apiKey apiKey \
  --indexName indexName \
  --template "InstantSearch.js" \
  --no-installation \
  &>/dev/null

assert "Project ignores dependencies" \
  test ! -e "$temp_app_path"/test-app-should-ignore-deps/node_modules

# **********************************************************************
# Test project folder is created on success
# **********************************************************************

yarn start \
  "$temp_app_path"/test-app-exists \
  --appId appId \
  --apiKey apiKey \
  --indexName indexName \
  --template "InstantSearch.js" \
  --no-installation \
  &>/dev/null

# Confirm the generated file exists
assert "Project folder is created on success" \
  test -e "$temp_app_path"/test-app-exists/package.json

# **********************************************************************
# Test project doesn't override existing folder
# **********************************************************************

mkdir "$temp_app_path"/test-app-should-remain
echo 'hello' > "$temp_app_path"/test-app-should-remain/README.md

yarn start \
  "$temp_app_path"/test-app-should-remain \
  --appId appId \
  --apiKey apiKey \
  --indexName indexName \
  --template "InstantSearch.js" \
  --no-installation \
  &>/dev/null

assert "Project doesn't override existing folder" \
  test $(grep "hello" "$temp_app_path"/test-app-should-remain/README.md)

# **********************************************************************
# Test project doesn't override existing file
# **********************************************************************

mkdir "$temp_app_path"/test-app-should-remain-file
touch "$temp_app_path"/test-app-should-remain-file/file

yarn start \
  "$temp_app_path"/test-app-should-remain-file \
  --appId appId \
  --apiKey apiKey \
  --indexName indexName \
  --template "InstantSearch.js" \
  --no-installation \
  &>/dev/null

assert "Project doesn't override existing file" \
  test -e "$temp_app_path"/test-app-should-remain-file/file

# Cleanup
echo
echo '✨  Cleaning up'
rm -rf "$temp_app_path"
