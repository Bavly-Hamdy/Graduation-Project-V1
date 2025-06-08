
# Deployment Guide

## Firebase Hosting Setup

### Prerequisites
- Node.js 18+ installed
- Firebase CLI installed (`npm install -g firebase-tools`)
- A Firebase project created

### Step-by-Step Deployment

1. **Build the project**
   ```bash
   npm run build
   ```

2. **Login to Firebase**
   ```bash
   firebase login
   ```

3. **Initialize Firebase (first time only)**
   ```bash
   firebase init hosting
   ```
   - Select your Firebase project
   - Set public directory to `dist`
   - Configure as single-page app: Yes
   - Set up automatic builds and deploys with GitHub: Optional

4. **Deploy**
   ```bash
   firebase deploy
   ```

### GitHub Actions Setup

1. **Generate Firebase Service Account**
   - Go to Firebase Console → Project Settings → Service Accounts
   - Generate new private key
   - Copy the entire JSON content

2. **Set GitHub Secrets**
   In your GitHub repository settings → Secrets and Variables → Actions:
   ```
   FIREBASE_SERVICE_ACCOUNT: (paste the service account JSON)
   FIREBASE_PROJECT_ID: your-project-id
   VITE_FIREBASE_API_KEY: your-api-key
   VITE_FIREBASE_AUTH_DOMAIN: your-project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID: your-project-id
   VITE_FIREBASE_STORAGE_BUCKET: your-project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID: 123456789
   VITE_FIREBASE_APP_ID: 1:123456789:web:abcdef123456
   ```

3. **Automatic Deployment**
   - Push to `main` branch triggers automatic deployment
   - GitHub Actions will build and deploy to Firebase Hosting

## Alternative Hosting Options

### Netlify
1. Connect your GitHub repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Add environment variables in Netlify dashboard

### Vercel
1. Connect your GitHub repository to Vercel
2. Framework preset: Vite
3. Build command: `npm run build`
4. Output directory: `dist`
5. Add environment variables in Vercel dashboard

## Environment Variables

Ensure all required environment variables are set in your hosting platform:

```env
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

## Troubleshooting

### Build Errors
- Check all environment variables are set
- Ensure Node.js version is 18+
- Clear node_modules and reinstall: `rm -rf node_modules package-lock.json && npm install`

### Firebase Deploy Issues
- Verify Firebase CLI is logged in: `firebase login`
- Check Firebase project is selected: `firebase use --add`
- Ensure billing is enabled for Firebase project

### Domain Configuration
- Add custom domains in Firebase Hosting settings
- Update DNS records to point to Firebase
- SSL certificates are automatically managed by Firebase
