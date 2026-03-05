/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                orbit: {
                    cyan: "#00f3ff",
                    blue: "#0ea5e9",
                    dark: "#050508",
                    glass: "rgba(15, 17, 26, 0.4)",
                    "glass-hover": "rgba(20, 24, 38, 0.6)",
                }
            },
            backgroundImage: {
                'glass-gradient': 'linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))',
            },
            boxShadow: {
                'neon-cyan': '0 0 15px rgba(0, 243, 255, 0.4)',
                'neon-blue': '0 0 15px rgba(14, 165, 233, 0.4)',
            },
            backdropBlur: {
                'glass': '20px',
            }
        },
    },
    plugins: [],
}
