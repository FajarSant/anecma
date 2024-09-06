/** @type {import('next').NextConfig} */
const nextConfig = {
    async redirects() {
        return [
            {
                source: "/",
                destination: "/istri/login",
                permanent: false,
            }
        ]
    }
};

export default nextConfig;
