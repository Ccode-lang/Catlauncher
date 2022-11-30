REM -- Get the directory where this script running from
SET SCRIPTDIR=%~dp0

REM -- Copy file to program files
SET DESTDIR=%ProgramFiles%\hglauncher
IF NOT EXIST "%DESTDIR%" MD "%DESTDIR%"
COPY "%SCRIPTDIR%\*" "%DESTDIR%"

REM -- Return exit code 0
EXIT /B 0