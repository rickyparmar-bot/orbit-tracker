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
                    purple: "#a78bfa",
                    violet: "#818cf8",
                    green: "#34d399",
                    red: "#ef4444",
                    dark: "#050508",
                    glass: "rgba(15, 17, 26, 0.4)",
                    "glass-hover": "rgba(20, 24, 38, 0.6)",
                },
                accent: {
                    primary: "#a78bfa",
                    secondary: "#818cf8",
                    green: "#34d399",
                    red: "#ef4444",
                    yellow: "#facc15",
                },
                text: {
                    primary: "#f8fafc",
                    secondary: "#94a3b8",
                    muted: "#475569",
                }
            },
            backgroundImage: {
                'glass-gradient': 'linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))',
                'grad-primary': 'linear-gradient(135deg, #a78bfa, #818cf8, #e2e8f0)',
                'grad-success': 'linear-gradient(135deg, #34d399, #10b981)',
                'noise-texture': 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\' opacity=\'0.03\'/%3E%3C/svg%3E")',
            },
            boxShadow: {
                'neon-cyan': '0 0 15px rgba(0, 243, 255, 0.4)',
                'neon-blue': '0 0 15px rgba(14, 165, 233, 0.4)',
                'neon-purple': '0 0 15px rgba(167, 139, 250, 0.4)',
                'soft': '0 20px 60px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
                'float': '0 40px 100px rgba(139, 92, 246, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.15)',
                'glow-primary': '0 0 20px rgba(167, 139, 250, 0.4)',
            },
            backdropBlur: {
                'glass': '20px',
            },
            animation: {
                'spin-slow': 'spin 3s linear infinite',
                'float': 'float 6s ease-in-out infinite',
                'sweep': 'sweep 2s infinite linear',
            },
            keyframes: {
                float: {
                    '0%, 100%': { transform: 'translateY(0) scale(1)' },
                    '50%': { transform: 'translateY(50px) scale(1.05)' },
                },
                sweep: {
                    '0%': { transform: 'translateX(-100%)' },
                    '100%': { transform: 'translateX(200%)' },
                }
            }
        },
    },
    plugins: [],
}
