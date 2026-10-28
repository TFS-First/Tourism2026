const VocabularySection = ({ searchQuery, setSearchQuery }) => {
  const [revealedWords, setRevealedWords] = useState({});

  const toggleWordReveal = (key) => {
    setRevealedWords(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const revealAll = () => {
    const all = {};
    vocabularyData.forEach((sec, sIdx) => {
      sec.words.forEach((_, wIdx) => {
        all[`${sIdx}-${wIdx}`] = true;
        all[`search-${sIdx}-${wIdx}`] = true;
      });
    });
    setRevealedWords(all);
  };

  const hideAll = () => {
    setRevealedWords({});
  };

  const normalizeSearchText = (str) => {
    if (!str) return '';
    return str
      .toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/[إأآا]/g, 'ا')
      .replace(/ة/g, 'ه')
      .replace(/ى/g, 'ي')
      .replace(/[ḏd]/g, 'd')
      .replace(/[ṯt]/g, 't')
      .replace(/[ḥh]/g, 'h')
      .replace(/[ḫh]/g, 'h')
      .replace(/[šs]/g, 's')
      .replace(/[ḳq]/g, 'k')
      .replace(/[ỉi]/g, 'i')
      .replace(/[ꜥa]/g, 'a')
      .replace(/3/g, 'a')
      .trim();
  };

  const normalizedQuery = normalizeSearchText(searchQuery);
  const isSearching = normalizedQuery.length > 0;

  const searchResults = useMemo(() => {
    if (!isSearching) return [];
    const results = [];
    vocabularyData.forEach((sec, secIdx) => {
      sec.words.forEach((word, wordIdx) => {
        const matchTrans = normalizeSearchText(word.trans).includes(normalizedQuery);
        const matchEn = normalizeSearchText(word.meanEn || word.mean).includes(normalizedQuery);
        const matchAr = normalizeSearchText(word.meanAr).includes(normalizedQuery);
        const matchH = (word.h || '').includes(searchQuery.trim());
        if (matchTrans || matchEn || matchAr || matchH) {
          results.push({
            word,
            lesson: sec.lesson,
            cardKey: `search-${secIdx}-${wordIdx}`
          });
        }
      });
    });
    return results;
  }, [normalizedQuery, isSearching, searchQuery]);

  const totalWordsCount = useMemo(() => {
    return vocabularyData.reduce((acc, s) => acc + s.words.length, 0);
  }, []);

  const renderCard = (word, cardKey, lessonBadge = null) => {
    const isRevealed = !!revealedWords[cardKey];
    return (
      <div
        key={cardKey}
        data-nav-target={`word-${cardKey}`}
        onClick={() => toggleWordReveal(cardKey)}
        className={`group flex flex-col items-center text-center justify-between p-4 rounded-2xl w-full transition-all cursor-pointer shadow-xs select-none min-h-[145px] sm:min-h-[155px] overflow-hidden ${
          isRevealed
            ? 'bg-amber-50/30 border-2 border-amber-400 shadow-md ring-1 ring-amber-400/20'
            : 'bg-white hover:bg-amber-50/40 hover:border-amber-400 border border-stone-200 hover:-translate-y-0.5 hover:shadow-md'
        }`}
      >
        {lessonBadge && (
          <span className="text-[10px] font-bold text-amber-800 bg-amber-100/80 px-2.5 py-0.5 rounded-full mb-1">
            {lessonBadge}
          </span>
        )}
        {!isRevealed ? (
          /* HIDDEN STATE: Large, Crystal-Clear Hieroglyphic Symbol */
          <div className="my-auto flex flex-col items-center justify-center w-full py-2 overflow-hidden">
            <VocabularyGlyph code={word.h} />
            <span className="text-[11px] text-stone-400 group-hover:text-amber-700 font-medium transition-colors mt-2 flex items-center gap-1">
              <Icon name="Eye" size={13} className="text-amber-600" />
              <span>انقر لمعرفة النطق والمعنى</span>
            </span>
          </div>
        ) : (
          /* REVEALED STATE: Shows Hieroglyph + Transliteration + English Meaning + Arabic Meaning */
          <div className="w-full flex flex-col items-center justify-between h-full animate-in fade-in py-1 overflow-hidden">
            <VocabularyGlyph code={word.h} revealed />
            <div className="w-full border-t border-amber-200/60 pt-2 flex flex-col items-center">
              <span className="block text-2xl font-serif text-amber-700 font-bold mb-1" dir="ltr">
                {word.trans}
              </span>
              <span className="block text-sm md:text-base text-slate-800 font-bold leading-snug text-center" dir="ltr">
                {word.meanEn || word.mean}
              </span>
              {word.meanAr && (
                <span className="block text-xs text-stone-600 font-medium mt-1 text-center" dir="rtl">
                  ({word.meanAr})
                </span>
              )}
              <span className="text-[10px] text-stone-400 mt-2 block">
                (انقر للإخفاء)
              </span>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6 space-y-6 mt-4">
      {/* Top Flashcard Controls Bar with Integrated Search */}
      <div className="vocabulary-toolbar bg-white border border-stone-200 rounded-2xl p-4 sm:p-5 shadow-sm space-y-3.5">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="p-2 bg-amber-100 text-amber-800 rounded-xl shadow-2xs">
              <Icon name="BookOpen" size={20} />
            </span>
            <div>
              <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <span>قاموس الكلمات والمفردات</span>
                <span className="text-xs font-semibold px-2 py-0.5 bg-amber-100/70 text-amber-800 rounded-full">
                  {totalWordsCount} كلمة
                </span>
              </h2>
              <p className="text-xs text-stone-500">
                ابحث بنطق الكلمة (مثل sdm, itrw, rn) أو بمعناها بالعربية أو الإنجليزية
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
            <button
              onClick={revealAll}
              className="px-3.5 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
            >
              <Icon name="Eye" size={14} className="text-amber-600" />
              <span>كشف الكل</span>
            </button>
            <button
              onClick={hideAll}
              className="px-3.5 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 border border-stone-200 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
            >
              <Icon name="Lock" size={14} className="text-stone-500" />
              <span>إخفاء الكل (اختبر نفسك)</span>
            </button>
          </div>
        </div>

        {/* Real-time Search Input Box */}
        <div className="relative w-full">
          <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-stone-400">
            <Icon name="Search" size={18} />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ابحث بنطق الكلمة أو معناها بالعربي أو الإنجليزي…"
            aria-label="البحث في قاموس الكلمات"
            className="w-full pr-10 pl-10 py-2.5 sm:py-3 text-sm bg-stone-50 hover:bg-white focus:bg-white border border-stone-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 rounded-xl transition-all outline-hidden text-slate-800 font-medium"
            dir={searchTextDirection(searchQuery)}
            style={{textAlign: 'start'}}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-stone-400 hover:text-stone-600 cursor-pointer"
              title="مسح البحث"
            >
              <Icon name="X" size={16} />
            </button>
          )}
        </div>

        {isSearching && (
          <div className="flex items-center justify-between text-xs text-stone-600 pt-1 border-t border-stone-100">
            <span>
              نتائج البحث عن "<strong className="text-amber-700">{searchQuery}</strong>": {searchResults.length} كلمة مطابقة
            </span>
            <button
              onClick={() => setSearchQuery('')}
              className="text-amber-700 hover:underline font-bold"
            >
              عرض جميع الكلمات
            </button>
          </div>
        )}
      </div>

      {isSearching ? (
        searchResults.length > 0 ? (
          <div className="bg-white border border-stone-200 rounded-2xl overflow-hidden shadow-sm">
            <div className="bg-gradient-to-l from-amber-50/80 via-stone-100 to-stone-100 border-b border-stone-200 p-4 md:p-5 flex items-center justify-between">
              <h3 className="text-base sm:text-lg font-bold text-slate-800">
                نتائج البحث المكتشفة ({searchResults.length} كلمة)
              </h3>
              <span className="text-xs font-bold text-amber-800 bg-amber-100/80 px-3 py-1 rounded-full">
                مطابقات القاموس
              </span>
            </div>
            <div className="p-4 md:p-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4" dir="ltr">
              {searchResults.map(({ word, cardKey, lesson }) => renderCard(word, cardKey, lesson))}
            </div>
          </div>
        ) : (
          <div className="bg-white border border-stone-200 rounded-2xl p-8 sm:p-12 text-center space-y-3 shadow-sm">
            <div className="text-4xl">🔍</div>
            <h3 className="text-base sm:text-lg font-bold text-slate-700">لم يتم العثور على أي كلمة مطابقة</h3>
            <p className="text-xs sm:text-sm text-stone-500 max-w-md mx-auto leading-relaxed">
              جرب البحث بنطق آخر مبسط مثل "sdm" أو "itrw" أو باللغة العربية مثل "نهر" أو "يسمع" أو "كاتب".
            </p>
            <button
              onClick={() => setSearchQuery('')}
              className="mt-2 px-4 py-2 bg-amber-100 text-amber-900 border border-amber-200 rounded-xl text-xs font-bold hover:bg-amber-200 transition-colors"
            >
              مسح البحث وعرض كل الكلمات
            </button>
          </div>
        )
      ) : (
        vocabularyData.map((section, secIdx) => (
          <div key={secIdx} data-nav-target={`vocab-${secIdx}`} data-content-id={`vocab-${secIdx}`} className="bg-white border border-stone-200 rounded-2xl overflow-hidden shadow-sm">
            <div className="bg-gradient-to-l from-amber-50/80 via-stone-100 to-stone-100 border-b border-stone-200 p-4 md:p-5 flex items-center justify-between">
              <h2 className="text-lg sm:text-xl font-bold text-slate-800">
                كلمات {section.lesson}
              </h2>
              <span className="text-xs font-bold text-amber-800 bg-amber-100/80 px-3 py-1 rounded-full">
                {section.words.length} كلمة
              </span>
            </div>
            <div className="p-4 md:p-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4" dir="ltr">
              {section.words.map((word, i) => renderCard(word, `${secIdx}-${i}`))}
            </div>
          </div>
        ))
      )}
    </div>
  );
};
