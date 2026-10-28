import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import { getDatasets,loadLessons,validateLessons,assembleSource,json,sha256,read } from '../scripts/project.mjs';
const original=json('tests/fixtures/refactor-baseline.json');
test('the original three lessons and shared content retain every field and Unicode character',()=>{
 const lessons=loadLessons().filter(l=>['lesson1','lesson2','lesson3'].includes(l.id));
 for(const [name,value] of Object.entries(getDatasets(lessons))) assert.equal(sha256(value),original.datasets[name].sha256,name+' differs from the approved content.');
});
test('hieroglyph parser and Arabic/Latin search direction retain their behavior',()=>{
 const context={};vm.createContext(context);vm.runInContext(read('src/lib/hieroglyphs.js')+'\n'+read('src/lib/search.js'),context);
 assert.equal(vm.runInContext("searchTextDirection('نهر')",context),'rtl');assert.equal(vm.runInContext("searchTextDirection('sdm')",context),'ltr');assert.equal(vm.runInContext("searchTextDirection('')",context),'rtl');
 const parsed=JSON.parse(vm.runInContext("JSON.stringify(parseHieroglyphWord('𓅓*𓋴*𓎛*𓆊'))",context));assert.equal(parsed.type,'row');assert.equal(parsed.items.length,4);
 const stacked=JSON.parse(vm.runInContext("JSON.stringify(parseHieroglyphWord('(𓈘:𓈘:𓈘)'))",context));assert.equal(stacked.type,'stack');assert.equal(stacked.items.length,3);
});
test('adding forty lessons aggregates data without changing shared renderers or writing into source files',()=>{
 const lessons=structuredClone(loadLessons());
 for(let n=4;n<=40;n++){const original=structuredClone(lessons[0]);const id='lesson'+n;original.id=id;original.number=n;original.titleAr='الدرس '+n;original.titleEn='Lesson '+n;original.grammar={id,titleAr:original.titleAr,titleEn:original.titleEn,rules:[],badges:[]};original.vocabulary={lesson:original.titleAr,lessonEn:original.titleEn,words:[]};original.exercises=[];original.typingQuestions=[];original.quizQuestions=[];lessons.push(original);}
 const datasets=getDatasets(lessons);assert.equal(datasets.grammarData.length,40);assert.equal(datasets.vocabularyData.length,40);assert.equal(Object.keys(datasets.exercisesData).length,40);assert.match(assembleSource(lessons),/lesson40/);
});

test('invalid lesson identities, links and unsupported exercise kinds are rejected before publication',()=>{
 const duplicateNumber=structuredClone(loadLessons());duplicateNumber[1].number=duplicateNumber[0].number;assert.throws(()=>validateLessons(duplicateNumber),/lesson number/);
 const missingAnchor=structuredClone(loadLessons());missingAnchor[0].grammar.badges[0].id='missing-rule';assert.throws(()=>validateLessons(missingAnchor),/missing rule/);
 const invalidKind=structuredClone(loadLessons());invalidKind[0].exercisePresentation.kind='unknown';assert.throws(()=>validateLessons(invalidKind),/Unsupported exercise kind/);
 const duplicateQuestion=structuredClone(loadLessons());duplicateQuestion[1].typingQuestions[0].id=String(duplicateQuestion[0].typingQuestions[0].id);assert.throws(()=>validateLessons(duplicateQuestion),/typing question ID/);
});
