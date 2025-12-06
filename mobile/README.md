# StudyIn Mobile App

A React Native mobile app for international students to discover and apply to universities in China.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm start

# Run on iOS Simulator
npm run ios

# Run on Android Emulator
npm run android
```

## 📱 Features

- 🏠 **Home** - Browse universities, programs, and scholarships
- 🔍 **Explore** - Search and filter universities
- 🎓 **Scholarships** - Track scholarship deadlines
- 💬 **Messages** - Communicate with advisors
- 👤 **Profile** - Manage applications and documents

## 🛠 Tech Stack

- **Framework**: Expo SDK 54 + TypeScript
- **Navigation**: Expo Router
- **Animations**: Moti + Reanimated 3
- **State**: Zustand
- **Backend**: Supabase
- **Push**: Expo Notifications

## 📦 Build for Production

```bash
# Install EAS CLI
npm install -g eas-cli

# Login to Expo
eas login

# Build for iOS
eas build --platform ios

# Build for Android
eas build --platform android

# Submit to App Store
eas submit --platform ios

# Submit to Play Store
eas submit --platform android
```

## 📁 Project Structure

```
mobile/
├── app/                    # Expo Router screens
│   ├── (tabs)/             # Main tab screens
│   ├── (auth)/             # Auth screens
│   └── university/         # Detail screens
├── components/             # Reusable components
├── hooks/                  # Custom hooks
├── lib/                    # Utilities & clients
├── stores/                 # Zustand stores
└── assets/                 # Images & fonts
```

## 🔐 Environment Variables

Create a `.env` file:

```env
EXPO_PUBLIC_SUPABASE_URL=your-supabase-url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

## 📱 App Store Checklist

### iOS
- [ ] App icon (1024x1024)
- [ ] Screenshots (6.5", 5.5", 12.9" iPad)
- [ ] App description
- [ ] Privacy policy URL
- [ ] Apple Developer account

### Android
- [ ] App icon (512x512)
- [ ] Feature graphic (1024x500)
- [ ] Screenshots
- [ ] App description
- [ ] Privacy policy URL
- [ ] Google Play Console account
