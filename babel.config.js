// babel.config.js
module.exports = {
  presets: ['babel-preset-expo'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./'],
        alias: {
          // “react-native-maps” → your web stub
          'react-native-maps': './shims/react-native-maps-web.js',
          // codegenNativeCommands → its stub
          'react-native/Libraries/Utilities/codegenNativeCommands':
            './shims/codegenNativeCommands.js',
        },
      },
    ],
  ],
};
