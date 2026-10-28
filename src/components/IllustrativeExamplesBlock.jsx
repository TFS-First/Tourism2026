const IllustrativeExamplesBlock = ({ examples }) => {
  // Map of revealed state for each example card (default: all false / hidden for self-testing)
  const [revealedMap, setRevealedMap] = useState({});

  const isAllRevealed = examples.length > 0 && examples.every((_, i) => revealedMap[i]);

  const toggleAll = () => {
    if (isAllRevealed) {
      setRevealedMap({});
    } else {
      const all = {};
      examples.forEach((_, i) => { all[i] = true; });
      setRevealedMap(all);
    }
  };

  const toggleSingle = (idx) => {
    setRevealedMap(prev => ({
      ...prev,
      [idx]: !prev[idx]
    }));
  };

  // Dynamic hieroglyph sizing: large if few symbols, compact if long sentence to never overflow
  const getExampleHieroglyphSize = (hCode) => {
    if (!hCode) return "normal";
    const words = hCode.trim().split(/\s+/);
    const cleanSigns = [...hCode.replace(/[\s\:\*\(\)\,\.\=]/g, '')];
    const signCount = cleanSigns.length;

    if (words.length === 1) {
      if (signCount <= 2) return "large";
      if (signCount <= 4) return "large";
      return "normal";
    }
    if (words.length <= 2 && signCount <= 5) {
      return "large";
    }
    if (words.length <= 3 && signCount <= 8) {
      return "normal";
    }
    return "compact";
  };

  return (
    <div className="mt-4 pt-4 border-t border-stone-200">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <span className="p-1.5 bg-amber-100 text-amber-800 rounded-lg shadow-2xs">
            <Icon name="BookOpen" size={16} />
          </span>
          <h4 className="text-sm md:text-base font-bold text-slate-800" dir="ltr">
            📌 Illustrative Examples & Analysis
          </h4>
        </div>
        
        {/* Toggle All / Self-Test Mode Button */}
        <button
          onClick={toggleAll}
          className="text-xs font-semibold px-2.5 py-1.5 rounded-xl border border-amber-300/80 bg-amber-50 hover:bg-amber-100 text-amber-900 flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer"
        >
          <Icon name={isAllRevealed ? "EyeOff" : "Eye"} size={14} className="text-amber-700" />
          <span>{isAllRevealed ? "إخفاء كل الإجابات (اختبار ذاتي)" : "إظهار كل الإجابات"}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 md:gap-4 w-full" dir="ltr">
        {examples.map((ex, i) => {
          const isRevealed = !!revealedMap[i];
          const hieroSize = getExampleHieroglyphSize(ex.h);

          return (
            <div 
              key={i}
              onClick={() => {
                if (!isRevealed) toggleSingle(i);
              }}
              className={`flex flex-col justify-between rounded-2xl shadow-sm transition-all overflow-hidden p-3.5 sm:p-4 border ${
                !isRevealed 
                  ? 'bg-gradient-to-b from-white to-stone-50/70 border-stone-200 hover:border-amber-400 hover:shadow-md cursor-pointer' 
                  : 'bg-white border-amber-300 shadow-md ring-1 ring-amber-400/25'
              }`}
            >
              {/* Hieroglyphic quadrat sentence - Dynamic sizing: large for short words, compact for long sentences */}
              <div className="w-full flex items-center justify-center p-2.5 sm:p-3 bg-stone-50/90 rounded-xl border border-stone-200/80 mb-2.5 min-h-[56px] sm:min-h-[64px] overflow-hidden">
                <HieroglyphBlock code={ex.h} size={hieroSize} />
              </div>

              {/* Body: Hidden vs Revealed */}
              {!isRevealed ? (
                <div className="flex-1 flex items-center justify-center py-5 sm:py-6 px-3 text-center select-none">
                  <p className="text-xs sm:text-sm text-stone-500 font-medium hover:text-amber-700 transition-colors flex items-center justify-center gap-1.5 leading-relaxed" dir="rtl">
                    <span>💡</span>
                    <span>اقرأ الرموز وخمّن المعنى أولاً، ثم اضغط للتحقق</span>
                  </p>
                </div>
              ) : (
                <div className="flex-1 flex flex-col justify-between">
                  {/* Transliteration & English / Arabic Meaning */}
                  <div className="flex flex-col items-center text-center space-y-1 my-1">
                    <span className="text-lg sm:text-xl font-serif text-amber-700 font-bold" dir="ltr">
                      {ex.trans}
                    </span>
                    {/* Primary English Meaning */}
                    <span className="text-sm sm:text-base text-slate-800 font-bold leading-snug" dir="ltr">
                      {ex.meanEn || ex.mean}
                    </span>
                    {/* Clarifying Arabic Meaning underneath */}
                    {ex.meanAr && (
                      <span className="text-xs text-stone-600 font-medium" dir="rtl">
                        ({ex.meanAr})
                      </span>
                    )}
                  </div>

                  {/* Note badge: English Primary + Brief Arabic indicator */}
                  {(ex.noteEn || ex.noteAr) && (
                    <div className="mt-2 bg-amber-50/80 border border-amber-200/80 rounded-xl p-2 sm:p-2.5 text-xs text-amber-950 flex flex-col gap-1 text-center w-full">
                      {ex.noteEn && <span dir="ltr" className="text-amber-900 font-bold">{ex.noteEn}</span>}
                      {ex.noteAr && <span dir="rtl" className="text-stone-600 font-medium text-[11px]">{ex.noteAr}</span>}
                    </div>
                  )}

                  {/* Re-hide toggle button */}
                  <div className="mt-2.5 pt-2 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-400">
                    <span className="text-emerald-700 font-semibold flex items-center gap-1">
                      <Icon name="Check" size={12} />
                      <span>تم الإظهار</span>
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleSingle(i);
                      }}
                      className="hover:text-amber-700 font-medium flex items-center gap-1 p-0.5 rounded transition-colors cursor-pointer"
                      title="إخفاء لإعادة الاختبار"
                    >
                      <Icon name="EyeOff" size={13} />
                      <span>إخفاء</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
