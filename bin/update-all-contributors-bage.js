#! /usr/bin/env node

// replace inline badge - see https://github.com/all-contributors/all-contributors/issues/361
const fs = require('fs');

const allContributorsConfig = fs.readFileSync('.all-contributorsrc', 'utf-8');
const contributorsAmount = JSON.parse(allContributorsConfig).contributors.length;
const readme = fs.readFileSync('README.md', 'utf-8');
const updatedReadme = readme.replace(/all_contributors-\d+-(.+)\.svg/, `all_contributors-${contributorsAmount}-$1.svg`);
fs.writeFileSync('README.md', updatedReadme, { encoding: 'utf-8' });
