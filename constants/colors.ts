export const Colors = {
    light: {
      primary: '#14B8A6',        // Vibrant Teal
      primaryDark: '#0D9488',
      secondary: '#8B5CF6',      // Purple
      background: '#FAFAFA',     // Soft white
      card: '#FFFFFF',
      text: '#1A1A1A',
      textSecondary: '#6B7280',
      border: '#E5E7EB',
      success: '#10B981',        // Brighter green
      warning: '#F59E0B',        // Amber
      danger: '#EF4444',         // Brighter red
      shadow: 'rgba(0, 0, 0, 0.1)',
    },
    dark: {
      primary: '#14B8A6',        // Vibrant Teal
      primaryDark: '#0D9488',
      secondary: '#A78BFA',      // Light purple
      background: '#0F1419',
      card: '#1A1F2E',
      text: '#FFFFFF',
      textSecondary: '#9CA3AF',
      border: '#2D3748',
      success: '#10B981',
      warning: '#F59E0B',
      danger: '#EF4444',
      shadow: 'rgba(0, 0, 0, 0.3)',
    }
  };
  
  export type Theme = typeof Colors.light;