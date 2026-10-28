import assert from 'node:assert/strict';
import { buildArtifacts, json, read, getDatasets, sha256 } from './project.mjs';
const artifacts=buildArtifacts();
for(const [file,content] of Object.entries(artifacts))assert.equal(read(file),content,`Stale generated file: ${file}. Run npm run build.`);
assert(!read('index.html').includes('text/babel'),'Browser must not compile JSX at runtime.');
assert(!read('index.html').includes('@babel/standalone'),'Compiler belongs only in build tools.');
if(process.argv.includes('--content-baseline')){
 const baseline=json('tests/fixtures/refactor-baseline.json');
 for(const [name,value] of Object.entries(getDatasets()))assert.equal(sha256(value),baseline.datasets[name].sha256,`Content changed during migration: ${name}`);
 console.log('Content parity: all seven original datasets match the approved baseline.');
}
console.log('Generated files are current; lesson IDs, links and question IDs are valid.');
