// Test script for seo-engine.ts
import { generatePageConfig, slugToSeed } from './lib/seo-engine.js';

// Test 1: Test slugToSeed function
console.log('Test 1: Testing slugToSeed function');
const slug1 = 'test-slug';
const seed1 = slugToSeed(slug1);
const seed2 = slugToSeed(slug1);
console.log(`Seed for "${slug1}": ${seed1}`);
console.log(`Seed consistency: ${seed1 === seed2 ? 'PASS' : 'FAIL'}`);

const slug2 = 'another-slug';
const seed3 = slugToSeed(slug2);
console.log(`Seed for "${slug2}": ${seed3}`);
console.log(`Seed uniqueness: ${seed1 !== seed3 ? 'PASS' : 'FAIL'}`);

// Test 2: Test generatePageConfig function
console.log('\nTest 2: Testing generatePageConfig function');
const config1 = generatePageConfig(slug1);
const config2 = generatePageConfig(slug1);
console.log(`Config for "${slug1}":`, config1);
console.log(`Config consistency: ${JSON.stringify(config1) === JSON.stringify(config2) ? 'PASS' : 'FAIL'}`);

const config3 = generatePageConfig(slug2);
console.log(`Config for "${slug2}":`, config3);
console.log(`Config uniqueness: ${JSON.stringify(config1) !== JSON.stringify(config3) ? 'PASS' : 'FAIL'}`);

// Test 3: Test multiple slugs
console.log('\nTest 3: Testing multiple slugs');
const testSlugs = [
  'convert-curl-to-axios',
  'javascript-array-methods',
  'react-hooks-guide',
  'nodejs-best-practices',
  'css-grid-layout'
];

testSlugs.forEach(slug => {
  const config = generatePageConfig(slug);
  console.log(`\nSlug: "${slug}"`);
  console.log(`Seed: ${config.seed}`);
  console.log(`Layout: ${config.layout.hero}-${config.layout.pain}-${config.layout.solution}`);
  console.log(`Theme: ${config.theme}`);
  console.log(`Code Example: ${config.showCodeExample}`);
  console.log(`Case Study: ${config.showCaseStudy}`);
});

console.log('\nAll tests completed!');
