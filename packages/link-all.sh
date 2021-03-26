#!/usr/bin/env bash

PACKAGES=$(/bin/ls -d */)
PACKAGES=($(echo "$PACKAGES" | tr ' ' '\n'))

LINK_COMMAND="yarn link "

for i in ${!PACKAGES[@]};
do
  PACKAGE=${PACKAGES[$i]}
  echo $PACKAGE
  cd $PACKAGE
  # echo cwd
  yarn link
  # echo "yarn link"
  PACKAGE_NAME=$(echo "$PACKAGE" | rev | cut -c 2- | rev)
  LINK_COMMAND="$LINK_COMMAND @vtex/$PACKAGE_NAME"
  cd ..
done

echo "The command for linking is:"
echo
echo $LINK_COMMAND
