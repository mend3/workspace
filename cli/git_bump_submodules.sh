#!/bin/bash

# * bump_submodules.sh - Bump submodules to latest main.
# * Usage: ./bump_submodules.sh

git submodule foreach 'git fetch origin && git checkout main && git pull origin main'
git add .
git commit -m "Update submodules to latest main"
