/** @type {import('tailwindcss').Config} */

// Helper to create color with opacity support
function withOpacity(variableName) {
  return ({ opacityValue }) => {
    if (opacityValue !== undefined) {
      return `rgba(var(${variableName}), ${opacityValue})`;
    }
    return `rgb(var(${variableName}))`;
  };
}

export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Warm stone + amber palette - using RGB for opacity support
        background: {
          DEFAULT: withOpacity('--color-background'),
          secondary: withOpacity('--color-background-secondary'),
        },
        foreground: {
          DEFAULT: withOpacity('--color-foreground'),
          secondary: withOpacity('--color-foreground-secondary'),
        },
        border: withOpacity('--color-border'),
        accent: {
          DEFAULT: withOpacity('--color-accent'),
          hover: withOpacity('--color-accent-hover'),
        },
      },
      fontFamily: {
        display: ['Sora Variable', 'system-ui', 'sans-serif'],
        sans: ['Plus Jakarta Sans Variable', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};
