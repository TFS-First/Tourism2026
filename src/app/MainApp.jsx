function MainApp() {
  const getInitialTab = () => {
    try {
      const hash = window.location.hash.replace('#', '');
      if (['learn', 'vocab', 'grammar', 'exercises'].includes(hash)) {
        return hash;
      }
      const saved = localStorage.getItem('tourism2026_active_tab');
      if (saved && ['learn', 'vocab', 'grammar', 'exercises'].includes(saved)) {
        return saved;
      }
    } catch (e) {}
    return 'learn';
  };

  const getInitialShowLanding = () => {
    try {
      const hash = window.location.hash.replace('#', '');
      if (['learn', 'vocab', 'grammar', 'exercises'].includes(hash)) {
        return false;
      }
      const hasStarted = localStorage.getItem('tourism2026_has_started');
      return hasStarted !== 'true';
    } catch (e) {}
    return true;
  };

  const [showLanding, setShowLanding] = useState(getInitialShowLanding);
  const [selectedSign, setSelectedSign] = useState(null);
  const [activeDrawingSign, setActiveDrawingSign] = useState(null);
  const orderedSigns = useMemo(() => [...hieroglyphsData].sort((a,b)=>a.step-b.step), []);
  const selectedSignIndex = orderedSigns.findIndex(sign => sign.step === selectedSign?.step);
  const [activeTab, setActiveTab] = useState(getInitialTab);
  const [learnSubTab, setLearnSubTab] = useState('path');
  const [contentOpen,setContentOpen] = useState(false);
  const [grammarSelection,setGrammarSelection] = useState('all');
  const [grammarExpanded,setGrammarExpanded] = useState({});
  const [exerciseSelection,setExerciseSelection] = useState('lesson1');
  const [contentJump,setContentJump] = useState(null);
  const [contentLocation,setContentLocation] = useState({id:'',detail:''});
  const contentTriggerRef = useRef(null);
  const sectionNames = {learn:'الرموز',vocab:'الكلمات',grammar:'القواعد',exercises:'التدريبات'};
  const contentGroups = useMemo(() => {
    if(activeTab==='grammar') return [{id:'all',label:'جميع الدروس',detail:`${grammarData.length} درس`,children:[]},...grammarData.map(g=>({id:g.id,label:g.titleAr.split(':')[0],detail:g.titleAr.split(':').slice(1).join(':').trim(),children:g.rules.map((r,i)=>({id:r.id || `${g.id}-rule-${i}`,label:r.badgeAr || r.titleAr || r.badgeEn,detail:r.titleEn,anchor:r.id}))}))];
    if(activeTab==='vocab') return vocabularyData.map((g,i)=>({id:`vocab-${i}`,label:g.lesson,detail:`${g.words.length} كلمة`,children:g.words.map((w,j)=>({id:`word-${i}-${j}`,label:w.meanAr || w.meanEn || w.trans,detail:w.trans,anchor:`word-${i}-${j}`}))}));
    if(activeTab==='exercises') return exerciseNavigation();
    return [{id:'learn-path',label:'مسار الرموز',detail:'بالترتيب خطوة بخطوة',sub:'path',children:[...hieroglyphsData].sort((a,b)=>a.step-b.step).map(h=>({id:`learn-sign-${h.step}`,label:`${h.step}. ${h.soundAr || h.trans}`,detail:h.descAr || h.meaning,anchor:`learn-sign-${h.step}`}))},{id:'learn-grid',label:'جدول الرموز',detail:'كل الرموز في مكان واحد',sub:'grid',children:hieroglyphsData.map(h=>({id:`grid-sign-${h.step}`,label:`${h.step}. ${h.soundAr || h.trans}`,detail:h.descAr || h.meaning,anchor:`grid-sign-${h.step}`}))},{id:'learn-phonograms',label:'العلامات الصوتية',detail:'علامات ثنائية وثلاثية، وكلمات وألقاب',sub:'phonograms',children:phonogramsData.map(h=>({id:`phonogram-${h.id}`,label:h.trans,detail:h.meanAr || h.typeAr,anchor:`phonogram-${h.id}`}))}];
  },[activeTab]);
  const closeContent = () => {setContentOpen(false);};
  const chooseContent = (group,child) => {
    setContentOpen(false); setQuickSearchOpen(false);
    let anchor = child?.anchor;
    if(activeTab==='grammar') {setGrammarSelection(group.id);if(group.id==='all'){setGrammarExpanded(Object.fromEntries(grammarData.map(g=>[g.id,true])));anchor='grammar-top';}else{setGrammarExpanded(p=>({...p,[group.id]:true}));anchor=anchor || `grammar-${group.id}`;}}
    else if(activeTab==='vocab'){setVocabQuery('');anchor=anchor || group.id;}
    else if(activeTab==='exercises'){setExerciseSelection(group.id);anchor=anchor || `exercise-${group.id}`;}
    else {setLearnSubTab(group.sub);anchor=anchor || group.id;}
    setContentLocation({id:group.id,detail:child?.label || ''});
    setContentJump({anchor,stamp:Date.now()});
  };
  useEffect(()=>{
    if(!contentJump || showLanding) return;
    let timer;
    const frame=requestAnimationFrame(()=>{
      const targets=[...document.querySelectorAll('[data-nav-target]')];
      const node=targets.find(n=>n.dataset.navTarget===contentJump.anchor && n.getBoundingClientRect().width>0) || document.getElementById(contentJump.anchor);
      if(!node)return;
      const move=()=>{const header=document.querySelector('.study-header');window.scrollTo({top:Math.max(0,node.getBoundingClientRect().top+scrollY-(header?.getBoundingClientRect().height || 0)-14),behavior:'instant'});};
      move();timer=setTimeout(move,280);
    });
    return()=>{cancelAnimationFrame(frame);clearTimeout(timer);};
  },[contentJump,showLanding]);
  useEffect(()=>{
    if(showLanding || selectedSign)return;
    const header=document.querySelector('.study-header');if(!header)return;
    const resize=new ResizeObserver(()=>document.documentElement.style.setProperty('--study-content-offset',`${header.getBoundingClientRect().height+14}px`));resize.observe(header);
    let frame=null;
    const update=()=>{frame=null;const edge=header.getBoundingClientRect().bottom+65;const nodes=[...document.querySelectorAll('main [data-content-id]')].filter(n=>n.getBoundingClientRect().width>0);let chosen=nodes[0];for(const n of nodes){if(n.getBoundingClientRect().top<=edge)chosen=n;}if(chosen){const id=chosen.dataset.contentId,detail=chosen.dataset.contentDetail || '';setContentLocation(p=>p.id===id&&p.detail===detail?p:{id,detail});}};
    const schedule=()=>{if(frame===null)frame=requestAnimationFrame(update);};
    const mutations=new MutationObserver(schedule);mutations.observe(document.querySelector('.study-shell main'),{childList:true,subtree:true});window.addEventListener('scroll',schedule,{passive:true});schedule();
    return()=>{resize.disconnect();mutations.disconnect();window.removeEventListener('scroll',schedule);if(frame!==null)cancelAnimationFrame(frame);};
  },[activeTab,learnSubTab,showLanding,selectedSign]);

  const [compactNav, setCompactNav] = useState(false);
  const [quickSearchOpen, setQuickSearchOpen] = useState(false);
  const [vocabQuery, setVocabQuery] = useState('');
  const quickSearchRef = useRef(null);

  useEffect(() => {
    if (showLanding) { setCompactNav(false); return; }
    let frame = null;
    const update = () => {
      frame = null;
      if (quickSearchOpen) return;
      // Separate thresholds prevent oscillation when the top row collapses.
      if (window.scrollY > 120) setCompactNav(true);
      else if (window.scrollY < 20) setCompactNav(false);
    };
    const onScroll = () => {
      if (frame === null) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (frame !== null) cancelAnimationFrame(frame);
    };
  }, [showLanding, quickSearchOpen]);

  useEffect(() => {
    if (quickSearchOpen) quickSearchRef.current?.focus();
  }, [quickSearchOpen]);

  const updateQuickSearch = (value) => {
    setVocabQuery(value);
    // Filtering can shorten the page; show the matches directly below the search.
    window.scrollTo({ top: 0, behavior: 'instant' });
  };


  useEffect(() => { if (selectedSign) window.scrollTo(0, 0); }, [selectedSign]);

  const handleSelectSign = (item) => {
    setSelectedSign(item);
    setActiveDrawingSign(item.forms ? item.forms[0].sign : item.h);
  };

  // Sync tab changes to URL hash and localStorage so refresh keeps the user right here
  const handleTabChange = (tabId) => {
    setContentOpen(false); setContentLocation({id:'',detail:''});
    setQuickSearchOpen(false);
    setActiveTab(tabId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    try {
      localStorage.setItem('tourism2026_active_tab', tabId);
      localStorage.setItem('tourism2026_has_started', 'true');
      window.location.hash = tabId;
    } catch (e) {}
  };

  const handleStartFromLanding = (targetTab = 'learn') => {
    setActiveTab(targetTab);
    setShowLanding(false);
    try {
      localStorage.setItem('tourism2026_has_started', 'true');
      localStorage.setItem('tourism2026_active_tab', targetTab);
      window.location.hash = targetTab;
    } catch (e) {}
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReturnToLanding = () => {
    setShowLanding(true);
    try {
      localStorage.setItem('tourism2026_has_started', 'false');
      if (window.location.hash) {
        history.pushState("", document.title, window.location.pathname + window.location.search);
      }
    } catch (e) {}
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (showLanding) {
    return (
      <LandingHero
        onStart={() => handleStartFromLanding('learn')}
        onSelectTab={(tabId) => handleStartFromLanding(tabId)}
      />
    );
  }

  const sortedHieroglyphs = [...hieroglyphsData].sort((a, b) => a.step - b.step);

  return (
    <div dir="rtl" className={`study-shell min-h-screen text-slate-900 font-sans pb-12 ${quickSearchOpen ? "study-search-open" : ""}`}>
      {!selectedSign && (
        <header className={`study-header ${compactNav ? "is-compact" : ""}`}>
          <div className="study-header-inner">
            <div className="study-topbar" aria-hidden={compactNav} inert={compactNav ? "" : undefined}>
              <div className="study-identity"><span className="study-emblem" aria-hidden="true">𓆣</span><div><h1>المصرية القديمة</h1><span className="study-wordmark">ANCIENT EGYPTIAN</span></div></div>
              <span className="study-context">رحلتك لفهم لغة الأجداد</span>
              <button onClick={handleReturnToLanding} className="study-home" title="العودة للواجهة الرئيسية"><Icon name="Home" size={17} /><span>الرئيسية</span><span aria-hidden="true">↗</span></button>
            </div>
            <div className="study-tab-row">
            <nav className="study-tabs" aria-label="أقسام التطبيق">
              {[
                { id: 'learn', icon: 'Compass', label: 'مسار التعلم والرموز', mobileLabel: 'الرموز' },
                { id: 'vocab', icon: 'BookOpen', label: 'قاموس الكلمات', mobileLabel: 'الكلمات' },
                { id: 'grammar', icon: 'FileText', label: 'القواعد النحوية', mobileLabel: 'القواعد' },
                { id: 'exercises', icon: 'Award', label: 'التدريبات والاختبارات', mobileLabel: 'التدريبات' }
              ].map(tab => (
                <button key={tab.id} onClick={() => handleTabChange(tab.id)} aria-current={activeTab === tab.id ? 'page' : undefined} className={`study-tab ${activeTab === tab.id ? 'is-active' : ''}`}>
                  <Icon name={tab.icon} size={19} /><span className="study-tab-label">{tab.label}</span><span className="study-tab-mobile">{tab.mobileLabel}</span>
                </button>
              ))}
            </nav>
            {compactNav && activeTab === 'vocab' && (
              <button className="study-search-toggle" aria-label={quickSearchOpen ? 'إغلاق بحث الكلمات' : 'البحث عن كلمة'} aria-expanded={quickSearchOpen} aria-controls="quick-vocab-search" onClick={() => setQuickSearchOpen(open => !open)}>
                <Icon name={quickSearchOpen ? 'X' : 'Search'} size={20} />
                {vocabQuery && !quickSearchOpen && <span className="study-search-dot" aria-hidden="true" />}
              </button>
            )}
            </div>
            <div className="content-context"><button ref={contentTriggerRef} className="content-open" aria-haspopup="dialog" aria-expanded={contentOpen} onClick={()=>setContentOpen(true)}><Icon name="Layers" size={16}/><span>المحتوى</span><Icon name="ChevronDown" size={13}/></button><div className="content-location"><b>{contentGroups.find(g=>g.id===contentLocation.id)?.label || (activeTab==='learn'?contentGroups.find(g=>g.sub===learnSubTab)?.label:activeTab==='exercises'?contentGroups.find(g=>g.id===exerciseSelection)?.label:activeTab==='grammar'&&grammarSelection!=='all'?contentGroups.find(g=>g.id===grammarSelection)?.label:'اختر مكانك من المحتوى')}</b>{contentLocation.detail&&<><span aria-hidden="true">·</span><span>{contentLocation.detail}</span></>}</div><span className="context-count">{contentGroups.length} وجهات</span></div>
            {compactNav && quickSearchOpen && activeTab === 'vocab' && (
              <div className="study-quick-search" id="quick-vocab-search" role="search" aria-label="البحث في الكلمات">
                <Icon name="Search" size={18} />
                <input ref={quickSearchRef} type="search" dir={searchTextDirection(vocabQuery)} style={{textAlign:'start'}} aria-label="ابحث بنطق الكلمة أو معناها" placeholder="ابحث بنطق الكلمة أو معناها…" value={vocabQuery} onChange={e => updateQuickSearch(e.target.value)} onKeyDown={e => { if (e.key === 'Escape') setQuickSearchOpen(false); }} />
                {vocabQuery && <button className="study-search-clear" aria-label="مسح البحث السريع" onClick={() => updateQuickSearch('')}><Icon name="X" size={17} /></button>}
              </div>
            )}
          </div>
        </header>
      )}

      {!selectedSign && <ContentDrawer open={contentOpen} onClose={closeContent} groups={contentGroups} current={contentLocation.id} onChoose={chooseContent} sectionName={sectionNames[activeTab]}/>}
      {!selectedSign && (
        <main className="w-full">
          {/* TAB 1: Learn Path & Signs (Timeline, Full Alphabet, Phonograms) */}
          {activeTab === 'learn' && (
            <div className="space-y-4">
              {/* Secondary Sub-navigation pills */}
              <div className="learn-view-tabs" aria-label="طرق عرض الرموز" dir="rtl">
                <button
                  onClick={() => setLearnSubTab('path')}
                  className={`py-1.5 sm:py-2 px-2.5 sm:px-3.5 rounded-xl font-bold text-xs sm:text-sm transition-all ${
                    learnSubTab === 'path'
                      ? 'bg-amber-600 text-white shadow-sm'
                      : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-50'
                  }`}
                >
                  <span className="sm:hidden">📍 مسار الرموز</span>
                  <span className="hidden sm:inline">📍 مسار الرموز بالترتيب (خط زمني)</span>
                </button>
                <button
                  onClick={() => setLearnSubTab('grid')}
                  className={`py-1.5 sm:py-2 px-2.5 sm:px-3.5 rounded-xl font-bold text-xs sm:text-sm transition-all ${
                    learnSubTab === 'grid'
                      ? 'bg-amber-600 text-white shadow-sm'
                      : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-50'
                  }`}
                >
                  <span className="sm:hidden">𓀀 جدول الرموز</span>
                  <span className="hidden sm:inline">𓀀 جدول الرموز الكامل (Sign Grid)</span>
                </button>
                <button
                  onClick={() => setLearnSubTab('phonograms')}
                  className={`py-1.5 sm:py-2 px-2.5 sm:px-3.5 rounded-xl font-bold text-xs sm:text-sm transition-all ${
                    learnSubTab === 'phonograms'
                      ? 'bg-amber-600 text-white shadow-sm'
                      : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-50'
                  }`}
                >
                  <span className="sm:hidden">𓏠 العلامات الصوتية</span>
                  <span className="hidden sm:inline">𓏠 Phonograms / العلامات الصوتية</span>
                </button>
              </div>

              <p className="max-w-5xl mx-auto px-4 text-xs text-stone-500 leading-relaxed" dir="rtl">النقحرة: كتابة قيمة العلامات بحروف مثل sḏm، وليست ترجمتها. المقابل العربي تقريب تعليمي للصوت. الجدول يضم مجموعات العلامات الأحادية وأشكالها البديلة؛ العلامات المتعددة مختارات وليست قائمة جاردنر كاملة.</p>

              {/* View 1: Timeline Path */}
              {learnSubTab === 'path' && (
                <div data-nav-target="learn-path" data-content-id="learn-path" className="max-w-5xl mx-auto p-4 md:p-6 mt-2 md:mt-4">
                  {/* Mobile View: Timeline with Symbol Only (Self-testing) */}
                  <div className="md:hidden relative border-r-4 border-amber-200 pr-5 mr-3 space-y-3">
                    {sortedHieroglyphs.map((item, idx) => (
                      <div
                        key={idx}
                        data-nav-target={`learn-sign-${item.step}`} data-content-id="learn-path" data-content-detail={item.soundAr || item.trans}
                        onClick={() => handleSelectSign(item)}
                        className="relative bg-white border border-stone-200 rounded-xl p-3 flex items-center justify-between cursor-pointer hover:border-amber-500 shadow-sm transition-all"
                        dir="ltr"
                      >
                        <span className="absolute -right-[29px] w-5 h-5 rounded-full bg-amber-500 border-4 border-stone-100"></span>
                        {/* 1. Left: Hieroglyph Drawing (Only Symbol) */}
                        <div className="bg-stone-50 min-h-[56px] px-3 py-1.5 flex items-center justify-center rounded-lg border border-stone-200">
                          <SignCardFace item={item} isGrid={true} />
                        </div>
                        {/* 2. Right: Step badge and hint */}
                        <div className="flex flex-col items-end gap-1" dir="rtl">
                          <span className="text-xs font-bold text-amber-800 bg-amber-100/90 px-2.5 py-0.5 rounded-full">الرمز {item.step}</span>
                          <span className="text-[11px] text-stone-400 font-medium flex items-center gap-1">
                            <Icon name="Eye" size={12} /> اضغط للاختبار ومعرفة النطق
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Tablet / iPad / PC View: Centered Multi-Column Responsive Cards (Symbol only) */}
                  <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {sortedHieroglyphs.map((item, idx) => (
                      <div
                        key={idx}
                        data-nav-target={`learn-sign-${item.step}`} data-content-id="learn-path" data-content-detail={item.soundAr || item.trans}
                        onClick={() => handleSelectSign(item)}
                        className="group bg-white border border-stone-200 rounded-2xl p-5 flex flex-col items-center justify-center cursor-pointer hover:border-amber-500 hover:shadow-md hover:-translate-y-0.5 transition-all relative min-h-[140px]"
                      >
                        <div className="absolute top-3 right-3 flex items-center gap-1 text-xs font-bold text-amber-800 bg-amber-100/80 px-2.5 py-0.5 rounded-full">
                          <span>الرمز {item.step}</span>
                        </div>

                        <div className="my-auto py-2 flex items-center justify-center w-full">
                          <SignCardFace item={item} isGrid={false} />
                        </div>

                        <div className="text-xs text-stone-400 group-hover:text-amber-600 transition-colors flex items-center gap-1 font-medium mt-1">
                          <Icon name="Eye" size={13} /> <span>انقر لمعرفة النطق والتفاصيل</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* View 2: Full Alphabet Grid */}
              {learnSubTab === 'grid' && (
                <div data-nav-target="learn-grid" data-content-id="learn-grid" className="max-w-5xl mx-auto p-4 md:p-6 mt-2 md:mt-4 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2.5 sm:gap-3 md:gap-4" dir="ltr">
                  {hieroglyphsData.map((item, idx) => (
                    <button
                      key={idx}
                      data-nav-target={`grid-sign-${item.step}`} data-content-id="learn-grid" data-content-detail={item.soundAr || item.trans}
                      onClick={() => handleSelectSign(item)}
                      className="group bg-white border border-stone-200 rounded-2xl p-3 sm:p-4 aspect-square flex flex-col items-center justify-center hover:border-amber-500 hover:shadow-md hover:-translate-y-0.5 transition-all shadow-sm relative overflow-hidden"
                      title="انقر لاختبار معلوماتك ومعرفة التفاصيل"
                    >
                      <span className="absolute top-1.5 right-2 text-[10px] sm:text-xs font-bold text-stone-400 group-hover:text-amber-600">
                        {item.step}
                      </span>
                      <div className="my-auto flex items-center justify-center">
                        <SignCardFace item={item} isGrid={true} />
                      </div>
                      <span className="text-[10px] text-stone-400 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                        اختبر نفسك
                      </span>
                    </button>
                  ))}
                </div>
              )}

              {/* View 3: Phonograms */}
              {learnSubTab === 'phonograms' && <div data-nav-target="learn-phonograms" data-content-id="learn-phonograms"><PhonogramsSection key={contentJump?.stamp}/></div>}
            </div>
          )}

          {/* TAB 2: Vocabulary */}
          {activeTab === 'vocab' && <VocabularySection searchQuery={vocabQuery} setSearchQuery={setVocabQuery} />}

          {/* TAB 3: Grammar */}
          {activeTab === 'grammar' && <GrammarSection selectedLessonTab={grammarSelection} setSelectedLessonTab={setGrammarSelection} expandedLessons={grammarExpanded} setExpandedLessons={setGrammarExpanded} />}

          {/* TAB 4: Exercises & Quizzes */}
          {activeTab === 'exercises' && <ExercisesSection activeExTab={exerciseSelection} setActiveExTab={setExerciseSelection} />}
        </main>
      )}

      {selectedSign && (
        <div className="bg-stone-50 min-h-screen">
          <header className="bg-white border-b border-stone-200 p-4 sticky top-0 z-20 shadow-sm">
            <div className="max-w-5xl mx-auto flex items-center justify-between">
              <button onClick={() => { setSelectedSign(null); setActiveDrawingSign(null); }} className="flex items-center gap-2 text-stone-700 hover:bg-stone-200 bg-stone-100 px-4 py-2 rounded-xl font-semibold transition-colors">
                <Icon name="ArrowRight" size={20} /> رجوع
              </button>
              <SignPicker signs={orderedSigns} selected={selectedSign} onChoose={handleSelectSign} />
            </div>
          </header>

          <main className="max-w-5xl mx-auto p-4 md:p-6 mt-4 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Right Column on Desktop: Sign Info & Examples */}
            <div className="lg:col-span-7 space-y-6">
              {/* Top Hero Card: Responsive, Balanced on Mobile, Tablet & PC */}
              <div className="bg-white border border-stone-200 rounded-2xl p-5 sm:p-6 shadow-sm">
                {/* Header row: Arabic Sound Pill & Multiple forms indicator */}
                <div className="flex items-center justify-between border-b border-stone-100 pb-3 mb-4">
                  <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-800 px-3.5 py-1 rounded-full text-sm font-bold">
                    <span>المقابل العربي التقريبي: {selectedSign.soundAr}</span>
                  </div>
                  {selectedSign.forms && selectedSign.forms.length > 1 && (
                    <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">له أكثر من شكل ({selectedSign.forms.length})</span>
                  )}
                </div>

                {/* Content row */}
                <div className="flex flex-col sm:flex-row items-center sm:items-stretch gap-4 md:gap-5">
                  {/* 1. Hieroglyph Display Box */}
                  {selectedSign.forms && selectedSign.forms.length > 1 ? (
                    <div className="bg-stone-50 p-3 sm:p-4 rounded-2xl border border-stone-200 flex items-center justify-center gap-3 sm:gap-4 shrink-0" dir="ltr">
                      {selectedSign.forms.map((f, i) => (
                        <div key={i} className="flex flex-col items-center">
                          <span className="text-[11px] font-serif font-bold text-stone-400 mb-0.5">({f.num})</span>
                          <span className="text-5xl sm:text-6xl font-['Segoe_UI_Historic'] text-slate-800">{f.sign}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-stone-50 p-4 sm:p-5 rounded-2xl border border-stone-200 flex items-center justify-center shrink-0 min-w-[90px] min-h-[90px]">
                      <span className="text-6xl sm:text-7xl font-['Segoe_UI_Historic'] text-slate-800">{selectedSign.h}</span>
                    </div>
                  )}

                  {/* 2. Sound, Transliteration & Meaning */}
                  <div className="flex flex-col justify-center gap-2 text-center sm:text-right w-full">
                    <div className="flex items-baseline justify-center sm:justify-start">
                      <span className="text-3xl sm:text-4xl font-serif text-amber-600 font-bold" dir="ltr">{selectedSign.trans}</span>
                    </div>
                    <div className="text-sm text-stone-700 bg-amber-50/60 p-2.5 rounded-xl border border-amber-100">
                      <div className="font-bold text-slate-800 text-base">{selectedSign.descAr || selectedSign.meaning}</div>
                      {selectedSign.descEn && (
                        <div className="text-xs text-stone-500 font-medium mt-0.5" dir="ltr">({selectedSign.descEn})</div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Switch Drawing Form if multiple forms exist */}
                {selectedSign.forms && selectedSign.forms.length > 1 && (
                  <div className="mt-4 pt-3 border-t border-stone-100 flex flex-wrap items-center justify-center sm:justify-start gap-2">
                    <span className="text-xs font-bold text-stone-600">اختر الشكل للرسم:</span>
                    {selectedSign.forms.map((f, i) => (
                      <button
                        key={i}
                        onClick={() => setActiveDrawingSign(f.sign)}
                        className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                          activeDrawingSign === f.sign
                            ? 'bg-amber-600 text-white shadow-sm'
                            : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                        }`}
                      >
                        <span className="text-base font-['Segoe_UI_Historic']">{f.sign}</span>
                        <span>{f.desc}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Examples Card */}
              <div className="bg-white border border-stone-200 rounded-2xl p-5 sm:p-6 shadow-sm">
                <h3 className="font-bold text-lg text-slate-800 mb-4 flex items-center gap-2">
                  <Icon name="BookOpen" size={20} className="text-amber-600" />
                  <span>أمثلة على استخدام الرمز في الكلمات</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3" dir="ltr">
                  {selectedSign.examples && selectedSign.examples.map((ex, i) => (
                    <div key={i} className="flex items-center gap-3 bg-stone-50 border border-stone-200/80 p-3 rounded-xl hover:border-amber-300 transition-colors">
                      <div className="bg-white border border-stone-200 rounded-lg p-2 min-w-[50px] flex items-center justify-center">
                        <HieroglyphBlock code={ex.word || ex.h} size="normal" />
                      </div>
                      <div className="flex flex-col text-left">
                        <span className="font-serif font-bold text-amber-700 text-base">{ex.trans}</span>
                        <span className="text-xs text-stone-700 font-medium">{ex.mean}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Left Column on Desktop: Interactive Drawing Pad */}
            <div className="lg:col-span-5 bg-white border border-stone-200 rounded-2xl p-4 sm:p-6 shadow-sm lg:sticky lg:top-24">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-stone-100">
                <div className="flex items-center gap-2">
                  <Icon name="PenTool" size={20} className="text-amber-600" />
                  <h3 className="font-bold text-lg text-slate-800">لوحة التدريب على الرسم</h3>
                </div>
                <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                  ارسم بيدك أو بالقلم
                </span>
              </div>
              <div className="mb-4">
                <DrawingPad key={selectedSign.step} sign={activeDrawingSign || selectedSign.h} />
              </div>
            </div>
          </main>
          <nav className="sign-pagination" aria-label="التنقل بين الرموز" dir="rtl">
            <button disabled={selectedSignIndex <= 0} onClick={() => handleSelectSign(orderedSigns[selectedSignIndex - 1])}><Icon name="ArrowRight" size={18} className="rotate-180"/><span>السابق</span></button>
            <span aria-live="polite">{selectedSignIndex + 1} من {orderedSigns.length}</span>
            <button disabled={selectedSignIndex >= orderedSigns.length - 1} onClick={() => handleSelectSign(orderedSigns[selectedSignIndex + 1])}><span>التالي</span><Icon name="ArrowRight" size={18}/></button>
          </nav>
        </div>
      )}
    </div>
  );
}
