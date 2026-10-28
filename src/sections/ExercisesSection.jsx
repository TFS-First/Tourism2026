const ExercisesSection = ({ activeExTab, setActiveExTab }) => {
  const [revealed, setRevealed] = useState({});
  const isRevealed = index => !!revealed[activeExTab + '-' + index];
  const toggleReveal = index => {
    const key = activeExTab + '-' + index;
    setRevealed(previous => ({ ...previous, [key]: !previous[key] }));
  };
  const lesson = lessonRegistry.find(entry => entry.id === activeExTab);
  const items = exercisesData[activeExTab];
  const presentation = lesson?.exercisePresentation || {
    kind: items?.some(item => item.correctH) ? 'drawing' : 'reading',
    titleEn: lesson?.titleEn || activeExTab, titleAr: lesson?.titleAr || '',
    description: '', icon: 'BookOpen'
  };
  const renderDrawingCard = (item, idx) => (
              <div key={idx} data-nav-target={`exercise-${activeExTab}-${idx}`} data-content-id={activeExTab} data-content-detail={item.trans} className="bg-white border border-stone-200 rounded-2xl p-4 sm:p-5 md:p-6 shadow-sm flex flex-col justify-between">
                <div className="flex items-center justify-between border-b border-stone-100 pb-3 mb-4" dir="ltr">
                  <div>
                    <span className="text-xl sm:text-2xl font-serif text-amber-700 font-bold block">{item.trans}</span>
                    <span className="text-xs text-stone-500 font-medium">{item.meanEn}</span>
                  </div>
                  <button
                    onClick={() => toggleReveal(idx)}
                    className="flex items-center gap-1.5 px-3 py-1 bg-amber-50 border border-amber-200 text-amber-800 rounded-xl font-bold text-xs hover:bg-amber-100 transition-colors"
                  >
                    <Icon name="Eye" size={14} />
                    <span>{isRevealed(idx) ? 'إخفاء الحل' : 'كشف الحل'}</span>
                  </button>
                </div>

                <div className="flex flex-col gap-4 items-center w-full">
                  <div className="w-full"><DrawingPad isExercise={true} /></div>
                  {isRevealed(idx) && (
                    <div className="w-full flex flex-col items-center justify-center p-4 bg-green-50 border border-green-200 rounded-xl mt-2 animate-in fade-in" dir="ltr">
                      <span className="text-xs text-green-900 font-bold mb-2">Model Arrangement:</span>
                      <HieroglyphBlock code={item.correctH} size="large" />
                    </div>
                  )}
                </div>
              </div>
  );
  const renderReadingCard = (item, idx) => (
              <div key={idx} data-nav-target={`exercise-${activeExTab}-${idx}`} data-content-id={activeExTab} data-content-detail={item.trans} onClick={() => toggleReveal(idx)} className="group bg-white border border-stone-200 hover:border-amber-400 hover:shadow-md transition-all rounded-2xl p-4 sm:p-5 md:p-6 shadow-sm cursor-pointer relative overflow-hidden flex flex-col justify-between">
                <div className="text-center mb-3 sm:mb-4 py-3 flex items-center justify-center min-h-[64px] sm:min-h-[72px] bg-stone-50/70 rounded-xl border border-stone-100">
                  <HieroglyphBlock code={item.h} size="large" />
                </div>

                {isRevealed(idx) ? (
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
  );
  return (
    <div className="max-w-5xl mx-auto p-2.5 sm:p-4 md:p-6 mt-2 sm:mt-4 space-y-4 sm:space-y-6">
      <label className="lesson-quick-select" htmlFor="exercise-content-select"><Icon name="Award" size={17}/><span>التدريب</span><select id="exercise-content-select" value={activeExTab} onChange={e=>setActiveExTab(e.target.value)}>{exerciseNavigation().map(g=><option key={g.id} value={g.id}>{g.label} — {g.detail}</option>)}</select></label>
      {Array.isArray(items) && (
        <div key={activeExTab} data-nav-target={`exercise-${activeExTab}`} data-content-id={activeExTab} className="space-y-4 sm:space-y-6">
          <div className="bg-gradient-to-l from-amber-500/10 via-amber-50 to-white border border-amber-200/80 p-3.5 sm:p-5 rounded-2xl mb-3 sm:mb-4 shadow-xs" dir="ltr">
            <div className="flex items-start gap-2.5 mb-1.5">
              <span className="p-1.5 bg-amber-500 text-white rounded-xl shrink-0 mt-0.5 shadow-xs">
                <Icon name={presentation.icon || 'BookOpen'} size={16}/>
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                  <h3 className="font-bold text-slate-900 text-sm sm:text-base md:text-lg leading-snug">
                    {presentation.titleEn}
                  </h3>
                  <span className="text-xs font-semibold text-amber-800 self-start sm:self-auto bg-amber-100/70 px-2 py-0.5 rounded-md" dir="rtl">
                    {presentation.titleAr}
                  </span>
                </div>
                <p className="text-stone-600 text-xs sm:text-sm leading-relaxed mt-1.5">
                  {presentation.description}
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-4 md:gap-6">
            {items.map(presentation.kind === 'drawing' ? renderDrawingCard : renderReadingCard)}
          </div>
        </div>
      )}
      {activeExTab === 'typing' && <div data-nav-target="exercise-typing" data-content-id="typing"><TypingExercise /></div>}
      {activeExTab === 'quiz' && <div data-nav-target="exercise-quiz" data-content-id="quiz"><QuizSection /></div>}
    </div>
  );
};
