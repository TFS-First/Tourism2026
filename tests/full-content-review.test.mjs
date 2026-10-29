import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {json,read,loadLessons} from '../scripts/project.mjs';
const alphabet=json('src/data/shared/hieroglyphs.json'),phonograms=json('src/data/shared/phonograms.json');
const glyphs=s=>[...s].filter(c=>c.codePointAt(0)>=0x13000&&c.codePointAt(0)<=0x1342f).join('');
const key=s=>{const m=s.match(/^([A-Za-z]+)(\d+)([A-Za-z]?)$/);assert(m,s);return m[1].toUpperCase()+Number(m[2])+m[3].toUpperCase();};
test('every declared Gardiner code matches its actual Unicode glyph, including alternative forms',()=>{
 const mapping=json('tests/fixtures/gardiner-unicode-map.json').signs;
 for(const item of [...alphabet,...phonograms]){
  assert.equal(glyphs(item.h),item.gardiner.split('+').map(c=>mapping[key(c)]).join(''),item.id||item.trans);
  for(const form of item.forms||[])assert.equal(form.sign,mapping[key(form.gardiner)],form.name);
 }
});
test('the alphabet retains every basic sound group, stable step and both s-signs',()=>{
 assert.equal(alphabet.length,24);assert.deepEqual(alphabet.map(x=>x.step).sort((a,b)=>a-b),Array.from({length:24},(_,i)=>i+1));
 const groups=['3','ỉ','y','ʿ','w','b','p','f','m','n','r','h','ḥ','ḫ','ẖ','s','š','ḳ','k','g','t','ṯ','d','ḏ'];
 assert.deepEqual(alphabet.map(x=>x.trans),groups);
 assert.deepEqual(alphabet.find(x=>x.trans==='s').forms.map(x=>x.sign),['𓊃','𓋴']);
});
test('existing vocabulary, exercises and exam identities remain stable, with the reviewed missing signs restored',()=>{
 const lessons=loadLessons().filter(l=>l.number<=3);assert.equal(lessons.flatMap(l=>l.vocabulary.words).length,69);assert.equal(lessons.flatMap(l=>l.exercises).length,26);assert.equal(lessons.flatMap(l=>l.typingQuestions).length,25);
 assert.equal(json('src/data/shared/comprehensive-quiz.json').length,36);
 assert(lessons[1].vocabulary.words.find(x=>x.trans==='ḥmt').h.includes('𓅓'));
 assert.equal(lessons[2].vocabulary.words.find(x=>x.trans==='ḫ3').h,'𓆼*𓄿*𓉹');
 assert.equal(lessons[2].typingQuestions.find(x=>x.id===24).trans,'ḏ3 sš m ỉtrw');
 assert.equal(lessons[1].typingQuestions.find(x=>x.id===18).trans,'sḏm st tn n sš');
 for(const word of lessons.flatMap(l=>l.vocabulary.words)){assert(word.h&&word.trans&&word.meanAr&&word.meanEn);}
});
test('word signs and compound titles are not incorrectly labelled single quadriliteral phonograms',()=>{
 assert.equal(phonograms.length,38);assert.equal(phonograms.filter(x=>x.type==='word').length,6);
 assert.equal(phonograms.find(x=>x.id==='tri_mAa').trans,'mꜣ');assert.equal(phonograms.find(x=>x.id==='tri_mAa').type,'biliteral');
 assert.equal(phonograms.find(x=>x.id==='tri_smr').trans,'mr');assert.equal(phonograms.find(x=>x.id==='tri_hsb').h,'𓐎');
 assert.equal(phonograms.find(x=>x.id==='quad_xkrw').h,'𓐬');
});
test('all dedicated glyph expressions parse without unconsumed grouping controls',()=>{
 const ctx=vm.createContext({});vm.runInContext(read('src/lib/hieroglyphs.js')+';globalThis.parse=parseHieroglyphWord',ctx);
 let checked=0;
 function walk(x){if(!x||typeof x!=='object')return;for(const [k,v]of Object.entries(x)){
  if(['h','correctH','word','sign','hieroglyph'].includes(k)&&typeof v==='string'){
   checked++;assert(glyphs(v),v);for(const word of v.trim().split(/\s+/)){const inspect=n=>{if(n.type==='sign')assert.doesNotMatch(n.text,/[():*]/,v);n.items?.forEach(inspect);};inspect(ctx.parse(word));}
  }else walk(v);
 }}
 walk(alphabet);walk(phonograms);walk(loadLessons().filter(l=>l.number<=3));walk(json('src/data/shared/comprehensive-quiz.json'));assert.equal(checked,537);
});
