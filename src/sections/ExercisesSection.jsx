const ExercisesSection = ({ activeExTab, setActiveExTab }) => {
  const [revealedL1, setRevealedL1] = useState({});
  const [revealedL2, setRevealedL2] = useState({});
  const [revealedL3, setRevealedL3] = useState({});

  const toggleRevealL1 = (index) => setRevealedL1(prev => ({ ...prev, [index]: !prev[index] }));
  const toggleRevealL2 = (index) => setRevealedL2(prev => ({ ...prev, [index]: !prev[index] }));
  const toggleRevealL3 = (index) => setRevealedL3(prev => ({ ...prev, [index]: !prev[index] }));

  return (
    <div className="max-w-5xl mx-auto p-2.5 sm:p-4 md:p-6 mt-2 sm:mt-4 space-y-4 sm:space-y-6">
      <label className="lesson-quick-select" htmlFor="exercise-content-select"><Icon name="Award" size={17}/><span>التدريب</span><select id="exercise-content-select" value={activeExTab} onChange={e=>setActiveExTab(e.target.value)}>{exerciseNavigation().map(g=><option key={g.id} value={g.id}>{g.label} — {g.detail}</option>)}</select></label>

      {activeExTab === 'lesson1' && (
        <div data-nav-target="exercise-lesson1" data-content-id="lesson1" className="space-y-4 sm:space-y-6">
          <div className="bg-gradient-to-l from-amber-500/10 via-amber-50 to-white border border-amber-200/80 p-3.5 sm:p-5 rounded-2xl mb-3 sm:mb-4 shadow-xs" dir="ltr">
            <div className="flex items-start gap-2.5 mb-1.5">
              <span className="p-1.5 bg-amber-500 text-white rounded-xl shrink-0 mt-0.5 shadow-xs">
                <Icon name="Edit3" size={16}/>
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                  <h3 className="font-bold text-slate-900 text-sm sm:text-base md:text-lg leading-snug">
                    Lesson I: Hieroglyph Drawing Exercise
                  </h3>
                  <span className="text-xs font-semibold text-amber-800 self-start sm:self-auto bg-amber-100/70 px-2 py-0.5 rounded-md" dir="rtl">
                    تمرين رسم الكلمات
                  </span>
                </div>
                <p className="text-stone-600 text-xs sm:text-sm leading-relaxed mt-1.5">
                  Draw the following hieroglyphic words adhering to balanced quadrat arrangement. Click 'Show Answer' to check your drawing.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-4 md:gap-6">
            {exercisesData.lesson1.map((item, idx) => (
              <div key={idx} data-nav-target={`exercise-lesson1-${idx}`} data-content-id="lesson1" data-content-detail={item.trans} className="bg-white border border-stone-200 rounded-2xl p-4 sm:p-5 md:p-6 shadow-sm flex flex-col justify-between">
                <div className="flex items-center justify-between border-b border-stone-100 pb-3 mb-4" dir="ltr">
                  <div>
                    <span className="text-xl sm:text-2xl font-serif text-amber-700 font-bold block">{item.trans}</span>
                    <span className="text-xs text-stone-500 font-medium">{item.meanEn}</span>
                  </div>
                  <button 
                    onClick={() => toggleRevealL1(idx)} 
                    className="flex items-center gap-1.5 px-3 py-1 bg-amber-50 border border-amber-200 text-amber-800 rounded-xl font-bold text-xs hover:bg-amber-100 transition-colors"
                  >
                    <Icon name="Eye" size={14} /> 
                    <span>{revealedL1[idx] ? 'إخفاء الحل' : 'كشف الحل'}</span>
                  </button>
                </div>
                
                <div className="flex flex-col gap-4 items-center w-full">
                  <div className="w-full"><DrawingPad isExercise={true} /></div>
                  {revealedL1[idx] && (
                    <div className="w-full flex flex-col items-center justify-center p-4 bg-green-50 border border-green-200 rounded-xl mt-2 animate-in fade-in" dir="ltr">
                      <span className="text-xs text-green-900 font-bold mb-2">Model Arrangement:</span>
                      <HieroglyphBlock code={item.correctH} size="large" />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeExTab === 'lesson2' && (
        <div data-nav-target="exercise-lesson2" data-content-id="lesson2" className="space-y-4 sm:space-y-6">
          <div className="bg-gradient-to-l from-amber-500/10 via-amber-50 to-white border border-amber-200/80 p-3.5 sm:p-5 rounded-2xl mb-3 sm:mb-4 shadow-xs" dir="ltr">
            <div className="flex items-start gap-2.5 mb-1.5">
              <span className="p-1.5 bg-amber-500 text-white rounded-xl shrink-0 mt-0.5 shadow-xs">
                <Icon name="BookOpen" size={16}/>
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                  <h3 className="font-bold text-slate-900 text-sm sm:text-base md:text-lg leading-snug">
                    Lesson II: Reading & Syntax Exercise
                  </h3>
                  <span className="text-xs font-semibold text-amber-800 self-start sm:self-auto bg-amber-100/70 px-2 py-0.5 rounded-md" dir="rtl">
                    تمرين قراءة وإعراب الجمل
                  </span>
                </div>
                <p className="text-stone-600 text-xs sm:text-sm leading-relaxed mt-1.5">
                  Read the hieroglyphic sentences and determine their syntactic structure (Nominal vs. Verbal, Transitive vs. Intransitive). Click any card to reveal transliteration, translation, and grammar breakdown.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-4 md:gap-6">
            {exercisesData.lesson2.map((item, idx) => (
              <div key={idx} data-nav-target={`exercise-lesson2-${idx}`} data-content-id="lesson2" data-content-detail={item.trans} onClick={() => toggleRevealL2(idx)} className="group bg-white border border-stone-200 hover:border-amber-400 hover:shadow-md transition-all rounded-2xl p-4 sm:p-5 md:p-6 shadow-sm cursor-pointer relative overflow-hidden flex flex-col justify-between">
                <div className="text-center mb-3 sm:mb-4 py-3 flex items-center justify-center min-h-[64px] sm:min-h-[72px] bg-stone-50/70 rounded-xl border border-stone-100">
                  <HieroglyphBlock code={item.h} size="large" />
                </div>
                
                {revealedL2[idx] ? (
                  <div className="pt-3.5 border-t border-amber-200/80 flex flex-col items-center gap-1.5 animate-in fade-in slide-in-from-top-2 duration-300 text-center" dir="ltr">
                    <span className="text-xl sm:text-2xl font-serif text-amber-700 font-bold">{item.trans}</span>
                    <span className="text-slate-900 font-bold text-sm sm:text-base md:text-lg leading-snug">{item.meanEn || item.mean}</span>
                    {item.meanAr && (
                      <span className="text-xs sm:text-sm text-stone-600 bg-amber-50/80 border border-amber-200/60 px-3 py-1 rounded-xl font-medium mt-0.5" dir="rtl">
                        {item.meanAr}
                      </span>
                    )}
                  </div>
                ) : (
                  <div className="pt-3 border-t border-dashed border-stone-200 flex items-center justify-center gap-1.5 text-xs text-amber-700 font-bold group-hover:text-amber-800 transition-colors">
                    <Icon name="Eye" size={14} className="text-amber-600" />
                    <span>انقر لمعرفة النطق والترجمة والإعراب</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {activeExTab === 'lesson3' && (
        <div data-nav-target="exercise-lesson3" data-content-id="lesson3" className="space-y-4 sm:space-y-6">
          <div className="bg-gradient-to-l from-amber-500/10 via-amber-50 to-white border border-amber-200/80 p-3.5 sm:p-5 rounded-2xl mb-3 sm:mb-4 shadow-xs" dir="ltr">
            <div className="flex items-start gap-2.5 mb-1.5">
              <span className="p-1.5 bg-amber-500 text-white rounded-xl shrink-0 mt-0.5 shadow-xs">
                <Icon name="Award" size={16}/>
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                  <h3 className="font-bold text-slate-900 text-sm sm:text-base md:text-lg leading-snug">
                    Lesson III: Verb Conjugation & Passive Voice
                  </h3>
                  <span className="text-xs font-semibold text-amber-800 self-start sm:self-auto bg-amber-100/70 px-2 py-0.5 rounded-md" dir="rtl">
                    تمرين صيغ الأفعال والمجهول
                  </span>
                </div>
                <p className="text-stone-600 text-xs sm:text-sm leading-relaxed mt-1.5">
                  Practice reading suffix conjugation forms (sḏm=f), passive voice with agent marker (sḏm.tw rn ỉn s), and past tense (sḏm.n=f). Click card to reveal answer.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-4 md:gap-6">
            {exercisesData.lesson3.map((item, idx) => (
              <div key={idx} data-nav-target={`exercise-lesson3-${idx}`} data-content-id="lesson3" data-content-detail={item.trans} onClick={() => toggleRevealL3(idx)} className="group bg-white border border-stone-200 hover:border-amber-400 hover:shadow-md transition-all rounded-2xl p-4 sm:p-5 md:p-6 shadow-sm cursor-pointer relative overflow-hidden flex flex-col justify-between">
                <div className="text-center mb-3 sm:mb-4 py-3 flex items-center justify-center min-h-[64px] sm:min-h-[72px] bg-stone-50/70 rounded-xl border border-stone-100">
                  <HieroglyphBlock code={item.h} size="large" />
                </div>
                
                {revealedL3[idx] ? (
                  <div className="pt-3.5 border-t border-amber-200/80 flex flex-col items-center gap-1.5 animate-in fade-in slide-in-from-top-2 duration-300 text-center" dir="ltr">
                    <span className="text-xl sm:text-2xl font-serif text-amber-700 font-bold">{item.trans}</span>
                    <span className="text-slate-900 font-bold text-sm sm:text-base md:text-lg leading-snug">{item.meanEn || item.mean}</span>
                    {item.meanAr && (
                      <span className="text-xs sm:text-sm text-stone-600 bg-amber-50/80 border border-amber-200/60 px-3 py-1 rounded-xl font-medium mt-0.5" dir="rtl">
                        {item.meanAr}
                      </span>
                    )}
                  </div>
                ) : (
                  <div className="pt-3 border-t border-dashed border-stone-200 flex items-center justify-center gap-1.5 text-xs text-amber-700 font-bold group-hover:text-amber-800 transition-colors">
                    <Icon name="Eye" size={14} className="text-amber-600" />
                    <span>انقر لمعرفة النطق والترجمة والإعراب</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {!['lesson1','lesson2','lesson3','typing','quiz'].includes(activeExTab) && Array.isArray(exercisesData[activeExTab]) && <div data-nav-target={`exercise-${activeExTab}`} data-content-id={activeExTab} className="grid grid-cols-1 md:grid-cols-2 gap-4">{exercisesData[activeExTab].map((item,index)=><div key={index} data-nav-target={`exercise-${activeExTab}-${index}`} data-content-id={activeExTab} data-content-detail={item.trans} className="bg-white border border-stone-200 rounded-2xl p-5"><h3 className="font-bold text-amber-800">{item.trans}</h3><p className="text-sm text-stone-500 my-3">{item.meanAr || item.meanEn || item.mean}</p>{item.correctH && <DrawingPad isExercise={true}/>}<details className="mt-3"><summary className="cursor-pointer text-sm text-amber-700">كشف الحل</summary><HieroglyphBlock code={item.correctH || item.h} size="large"/></details></div>)}</div>}
      {activeExTab === 'typing' && <div data-nav-target="exercise-typing" data-content-id="typing"><TypingExercise /></div>}
      {activeExTab === 'quiz' && <div data-nav-target="exercise-quiz" data-content-id="quiz"><QuizSection /></div>}
    </div>
  );
};
