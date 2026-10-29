import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {createRequire} from 'node:module';
import {json,read,loadLessons,getDatasets,assembleSource} from '../scripts/project.mjs';
const lesson=json('src/lessons/lesson-04.json'),summaries=json('src/data/shared/rule-summaries.json');
const require=createRequire(import.meta.url),babel=require('../tools/vendor/babel-standalone-7.26.9.cjs');
test('lesson IV covers §§41–52, all 22 vocabulary entries and all nine IV(b) writing prompts',()=>{
 assert.equal(lesson.grammar.rules.length,12);
 assert.deepEqual(lesson.grammar.rules.flatMap(r=>r.sourceSections),Array.from({length:12},(_,i)=>String(41+i)));
 assert(lesson.vocabulary.words.find(x=>x.trans==='ỉty').h.includes('𓀰'),'A42 king classifier, as reviewed on p446');
 assert.equal(lesson.vocabulary.words.length,22);assert.equal(lesson.exercises.length,24);
 assert.equal(lesson.exercises.filter(x=>x.sourceLabel?.startsWith('IV(a)')).length,7);
 const writing=lesson.exercises.filter(x=>x.correctH);assert.equal(writing.length,9);
 assert.deepEqual(writing.map(x=>x.trans),Array.from({length:9},(_,i)=>`IV(b)${i+1}`));
 assert.equal(lesson.typingQuestions.length,16);assert.equal(lesson.quizQuestions.length,12);
 for(let i=0;i<9;i++){assert.equal(writing[i].answerTrans,lesson.typingQuestions[i].trans);assert.equal(writing[i].correctH,lesson.typingQuestions[i].h);assert.match(writing[i].source,/IV\(b\)/);}
 assert.match(lesson.typingQuestions[2].trans,/^mk ṯn /); // female addressee, maid-servant
 assert.match(lesson.typingQuestions[6].trans,/sḏm=sn st/); // collective subject as noted in source
 const all=getDatasets();assert.equal(all.vocabularyData.length,4);assert.equal(all.typingQuestionsData.length,41);assert.equal(all.comprehensiveQuizData.length,48);
});
test('every current rule has its own bilingual summary and a visible hieroglyphic example',()=>{
 for(const l of loadLessons())for(const r of l.grammar.rules){const s=r.quickSummary || summaries[r.id];assert(s,r.id);assert(s.titleAr&&s.titleEn&&s.explanationAr&&s.explanationEn);assert(s.example?.h&&s.example.trans&&s.example.meanAr&&s.example.meanEn);}
 assert.match(assembleSource(),/const ruleSummaries = \{/);
 const text=read('src/sections/GrammarSection.jsx');assert.equal((text.match(/<GrammarRuleSummary /g)||[]).length,2,'Both standard rules and the classifier grid support a summary.');
});
test('new lesson and summary glyphs parse, and each quiz item has one unambiguous answer',()=>{
 const ctx=vm.createContext({});vm.runInContext(read('src/lib/hieroglyphs.js')+';globalThis.parse=parseHieroglyphWord',ctx);
 let checked=0;const walk=x=>{if(!x||typeof x!=='object')return;for(const[k,v]of Object.entries(x)){if(['h','correctH'].includes(k)&&typeof v==='string'){checked++;assert.match(v,/[\u{13000}-\u{1342f}]/u);for(const word of v.split(/\s+/)){const inspect=n=>{if(n.type==='sign')assert.doesNotMatch(n.text,/[():*]/,v);n.items?.forEach(inspect);};inspect(ctx.parse(word));}}else walk(v);}};
 walk(lesson);walk(summaries);assert(checked>100);
 for(const q of lesson.quizQuestions)assert.equal(q.options.filter(o=>o.isCorrect).length,1,q.id);
});
test('the shared exercise renderer presents both reading practice and writing tasks in lesson IV',()=>{
 const ctx=vm.createContext({useState:()=>[{},()=>{}],lessonRegistry:[lesson],exercisesData:{lesson4:lesson.exercises},exerciseNavigation:()=>[{id:'lesson4',label:'الدرس الرابع'}],Icon:()=>null,DrawingPad:()=>null,HieroglyphBlock:()=>null,VocabularyGlyph:()=>null,React:{createElement:(type,props,...children)=>({type,props:{...props,children}})}});
 vm.runInContext(babel.transform(read('src/sections/ExercisesSection.jsx'),{presets:['react']}).code+';globalThis.render=ExercisesSection',ctx);
 const tree=ctx.render({activeExTab:'lesson4',setActiveExTab:()=>{}});let cards=0,drawings=0;
 function walk(n){if(!n||typeof n!=='object')return;if(n.props?.['data-nav-target']?.startsWith('exercise-lesson4-'))cards++;if(n.type===ctx.DrawingPad)drawings++;for(const c of(n.props?.children||[]).flat(Infinity))walk(c);}
 walk(tree);assert.equal(cards,24);assert.equal(drawings,9);
});
