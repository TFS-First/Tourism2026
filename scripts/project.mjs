import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { createRequire } from 'node:module';
export const root = path.resolve(import.meta.dirname, '..');
export const read = file => fs.readFileSync(path.join(root,file),'utf8');
export const json = file => JSON.parse(read(file));
export const canonical = value => JSON.stringify(sort(value));
function sort(value) { return value && typeof value==='object' ? Array.isArray(value) ? value.map(sort) : Object.fromEntries(Object.keys(value).sort().map(key=>[key,sort(value[key])])) : value; }
export const sha256 = value => crypto.createHash('sha256').update(typeof value==='string'?value:canonical(value)).digest('hex');
export function loadLessons() {
  const files=json('src/lessons/registry.json');
  if(!Array.isArray(files)||new Set(files).size!==files.length) throw new Error('Lesson registry must be an array of unique filenames.');
  const lessons=files.map(file=>{if(!/^[a-z0-9-]+\.json$/i.test(file))throw new Error('Invalid lesson filename: '+file);return json('src/lessons/'+file);});
  return validateLessons(lessons);
}
export function validateLessons(lessons) {
  const ids=new Set(),numbers=new Set(),titles=new Set(),ruleIds=new Set(),typingIds=new Set(),quizIds=new Set();
  for(const lesson of lessons){
    if(!Number.isInteger(lesson.number)||lesson.number<1||numbers.has(lesson.number))throw new Error('Missing or duplicate lesson number: '+lesson.number);numbers.add(lesson.number);
    if(!lesson.titleEn||titles.has(lesson.titleEn))throw new Error('Missing or duplicate lesson title: '+lesson.titleEn);titles.add(lesson.titleEn);
    if(lesson.exercisePresentation && !['drawing','reading'].includes(lesson.exercisePresentation.kind))throw new Error('Unsupported exercise kind in '+lesson.id);

    if(!lesson.id || ids.has(lesson.id))throw new Error('Missing or duplicate lesson ID: '+lesson.id);ids.add(lesson.id);
    if(!lesson.grammar || lesson.grammar.id!==lesson.id || !Array.isArray(lesson.grammar.rules)) throw new Error('Invalid grammar data for '+lesson.id);
    if(!Array.isArray(lesson.vocabulary?.words)||!Array.isArray(lesson.exercises)||!Array.isArray(lesson.typingQuestions)||!Array.isArray(lesson.quizQuestions))throw new Error('Missing lesson arrays in '+lesson.id);
    for(const rule of lesson.grammar.rules){if(!rule.id||ruleIds.has(rule.id))throw new Error('Missing or duplicate rule anchor: '+rule.id);ruleIds.add(rule.id);}
    for(const badge of lesson.grammar.badges||[])if(typeof badge==='object' && !lesson.grammar.rules.some(rule=>rule.id===badge.id))throw new Error('Badge points to a missing rule: '+badge.id);
    for(const [rows,seen,kind] of [[lesson.typingQuestions,typingIds,'typing'],[lesson.quizQuestions,quizIds,'quiz']])for(const q of rows){if(q.id==null||seen.has(String(q.id)))throw new Error('Missing or duplicate '+kind+' question ID: '+q.id);seen.add(String(q.id));}
  }
  return lessons;
}
export function getDatasets(lessons=loadLessons()) {
  const sharedQuiz=json('src/data/shared/comprehensive-quiz.json');
  const quiz=[...sharedQuiz,...lessons.flatMap(l=>l.quizQuestions)];
  if(new Set(quiz.map(q=>String(q.id))).size!==quiz.length)throw new Error('Quiz IDs must be unique across shared and lesson questions.');
  return {
    hieroglyphsData:json('src/data/shared/hieroglyphs.json'),
    grammarData:lessons.map(l=>l.grammar),vocabularyData:lessons.map(l=>l.vocabulary),
    exercisesData:Object.fromEntries(lessons.map(l=>[l.id,l.exercises])),
    typingQuestionsData:lessons.flatMap(l=>l.typingQuestions),comprehensiveQuizData:quiz,
    phonogramsData:json('src/data/shared/phonograms.json')
  };
}
export function assembleSource(lessons=loadLessons()) {
  const data=getDatasets(lessons);
  const lessonDataNames=['grammarData','vocabularyData','exercisesData','typingQuestionsData','comprehensiveQuizData'];
  return json('src/build-manifest.json').map(entry=>{
    if(entry.kind==='code')return '// Source: '+entry.path+'\n'+read(entry.path);
    if(entry.kind==='data')return `const ${entry.name} = ${JSON.stringify(data[entry.name])};`;
    if(entry.kind==='lessons')return `const lessonRegistry = ${JSON.stringify(lessons.map(l=>({id:l.id,number:l.number,titleAr:l.titleAr,titleEn:l.titleEn,exercisePresentation:l.exercisePresentation,typingIcon:l.typingIcon})))};\n`+lessonDataNames.map(name=>`const ${name} = ${JSON.stringify(data[name])};`).join('\n');
    throw new Error('Unknown build-manifest entry: '+entry.kind);
  }).join('\n\n');
}
const require=createRequire(import.meta.url);
export function buildArtifacts() {
  const babel=require('../tools/vendor/babel-standalone-7.26.9.cjs');
  if(babel.version!=='7.26.9')throw new Error('Unexpected Babel compiler version.');
  const source=assembleSource();
  const code=babel.transform(source,{presets:['react'],comments:true,filename:'app.jsx'}).code;
  const css=read('src/styles/app.css');
  const html=read('src/index.template.html').replaceAll('__APP_VERSION__',sha256(code).slice(0,12)).replaceAll('__CSS_VERSION__',sha256(css).slice(0,12));
  return {'index.html':html,'assets/app.css':css,'assets/app.js':'// GENERATED by npm run build. Edit src/ files instead.\n'+code+'\n'};
}
