yarn workspaces info | grep -o '"@vtex/theme.*"' | sort -u | tr '"' ' ' | while read -r line; do yarn workspace $line build; done
