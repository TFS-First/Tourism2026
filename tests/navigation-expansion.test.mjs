import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import { createRequire } from 'node:module';
import { loadLessons,assembleSource,read } from '../scripts/project.mjs';
const require=createRequire(import.meta.url);
const babel=require('../tools/vendor/babel-standalone-7.26.9.cjs');
function sandbox(lessons){
 const context={window:{location:{hash:'#grammar'}},localStorage:{getItem:()=>null},document:{getElementById:()=>null}};
 context.React={useState:value=>[typeof value==='function'?value():value,()=>{}],useEffect:()=>{},useLayoutEffect:()=>{},useMemo:fn=>fn(),useRef:()=>({current:null}),Component:class{},createElement:(type,props,...children)=>({type,props:{...props,children}})};
 context.ReactDOM={createRoot:()=>({render:()=>{}})};vm.createContext(context);vm.runInContext(babel.transform(assembleSource(lessons),{presets:['react']}).code,context);return context;
}
function find(node,predicate){if(!node||typeof node!=='object')return null;if(predicate(node))return node;for(const child of (node.props?.children||[]).flat(Infinity)){const result=find(child,predicate);if(result)return result;}return null;}
test('all four content catalogs render with the current lesson registry',()=>{
 const context=sandbox(loadLessons());
 for(const tab of ['learn','vocab','grammar','exercises']){context.window.location.hash='#'+tab;const app=vm.runInContext('MainApp()',context);const drawer=find(app,n=>n.type?.name==='ContentDrawer');assert(drawer,tab);assert(drawer.props.groups.length>=3);assert(drawer.props.groups.every(g=>g.label&&Array.isArray(g.children)));}
});
test('forty lessons render through the same exercise template and content drawer',()=>{
 const lessons=structuredClone(loadLessons());
 for(let i=4;i<=40;i++){
  const lesson=structuredClone(lessons[0]);lesson.id='lesson'+i;lesson.number=i;lesson.titleAr='الدرس '+i;lesson.titleEn='Lesson '+i;
  lesson.grammar={id:lesson.id,titleAr:lesson.titleAr,titleEn:lesson.titleEn,rules:[],badges:[]};lesson.vocabulary={lesson:lesson.titleAr,lessonEn:lesson.titleEn,words:[]};lesson.typingQuestions=[{...lesson.typingQuestions[0],id:100+i,lesson:lesson.titleAr,lessonEn:lesson.titleEn}];lesson.quizQuestions=[];lesson.exercises=lesson.exercises.slice(0,1);lessons.push(lesson);
 }
 const context=sandbox(lessons);
 for(const tab of ['vocab','grammar','exercises']){context.window.location.hash='#'+tab;const drawer=find(vm.runInContext('MainApp()',context),n=>n.type?.name==='ContentDrawer');assert(drawer.props.groups.length>=40,tab);}
 const exercise=vm.runInContext("ExercisesSection({activeExTab:'lesson40',setActiveExTab:()=>{}})",context);
 assert(find(exercise,n=>n.props?.['data-nav-target']==='exercise-lesson40-0'));
 const typing=vm.runInContext('TypingExercise()',context);assert(find(typing,n=>n.type==='select'&&n.props.id==='typing-lesson-select'),'Large typing catalogs use the existing compact selector instead of dozens of pills.');
});
test('existing exercise headers still match the source text and use one renderer',()=>{
 const text=read('src/sections/ExercisesSection.jsx');assert(!/activeExTab === ['"]lesson[123]['"]/.test(text));
 for(const lesson of loadLessons()){assert(lesson.exercisePresentation.titleEn);assert(lesson.exercisePresentation.titleAr);assert(lesson.exercisePresentation.description);assert(['reading','drawing'].includes(lesson.exercisePresentation.kind));}
});
