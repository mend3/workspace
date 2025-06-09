#!/bin/bash
set -e

get_openai_costs() {
  curl -s https://api.openai.com/v1/usage \
    -H "Authorization: Bearer $OPENAI_API_KEY" | jq '.total_usage'
}

send_slack_notification() {
  local cost=$(get_openai_costs)
  local message="📊 *OpenAI Cost Report:* \`\$$cost\`"
  curl -X POST -H 'Content-type: application/json' --data "{ \"text\": \"$message\" }" "$SLACK_WEBHOOK_URL"
}

send_slack_notification
