#!/bin/bash
# ---------------------------------------------------------------------------
# Start script for the xxx client
# ---------------------------------------------------------------------------

CURRENT_DIR=$(dirname "$0")

# 设置包含PID的文件路径
PIDFILE="${CURRENT_DIR}/service/sim-trade.pid"

# 检查文件是否存在
if [ ! -f "$PIDFILE" ]; then
    echo "file $PIDFILE is not exist!" >> stop_output.txt
    exit 1
fi

# 遍历文件中的每一行
while read -r PID; do
    echo "current pid is $PID" >> stop_output.txt
    # 检查PID是否存在
    if pgrep -x "$PID" > /dev/null; then
        echo "发现进程 PID: $PID，正在杀死..." >> stop_output.txt
        kill -9 "$PID"
        if [ $? -ne 0 ]; then
            echo "无法杀死 PID: $PID 进程" >> stop_output.txt
        fi
    else
        echo "process PID: $PID is not exist" >> stop_output.txt
    fi
done < "$PIDFILE"

# 删除PID文件
rm "$PIDFILE"
if [ $? -eq 0 ]; then
    echo "PID文件 $PIDFILE 已删除" >> stop_output.txt
else
    echo "无法删除PID文件 $PIDFILE" >> stop_output.txt
fi

echo "process end" >> stop_output.txt