@echo off
setlocal enabledelayedexpansion

if "%OS%" == "Windows_NT" setlocal
rem ---------------------------------------------------------------------------
rem Start script for the xxx client
rem ---------------------------------------------------------------------------

set CURRENT_DIR=%~dp0


:: 设置包含PID的文件路径
set "PIDFILE=%CURRENT_DIR%/service/sim-trade.pid"

:: 检查文件是否存在
if not exist "%PIDFILE%" (
    echo file %PIDFILE% is not exist!  >> stop_output.txt
    goto :eof
)

:: 遍历文件中的每一行
for /f "delims=" %%i in (%PIDFILE%) do (
    set "PID=%%i"
    echo current pid is !PID! >> stop_output.txt
    :: 检查PID是否存在
    tasklist | findstr /C:"!PID!" >nul
    if !errorlevel! equ 0 (
        echo 发现进程 PID: !PID!，正在杀死...  >> stop_output.txt
        taskkill /F /PID !PID!
        if !errorlevel! neq 0 (
            echo can not kill PID: !PID! process  >> stop_output.txt
        )
    ) else (
        echo process PID: !PID! is not exist  >> stop_output.txt
    )
)

:: 删除PID文件
:: del "%PIDFILE%"
:: if !errorlevel! equ 0 (
::     echo PID文件 %PIDFILE% 已删除 >> stop_output.txt
:: ) else (
::     echo 无法删除PID文件 %PIDFILE% >> stop_output.txt
:: )

echo process end >> stop_output.txt

pause
