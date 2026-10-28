const TypingExercise = () => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedLesson, setSelectedLesson] = useState('all');
  const [userInput, setUserInput] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [showHint, setShowHint] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [score, setScore] = useState(0);
  const [answeredCount, setAnsweredCount] = useState(0);

  const lessonFilters = [
          { id: 'all', label: `🌟 All Lessons (${typingQuestionsData.length})` },
          ...[...new Set(typingQuestionsData.map(question => question.lessonEn))].map(title => ({
            id: title,
            label: `${lessonRegistry.find(lesson => lesson.titleEn === title)?.typingIcon || '📘'} ${title} (${typingQuestionsData.filter(question => question.lessonEn === title).length})`
          }))
        ];

  const filteredQuestions = useMemo(() => {
    if (selectedLesson === 'all') return typingQuestionsData;
    return typingQuestionsData.filter(q => q.lessonEn === selectedLesson);
  }, [selectedLesson]);

  const currentQ = filteredQuestions[currentIdx % filteredQuestions.length];

  const handleCharInsert = (char) => {
    setUserInput(prev => prev + char);
  };

  const handleNormalize = (str) => {
    if (!str) return '';
    return str
      .toLowerCase()
      .replace(/\s+/g, ' ')
      .replace(/[\.\=]/g, '')
      .replace(/[ʾ’']/g, '3')
      .replace(/[ʿ‘]/g, 'ʿ')
      .trim();
  };

  const handleCheck = () => {
    if (!userInput.trim()) return;
    const cleanUser = handleNormalize(userInput);
    const cleanTarget = handleNormalize(currentQ.trans);

    const isMatch = cleanUser === cleanTarget || 
      cleanUser.replace(/\s+/g, '') === cleanTarget.replace(/\s+/g, '') ||
      userInput.trim().toLowerCase() === currentQ.trans.toLowerCase();

    if (isMatch) {
      setFeedback({ isCorrect: true, message: "🎉 Excellent! Correct transliteration." });
      setScore(prev => prev + 1);
    } else {
      setFeedback({ isCorrect: false, message: "🧐 Not quite right. Check your spelling or click 'Reveal Solution'." });
    }
    setAnsweredCount(prev => prev + 1);
  };

  const handleNext = () => {
    setUserInput('');
    setFeedback(null);
    setShowHint(false);
    setShowSolution(false);
    setCurrentIdx(prev => (prev + 1) % filteredQuestions.length);
  };

  const handleFilter = (lKey) => {
    setSelectedLesson(lKey);
    setCurrentIdx(0);
    setUserInput('');
    setFeedback(null);
    setShowHint(false);
    setShowSolution(false);
  };

  const specialChars = ['3', 'ỉ', 'ʿ', 'ḥ', 'ḫ', 'ẖ', 'š', 'ḳ', 'ṯ', 'ḏ', '=', '.n', '.tw'];

  return (
    <div className="space-y-6">
      {/* Top Banner (English Primary) */}
      <div className="bg-gradient-to-l from-amber-500/10 via-amber-50 to-white border border-amber-200/80 p-3.5 sm:p-5 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
        <div className="flex items-start gap-2.5">
          <span className="p-1.5 bg-amber-500 text-white rounded-xl shrink-0 mt-0.5 shadow-xs">
            <Icon name="Edit3" size={16}/>
          </span>
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-1">
              <h3 className="font-bold text-slate-900 text-sm sm:text-base md:text-lg leading-snug" dir="ltr">
                Interactive Transliteration Practice
              </h3>
              <span className="text-xs font-semibold text-amber-800 self-start sm:self-auto bg-amber-100/70 px-2 py-0.5 rounded-md" dir="rtl">
                تدريب كتابة تفاعلي
              </span>
            </div>
            <p className="text-stone-600 text-xs sm:text-sm mt-1" dir="ltr">
              Look at the hieroglyphic symbols and type the correct Gardiner transliteration. Use the on-screen special character keys below to insert symbols easily.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 shrink-0 self-end sm:self-auto">
          <div className="bg-white border border-amber-300 px-3.5 py-1.5 rounded-xl shadow-xs text-center">
            <span className="block text-[11px] text-stone-500 font-medium" dir="ltr">Score</span>
            <span className="text-base sm:text-lg font-bold text-amber-700">{score} / {answeredCount}</span>
          </div>
        </div>
      </div>

      {/* Lesson Filter Pills */}
      {lessonFilters.length > 7 ? (
        <label className="lesson-quick-select" htmlFor="typing-lesson-select"><span>درس الكتابة</span><select id="typing-lesson-select" value={selectedLesson} onChange={event=>handleFilter(event.target.value)}>{lessonFilters.map(tab=><option key={tab.id} value={tab.id}>{tab.label}</option>)}</select></label>
      ) : <div className="flex flex-wrap justify-center gap-2" dir="ltr">
        {lessonFilters.map(tab => (
          <button
            key={tab.id}
            onClick={() => handleFilter(tab.id)}
            className={`py-1.5 px-3.5 rounded-xl font-bold text-xs sm:text-sm transition-all ${
              selectedLesson === tab.id
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>}

      {/* Question Card */}
      {currentQ && (
        <div className="bg-white border border-stone-200 rounded-2xl shadow-sm p-5 md:p-7 max-w-3xl mx-auto space-y-6">
          {/* Header of question */}
          <div className="flex items-center justify-between border-b border-stone-100 pb-3" dir="ltr">
            <span className="text-xs font-bold text-amber-800 bg-amber-100/80 px-2.5 py-1 rounded-full">
              {currentQ.lessonEn || currentQ.lesson} • Question {(currentIdx % filteredQuestions.length) + 1} of {filteredQuestions.length}
            </span>
            <button
              onClick={() => setShowHint(prev => !prev)}
              className="text-xs font-bold text-stone-500 hover:text-amber-700 flex items-center gap-1 transition-colors"
            >
              <Icon name="HelpCircle" size={14} /> {showHint ? 'Hide Hint' : 'Grammar Hint (تلميح)'}
            </button>
          </div>

          {/* Hint box if visible */}
          {showHint && (
            <div className="bg-blue-50 border border-blue-200 p-3 rounded-xl text-xs text-blue-900 animate-in fade-in" dir="ltr">
              <span className="font-bold">💡 Syntax Hint:</span> {currentQ.hint}
            </div>
          )}

          {/* Large Hieroglyphs Display */}
          <div className="flex flex-col items-center justify-center p-6 bg-stone-50/90 rounded-2xl border border-stone-200/80 min-h-[90px]">
            <HieroglyphBlock code={currentQ.h} size="large" />
          </div>

          {/* Special Gardiner transliteration character buttons */}
          <div className="space-y-1.5" dir="ltr">
            <span className="text-[11px] font-bold text-stone-500 block text-center">
              Special Gardiner Characters <span className="text-stone-400 font-normal" dir="rtl">(انقر لإضافة الحروف الخاصة):</span>
            </span>
            <div className="flex flex-wrap justify-center gap-1.5">
              {specialChars.map(char => (
                <button
                  key={char}
                  type="button"
                  onClick={() => handleCharInsert(char)}
                  className="px-2.5 py-1 bg-stone-100 hover:bg-amber-100 hover:border-amber-400 border border-stone-200 rounded-lg font-serif font-bold text-slate-800 text-sm sm:text-base transition-colors active:scale-95 shadow-xs cursor-pointer"
                >
                  {char}
                </button>
              ))}
            </div>
            <p className="text-[11px] text-stone-500 text-center pt-1" dir="rtl">
              💡 <strong>ملاحظة:</strong> الحروف الإنجليزية العادية (مثل <code className="font-mono text-amber-800 font-bold">m, p, t</code>) تُكتب مباشرة من كيبورد جهازك. أما المخصصات الدلالية (مثل سقف السماء 𓇯) فهي غير منطوقة ولا تُكتب في النطق الصوتي.
            </p>
          </div>

          {/* Input field */}
          <div className="space-y-2">
            <div className="relative" dir="ltr">
              <input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') handleCheck(); }}
                placeholder="Type transliteration here (e.g. sḏm=f rn pn)..."
                className="w-full text-center text-lg sm:text-xl font-serif font-bold p-3.5 bg-stone-50 border-2 border-stone-300 rounded-xl focus:border-amber-500 focus:bg-white focus:outline-none transition-all placeholder:font-sans placeholder:text-stone-400 placeholder:text-sm"
              />
              {userInput && (
                <button
                  type="button"
                  onClick={() => setUserInput('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 text-xs bg-stone-200/80 rounded-full w-5 h-5 flex items-center justify-center"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Action buttons (English Primary) */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2" dir="ltr">
            <button
              onClick={handleCheck}
              className="flex-1 min-w-[140px] py-2.5 px-4 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl shadow-md transition-colors text-sm sm:text-base flex items-center justify-center gap-1.5"
            >
              <Icon name="Check" size={18} /> Check Answer <span className="text-xs opacity-80" dir="rtl">(تحقق)</span>
            </button>
            <button
              onClick={() => setShowSolution(prev => !prev)}
              className="py-2.5 px-4 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold rounded-xl transition-colors text-sm"
            >
              {showSolution ? 'Hide Solution' : 'Reveal Solution (كشف الحل)'}
            </button>
            <button
              onClick={handleNext}
              className="py-2.5 px-4 bg-stone-800 hover:bg-black text-white font-bold rounded-xl transition-colors text-sm flex items-center gap-1.5"
            >
              Next (التالي) <Icon name="ArrowRight" size={16} />
            </button>
          </div>

          {/* Feedback banner */}
          {feedback && (
            <div className={`p-4 rounded-xl text-center font-bold text-sm sm:text-base animate-in zoom-in-95 duration-200 ${
              feedback.isCorrect
                ? 'bg-green-50 text-green-800 border border-green-300'
                : 'bg-red-50 text-red-800 border border-red-300'
            }`} dir="ltr">
              {feedback.message}
            </div>
          )}

          {/* Solution & Meanings card */}
          {(showSolution || feedback?.isCorrect) && (
            <div className="bg-amber-50/70 border border-amber-300/80 rounded-xl p-4 text-center space-y-2 animate-in fade-in" dir="ltr">
              <span className="text-xs font-bold text-amber-900 uppercase block tracking-wider">Model Transliteration & Meaning:</span>
              <span className="text-2xl sm:text-3xl font-serif font-bold text-amber-800 block">{currentQ.trans}</span>
              <div className="flex flex-col items-center justify-center gap-0.5">
                <span className="text-base sm:text-lg font-bold text-slate-900">{currentQ.meanEn}</span>
                {currentQ.meanAr && <span className="text-xs text-stone-500 font-medium" dir="rtl">({currentQ.meanAr})</span>}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
