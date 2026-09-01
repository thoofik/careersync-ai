# CareerSync AI
The most advanced AI-powered interview preparation platform for software engineers, web developers, data scientists, and tech 
professionals. Practice realistic technical and behavioral interviews with personalized feedback.
Mocks, peer rounds, and resume checks. Built by [Thoofik](https://github.com/thoofik).

[![CareerSync AI](https://img.shields.io/badge/CareerSync%20AI-Next.js%2015-blue)](https://github.com/thoofik)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![Firebase](https://img.shields.io/badge/Firebase-11-orange)](https://firebase.google.com/)

## Why CareerSync AI

- **Most Advanced Interview AI**: Utilizes Llama 3.3 70B LLM - the same technology powering enterprise AI assistants
- **Complete Interview Simulation**: Full voice-based interviews with realistic AI interviewer responses
- **Personalized Feedback**: Detailed analysis of your performance with specific improvement suggestions
- **Role-Specific Questions**: Tailored for Frontend, Backend, Full Stack, DevOps, Data Science positions
- **All Experience Levels**: Junior, Mid-level, and Senior technical interview preparation
- **Resume Scanning**: Upload a PDF resume for ATS-style scoring and improvement tips matched to a job description

## 🤖 AI/ML Capabilities

The platform leverages cutting-edge AI technologies:

- **Large Language Models (LLMs)**: Llama 3.3 70B generates high-quality interview questions, evaluates answers, and provides personalized feedback
- **Natural Language Processing**: Analyzes interview transcripts for communication skills assessment
- **Custom Scoring Algorithms**: Evaluates responses across technical knowledge, problem-solving, and communication dimensions
- **Speech Technologies**: Deepgram for transcription and Eleven Labs for realistic interviewer voices
- **Resume Intelligence**: Parses PDF resumes, extracts skills/experience, and scores them against ATS criteria and a target role

## 📋 Tech Stack

- Next.js 15 with App Router
- TypeScript
- Firebase Authentication and Firestore
- Tailwind CSS for styling
- Shadcn UI components
- AI/ML Integration:
  - Groq AI SDK for LLM capabilities
  - Llama 3.3 70B for sophisticated interview simulations
  - Llama 3.2 11B for vision and feedback capabilities
  - AI text generation for question creation and feedback
  - Deepgram for voice transcription
  - Eleven Labs for realistic voice synthesis

## 📱 Key Features

- 🔐 User authentication with Firebase
- 💻 Practice technical coding interviews
- 🗣️ Behavioral interview simulations
- 📊 Performance feedback and improvement suggestions
- 🌐 Support for multiple tech stacks and roles
- 🎯 AI-driven improvement recommendations
- 🤝 Peer interview practice sessions
- 📊 Progress tracking dashboard
- 📄 Resume scanning with ATS score and rewrite tips

## 📄 Resume Scanning

CareerSync AI includes a resume scanning flow so interview prep and resume review live in the same project.

- Upload a **PDF resume** (drag and drop or click) on `/skillscan/upload`
- Optionally add **company**, **job title**, and **job description** so feedback matches the role you are applying for
- The app extracts resume text, analyzes it with the LLM, and stores the result
- You get an **ATS-style score** plus tips on content, structure, skills, and wording
- Past scans are listed on `/skillscan` so you can compare submissions
- When creating a mock interview, you can also attach a resume so questions follow the skills and experience on that PDF

This is part of CareerSync AI — not a separate product. Mocks, peer rounds, and resume checks share the same app, auth, and AI stack.

## 🛠️ Getting Started

### Prerequisites

- Node.js 18+ installed
- Firebase project set up

### Environment Setup

Create a `.env.local` file in the project root (copy from `.env.example`). Do **not** commit `.env.local`.

```
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_VAPI_WEB_TOKEN=
FIREBASE_PROJECT_ID=
FIREBASE_CLIENT_EMAIL=
FIREBASE_PRIVATE_KEY=
GROQ_API_KEY=
```

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Run the development server:

```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

Resume scanning: open `/skillscan`, then upload a PDF at `/skillscan/upload`.

## 📂 Project Structure

```
/app - Next.js application routes
/components - Reusable UI components
/firebase - Firebase configuration
/lib - Utilities and server actions
/public - Static assets
/types - TypeScript type definitions
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is licensed under the MIT License.

## Contact

- GitHub: [github.com/thoofik](https://github.com/thoofik)
- Email: [thoofikusmaan@gmail.com](mailto:thoofikusmaan@gmail.com)
- LinkedIn: [Thoofik Usmaan A](https://www.linkedin.com/in/thoofik-usmaan-a-2b93a9254/)
