import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {createRequire} from 'node:module';
import {json,read,loadLessons} from '../scripts/project.mjs';
const lesson=json('src/lessons/lesson-03.json');
const require=createRequire(import.meta.url);
const babel=require('../tools/vendor/babel-standalone-7.26.9.cjs');
test('the easy explanations and their glyphs live under the matching grammar rule',()=>{
 assert.equal(lesson.grammar.learningGuide,undefined);
 const [suffix,voice,past]=lesson.grammar.rules.map(rule=>rule.learningGuide);
 assert.equal(suffix.steps[0].pairs[1].trans,'sḏm=f');
 assert.equal(voice.steps[0].pairs[1].trans,'sḏm.tw sḫr pn');
 assert.equal(voice.steps[1].pairs[1].trans,'ḏd.tw sḫr pn');
 assert.equal(past.steps[0].pairs[1].trans,'sḏm.n.tw sḫr pn');
 assert.equal(past.steps[2].pairs[0].trans,'sḏm.n=f');
 assert.equal(past.steps[3].pairs[0].trans,'sḏm.n.tw ḫrw');
 for(const guide of [suffix,voice,past])for(const step of guide.steps)for(const pair of step.pairs){assert(pair.h,'Every beginner example needs visible glyphs');assert.match(pair.h,/[\u{13000}-\u{1342f}]/u);}
 assert.match(voice.intro,/ليست اقتباسات/);
 const passive=lesson.grammar.rules[1].points[1].subPoints[2];
 assert.equal(passive.examples[0].trans,'sḏm=f (passive)');
 assert.equal(passive.examples[0].h,'𓋴*𓄔*𓅓*𓆑');
 assert.doesNotMatch(lesson.grammar.rules[2].titleAr,/الماضي التام/);
});
test('the grammar view nests each learning guide inside its owning rule anchor',()=>{
 const guide=()=>null;
 const context=vm.createContext({grammarData:[lesson.grammar],GrammarLearningGuide:guide,IllustrativeExamplesBlock:()=>null,HieroglyphBlock:()=>null,Icon:()=>null,React:{createElement:(type,props,...children)=>({type,props:{...props,children}})}});
 vm.runInContext(babel.transform(read('src/sections/GrammarSection.jsx'),{presets:['react']}).code+';globalThis.render=GrammarSection',context);
 const tree=context.render({selectedLessonTab:'lesson3',setSelectedLessonTab:()=>{},expandedLessons:{lesson3:true},setExpandedLessons:()=>{}});
 const placements=[];
 function walk(node,anchor){if(!node||typeof node!=='object')return;anchor=node.props?.id?.startsWith('rule-')?node.props.id:anchor;if(node.type===guide)placements.push(anchor);for(const child of (node.props?.children||[]).flat(Infinity))walk(child,anchor);}
 walk(tree,null);assert.deepEqual(placements,['rule-3-1','rule-3-2','rule-3-3']);
});
test('the glyph review counts each changed source location and preserves permitted stacks',()=>{
 const review=json('tests/fixtures/grammar-glyph-review.json');
 assert.equal(review.reviewedEntries,207);
 const changed=review.audit.filter(row=>row.before!==row.after);assert.equal(changed.length,review.correctedEntries);assert.equal(changed.length,22);
 assert.equal(new Set(review.audit.map(row=>row.lessonId+':'+row.path.join('.'))).size,207);
 for(const row of changed){assert(row.references.length);const l=loadLessons().find(l=>l.id===row.lessonId);assert.equal(row.path.reduce((x,k)=>x[k],l),row.after);}
 const context=vm.createContext({});vm.runInContext(read('src/lib/hieroglyphs.js')+';globalThis.parse=parseHieroglyphWord',context);
 assert.equal(context.parse('𓂋:𓈖').type,'stack');assert.equal(context.parse('(𓈘:𓈘:𓈘)').items.length,3);
 for(const l of loadLessons()){
  function check(x){if(!x||typeof x!=='object')return;for(const [k,v]of Object.entries(x)){if(k==='h'){for(const word of v.trim().split(/\s+/)){function inspect(n){if(n.type==='sign')assert.doesNotMatch(n.text,/[():*]/,'Malformed glyph expression '+v);n.items?.forEach(inspect);}inspect(context.parse(word));}}else check(v);}}
  check(l.grammar);
 }
});
test('reviewed grammatical examples keep tall birds beside each other and isolate suffix groups',()=>{
 const context=vm.createContext({});vm.runInContext(read('src/lib/hieroglyphs.js')+';globalThis.parse=parseHieroglyphWord',context);
 const past=lesson.grammar.rules[2].points[0].subPoints[0].examples[0].h;
 const node=context.parse(past);assert.equal(node.type,'row');assert.equal(node.items[2].text,'𓅓');
 assert.equal(node.items[3].type,'stack');assert.deepEqual(Array.from(node.items[3].items,x=>x.text),['𓈖','𓆑']);
 const see=context.parse(lesson.grammar.rules[0].points[0].subPoints[0].examples[1].h);
 assert.equal(see.items[1].text,'𓄿');assert.equal(see.items[2].text,'𓄿');
});
