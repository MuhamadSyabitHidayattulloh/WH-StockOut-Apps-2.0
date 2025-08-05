# WH StockOut Apps 2.0

Modern React Native warehouse management application with glassmorphism design and dark/light mode support.

## Features

- **Modern Glassmorphism UI**: Black and white formal design with iOS-like aesthetics
- **Dark/Light Mode**: Automatic system theme detection with manual toggle
- **QR Code Scanning**: Camera-based barcode scanning for inventory management
- **Real-time Data Sync**: Seamless integration with warehouse management APIs
- **User Authentication**: Secure login and registration system
- **Offline Support**: Local data storage with AsyncStorage
- **Sound & Vibration Feedback**: Enhanced user experience with audio/haptic feedback

## Tech Stack

- **React Native 0.80.2** (Latest version with React 19.1.0)
- React Navigation 6
- React Native Vision Camera
- AsyncStorage
- Axios for API calls
- Lottie animations
- Vector Icons
- **@d11/react-native-fast-image** (React 19 compatible fork)
- **react-native-sound-player** (Modern audio library)

## Design Philosophy

This app features a modern glassmorphism design with:
- Semi-transparent glass-like components
- Subtle shadows and blur effects
- Adaptive color scheme (dark/light mode)
- Smooth animations and micro-interactions
- iOS-inspired interface elements

## Installation

1. Clone the repository:
```bash
git clone https://github.com/MuhamadSyabitHidayattulloh/WH-StockOut-Apps-2.0.git
cd WH-StockOut-Apps-2.0
```

2. Install dependencies (no legacy peer deps required):
```bash
npm install
```

3. For iOS (if developing on macOS):
```bash
cd ios && pod install && cd ..
```

4. Run the application:
```bash
# For Android
npm run android

# For iOS
npm run ios
```

## Project Structure

```
src/
├── api/                 # API endpoints and configurations
├── assets/             # Images, sounds, animations
├── components/         # Reusable UI components
│   ├── GlassBackground.js
│   ├── GlassButton.js
│   ├── GlassInput.js
│   ├── GlassCard.js
│   ├── GlassTable.js
│   ├── AnimatedGlassButton.js
│   └── ThemeToggle.js
├── context/            # React contexts
│   └── ThemeContext.js
├── function/           # Utility functions
├── pages/              # Screen components
│   ├── Login.js
│   ├── Home.js
│   ├── WOInstruction.js
│   ├── Register.js
│   └── FullCameraScan.js
└── styles/             # Style definitions
    └── glassmorphism.js
```

## Key Components

### ThemeContext
Provides dark/light mode functionality with system theme detection and manual toggle.

### GlassBackground
Provides the main glassmorphism background with floating glass elements that adapt to theme.

### GlassButton & AnimatedGlassButton
Interactive buttons with glass effect and smooth animations that adapt to theme.

### GlassInput
Input fields with glassmorphism styling and built-in password visibility toggle.

### GlassTable
Data table component with glass styling for displaying inventory data.

### GlassCard
Versatile card component with multiple variants and optional interactions.

### ThemeToggle
Component for switching between light, dark, and system themes.

## Theme Support

The app supports three theme modes:
- **System**: Automatically follows device theme
- **Light**: Force light mode
- **Dark**: Force dark mode

Theme preference is persisted using AsyncStorage.

## API Integration

The app integrates with warehouse management APIs for:
- User authentication
- Stock out operations
- Data synchronization

## Permissions

The app requires the following permissions:
- Camera (for QR code scanning)
- Storage (for local data persistence)

## Development Notes

This is a complete rewrite of the original WH StockOut Apps with:
- **React Native 0.80.2** with React 19.1.0 (latest stable)
- **No legacy peer deps required** - all dependencies are compatible
- Modern glassmorphism design system with theme support
- Enhanced user experience with dark/light mode
- Improved code architecture with React Context
- Better performance and reliability

## Dependency Updates

### Replaced Dependencies:
- `react-native-fast-image` → `@d11/react-native-fast-image` (React 19 compatible)
- `react-native-sound` → `react-native-sound-player` (modern audio library)

### All dependencies are now compatible with:
- React Native 0.80.2
- React 19.1.0
- No `--legacy-peer-deps` flag required

## Setup Commands Used

```bash
# Project initialization (correct approach)
npx @react-native-community/cli@latest init WHStockOutApps2

# Dependencies installation (no legacy peer deps)
npm install @react-navigation/native @react-navigation/native-stack react-native-screens react-native-safe-area-context @react-native-async-storage/async-storage react-native-vector-icons axios moment react-native-sound-player lottie-react-native @d11/react-native-fast-image react-native-vision-camera react-native-permissions react-native-loading-spinner-overlay react-native-svg uuid react-native-get-random-values
```

## License

© PED - Denso Indonesia 2025

## Contributing

This project is maintained by the PED team at Denso Indonesia. For contributions or issues, please contact the development team.

