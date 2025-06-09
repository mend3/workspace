#!/bin/bash
set -e

get_terraform_costs() {
  curl -s --header "Authorization: Bearer $TF_API_TOKEN" \
    --header "Content-Type: application/vnd.api+json" \
    "https://app.terraform.io/api/v2/organizations/$TF_CLOUD_ORGANIZATION/workspaces/$TF_WORKSPACE/cost-estimates" | jq '.data[].attributes.estimated_monthly_cost'
}

send_slack_notification() {
  local cost=$(get_terraform_costs)
  local message="📊 *Terraform Estimated Monthly Cost:* \`\$$cost\`"
  curl -X POST -H 'Content-type: application/json' --data "{ \"text\": \"$message\" }" "$SLACK_WEBHOOK_URL"
}

send_slack_notification
