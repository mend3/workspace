#!/bin/bash
set -e

get_aws_costs() {
  aws ce get-cost-and-usage \
    --time-period Start=$(date -d "-1 day" +%Y-%m-%d),End=$(date +%Y-%m-%d) \
    --granularity DAILY \
    --metrics "BlendedCost" \
    --group-by Type=DIMENSION,Key=SERVICE \
    --region $AWS_REGION \
    --query 'ResultsByTime[0].Groups[*].{Service:Keys[0],Cost:Metrics.BlendedCost.Amount}' \
    --output table
}

send_slack_notification() {
  local message="📊 *AWS Cost Report*\n\`\`\`\n$(get_aws_costs)\n\`\`\`"
  curl -X POST -H 'Content-type: application/json' --data "{ \"text\": \"$message\" }" "$SLACK_WEBHOOK_URL"
}

send_slack_notification
