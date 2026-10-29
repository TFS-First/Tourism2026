const GrammarSection = ({ selectedLessonTab, setSelectedLessonTab, expandedLessons, setExpandedLessons }) => {

  const toggleLesson = (id) => {
    setExpandedLessons(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const expandAllLessons = () => {
    const all = {};
    grammarData.forEach(g => { all[g.id] = true; });
    setExpandedLessons(all);
  };

  const collapseAllLessons = () => {
    setExpandedLessons({});
  };

  const handleFilterChange = (tabId) => {
    setSelectedLessonTab(tabId);
    if (tabId !== 'all') {
      setExpandedLessons(prev => ({ ...prev, [tabId]: true }));
    }
    const el = document.getElementById('grammar-top');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
    else window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderExamples = (examples) => (
    <IllustrativeExamplesBlock examples={examples} />
  );

  const visibleSections = grammarData.filter(section => 
    selectedLessonTab === 'all' || section.id === selectedLessonTab
  );

  return (
    <div className="max-w-5xl mx-auto p-2.5 sm:p-4 md:p-6 space-y-4 sm:space-y-5 mt-2 sm:mt-4">
      {/* Anchor for smooth scroll to top when changing tabs */}
      <div id="grammar-top"></div>

      {/* Lesson Selector Header with Expand/Collapse All buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-2.5 max-w-4xl mx-auto px-1" dir="rtl">
        <div className="text-xs sm:text-sm font-bold text-stone-700 flex items-center gap-1.5">
          <Icon name="Layers" size={16} className="text-amber-600" />
          <span>اختر الدرس من القائمة أدناه لفتحه (الدروس مطوية افتراضياً):</span>
        </div>
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <button
            onClick={expandAllLessons}
            className="px-2.5 py-1 text-xs font-semibold text-amber-900 bg-amber-50 hover:bg-amber-100 border border-amber-200/80 rounded-lg transition-colors flex items-center gap-1 shadow-2xs cursor-pointer"
            title="فتح جميع الدروس"
          >
            <Icon name="Maximize2" size={12} className="text-amber-700" />
            <span>فتح الكل</span>
          </button>
          <button
            onClick={collapseAllLessons}
            className="px-2.5 py-1 text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 border border-stone-200 rounded-lg transition-colors flex items-center gap-1 shadow-2xs cursor-pointer"
            title="طي جميع الدروس"
          >
            <Icon name="Minimize2" size={12} className="text-stone-500" />
            <span>طي الكل</span>
          </button>
        </div>
      </div>

      <label className="lesson-quick-select" htmlFor="grammar-lesson-select"><Icon name="Layers" size={17}/><span>الدرس</span><select id="grammar-lesson-select" value={selectedLessonTab} onChange={e=>handleFilterChange(e.target.value)}><option value="all">عرض جميع الدروس</option>{grammarData.map(g=><option key={g.id} value={g.id}>{g.titleAr}</option>)}</select></label>

      {visibleSections.map((section) => (
        <div key={section.id} data-nav-target={`grammar-${section.id}`} data-content-id={section.id} className="bg-white border border-stone-200 rounded-2xl overflow-hidden shadow-sm">
          {/* Section Accordion Header: Centered Titles & Clickable Sub-badges */}
          <div className="bg-stone-50 border-b border-stone-200 hover:bg-stone-100 transition-colors">
            <div role="button" tabIndex={0} aria-expanded={!!expandedLessons[section.id]} onKeyDown={e=>{if(e.target===e.currentTarget&&(e.key==='Enter'||e.key===' ')){e.preventDefault();toggleLesson(section.id);}}} onClick={() => toggleLesson(section.id)} className="w-full flex items-center justify-between p-3.5 sm:p-4 md:p-5 text-left cursor-pointer" dir="ltr">
              <div className="flex-1 flex flex-col items-center justify-center text-center gap-1 px-1 sm:px-2">
                <h2 className="text-base sm:text-xl md:text-2xl font-bold text-slate-800 tracking-tight leading-snug">{section.titleEn}</h2>
                <span className="text-xs sm:text-sm font-semibold text-stone-500" dir="rtl">{section.titleAr}</span>
                {section.badges && (
                  <div className="flex flex-wrap justify-center gap-1.5 mt-2">
                    {section.badges.map((b, bi) => {
                      const badgeLabel = typeof b === 'object' ? b.label : b;
                      const badgeId = typeof b === 'object' ? b.id : null;
                      return (
                        <button
                          key={bi}
                          type="button"
                          onClick={(e) => {
                            if (badgeId) {
                              e.stopPropagation();
                              if (!expandedLessons[section.id]) {
                                setExpandedLessons(prev => ({ ...prev, [section.id]: true }));
                              }
                              setTimeout(() => {
                                const el = document.getElementById(badgeId);
                                if (el) {
                                  el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                }
                              }, 100);
                            }
                          }}
                          className="inline-flex items-center gap-1 bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 text-[11px] sm:text-xs px-2.5 py-1 rounded-full font-bold transition-all shadow-xs cursor-pointer"
                        >
                          <span>{badgeLabel}</span>
                          {badgeId && <Icon name="ArrowDown" size={11} className="opacity-70" />}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
              <Icon name="ChevronDown" className={`text-stone-500 transition-transform duration-300 shrink-0 ml-2 ${expandedLessons[section.id] ? 'rotate-180' : ''}`} size={22} />
            </div>
          </div>

          {/* Section Content */}
          {expandedLessons[section.id] && (
            <div className="p-3 sm:p-4 md:p-6 space-y-4 sm:space-y-6 animate-in slide-in-from-top-2 duration-300 bg-stone-50/60" dir="ltr">
              {section.rules.map((rule, idx) => {
                
                // Generic Determinatives Grid
                if (rule.type === 'grid') {
                  return (
                    <div key={idx} id={rule.id} data-nav-target={rule.id} data-content-id={section.id} data-content-detail={rule.badgeAr || rule.titleAr} className="bg-white rounded-xl sm:rounded-2xl border border-stone-200 shadow-sm p-3.5 sm:p-5 md:p-6 space-y-3.5 sm:space-y-4 scroll-mt-20">
                      {/* Rule Header */}
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-100 pb-3">
                        <div className="flex items-center gap-2">
                          <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-amber-600 text-white font-bold flex items-center justify-center text-xs sm:text-sm shadow-sm">
                            {rule.ruleNum}
                          </span>
                          <span className="inline-block bg-amber-100 text-amber-900 border border-amber-300 text-xs sm:text-sm font-bold px-2.5 sm:px-3 py-1 rounded-lg">
                            {rule.badgeEn} <span className="font-normal opacity-80" dir="rtl">({rule.badgeAr})</span>
                          </span>
                        </div>
                      </div>
                      <div>
                        <h3 className="text-base sm:text-lg md:text-xl font-bold text-slate-800 mb-0.5 leading-snug">{rule.titleEn}</h3>
                        <h4 className="text-xs sm:text-sm md:text-base font-semibold text-stone-500" dir="rtl">{rule.titleAr}</h4>
                      </div>
                      {rule.summaryEn && (
                        <p className="text-stone-700 text-xs sm:text-sm md:text-base leading-relaxed bg-amber-50/60 p-2.5 sm:p-3 rounded-xl border border-amber-200/60">
                          {rule.summaryEn}
                        </p>
                      )}
                      
                      {/* Grid for Generic Determinatives */}
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2.5 sm:gap-3 md:gap-4 pt-1">
                        {rule.items.map((item, i) => (
                          <div key={i} className="flex flex-col items-center justify-center gap-1.5 sm:gap-2 bg-stone-50 hover:bg-amber-50/40 hover:border-amber-300 border border-stone-200 p-2.5 sm:p-3.5 md:p-4 rounded-xl shadow-xs transition-colors overflow-hidden">
                            <span className="text-3xl sm:text-4xl md:text-5xl text-slate-800 font-['Segoe_UI_Historic'] text-center">{item.h}</span>
                            <div className="flex flex-col text-xs font-medium text-stone-700 leading-tight gap-0.5 w-full justify-center items-center">
                              <span className="font-bold text-slate-800 text-center text-xs sm:text-sm">{item.meanEn}</span>
                              <span dir="rtl" className="whitespace-nowrap text-center text-[11px] text-stone-500 w-full">({item.meanAr})</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                }

                // Standard Structured Rule (English-First)
                return (
                  <div key={idx} id={rule.id} data-nav-target={rule.id} data-content-id={section.id} data-content-detail={rule.badgeAr || rule.titleAr} className="bg-white rounded-xl sm:rounded-2xl border border-stone-200 shadow-sm p-3.5 sm:p-5 md:p-6 space-y-3.5 sm:space-y-4 scroll-mt-20">
                    {/* Rule Top Header */}
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-100 pb-3">
                      <div className="flex items-center gap-2">
                        <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-amber-600 text-white font-bold flex items-center justify-center text-xs sm:text-sm shadow-sm">
                          {rule.ruleNum}
                        </span>
                        <span className="inline-block bg-amber-100 text-amber-900 border border-amber-300 text-xs sm:text-sm font-bold px-2.5 sm:px-3 py-1 rounded-lg">
                          {rule.badgeEn} <span className="font-normal opacity-80" dir="rtl">({rule.badgeAr})</span>
                        </span>
                      </div>
                    </div>

                    {/* Titles */}
                    <div>
                      <h3 className="text-base sm:text-lg md:text-xl font-bold text-slate-800 mb-0.5 leading-snug">{rule.titleEn}</h3>
                      <h4 className="text-xs sm:text-sm md:text-base font-semibold text-stone-500" dir="rtl">{rule.titleAr}</h4>
                    </div>

                    {rule.learningGuide && <GrammarLearningGuide guide={rule.learningGuide} />}

                    {/* Formula Syntax Box (Single or Dual Side-by-Side Cards) */}
                    {rule.formulas ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-2.5">
                        {rule.formulas.map((f, fi) => (
                          <div key={fi} className="bg-gradient-to-r from-amber-500/10 via-amber-50 to-white border-l-4 border-amber-500 p-2.5 sm:p-3.5 rounded-xl border border-amber-200/80 shadow-xs">
                            <div className="flex flex-wrap items-center justify-between gap-1 mb-1">
                              <span className="text-xs font-bold text-amber-800">{f.titleEn || f.labelEn}</span>
                              <span className="text-[11px] font-semibold text-amber-900" dir="rtl">{f.titleAr || f.labelAr}</span>
                            </div>
                            <span className="font-mono text-xs sm:text-sm md:text-base font-bold text-slate-900 block break-words">{f.formula || f.code}</span>
                          </div>
                        ))}
                      </div>
                    ) : rule.formula ? (
                      <div className="bg-gradient-to-r from-amber-500/10 via-amber-50 to-white border-l-4 border-amber-500 p-2.5 sm:p-3.5 md:p-4 rounded-xl border border-amber-200/80 shadow-xs">
                        <span className="text-xs font-bold text-amber-800 block mb-1">📐 Grammar Formula (الصيغة النحوية):</span>
                        <span className="font-mono text-xs sm:text-sm md:text-base font-bold text-slate-900 block break-words">{rule.formula}</span>
                      </div>
                    ) : null}

                    {/* Summary in English */}
                    {rule.summaryEn && (
                      <p className="text-stone-700 text-xs sm:text-sm md:text-base leading-relaxed bg-stone-50 p-2.5 sm:p-3 rounded-xl border border-stone-200/70">
                        {rule.summaryEn}
                      </p>
                    )}

                    {/* Numbered Points & Clean Sub-Points */}
                    {rule.points && rule.points.length > 0 && (
                      <div className="space-y-2.5 sm:space-y-3 pt-1">
                        <span className="text-[11px] sm:text-xs font-bold text-stone-400 uppercase tracking-wider block">Rule Breakdown & Key Points:</span>
                        <div className="grid grid-cols-1 gap-2.5">
                          {rule.points.map((pt, pti) => (
                            <div key={pti} className="bg-stone-50/70 border border-stone-200/90 rounded-xl p-3 sm:p-4 hover:border-amber-300 transition-colors">
                              <div className="flex items-start gap-2.5">
                                <span className="w-6 h-6 rounded-md bg-amber-500 text-white font-bold flex items-center justify-center text-xs shrink-0 mt-0.5 shadow-xs">
                                  {pt.num}
                                </span>
                                <div className="flex-1 min-w-0">
                                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 mb-1">
                                    <h5 className="font-bold text-slate-900 text-sm sm:text-base leading-snug">
                                      {pt.titleEn}
                                    </h5>
                                    {pt.indicatorAr && (
                                      <span className="inline-block self-start sm:self-auto text-[11px] sm:text-xs font-bold text-amber-900 bg-amber-100/90 border border-amber-300/60 px-2 py-0.5 rounded-md" dir="rtl">
                                        {pt.indicatorAr}
                                      </span>
                                    )}
                                  </div>
                                  {pt.descEn && (
                                    <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-normal">
                                      {pt.descEn}
                                    </p>
                                  )}
                                </div>
                              </div>
                              
                              {/* Sub-Points on individual neat rows */}
                              {pt.subPoints && pt.subPoints.length > 0 && (
                                <div className="mt-2.5 space-y-2 sm:pl-8">
                                  {pt.subPoints.map((sp, spi) => (
                                    <div key={spi} className="bg-white border border-stone-200/90 rounded-xl p-2.5 sm:p-3 shadow-xs hover:border-amber-300 transition-all">
                                      <div className="flex flex-wrap items-center justify-between gap-1.5">
                                        <span className="font-bold text-slate-800 text-xs sm:text-sm">
                                          {sp.label}
                                        </span>
                                        {sp.text && (
                                          <span className="text-xs font-semibold text-amber-800 bg-amber-50/80 border border-amber-200/70 px-2 py-0.5 rounded-md">
                                            {sp.text}
                                          </span>
                                        )}
                                      </div>
                                      {((sp.examples && sp.examples.length > 0) || sp.example || sp.h) && (
                                         <div className="mt-2.5 pt-2 border-t border-stone-100 flex flex-wrap items-center gap-2 text-xs">
                                           <span className="text-[11px] font-bold text-amber-800 bg-amber-100/80 px-2.5 py-1 rounded-md shrink-0 self-start sm:self-center">
                                             مثال
                                           </span>
                                           <div className="flex flex-wrap items-center gap-2">
                                             {(sp.examples && sp.examples.length > 0) ? (
                                               sp.examples.map((ex, exi) => (
                                                 <div key={exi} className="inline-flex items-center gap-2 bg-stone-50/90 hover:bg-amber-50/50 border border-stone-200/90 rounded-xl px-2.5 py-1.5 shadow-xs transition-colors">
                                                   {ex.h && <HieroglyphBlock code={ex.h} size="normal" boxed={false} />}
                                                   {ex.trans && (
                                                     <span className="font-mono text-slate-900 font-bold text-xs sm:text-sm" dir="ltr">
                                                       {ex.trans}
                                                     </span>
                                                   )}
                                                   {ex.mean && (
                                                     <span className="text-stone-500 font-sans text-[11px] sm:text-xs font-medium" dir="ltr">
                                                       '{ex.mean}'
                                                     </span>
                                                   )}
                                                 </div>
                                               ))
                                             ) : (
                                               <div className="inline-flex items-center gap-2 bg-stone-50/90 hover:bg-amber-50/50 border border-stone-200/90 rounded-xl px-2.5 py-1.5 shadow-xs transition-colors">
                                                 {sp.h && <HieroglyphBlock code={sp.h} size="normal" boxed={false} />}
                                                 {sp.example && (
                                                   <span className="font-mono text-slate-800 font-semibold text-xs sm:text-sm leading-relaxed" dir="ltr">
                                                     {sp.example}
                                                   </span>
                                                 )}
                                               </div>
                                             )}
                                           </div>
                                         </div>
                                       )}
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Pronouns Table (for Lesson 3) */}
                    {rule.pronounsTable && (
                      <div className="mt-4 overflow-x-auto rounded-xl border border-stone-200 shadow-sm">
                        <table className="w-full text-left text-xs sm:text-sm border-collapse bg-white">
                          <thead>
                            <tr className="bg-amber-100/90 border-b border-amber-200 text-amber-950 font-bold">
                              <th className="p-2 sm:p-2.5 text-center">#</th>
                              <th className="p-2.5 sm:p-3 text-center">Person / Gender</th>
                              <th className="p-2.5 sm:p-3 text-center">Hieroglyph</th>
                              <th className="p-2.5 sm:p-3 text-center">Suffix</th>
                              <th className="p-2.5 sm:p-3">English Meaning</th>
                              <th className="p-2.5 sm:p-3 text-right" dir="rtl">المعنى بالعربية</th>
                              <th className="p-2.5 sm:p-3">Example</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-stone-100">
                            {rule.pronounsTable.map((p, pIdx) => (
                              <tr key={pIdx} className="hover:bg-amber-50/50 transition-colors">
                                <td className="p-2 sm:p-2.5 font-bold text-amber-700 text-center">{p.num}</td>
                                <td className="p-2.5 sm:p-3 font-semibold text-stone-600 text-center whitespace-nowrap">{p.person}</td>
                                <td className="p-2.5 sm:p-3 text-center"><HieroglyphBlock code={p.h} size="normal" boxed={false} /></td>
                                <td className="p-2.5 sm:p-3 font-serif font-bold text-amber-700 text-base sm:text-lg text-center">{p.trans}</td>
                                <td className="p-2.5 sm:p-3 font-bold text-slate-800">{p.meanEn}</td>
                                <td className="p-2.5 sm:p-3 font-semibold text-amber-900 text-right" dir="rtl">{p.meanAr}</td>
                                <td className="p-2.5 sm:p-3 font-mono text-xs text-stone-600 whitespace-nowrap">{p.ex}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}

                    {/* Illustrative Examples Section */}
                    {rule.examples && renderExamples(rule.examples)}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
