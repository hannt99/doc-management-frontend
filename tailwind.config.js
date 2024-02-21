// JSDoc comments =>
/**
 * @type {import('tailwindcss').Config}
 */
// => Specify the type of the exported configuration object.
// It's indicating that the exported object should conform to the type defined in the tailwindcss module's Config type.
// This helps editors and tools (that support TypeScript or type checking via JSDoc comments) understand the expected structure of the exported configuration.
module.exports = {
    mode: 'jit',
    content: ['./src/**/*.{js,jsx,ts,tsx}'],
    theme: {
        extend: {
            boxShadow: {
                right: '2px 0 2px 0 rgba(0, 0, 0, 0.3)',
                '4Way': '0 3px 10px rgba(0, 0, 0, 0.2)',
            },
            transitionProperty: {
                height: 'max-height',
                width: 'width',
            },
            keyframes: {
                fadeIn: {
                    '0%': {
                        opacity: 0,
                        transform: 'translateY(-140px)',
                    },

                    '100%': {
                        opacity: 1,
                        transform: 'translateY(0)',
                    },
                },
            },
            animation: {
                fadeIn: 'fadeIn 0.5s ease',
            },
        },
    },
    plugins: [],
};
