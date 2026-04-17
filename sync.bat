@echo off
echo Sync con upstream...

git fetch upstream

if errorlevel 1 (
    echo Errore fetch
    pause
    exit /b
)

git checkout upstream/main -- .

echo File aggiornati da upstream (override completato)
pause