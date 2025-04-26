const { getDefaultConfig } = require('expo/metro-config');
const defaultConfig = getDefaultConfig(__dirname);

module.exports = {
  ...defaultConfig,
  resolver: {
    ...defaultConfig.resolver,
    sourceExts: [...defaultConfig.resolver.sourceExts, 'mjs'],
    extraNodeModules: {
      'react-native/Libraries/Utilities/codegenNativeCommands': 
        require.resolve('./shims/codegenNativeCommands.js'),
    },
    blockList: [
      /.*\/react-native-maps\/lib\/ios\/.*/,
    ],
  },
};