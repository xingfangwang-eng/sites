import path from 'path';

const config = {
  plugins: {
    "@tailwindcss/postcss": {
      config: path.resolve('./tailwind.config.js')
    },
  },
};

export default config;
