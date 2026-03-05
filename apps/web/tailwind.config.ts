import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'bg-base': '#0c0e14',
        'bg-raised': '#131620',
        'bg-card': '#1a1e2d',
        'bg-card-alt': '#1f2335',
        orange: {
          DEFAULT: '#ff6a00',
          alt: '#fe7a20',
          light: '#ffab5e',
          dark: '#cc4e00',
        },
        'text-primary': '#ffffff',
        'text-secondary': '#9aa0b8',
        'text-muted': '#5e6480',
        success: '#2ecc71',
        error: '#e74c3c',
        info: '#3498db',
        warning: '#f39c12',
      },
      fontFamily: {
        sans: ['Montserrat', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
      borderRadius: {
        sm: '6px',
        DEFAULT: '8px',
        md: '10px',
        lg: '16px',
        xl: '24px',
        '2xl': '32px',
      },
      boxShadow: {
        card: '0 2px 24px rgba(0,0,0,0.45)',
        orange: '0 4px 24px rgba(255,106,0,0.35)',
        float: '0 16px 48px rgba(0,0,0,0.60)',
      },
      backgroundImage: {
        'gradient-orange': 'linear-gradient(135deg, #ff6a00 0%, #fe7a20 100%)',
        'gradient-hero':
          'radial-gradient(ellipse 80% 60% at 70% 40%, rgba(255,106,0,0.12) 0%, transparent 65%)',
      },
      animation: {
        ticker: 'ticker 35s linear infinite',
        'fade-in-up': 'fadeInUp 0.6s ease-out both',
        'fade-in': 'fadeIn 0.4s ease-out forwards',
        'toast-in': 'toastIn 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'toast-out': 'toastOut 0.25s ease-in forwards',
        'scale-in': 'scaleIn 0.3s ease-out forwards',
        'slide-up': 'slideUp 0.4s ease-out forwards',
      },
      keyframes: {
        ticker: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        fadeInUp: {
          from: { opacity: '0', transform: 'translateY(24px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        toastIn: {
          from: { opacity: '0', transform: 'translateX(110%) scale(0.95)' },
          to: { opacity: '1', transform: 'translateX(0) scale(1)' },
        },
        toastOut: {
          from: { opacity: '1', transform: 'translateX(0) scale(1)' },
          to: { opacity: '0', transform: 'translateX(110%) scale(0.95)' },
        },
        scaleIn: {
          from: { opacity: '0', transform: 'scale(0.9)' },
          to: { opacity: '1', transform: 'scale(1)' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(16px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}

export default config
