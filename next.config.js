/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	images: {
		domains: [
			"picsum.photos",
			"avatars.dicebear.com",
			"images.unsplash.com",
			"images.pexels.com",
		],
	},
};

module.exports = nextConfig;
