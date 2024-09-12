/** @type {import('next').NextConfig} */
const nextConfig = {
    async redirects() {
        return [
            {
                source: "/",
                destination: "/pilih-gender",
                permanent: false,
            }
        ]
    }
};

export default nextConfig;
