# 📰 News Summerizer

A modern web application that summarizes news articles using AI, built with **Next.js**, **Tailwind CSS**, and **Firebase**.

## 🚀 Features

- 🧠 Summarize news articles using AI models (e.g., GPT-based backend)
- 🌐 Modern frontend with Next.js and Tailwind CSS
- 🔥 Firebase integration for data storage or authentication
- 📱 Responsive design for both desktop and mobile

## 📁 Project Structure

News-Summerizer/
│
├── public/ # Static assets
├── src/ # Source code
│ ├── app/ # Main app pages
│ │ └── page.tsx # Homepage
│ └── components/ # Reusable UI components
│
├── tailwind.config.ts # Tailwind CSS configuration
├── next.config.ts # Next.js configuration
├── tsconfig.json # TypeScript configuration
└── package.json # Project dependencies and scripts


## ⚙️ Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/naveensankar5905/News-Summerizer.git

```
####2. Install Dependencies
Make sure you have Node.js and npm installed.
```bash
npm install
```
3. Set Up Environment Variables
Create a .env.local file for Firebase and OpenAI keys:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
# Add other Firebase configs here
OPENAI_API_KEY=your_openai_api_key

```

