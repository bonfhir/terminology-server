#!/bin/bash

BUMP_LEVEL=$1

if ! [[ "major minor patch" =~ (^|[[:space:]])$BUMP_LEVEL($|[[:space:]]) ]]; then
    echo "Bump level must be one of major, minor, patch"
    exit 1
fi


CURRENT_VERSION=$(cat $(pwd)/VERSION | tr -d '\n')
CURRENT_MAJOR=$(echo "$CURRENT_VERSION" | cut -d. -f1)
CURRENT_MINOR=$(echo "$CURRENT_VERSION" | cut -d. -f2)
CURRENT_PATCH=$(echo "$CURRENT_VERSION" | cut -d. -f3)

if [ "$BUMP_LEVEL" = "major" ]; then
    SUGGESTED_MAJOR=$((CURRENT_MAJOR + 1))
    SUGGESTED_MINOR=0
    SUGGESTED_PATCH=0
    NEW_VERSION="$SUGGESTED_MAJOR.$SUGGESTED_MINOR.$SUGGESTED_PATCH"
fi

if [ "$BUMP_LEVEL" = "minor" ]; then
    SUGGESTED_MINOR=$((CURRENT_MINOR + 1))
    SUGGESTED_PATCH=0
    NEW_VERSION="$CURRENT_MAJOR.$SUGGESTED_MINOR.$SUGGESTED_PATCH"
fi

if [ "$BUMP_LEVEL" = "patch" ]; then
    SUGGESTED_PATCH=$((CURRENT_PATCH + 1))
    NEW_VERSION="$CURRENT_MAJOR.$CURRENT_MINOR.$SUGGESTED_PATCH"
fi

echo "Current version: $CURRENT_VERSION"
echo "New version: $NEW_VERSION"

echo "$NEW_VERSION" > $(pwd)/VERSION