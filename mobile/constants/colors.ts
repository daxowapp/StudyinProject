// Color constants for light and dark themes

export const lightTheme = {
    // Backgrounds
    background: '#F9FAFB',
    backgroundSecondary: '#F3F4F6',
    card: '#FFFFFF',
    cardHover: '#F9FAFB',

    // Text
    text: '#1F2937',
    textSecondary: '#6B7280',
    textMuted: '#9CA3AF',
    textInverse: '#FFFFFF',

    // Primary colors
    primary: '#C62828',
    primaryLight: '#EF5350',
    primaryDark: '#991B1B',

    // Secondary colors
    secondary: '#1E3A8A',
    secondaryLight: '#3B82F6',

    // Status colors
    success: '#059669',
    successBg: '#D1FAE5',
    warning: '#D97706',
    warningBg: '#FEF3C7',
    error: '#DC2626',
    errorBg: '#FEE2E2',
    info: '#0284C7',
    infoBg: '#E0F2FE',

    // Borders
    border: '#E5E7EB',
    borderLight: '#F3F4F6',

    // Gradients
    gradientStart: '#991B1B',
    gradientEnd: '#B91C1C',

    // Tab bar
    tabBar: '#FFFFFF',
    tabBarBorder: '#E5E7EB',
    tabBarActive: '#C62828',
    tabBarInactive: '#9CA3AF',

    // Input
    inputBackground: '#FFFFFF',
    inputBorder: '#D1D5DB',
    inputPlaceholder: '#9CA3AF',

    // Overlay
    overlay: 'rgba(0, 0, 0, 0.5)',

    // Shadow
    shadow: '#000000',
};

export const darkTheme = {
    // Backgrounds
    background: '#111827',
    backgroundSecondary: '#1F2937',
    card: '#1F2937',
    cardHover: '#374151',

    // Text
    text: '#F9FAFB',
    textSecondary: '#D1D5DB',
    textMuted: '#9CA3AF',
    textInverse: '#1F2937',

    // Primary colors
    primary: '#EF4444',
    primaryLight: '#F87171',
    primaryDark: '#DC2626',

    // Secondary colors
    secondary: '#3B82F6',
    secondaryLight: '#60A5FA',

    // Status colors
    success: '#10B981',
    successBg: '#064E3B',
    warning: '#F59E0B',
    warningBg: '#78350F',
    error: '#EF4444',
    errorBg: '#7F1D1D',
    info: '#0EA5E9',
    infoBg: '#0C4A6E',

    // Borders
    border: '#374151',
    borderLight: '#4B5563',

    // Gradients
    gradientStart: '#7F1D1D',
    gradientEnd: '#991B1B',

    // Tab bar
    tabBar: '#1F2937',
    tabBarBorder: '#374151',
    tabBarActive: '#EF4444',
    tabBarInactive: '#6B7280',

    // Input
    inputBackground: '#374151',
    inputBorder: '#4B5563',
    inputPlaceholder: '#6B7280',

    // Overlay
    overlay: 'rgba(0, 0, 0, 0.7)',

    // Shadow
    shadow: '#000000',
};

export type Theme = typeof lightTheme;
