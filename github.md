🧭 Step-by-Step: Upload Changes to GitHub (After First Push)

Whenever you edit files or add new ones:

1️⃣ Check What Changed

In your VS Code terminal (inside the project folder):

git status


This shows which files were changed, added, or deleted.

2️⃣ Add the Changes
git add .


This means: “Add all my latest edits to the next commit.”

(You can also add specific files, like git add App.js)

3️⃣ Commit the Changes
git commit -m "Updated AddExpense screen and fixed UI bug"


💡 The message explains what you did — makes it easy to track later.

4️⃣ Push to GitHub
git push


That’s it 🚀
Your latest changes are now uploaded to GitHub.

✅ Optional Pro Tips

To see your commit history:

git log --oneline


If you ever forget to add a file:

git add filename.js
git commit --amend
git push --force


Always make sure you’re on the right branch (usually main):

git branch

🔁 So Your Daily Upload Routine:
git add .
git commit -m "Describe your update"
git push