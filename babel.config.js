module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          root: ['./'],
          alias: {
            '@': './src',
            '@cardiani/types': './lib/types',
            '@cardiani/api-client': './lib/api-client',
          },
        },
      ],
    ],
  };
};