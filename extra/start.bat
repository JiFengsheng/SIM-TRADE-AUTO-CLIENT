@echo off

rem The running environment of test.jar is jdk1.8 at least.

if "%OS%" == "Windows_NT" setlocal
rem ---------------------------------------------------------------------------
rem Start script for the xxx client
rem ---------------------------------------------------------------------------

set APP_HOME_TEMP=%~dp0
set APP_HOME=%APP_HOME_TEMP:\=/%

if not "%APP_HOME%" == "" goto okHome

set "CURRENT_DIR=%cd%"
set "APP_HOME=%CURRENT_DIR%"
if exist "%APP_HOME%\jre\bin\java.exe" goto okHome
cd ..
set "APP_HOME=%cd%"
cd "%CURRENT_DIR%"
:okHome

set "EXECUTABLE=%APP_HOME%\jre\bin\java.exe"

if exist "%EXECUTABLE%" goto okExec
echo Cannot find "%EXECUTABLE%"
echo This file is needed to run this program
goto end

:okExec

rem Change directory to service directory
cd "%APP_HOME%\service"

rem Run the JAR file from the service directory
"%EXECUTABLE%" -Djava.net.preferIPv4Stack=true -jar "%APP_HOME%\service\sim-trade-auto-sys-1.0-SNAPSHOT.jar"  --server.port=%1

:end
