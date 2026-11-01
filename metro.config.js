const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const projectRoot = __dirname;
const monorepoRoot = path.resolve(projectRoot, '.');

const config = getDefaultConfig(projectRoot);

// Ensure Metro watches shared workspace packages
config.watchFolders = [
  path.resolve(__dirname, 'packages/shared'),
  path.resolve(__dirname, 'packages/i18n'),
  path.resolve(__dirname, 'lib'),
];

// Let Metro know where to look for dependencies
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
];

// Optimize worker usage
config.maxWorkers = 2;

module.exports = config;
