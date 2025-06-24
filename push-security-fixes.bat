@echo off
echo Pushing security fixes to GitHub...

git add .
git commit -m "Fix security issues: Remove exposed credentials and admin access"
git push origin main

echo Done! Security fixes have been pushed to GitHub.