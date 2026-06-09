const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

const gestureHandlerPath = path.resolve(
  __dirname,
  'node_modules/react-native-gesture-handler'
);

config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName === 'react-native-gesture-handler') {
    return {
      filePath: path.join(gestureHandlerPath, 'lib/commonjs/index.js'),
      type: 'sourceFile',
    };
  }
  if (moduleName.startsWith('react-native-gesture-handler/')) {
    const subPath = moduleName.replace('react-native-gesture-handler/', '');
    return {
      filePath: path.join(gestureHandlerPath, 'lib/commonjs', subPath + '.js'),
      type: 'sourceFile',
    };
  }
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
