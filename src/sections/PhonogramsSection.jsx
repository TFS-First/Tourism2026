const PhonogramsSection = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [revealedIds, setRevealedIds] = useState(new Set());

  const toggleReveal = (id) => {
    setRevealedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const filteredData = phonogramsData.filter(item => {
    const matchesFilter = activeFilter === 'all' || item.type === activeFilter;
    if (!matchesFilter) return false;
    if (!search.trim()) return true;
    const q = search.trim().toLowerCase();
    return (
      item.trans.toLowerCase().includes(q) ||
      item.meanAr.includes(q) ||
      item.meanEn.toLowerCase().includes(q) ||
      item.gardiner.toLowerCase().includes(q) ||
      item.h.includes(q)
    );
  });

  const revealAll = () => {
    const allIds = new Set(filteredData.map(item => item.id));
    setRevealedIds(allIds);
  };

  const hideAll = () => {
    setRevealedIds(new Set());
  };

  const totalCount = phonogramsData.length;
  const biCount = phonogramsData.filter(d => d.type === 'biliteral').length;
  const triCount = phonogramsData.filter(d => d.type === 'triliteral').length;
  const quadCount = phonogramsData.filter(d => d.type === 'quadriliteral').length;
  const revealedCount = revealedIds.size;

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6 space-y-6 mt-4">
      {/* Intro Hero Header */}
      <div className="bg-gradient-to-l from-amber-500/10 via-amber-50 to-white border border-amber-200/80 rounded-2xl p-5 md:p-7 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5 mb-1.5">
              <span className="p-2 bg-amber-500 text-white rounded-xl shadow-sm">
                <Icon name="Layers" size={24} />
              </span>
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-slate-800" dir="ltr">
                  Phonograms: Biliterals, Triliterals & Quadriliterals
                </h2>
                <div className="text-xs sm:text-sm font-bold text-amber-800 mt-0.5" dir="rtl">
                  العلامات الصوتية (ثنائية، ثلاثية، ورباعية الصوت)
                </div>
              </div>
            </div>
            <div className="mt-2 text-stone-600 text-sm md:text-base leading-relaxed max-w-3xl space-y-1">
              <p dir="ltr">
                In Middle Egyptian, writing goes beyond single-consonant signs. Scribes frequently utilized phonograms representing <strong className="text-amber-800 font-bold">two consonants (biliterals)</strong>, <strong className="text-amber-800 font-bold">three consonants (triliterals)</strong>, or <strong className="text-amber-800 font-bold">four consonants (quadriliterals)</strong> in sequence (e.g. <span className="font-['Segoe_UI_Historic'] text-lg font-bold text-slate-900">𓄤</span> <em>nfr</em>, <span className="font-['Segoe_UI_Historic'] text-lg font-bold text-slate-900">𓋹</span> <em>ʿnḫ</em>, <span className="font-['Segoe_UI_Historic'] text-lg font-bold text-slate-900">𓊵</span> <em>ḥtp</em>). These were regularly written with phonetic complements to guarantee clear, accurate reading.
              </p>
              <p className="text-xs text-stone-500 font-medium" dir="rtl">
                (في اللغة المصرية القديمة، لا تقتصر الرموز على العلامات الأحادية، بل استعمل الكاتب علامات تمثل صوتين أو ثلاثة أو أربعة أصوات متصلة، مع مكمل صوتي لتأكيد القراءة).
              </p>
            </div>
          </div>
          
          {/* Quick Counter Card */}
          <div className="bg-white/90 border border-amber-200 rounded-xl p-3 sm:p-4 text-center min-w-[170px] shadow-sm flex flex-col justify-center">
            <span className="text-xs text-stone-700 font-bold" dir="ltr">Revealed Progress</span>
            <span className="text-[10px] text-stone-400 font-medium" dir="rtl">(التقدم في الكشف)</span>
            <div className="text-2xl font-black text-amber-600 mt-1" dir="ltr">
              {revealedCount} <span className="text-sm font-normal text-stone-400">/ {phonogramsData.length}</span>
            </div>
            <div className="w-full bg-stone-100 rounded-full h-2 mt-2 overflow-hidden">
              <div 
                className="bg-amber-500 h-full rounded-full transition-all duration-300"
                style={{ width: `${Math.round((revealedCount / phonogramsData.length) * 100)}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Action Controls Bar */}
        <div className="mt-6 pt-5 border-t border-amber-200/60 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: 'all', labelEn: 'All', labelAr: 'الكل', count: totalCount },
              { id: 'biliteral', labelEn: 'Biliterals', labelAr: 'ثنائية الصوت', count: biCount },
              { id: 'triliteral', labelEn: 'Triliterals', labelAr: 'ثلاثية الصوت', count: triCount },
              { id: 'quadriliteral', labelEn: 'Quadriliterals', labelAr: 'رباعية الصوت', count: quadCount }
            ].map(f => (
              <button
                key={f.id}
                onClick={() => setActiveFilter(f.id)}
                className={`px-3 py-1.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 ${
                  activeFilter === f.id
                    ? 'bg-amber-600 text-white shadow-sm'
                    : 'bg-white text-stone-600 border border-stone-200 hover:border-amber-400 hover:bg-amber-50/50'
                }`}
              >
                <span dir="ltr">{f.labelEn}</span>
                <span className={`text-[10px] font-normal ${activeFilter === f.id ? 'text-amber-100' : 'text-stone-400'}`} dir="rtl">({f.labelAr})</span>
                <span className={`text-[11px] px-1.5 py-0.2 rounded-full font-serif ${activeFilter === f.id ? 'bg-amber-700/60 text-amber-100' : 'bg-stone-100 text-stone-500'}`}>
                  {f.count}
                </span>
              </button>
            ))}
          </div>

          {/* Reveal / Hide All Buttons & Search - Fully mobile responsive */}
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 w-full lg:w-auto">
            <div className="relative w-full sm:w-56 shrink-0">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="ابحث بالنطق أو المعنى..."
                className="w-full bg-white border border-stone-200 rounded-xl pl-8 pr-3 py-1.5 text-xs sm:text-sm focus:outline-none focus:border-amber-500 transition-colors"
                dir="rtl"
              />
              <span className="absolute left-2.5 top-2 text-stone-400">
                <Icon name="Search" size={14} />
              </span>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={revealAll}
                className="flex-1 sm:flex-initial px-3 py-1.5 bg-white border border-stone-200 hover:border-amber-400 hover:bg-amber-50/60 text-stone-700 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition-colors whitespace-nowrap"
                title="كشف جميع الرموز"
              >
                <Icon name="Eye" size={14} className="text-amber-600" />
                <span>كشف الكل</span>
              </button>

              <button
                onClick={hideAll}
                className="flex-1 sm:flex-initial px-3 py-1.5 bg-white border border-stone-200 hover:border-amber-400 hover:bg-amber-50/60 text-stone-700 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition-colors whitespace-nowrap"
                title="إخفاء جميع الرموز لاختبار نفسك"
              >
                <Icon name="EyeOff" size={14} className="text-stone-500" />
                <span>إخفاء الكل</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredData.map(item => {
          const isRevealed = revealedIds.has(item.id);
          return (
            <div
              key={item.id}
              data-nav-target={`phonogram-${item.id}`} data-content-id="learn-phonograms" data-content-detail={item.trans}
              onClick={() => toggleReveal(item.id)}
              className={`group bg-white rounded-2xl border transition-all duration-200 cursor-pointer overflow-hidden relative flex flex-col justify-between ${
                isRevealed 
                  ? 'border-amber-400 shadow-md ring-1 ring-amber-400/30' 
                  : 'border-stone-200 hover:border-amber-400 hover:shadow-md hover:-translate-y-0.5'
              }`}
            >
              {/* Card Header: Type badge only (Gardiner code removed as requested) */}
              <div className="p-3 border-b border-stone-100 flex items-center justify-between bg-stone-50/60">
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] font-bold text-amber-800 bg-amber-100/80 px-2 py-0.5 rounded-md" dir="ltr">
                    {item.type === 'biliteral' ? 'Biliteral' : item.type === 'triliteral' ? 'Triliteral' : 'Quadriliteral'}
                  </span>
                  <span className="text-[10px] text-stone-500 font-medium" dir="rtl">
                    ({item.typeAr})
                  </span>
                </div>
              </div>

              {/* Card Body: The Hieroglyph Graphic */}
              <div className="p-5 flex flex-col items-center justify-center my-auto min-h-[120px]">
                <span className="text-5xl sm:text-6xl font-['Segoe_UI_Historic'] text-slate-800 transition-transform group-hover:scale-105 select-none leading-none">
                  {item.h}
                </span>
                <span className="text-[11px] text-stone-400 mt-2 font-medium" dir="rtl">
                  {item.categoryAr}
                </span>
              </div>

              {/* Bottom Area: Hidden state vs Revealed state */}
              {!isRevealed ? (
                <div className="p-3 bg-stone-50/80 border-t border-dashed border-stone-200 flex items-center justify-center gap-1.5 py-2.5 text-xs text-amber-700 font-bold group-hover:bg-amber-50/50 transition-colors">
                  <Icon name="Eye" size={13} className="text-amber-600" />
                  <span>انقر لمعرفة النطق والمعنى</span>
                </div>
              ) : (
                <div className="p-4 bg-gradient-to-b from-amber-50/40 to-amber-50/90 border-t border-amber-200 text-center space-y-1.5">
                  {/* Academic Transliteration Only */}
                  <div className="flex items-center justify-center">
                    <span className="text-2xl font-black font-serif text-amber-800" dir="ltr">
                      {item.trans}
                    </span>
                  </div>

                  {/* Meaning: English Primary, Arabic Secondary */}
                  <div className="text-sm font-bold text-slate-800" dir="ltr">
                    {item.meanEn}
                  </div>
                  <div className="text-xs font-medium text-stone-500" dir="rtl">
                    ({item.meanAr})
                  </div>

                  {/* Phonetic Complements & Example */}
                  {item.complements && (
                    <div className="pt-2 border-t border-amber-200/60 text-[11px] text-stone-600 flex flex-col items-center gap-1">
                      <div className="text-[11px]">
                        <span className="font-bold text-amber-900" dir="ltr">Complements: </span>
                        <span>{item.complements}</span>
                        <span className="text-[10px] text-stone-400 font-medium mr-1" dir="rtl">(المكملات)</span>
                      </div>
                      {item.example && (
                        <div className="inline-flex items-center gap-1.5 bg-white/80 px-2 py-1 rounded-lg border border-amber-200/80 mt-1">
                          <span className="text-[10px] text-stone-500 font-bold" dir="ltr">Example:</span>
                          <HieroglyphBlock code={item.example.h} size="small" boxed={false} />
                          <span className="text-[11px] font-serif font-bold text-slate-700" dir="ltr">
                            {item.example.trans}
                          </span>
                          <span className="text-[10px] text-stone-600 font-medium" dir="ltr">
                            "{item.example.mean}"
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Note */}
                  {item.note && (
                    <p className="text-[10px] text-stone-500 leading-tight pt-1">
                      {item.note}
                    </p>
                  )}

                  <div className="pt-1 text-[10px] text-amber-700/80 font-medium">
                    (انقر مجدداً للإخفاء)
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {filteredData.length === 0 && (
        <div className="p-12 text-center bg-white rounded-2xl border border-stone-200">
          <p className="text-stone-500 font-bold text-lg mb-2">لا توجد نتائج مطابقة لبحثك</p>
          <button 
            onClick={() => { setSearch(''); setActiveFilter('all'); }} 
            className="text-sm text-amber-600 font-bold hover:underline"
          >
            إعادة تعيين البحث والتصنيف
          </button>
        </div>
      )}
    </div>
  );
};
