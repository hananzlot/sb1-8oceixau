// webpack.config.js
const createExpoWebpackConfigAsync = require('@expo/webpack-config');
const path = require('path');

module.exports = async function (env, argv) {
  // load the default Expo webpack config
  const config = await createExpoWebpackConfigAsync(env, argv);

  // 1) Alias react-native-maps → our web shim
  // 2) Alias codegenNativeCommands → its shim
  config.resolve.alias = {
    ...(config.resolve.alias || {}),
    'react-native-maps': path.resolve(__dirname, 'shims/react-native-maps-web.js'),
    'react-native/Libraries/Utilities/codegenNativeCommands':
      path.resolve(__dirname, 'shims/codegenNativeCommands.js'),
  };

  // 3) (Optional) Prevent parsing native map files
  config.module.noParse = /node_modules\/react-native-maps\/(src|lib)\//;

  return config;
};
