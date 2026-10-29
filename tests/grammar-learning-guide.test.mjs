import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {json,read} from '../scripts/project.mjs';
const lesson=json('src/lessons/lesson-03.json');
test('lesson three distinguishes voice, past translation and the separate passive using Gardiner references',()=>{
 const guide=lesson.grammar.learningGuide;
 assert.equal(guide.steps.length,4);
 assert.equal(guide.steps[1].pairs[1].trans,'sḏm.n.tw sḫr pn');
 assert.equal(guide.steps[2].pairs[0].trans,'sḏm.n=f');
 assert.equal(guide.steps[3].pairs[1].trans,'sḏm.n.tw ḫrw');
 assert.match(guide.intro,/ليست اقتباسات/);
 const passive=lesson.grammar.rules[1].points[1].subPoints[2];
 assert.equal(passive.examples[0].trans,'sḏm=f (passive)');
 assert.equal(passive.examples[0].h,'𓋴*𓄔*𓅓*𓆑');
 assert.doesNotMatch(lesson.grammar.rules[2].titleAr,/الماضي التام/);
});
test('reviewed grammatical examples keep tall birds beside each other and isolate suffix groups',()=>{
 const context=vm.createContext({});vm.runInContext(read('src/lib/hieroglyphs.js')+';globalThis.parse=parseHieroglyphWord',context);
 const past=lesson.grammar.rules[2].points[0].subPoints[0].examples[0].h;
 const node=context.parse(past);assert.equal(node.type,'row');assert.equal(node.items[2].text,'𓅓');
 assert.equal(node.items[3].type,'stack');assert.deepEqual(Array.from(node.items[3].items,x=>x.text),['𓈖','𓆑']);
 const see=context.parse(lesson.grammar.rules[0].points[0].subPoints[0].examples[1].h);
 assert.equal(see.items[1].text,'𓄿');assert.equal(see.items[2].text,'𓄿');
});
