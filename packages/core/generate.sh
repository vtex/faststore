#!/bin/sh

# ANSI color codes
RED='\033[0;31m'
YELLOW='\033[1;33m'
PURPLE='\033[0;35m'
GREEN='\033[0;32m'
NC='\033[0m' # No Color

# Initialize debug flag to false
DEBUG_FLAG=false

# Check for --debug flag
if [ "$1" = "--debug" ]; then
    DEBUG_FLAG=true
fi

# Function to display errors with readable messages
show_error() {
    local cmd="$3"

    echo -e "${RED}error${NC} $1"
    if [ "$DEBUG_FLAG" = "true" ]; then
        echo -e "${PURPLE}DEBUG - \$ $cmd ${RED}error root ↓${NC}\n$2"
    fi
    exit 1
}

# Function to display warnings
show_warning() {
    local cmd="$3"

    echo -e "${YELLOW}warn${NC} $1"
    if [ "$DEBUG_FLAG" = "true" ]; then
        echo -e "${PURPLE}DEBUG - \$ $cmd ${YELLOW}warn root ↓${NC}\n$2"
    fi
}

# Function to run a command and handle errors and warnings
run_command() {
    local cmd="$1"
    local error_message="$2"
    local warn="$3"
    local output

    if [ "$DEBUG_FLAG" = "true" ]; then
        output="$($cmd --debug --verbose 2>&1)"
    else
        output="$($cmd 2>&1)"
    fi

    local exit_code="$?"
    if [ "$warn" = "true" ]; then
        if [ "$exit_code" -ne 0 ]; then
            show_warning "$error_message" "$output" "$cmd"
        fi
    elif [ "$exit_code" -ne 0 ]; then
        show_error "$error_message" "$output" "$cmd"
    fi
}

# Run "yarn generate:schema" without outputting logs and errors
run_command "yarn generate:schema" "Failed to run 'yarn generate:schema'. Please check your setup." "false"

# Run graphql-codegen and capture the output
run_command "graphql-codegen" "GraphQL was not optimized and TS files were not updated. Changes in the GraphQL layer did not take effect" "false"

# Run "yarn format:generated" and display a warning if it produces output
run_command "yarn format:generated" "Failed to format generated files. 'yarn format:generated' thrown errors" "true"

echo -e "${GREEN}GraphQL schema, types, and optimizations successfully generated 🎉${NC}"
