#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const version = process.argv[2];

if (!version) {
  console.error('Usage: node update-version.js <version>');
  process.exit(1);
}

console.log(`Updating version to ${version}`);

// Update main package.json
const mainPkgPath = path.join(__dirname, '..', 'package.json');
const mainPkg = JSON.parse(fs.readFileSync(mainPkgPath, 'utf8'));
mainPkg.version = version;
fs.writeFileSync(mainPkgPath, JSON.stringify(mainPkg, null, 2) + '\n');
console.log(`Updated ${mainPkgPath}`);

console.log('Version update complete');
