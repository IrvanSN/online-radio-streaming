/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./views/**/*.{html,js,ejs}"],
    theme: {
        extend: {
            colors: {
                "sea-blue": "#00A9FF",
                "reid-peach": "#FE5068",
                "yellow-strip": "#FFB703",
            },
        },
    },
    plugins: ["prettier-plugin-tailwindcss"],
};
