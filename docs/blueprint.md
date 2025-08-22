# **App Name**: MediMind AI

## Core Features:

- User Authentication: Authentication system with login and signup pages, profile picture upload, and 'Forgot Password' functionality using Firebase Authentication.
- Central Dashboard: Dashboard page that centralizes access to the Symptom Checker, AI Chatbot, Drug Checker, Skin Cancer Detection, and User Profile.
- Symptom Checker: AI-powered symptom checker that processes user-provided symptoms and returns a list of possible conditions with severity levels. An LLM is used as a tool to retrieve information about likely conditions given the listed symptoms.
- AI Health Chatbot: Interactive AI chatbot providing health-related assistance through a chat window interface. The LLM is used as a tool to assist and augment its memory and knowledge of various medical domains.
- Drug Interaction Checker: Drug safety checker that identifies potential harmful interactions between medications added by the user. The LLM is used as a tool to retrieve interaction warnings given the various combinations of pharmaceuticals and over the counter medications.
- Skin Cancer Analysis: Skin cancer detection tool that analyzes uploaded images to determine the probability of skin cancer and provide a recommendation. The LLM is used as a tool to find supporting documentation based on its probability analysis
- Profile Management: User profile page for managing personal information and uploaded files with secure download options.

## Style Guidelines:

- Primary color: Blue (#42A5F5), evoking trust and reliability, central to healthcare branding.
- Background color: Light gray (#F0F4F8), maintains a clean and professional backdrop without distracting from the primary content.
- Accent color: Green (#66BB6A), suggesting health and safety, highlighting positive confirmations or safe results within the app.
- Body and headline font: 'Inter', a grotesque-style sans-serif for a modern, neutral, and easily readable interface.
- Code font: 'Source Code Pro' for displaying code snippets.
- Use a consistent set of easily recognizable icons to visually represent each feature and status, following a minimalist design.
- Employ a responsive, mobile-first design, using Tailwind CSS grid and flexbox utilities for flexible and adaptive layouts.