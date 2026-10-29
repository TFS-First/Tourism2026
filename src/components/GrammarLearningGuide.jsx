// Optional, data-driven introduction: lessons keep their own teaching content.
const GrammarLearningGuide = ({ guide }) => {
  const [step, setStep] = useState(0);
  const guideId = React.useId();
  if (!guide?.steps?.length) return null;
  const current = guide.steps[Math.min(step, guide.steps.length - 1)];
  return (
    <section className="grammar-guide" dir="rtl" aria-label={guide.title}>
      <div className="grammar-guide-heading"><span className="grammar-guide-kicker">قبل التفاصيل</span><h3>{guide.title}</h3><p>{guide.intro}</p></div>
      <div className="grammar-guide-tabs" role="group" aria-label="خطوات فهم الدرس">
        {guide.steps.map((item, i) => <button key={i} id={`${guideId}-step-${i}`} aria-pressed={step === i} aria-controls={`${guideId}-panel`} onClick={() => setStep(i)}>{item.tabLabel || item.title}</button>)}
      </div>
      <div id={`${guideId}-panel`} role="region" aria-labelledby={`${guideId}-step-${step}`} className="grammar-guide-panel">
        <h4>{current.title}</h4><p>{current.explanation}</p>
        <div className="grammar-guide-pairs">{current.pairs.map((pair, i) => <article key={i} className="grammar-guide-example">
          <span className="grammar-guide-label">{pair.label}</span><h5>{pair.arabic}</h5>
          <div className="grammar-guide-trans" dir="ltr">{pair.trans}</div>
          <p>{pair.literal}</p><p className="grammar-guide-analysis">{pair.analysis}</p>
        </article>)}</div>
        <p className="grammar-guide-note">{current.note}</p>
        <div className="grammar-guide-pagination"><button disabled={step === 0} onClick={() => setStep(n => n - 1)}>الخطوة السابقة</button><span>{step + 1} / {guide.steps.length}</span><button disabled={step === guide.steps.length - 1} onClick={() => setStep(n => n + 1)}>الخطوة التالية</button></div>
      </div>
      <details className="grammar-guide-source"><summary>المصدر وطريقة قراءة الأمثلة</summary><p>{guide.source}</p></details>
    </section>
  );
};
