/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  redirects: async () => {
    return [
      {
        source: '/settings',
        destination: '/settings/team',
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
