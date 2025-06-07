#!/bin/bash
git submodule foreach 'git fetch origin && git checkout main && git pull origin main'
git add .
git commit -m "Update submodules to latest main"
