/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // 한방 그린 색상 팔레트
        primary: {
          50: '#E8F5F0',
          100: '#D1EBE1',
          200: '#A3D7C3',
          300: '#75C3A5',
          400: '#47AF87',
          500: '#2D8F6F', // 기본 한방 그린
          600: '#247259',
          700: '#1B5543',
          800: '#12382D',
          900: '#091B16',
        },
        // 보조색 - 따뜻한 브라운
        secondary: {
          50: '#FAF5F0',
          100: '#F5EBE1',
          200: '#EBD7C3',
          300: '#E1C3A5',
          400: '#D7AF87',
          500: '#8B7355',
          600: '#6F5C44',
          700: '#534533',
          800: '#372E22',
          900: '#1B1711',
        },
        // 시맨틱 색상
        success: {
          light: '#E8F5E9',
          DEFAULT: '#4CAF50',
          dark: '#388E3C',
        },
        warning: {
          light: '#FFF8E1',
          DEFAULT: '#FF9800',
          dark: '#F57C00',
        },
        error: {
          light: '#FFEBEE',
          DEFAULT: '#F44336',
          dark: '#D32F2F',
        },
        info: {
          light: '#E3F2FD',
          DEFAULT: '#2196F3',
          dark: '#1976D2',
        },
        // 중성 색상
        neutral: {
          50: '#FAFAFA',
          100: '#F5F5F5',
          200: '#EEEEEE',
          300: '#E0E0E0',
          400: '#BDBDBD',
          500: '#9E9E9E',
          600: '#757575',
          700: '#616161',
          800: '#424242',
          900: '#212121',
        },
      },
      fontFamily: {
        sans: [
          'Pretendard',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'Arial',
          'sans-serif',
        ],
      },
      fontSize: {
        // 본문
        'body-sm': ['14px', { lineHeight: '1.5', letterSpacing: '-0.01em' }],
        'body-md': ['16px', { lineHeight: '1.6', letterSpacing: '-0.01em' }],
        'body-lg': ['18px', { lineHeight: '1.6', letterSpacing: '-0.01em' }],
        // 제목
        'heading-sm': ['20px', { lineHeight: '1.4', letterSpacing: '-0.02em', fontWeight: '600' }],
        'heading-md': ['24px', { lineHeight: '1.3', letterSpacing: '-0.02em', fontWeight: '600' }],
        'heading-lg': ['32px', { lineHeight: '1.2', letterSpacing: '-0.02em', fontWeight: '700' }],
        'heading-xl': ['40px', { lineHeight: '1.1', letterSpacing: '-0.03em', fontWeight: '700' }],
      },
      spacing: {
        18: '4.5rem',
        88: '22rem',
        128: '32rem',
      },
      borderRadius: {
        sm: '4px',
        DEFAULT: '8px',
        md: '12px',
        lg: '16px',
        xl: '24px',
      },
      boxShadow: {
        sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
        DEFAULT: '0 2px 8px rgba(0, 0, 0, 0.08)',
        md: '0 4px 16px rgba(0, 0, 0, 0.1)',
        lg: '0 8px 24px rgba(0, 0, 0, 0.12)',
        xl: '0 12px 32px rgba(0, 0, 0, 0.16)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};
