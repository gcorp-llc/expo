const fs = require('fs');
const path = require('path');

try {
  const routerPath = path.resolve(__dirname, '..', 'node_modules', 'expo-router', 'build', 'global-state');
  if (fs.existsSync(routerPath)) {
    fs.writeFileSync(
      path.join(routerPath, 'router-store.d.ts'),
      'export declare const store: any;\n'
    );
    fs.writeFileSync(
      path.join(routerPath, 'router-store.js'),
      '"use strict";\nObject.defineProperty(exports, "__esModule", { value: true });\nexports.store = null;\n'
    );
    console.log('Successfully applied expo-router patch.');
  }
} catch (err) {
  console.warn('Could not apply expo-router patch:', err.message);
}
