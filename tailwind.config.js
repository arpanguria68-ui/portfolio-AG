/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: "class",
    theme: {
        extend: {
            colors: {
                primary: "#D4FF3F", // Updated Vibrant Lime Green
                "background-light": "#F9FAFB",
                "background-dark": "#0A0A0A",
                "card-dark": "#161616",
                "surface": "#1E1E1E",
                "charcoal": "#121212",
                "border-dark": "#262626",
            },
            fontFamily: {
                display: ["Space Grotesk", "sans-serif"], // Updated to Space Grotesk
                body: ["Inter", "sans-serif"],
                sans: ["Inter", "sans-serif"],
            },
            borderRadius: {
                DEFAULT: "12px",
                "large": "2rem", // Keep existing large
                "2xl": "24px",
                "3xl": "32px",
            },
            backgroundImage: {
                'smoke-pattern': "radial-gradient(circle at 50% 50%, rgba(212, 255, 63, 0.03) 0%, rgba(10,10,10,1) 70%), url('https://lh3.googleusercontent.com/aida-public/AB6AXuCe-di7JaX6QjGFUZJsC1o8RJMFt3-acokcAbrBwRau_8SYswJQVJI4lJUUwiI11628QJ1PR5hm5Qd4R6yMg56DzLQqmbz6W6PDsWnzVfLQjMCowejo_BYvGTtqDxjYdvYyzBFKs4nxBj7IaUfIOOAXT9cN15mitTT9aJnUPu3NcCyzujb7CD6xg8CiwmbQ-Dv1YVsEIndOWAcej7FndYJtnU9_PjpIF-Gpuro5SAlFeexYeMPPQ1YBoyPLkrZy5nhONrQCQw9jaKSF')",
            }
        },
    },
    plugins: [],
}
