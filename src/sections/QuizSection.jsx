const QuizSection = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [isPlaying, setIsPlaying] = useState(false);
  const [questionList, setQuestionList] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  const startQuiz = (cat = activeCategory) => {
    setActiveCategory(cat);
    let pool = [];
    if (cat === 'all') {
      pool = [...comprehensiveQuizData];
    } else {
      pool = comprehensiveQuizData.filter(q => q.category === cat);
    }
    const shuffled = [...pool].sort(() => Math.random() - 0.5).slice(0, 10);
    setQuestionList(shuffled);
    setCurrentIndex(0);
    setSelectedOption(null);
    setScore(0);
    setQuizFinished(false);
    setIsPlaying(true);
  };

  const currentQ = questionList[currentIndex];

  const handleSelectOption = (opt) => {
    if (selectedOption !== null) return;
    setSelectedOption(opt);
    if (opt.isCorrect) {
      setScore(s => s + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentIndex + 1 < questionList.length) {
      setCurrentIndex(i => i + 1);
      setSelectedOption(null);
    } else {
      setQuizFinished(true);
    }
  };

  // Welcome / Category selection screen
  if (!isPlaying) {
    return (
      <div className="max-w-2xl mx-auto p-2.5 sm:p-4 md:p-6 space-y-4 sm:space-y-6">
        <div className="bg-white border border-stone-200 rounded-3xl p-4 sm:p-6 md:p-8 text-center shadow-sm">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-amber-100/80 rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4 border border-amber-300">
            <Icon name="Award" size={36} className="text-amber-700" />
          </div>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-800 mb-1 leading-snug" dir="ltr">Comprehensive Ancient Egyptian Exam</h2>
          <span className="text-xs sm:text-sm font-semibold text-stone-500 block mb-3" dir="rtl">(الاختبار الشامل للغة المصرية القديمة)</span>
          <p className="text-stone-600 text-xs sm:text-sm md:text-base max-w-lg mx-auto mb-5 sm:mb-6 leading-relaxed" dir="ltr">
            Test your mastery of Hieroglyphic signs, Gardiner alphabet, vocabulary words, and sentence grammar. Select a test category below to begin.
          </p>

          {/* Category Selection Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3 mb-5 sm:mb-6" dir="ltr">
            {[
              { id: 'all', title: '🌟 All Lessons Exam', desc: 'Combined exam covering signs, vocabulary & grammar (شامل)' },
              { id: 'alphabet', title: '𓀀 Signs & Phonograms', desc: 'Uniliterals, biliterals & triliterals (العلامات والرموز الصوتية)' },
              { id: 'vocabulary', title: '📚 Vocabulary & Words', desc: 'Word meanings, spellings & determinatives (قاموس الكلمات)' },
              { id: 'grammar', title: '📐 Grammar & Syntax', desc: 'Transitive/Intransitive verbs, passive & word order (القواعد)' }
            ].map(cat => (
              <button
                key={cat.id}
                onClick={() => startQuiz(cat.id)}
                className="p-3.5 sm:p-4 bg-stone-50 hover:bg-amber-50 hover:border-amber-400 border border-stone-200 rounded-2xl text-left transition-all group shadow-xs hover:shadow-md cursor-pointer"
              >
                <h4 className="font-bold text-slate-800 group-hover:text-amber-700 text-sm sm:text-base mb-1">{cat.title}</h4>
                <p className="text-xs text-stone-500 leading-relaxed">{cat.desc}</p>
              </button>
            ))}
          </div>

          <button
            onClick={() => startQuiz('all')}
            className="w-full py-3 sm:py-3.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-2xl text-sm sm:text-base md:text-lg transition-colors shadow-md flex items-center justify-center gap-2"
          >
            <Icon name="Sparkles" size={18} /> Start Comprehensive Exam Now <span className="text-xs opacity-80" dir="rtl">(ابدأ الاختبار)</span>
          </button>
        </div>
      </div>
    );
  }

  // Quiz Finished / Results screen
  if (quizFinished) {
    const total = questionList.length;
    const pct = Math.round((score / total) * 100);
    let gradeBadge = { text: "Outstanding Mastery! 🏆 (ممتاز ومتقن)", color: "text-green-700 bg-green-100 border-green-300" };
    if (pct < 50) gradeBadge = { text: "Needs Review of Grammar & Words 📖 (بحاجة لمراجعة)", color: "text-amber-800 bg-amber-100 border-amber-300" };
    else if (pct < 80) gradeBadge = { text: "Very Good Progress! 🌟 (أداء جيد جداً)", color: "text-blue-800 bg-blue-100 border-blue-300" };

    return (
      <div className="max-w-xl mx-auto p-4 md:p-6">
        <div className="bg-white border border-stone-200 rounded-3xl p-6 md:p-8 text-center shadow-sm space-y-6 animate-in zoom-in-95 duration-300">
          <div className="w-20 h-20 bg-amber-100/90 rounded-2xl flex items-center justify-center mx-auto border border-amber-300">
            <Icon name="Award" size={44} className="text-amber-700" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-slate-800 mb-1" dir="ltr">Exam Results <span className="text-base text-stone-500 font-normal" dir="rtl">(نتيجة الاختبار)</span></h3>
            <span className={`inline-block px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold border mt-2 ${gradeBadge.color}`}>
              {gradeBadge.text}
            </span>
          </div>

          <div className="bg-stone-50 rounded-2xl p-5 border border-stone-200 flex items-center justify-around" dir="ltr">
            <div className="text-center">
              <span className="text-xs text-stone-500 font-medium block">Correct Answers</span>
              <span className="text-3xl font-bold text-slate-800">{score} / {total}</span>
            </div>
            <div className="h-10 w-px bg-stone-300"></div>
            <div className="text-center">
              <span className="text-xs text-stone-500 font-medium block">Percentage</span>
              <span className="text-3xl font-bold text-amber-600">{pct}%</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2" dir="ltr">
            <button
              onClick={() => startQuiz(activeCategory)}
              className="flex-1 py-3 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl transition-colors shadow-sm flex items-center justify-center gap-2"
            >
              <Icon name="RotateCcw" size={18} /> Restart Exam <span className="text-xs opacity-80" dir="rtl">(إعادة الاختبار)</span>
            </button>
            <button
              onClick={() => setIsPlaying(false)}
              className="flex-1 py-3 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold rounded-xl transition-colors"
            >
              Choose Category (اختيار قسم آخر)
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Active Question Card (English Primary)
  return (
    <div className="max-w-2xl mx-auto p-2.5 sm:p-4 md:p-6 space-y-4 sm:space-y-5">
      {/* Category Pills & Progress */}
      <div className="flex flex-wrap justify-between items-center gap-2 bg-white border border-stone-200 p-2.5 sm:p-3 rounded-2xl shadow-xs" dir="ltr">
        <span className="text-xs font-bold text-amber-800 bg-amber-100/90 px-3 py-1 rounded-full">
          {currentQ?.categoryLabelEn || currentQ?.categoryLabel}
        </span>
        <div className="flex items-center gap-3 sm:gap-4 text-xs sm:text-sm font-bold text-stone-600">
          <span>Question {currentIndex + 1} of {questionList.length}</span>
          <span className="text-amber-700">Score: {score}</span>
        </div>
      </div>

      {/* Question Box */}
      <div className="bg-white border border-stone-200 rounded-3xl p-4 sm:p-6 md:p-7 shadow-sm space-y-4 sm:space-y-5">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-1" dir="ltr">{currentQ?.qEn}</h3>
          {currentQ?.qAr && <p className="text-xs sm:text-sm text-stone-500 font-medium" dir="rtl">{currentQ?.qAr}</p>}
        </div>

        {/* Hieroglyph Display if present */}
        {currentQ?.hieroglyph && (
          <div className="flex items-center justify-center p-4 sm:p-5 bg-stone-50/90 rounded-2xl border border-stone-200/80 min-h-[70px]">
            <HieroglyphBlock code={currentQ.hieroglyph} size="large" />
          </div>
        )}

        {/* Options List (English First) */}
        <div className="space-y-2.5" dir="ltr">
          {currentQ?.options.map((opt, i) => {
            let optStyle = "w-full p-3.5 sm:p-4 rounded-xl border-2 transition-all flex items-center justify-between text-left cursor-pointer ";
            if (selectedOption === null) {
              optStyle += "border-stone-200 bg-white hover:border-amber-400 hover:bg-amber-50/40 text-slate-800";
            } else if (opt.isCorrect) {
              optStyle += "border-green-500 bg-green-50 text-green-900 shadow-xs font-bold";
            } else if (selectedOption.id === opt.id && !opt.isCorrect) {
              optStyle += "border-red-500 bg-red-50 text-red-900 shadow-xs font-bold";
            } else {
              optStyle += "border-stone-200 bg-stone-50/60 text-stone-400 opacity-60";
            }

            return (
              <button
                key={i}
                type="button"
                onClick={() => handleSelectOption(opt)}
                disabled={selectedOption !== null}
                className={optStyle}
              >
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-lg bg-stone-100 border border-stone-200 flex items-center justify-center text-xs font-bold shrink-0">
                    {String.fromCharCode(65 + i)}
                  </span>
                  <div className="flex flex-col text-left">
                    <span className="text-sm sm:text-base font-bold font-['Segoe_UI_Historic']">{opt.text}</span>
                    {opt.desc && <span className="text-xs text-stone-500 font-normal">{opt.desc}</span>}
                  </div>
                </div>

                {selectedOption !== null && opt.isCorrect && (
                  <span className="text-green-600 shrink-0"><Icon name="CheckCircle2" size={20} /></span>
                )}
                {selectedOption !== null && selectedOption.id === opt.id && !opt.isCorrect && (
                  <span className="text-red-600 shrink-0"><Icon name="XCircle" size={20} /></span>
                )}
              </button>
            );
          })}
        </div>

        {/* Explanation Banner & Next Button after answering */}
        {selectedOption !== null && (
          <div className="space-y-4 pt-2 animate-in fade-in slide-in-from-top-2 duration-300" dir="ltr">
            <div className={`p-4 rounded-2xl border text-sm leading-relaxed ${
              selectedOption.isCorrect
                ? 'bg-green-50 border-green-200 text-green-900'
                : 'bg-red-50 border-red-200 text-red-900'
            }`}>
              <div className="flex items-center gap-2 font-bold mb-1">
                <Icon name={selectedOption.isCorrect ? "CheckCircle2" : "XCircle"} size={18} />
                <span>{selectedOption.isCorrect ? 'Correct Answer! 🎉' : 'Incorrect. Notice the syntax rule:'}</span>
              </div>
              <p className="text-xs sm:text-sm mt-1 text-slate-800 leading-normal">{currentQ?.explanation}</p>
            </div>

            <button
              onClick={handleNextQuestion}
              className="w-full py-3.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl text-sm sm:text-base transition-colors shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>{currentIndex + 1 < questionList.length ? 'Next Question (السؤال التالي)' : 'Show Final Results (عرض النتيجة)'}</span>
              <Icon name="ArrowRight" size={18} />
            </button>
          </div>
        )}
      </div>

      <div className="text-center">
        <button
          onClick={() => setIsPlaying(false)}
          className="text-xs text-stone-400 hover:text-stone-600 font-medium transition-colors"
        >
          Exit Exam & Return to Menu (العودة للقائمة)
        </button>
      </div>
    </div>
  );
};
