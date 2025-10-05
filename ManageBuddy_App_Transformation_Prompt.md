# 🧠 ManageBuddy App Transformation Prompt

Transform your existing finance app into a **fun, human-like finance buddy** for students and young professionals.

---

## 🧩 PART 1 — App Overview & Goal

You are an expert Flutter app developer.

I already have a basic finance app built with Flutter that includes the following screens:
1. Home Screen (shows total expenses)
2. Add Expense Screen
3. Analytics Screen
4. Settings Screen

Now, I want to transform this into a unique app called **“ManageBuddy”** — a *friendly money buddy* for students and young professionals.

🎯 **Goal:**
Make it fun, emotional, and conversational — not just numbers. It should feel like a *friend helping with money*, not a boring tracker.

---

## 🧩 PART 2 — Core Features to Implement

1️⃣ **Conversational Onboarding**
- User is welcomed by a friendly chat-like setup (Get Started → ask name → ask budget → choose mode)
- Two tone options:
   - Bro Mode 😎 (fun, casual)
   - Professional Mode 💼 (calm, supportive)

2️⃣ **Home Screen**
- Shows “Safe to Spend Today”, total spent, and days left in the month
- Friendly messages (motivational, casual, not robotic)
- Examples:
  - “Good morning, Ali 🌤 You’ve got ₨650 to spend safely today!”
  - “Nice, you’re under budget today 🔥”

3️⃣ **Add Expense Screen**
- Quick add form (category, amount)
- After submission → friendly feedback:
  - “Lunch for ₨400? Solid choice, bro 🍔 Still got ₨250 left today!”

4️⃣ **Analytics Screen**
- Shows spending by category
- Shows progress/streaks with emojis and fun lines:
  - “You’ve stayed under budget for 5 days straight 🔥”

5️⃣ **Settings Screen**
- Switch between Bro Mode and Professional Mode
- Dark/Light mode toggle
- Reset budget or monthly data

6️⃣ **Motivation System**
- Daily motivational message or reminder
- Supportive tone when user overspends

---

## 🧩 PART 3 — Design & Feel

🎨 **Design style:**
- Minimal UI with rounded cards and emojis
- Bright and soft colors (e.g., teal, light yellow, or purple gradient)
- Font: playful yet readable
- Include simple animations for transitions
- Use icons or illustrations for categories (food, transport, shopping)

🗣 **Tone style:**
- Bro Mode 😎: Energetic, casual, funny
- Professional Mode 💼: Calm, clean, mature

Example:
```
User adds expense ₨400 on “Food”
App (Bro Mode): “🍔 Nice! Still got ₨250 left for today.”
App (Pro Mode): “Good work staying mindful with your spending, Ali.”
```

---

## 🧩 PART 4 — Implementation Instructions

Now, rewrite my current Flutter code structure based on the above plan.

✅ Keep my existing navigation (Home, Add Expense, Analytics, Settings)  
✅ Add the new conversational onboarding flow  
✅ Implement the two tone modes (Bro Mode & Professional Mode)  
✅ Add friendly messages dynamically on each screen  
✅ Redesign UI to be modern and emotional  

Make the app feel like a *smart, funny, and supportive buddy* — not a cold tracker.

**App Name:** ManageBuddy  
**Tagline:** “Your friendly money partner 💬💸”
