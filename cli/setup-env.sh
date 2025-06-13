#!/bin/sh

set -e # Exit on first error

# === LOAD ENVIRONMENT VARIABLES ===
source .env.sh

# Define the output file
ENV_FILE=".env"

# Create or overwrite the .env file
echo "# Generated .env file" >$ENV_FILE

# Loop through all environment variables
for var in $(printenv | awk -F= '{print $1}'); do
  # Escape special characters in variable values
  value=$(printenv "$var" | sed 's/"/\\"/g')

  # Append the variable to the .env file
  echo "$var=\"$value\"" >>$ENV_FILE
done

echo ".env file generated successfully."
