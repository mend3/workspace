copilot-set() {
  export COPILOT_APP=$1
  export COPILOT_ENV=$2
  echo "Set Copilot app to '$COPILOT_APP' and environment to '$COPILOT_ENV'"
}

copilot() {
  $(which copilot) --app "$COPILOT_APP" --env "$COPILOT_ENV" "$@"
}
