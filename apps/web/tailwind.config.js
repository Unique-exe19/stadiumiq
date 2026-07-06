/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // CSS variable tokens (required for @apply and opacity modifiers)
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        // FIFA Brand palette — light-mode tuned
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          50: 'hsl(220, 100%, 97%)',
          100: 'hsl(220, 95%, 93%)',
          200: 'hsl(220, 90%, 86%)',
          300: 'hsl(220, 85%, 75%)',
          400: 'hsl(220, 80%, 62%)',
          500: 'hsl(220, 75%, 50%)',
          600: 'hsl(220, 80%, 42%)',
          700: 'hsl(220, 85%, 35%)',
          800: 'hsl(220, 90%, 27%)',
          900: 'hsl(220, 95%, 20%)',
          950: 'hsl(220, 100%, 12%)',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          50: 'hsl(45, 100%, 97%)',
          100: 'hsl(45, 100%, 90%)',
          200: 'hsl(45, 100%, 80%)',
          300: 'hsl(45, 100%, 68%)',
          400: 'hsl(45, 95%, 55%)',
          500: 'hsl(38, 90%, 48%)',
          600: 'hsl(32, 88%, 40%)',
          700: 'hsl(26, 85%, 34%)',
          800: 'hsl(22, 80%, 28%)',
          900: 'hsl(18, 75%, 20%)',
        },
        success: {
          DEFAULT: 'hsl(142, 65%, 38%)',
          light: 'hsl(142, 72%, 94%)',
        },
        warning: {
          DEFAULT: 'hsl(38, 90%, 48%)',
          light: 'hsl(38, 92%, 94%)',
        },
        danger: {
          DEFAULT: 'hsl(0, 80%, 55%)',
          light: 'hsl(0, 84%, 96%)',
        },
        crowd: {
          low: 'hsl(142, 65%, 38%)',
          moderate: 'hsl(38, 90%, 48%)',
          high: 'hsl(30, 88%, 50%)',
          critical: 'hsl(0, 80%, 55%)',
        },
        security: {
          green: 'hsl(142, 65%, 38%)',
          amber: 'hsl(38, 90%, 48%)',
          red: 'hsl(0, 80%, 55%)',
          black: 'hsl(0, 0%, 10%)',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Outfit', 'Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      fontSize: {
        'fluid-sm': 'clamp(0.875rem, 1.5vw, 1rem)',
        'fluid-base': 'clamp(1rem, 2vw, 1.125rem)',
        'fluid-lg': 'clamp(1.125rem, 2.5vw, 1.5rem)',
        'fluid-xl': 'clamp(1.5rem, 4vw, 2.25rem)',
        'fluid-2xl': 'clamp(2rem, 6vw, 3.75rem)',
      },
      backgroundImage: {
        // Light premium gradients
        'gradient-hero': 'linear-gradient(160deg, hsl(220,60%,96%) 0%, hsl(220,80%,92%) 40%, hsl(38,90%,93%) 100%)',
        'gradient-stadium': 'linear-gradient(135deg, hsl(220,75%,96%) 0%, hsl(220,60%,90%) 50%, hsl(220,50%,85%) 100%)',
        'gradient-card': 'linear-gradient(135deg, hsl(0,0%,100%) 0%, hsl(220,30%,97%) 100%)',
        'gradient-glow': 'radial-gradient(ellipse at center, hsl(220,75%,50%,0.08) 0%, transparent 70%)',
        'gradient-cta': 'linear-gradient(135deg, hsl(220,75%,45%) 0%, hsl(220,80%,38%) 100%)',
      },
      boxShadow: {
        glow: '0 0 30px hsl(220,75%,50%,0.15)',
        'glow-accent': '0 0 30px hsl(38,90%,48%,0.2)',
        glass: '0 4px 24px rgba(30,60,140,0.08), inset 0 1px 0 rgba(255,255,255,0.9)',
        card: '0 2px 16px rgba(30,60,140,0.08)',
        elevated: '0 12px 40px rgba(30,60,140,0.12)',
        soft: '0 1px 3px rgba(0,0,0,0.06), 0 4px 12px rgba(0,0,0,0.04)',
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'slide-in-right': 'slideInRight 0.3s ease-out',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(24px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 20px hsl(220,75%,50%,0.1)' },
          '50%': { boxShadow: '0 0 40px hsl(220,75%,50%,0.25)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};
