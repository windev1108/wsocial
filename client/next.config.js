/** @type {import('next').NextConfig} */
const { i18n } = require('./next-i18next.config');

const nextConfig = {
    reactStrictMode: true,
    concurrentFeatures: true,
    images: {
        domains: ['res.cloudinary.com', 'lh3.googleusercontent.com'],
    },
    i18n,
};

module.exports = nextConfig;