/** @type {import('next').NextConfig} */
// const withBundleAnalyzer = require("@next/bundle-analyzer")({
// 	enabled: process.env.ANALYZE === "true",
// });
const nextConfig = {
	reactStrictMode: true,
	images: {
		domains: [
			"picsum.photos",
			"avatars.dicebear.com",
			"api.dicebear.com",
			"images.unsplash.com",
			"images.pexels.com",
			"scontent.fmnl17-2.fna.fbcdn.net",
			"i.pravatar.cc",
		],
	},
};

// module.exports = withBundleAnalyzer(nextConfig);
module.exports = nextConfig;
