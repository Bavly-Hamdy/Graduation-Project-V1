
# Care Companion Digital Health

A comprehensive health companion web application built with React, TypeScript, and modern web technologies.

## 🚀 Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd care-companion-digital-health
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your Firebase and API keys
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:8080`

## 🛠️ Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint

## 🏗️ Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **UI Components**: shadcn/ui, Tailwind CSS
- **State Management**: React Query (TanStack Query)
- **Backend**: Firebase (Authentication, Firestore, Hosting)
- **Internationalization**: react-i18next
- **Charts**: Recharts
- **Icons**: Lucide React

## 📱 Features

- **Multi-language Support** (English, Arabic)
- **Dark/Light Theme Toggle**
- **Responsive Design**
- **Health Chatbot Interface**
- **User Authentication** (Firebase)
- **Real-time Data Sync**

## 🔧 Environment Setup

### Required Environment Variables

Copy `.env.example` to `.env` and fill in your configuration:

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef123456
```

### Firebase Setup

1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable Authentication and Firestore Database
3. Add your domain to authorized domains
4. Copy your config keys to `.env`

## 🚀 Deployment

### Firebase Hosting (Recommended)

1. **Install Firebase CLI**
   ```bash
   npm install -g firebase-tools
   ```

2. **Login to Firebase**
   ```bash
   firebase login
   ```

3. **Initialize Firebase (if not done)**
   ```bash
   firebase init hosting
   ```

4. **Deploy**
   ```bash
   npm run build
   firebase deploy
   ```

### Automatic Deployment

The project includes GitHub Actions for automatic deployment:

1. Set up repository secrets in GitHub:
   - `FIREBASE_SERVICE_ACCOUNT` - Firebase service account JSON
   - `FIREBASE_PROJECT_ID` - Your Firebase project ID
   - All `VITE_` environment variables

2. Push to `main` branch to trigger automatic deployment

## 📁 Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── ui/              # shadcn/ui components
│   ├── layout/          # Layout components (Header, Footer)
│   └── chatbot/         # Chatbot-specific components
├── pages/               # Page components
├── hooks/               # Custom React hooks
├── contexts/            # React contexts (Theme, i18n)
├── lib/                 # Utility functions
├── i18n/                # Internationalization files
└── config/              # Configuration files
```

## 🔮 Phase 2 Roadmap

- **AI Integration**: Real chatbot with OpenAI/Gemini
- **Health Predictions**: ML models for health insights
- **Mobile App**: React Native companion app
- **Device Integration**: Wearable device connectivity
- **Advanced Analytics**: Health data visualization

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the [documentation](./DEPLOYMENT.md) for deployment help
