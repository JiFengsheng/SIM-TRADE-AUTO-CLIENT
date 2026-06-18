#!/bin/bash

# The running environment of test.jar is jdk1.8 at least.

# Determine the script directory
APP_HOME_TEMP=$(dirname "$0")
APP_HOME=$(echo "$APP_HOME_TEMP" | sed 's|\\|/|g')

if [ -n "$APP_HOME" ]; then
    goto_okHome=true
else
    CURRENT_DIR=$(pwd)
    APP_HOME="$CURRENT_DIR"
    if [ -f "$APP_HOME/jre/bin/java" ]; then
        goto_okHome=true
    else
        cd ..
        APP_HOME=$(pwd)
        cd "$CURRENT_DIR"
    fi
fi

if [ "$goto_okHome" == true ]; then
    :
else
    echo "Cannot determine APP_HOME"
    exit 1
fi

EXECUTABLE="$APP_HOME/jre/bin/java"

if [ -f "$EXECUTABLE" ]; then
    :
else
    echo "Cannot find \"$EXECUTABLE\""
    echo "This file is needed to run this program"
    exit 1
fi

# Change directory to service directory
cd "$APP_HOME/service" || exit 1

# Run the JAR file from the service directory
"$EXECUTABLE" -Djava.net.preferIPv4Stack=true -jar "$APP_HOME/service/sim-trade-auto-sys-1.0-SNAPSHOT.jar"  --server.port=$1
