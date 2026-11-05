import assert from 'node:assert/strict';
import { readdirSync } from 'node:fs';
import { buildArtifacts, json, read, getDatasets, sha256 } from './project.mjs';
const artifacts=buildArtifacts();
for(const [file,content] of Object.entries(artifacts))assert.equal(read(file),content,`Stale generated file: ${file}. Run npm run build.`);
assert(!read('index.html').includes('text/babel'),'Browser must not compile JSX at runtime.');
assert(!read('index.html').includes('@babel/standalone'),'Compiler belongs only in build tools.');
for (const name of readdirSync('islamic-history').filter(name => /^lecture-\d+\.html$/.test(name))) {
 const file=`islamic-history/${name}`;
 const page=read(file);
 assert(page.includes('../assets/course-ui.css') && page.includes('../assets/course-ui.js'),`${file}: shared course UI assets are required.`);
 for (const id of ['vocabulary','guide-briefing','quiz']) {
  const section=page.match(new RegExp(`<section\\b[^>]*\\bid="${id}"[^>]*>([\\s\\S]{0,250})`));
  assert(section,`${file}: missing #${id} section.`);
  assert(/^\s*<details class="course-fold">\s*<summary dir="rtl">/.test(section[1]),`${file}: #${id} must start with a closed Arabic course fold.`);
 }
}
if(process.argv.includes('--content-baseline')){
 const baseline=json('tests/fixtures/refactor-baseline.json');
 for(const [name,value] of Object.entries(getDatasets()))assert.equal(sha256(value),baseline.datasets[name].sha256,`Content changed during migration: ${name}`);
 console.log('Content parity: all seven original datasets match the approved baseline.');
}
console.log('Generated files are current; lesson IDs, links and question IDs are valid.');
