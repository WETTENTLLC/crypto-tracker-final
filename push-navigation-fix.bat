@echo off
echo Pushing navigation fixes to GitHub...

git add .
git commit -m "Fix navigation issues redirecting to dashboard"
git push origin main

echo Done! Navigation fixes have been pushed to GitHub.