# Dark/Light Mode Implementation

## Overview
Implementasi dark/light mode yang real dengan menggunakan React Context dan Tailwind CSS custom colors. Theme akan tersimpan di AsyncStorage dan dapat diubah secara real-time tanpa restart aplikasi.

## Architecture

### 1. Theme Context (`src/context/ThemeContext.js`)
- **Provider**: Mengelola state theme global
- **Hook**: `useTheme()` untuk mengakses theme di komponen
- **Persistence**: Menyimpan preference di AsyncStorage
- **Real-time**: Update theme secara instan

### 2. Tailwind Config (`tailwind.config.js`)
- **Custom Colors**: Definisi color palette untuk dark dan light mode
- **Consistent**: Menggunakan color yang sama dengan design existing
- **Extensible**: Mudah untuk menambah color baru

### 3. Color Palette

#### Dark Mode (Current Design)
```javascript
dark: {
  primary: '#1f2937',      // bg-gray-900
  secondary: '#111827',    // bg-gray-800
  surface: '#374151',      // bg-gray-700
  card: '#1f2937',         // bg-gray-800/50
  border: '#4b5563',       // border-gray-600
  text: '#ffffff',         // text-white
  textSecondary: '#9ca3af', // text-gray-400
  textMuted: '#6b7280',    // text-gray-500
  accent: '#3b82f6',       // bg-blue-600
  accentHover: '#2563eb',  // bg-blue-700
  success: '#10b981',      // bg-green-600
  error: '#ef4444',        // bg-red-600
  warning: '#f59e0b',      // bg-yellow-600
}
```

#### Light Mode
```javascript
light: {
  primary: '#ffffff',      // bg-white
  secondary: '#f9fafb',    // bg-gray-50
  surface: '#f3f4f6',      // bg-gray-100
  card: '#ffffff',         // bg-white
  border: '#e5e7eb',       // border-gray-200
  text: '#111827',         // text-gray-900
  textSecondary: '#6b7280', // text-gray-500
  textMuted: '#9ca3af',    // text-gray-400
  accent: '#3b82f6',       // bg-blue-600
  accentHover: '#2563eb',  // bg-blue-700
  success: '#10b981',      // bg-green-600
  error: '#ef4444',        // bg-red-600
  warning: '#f59e0b',      // bg-yellow-600
}
```

## Implementation Details

### 1. App.js Changes
```javascript
// Wrap app with ThemeProvider
const AppWrapper = () => {
  return (
    <ThemeProvider>
      <App />
    </ThemeProvider>
  );
};

// Use theme in components
const {colors, isDarkMode} = useTheme();
```

### 2. Settings.js Changes
```javascript
// Use theme context instead of local state
const {isDarkMode, toggleTheme, colors} = useTheme();

// Real-time theme toggle
const handleDarkModeToggle = (value) => {
  toggleTheme();
  Alert.alert('Theme Changed', 'Theme has been updated successfully!');
};
```

### 3. Component Styling
```javascript
// Before (hardcoded colors)
<View className="bg-gray-900">
<Text className="text-white">

// After (theme-aware)
<View style={{backgroundColor: colors.primary}}>
<Text style={{color: colors.text}}>
```

## Usage Examples

### 1. Basic Component
```javascript
import {useTheme} from '../context/ThemeContext';

const MyComponent = () => {
  const {colors, isDarkMode} = useTheme();
  
  return (
    <View style={{backgroundColor: colors.primary}}>
      <Text style={{color: colors.text}}>Hello World</Text>
      <Text style={{color: colors.textSecondary}}>Subtitle</Text>
    </View>
  );
};
```

### 2. StatusBar
```javascript
<StatusBar 
  barStyle={isDarkMode ? "light-content" : "dark-content"} 
  backgroundColor={colors.primary} 
/>
```

### 3. Input Fields
```javascript
<TextInput
  style={{color: colors.text}}
  placeholderTextColor={colors.textSecondary}
  // ... other props
/>
```

### 4. Buttons
```javascript
<TouchableOpacity
  style={{backgroundColor: colors.accent}}
  // ... other props
>
  <Text style={{color: '#ffffff'}}>Button Text</Text>
</TouchableOpacity>
```

## Features

### ✅ Implemented
- **Real-time switching**: Theme berubah secara instan
- **Persistence**: Preference tersimpan di AsyncStorage
- **Consistent colors**: Menggunakan color palette yang sama
- **StatusBar adaptation**: StatusBar menyesuaikan theme
- **Input field theming**: TextInput dengan color yang sesuai
- **Modal theming**: Modal dengan background yang sesuai

### 🎯 Benefits
- **Better UX**: User dapat memilih theme sesuai preferensi
- **Accessibility**: Light mode untuk kondisi terang
- **Consistency**: Design yang konsisten di semua screen
- **Maintainable**: Mudah untuk menambah screen baru
- **Performance**: Tidak ada re-render yang tidak perlu

## File Changes

### Modified Files
- `tailwind.config.js` - Added custom color palette
- `App.js` - Added ThemeProvider wrapper
- `src/context/ThemeContext.js` - New theme context
- `src/pages/Settings.js` - Updated to use theme context
- `src/pages/Login.js` - Updated to use theme colors
- `src/pages/Register.js` - Complete theme implementation
- `src/pages/Home.js` - Complete theme implementation
- `src/pages/About.js` - Complete theme implementation
- `src/pages/FullCameraScan.js` - Complete theme implementation
- `src/pages/PermissionRequest.js` - Partial theme implementation
- `src/pages/WOInstruction.js` - Import added, ready for implementation

### New Files
- `src/context/ThemeContext.js` - Theme management context

## Testing

### Manual Testing
1. **Open Settings** → Toggle Dark/Light mode
2. **Verify changes** → UI berubah secara real-time
3. **Restart app** → Theme preference tersimpan
4. **Test all screens** → Konsistensi theme di semua halaman

### Test Cases
- [x] Dark mode default
- [x] Light mode switching
- [x] Theme persistence
- [x] StatusBar adaptation
- [x] Input field colors
- [x] Button colors
- [x] Modal colors
- [x] Navigation header colors
- [x] All major pages themed
- [x] Component consistency

## Future Enhancements

### Possible Improvements
1. **System theme**: Follow device theme setting
2. **Custom themes**: User-defined color schemes
3. **Animation**: Smooth transition between themes
4. **More colors**: Additional color variants
5. **Accessibility**: High contrast mode

### Implementation Notes
- Theme context menggunakan React Context API
- Colors disimpan sebagai hex values untuk konsistensi
- AsyncStorage untuk persistence tanpa database
- Memoization untuk performance optimization
- Error handling untuk AsyncStorage operations 