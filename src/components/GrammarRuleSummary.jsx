const GrammarRuleSummary = ({ summary }) => <section className="rule-summary" dir="rtl" aria-label={`ملخص القاعدة: ${summary.titleAr}`}>
  <span className="rule-summary-kicker">خلاصة القاعدة · Rule summary</span>
  <h4>{summary.titleAr}</h4><p>{summary.explanationAr}</p>
  <div className="rule-summary-english" dir="ltr"><b>{summary.titleEn}</b><p>{summary.explanationEn}</p></div>
  {summary.example && <div className="rule-summary-example"><div className="rule-summary-glyph"><HieroglyphBlock code={summary.example.h} size="normal" boxed={false}/></div><div><b dir="ltr">{summary.example.trans}</b><p>{summary.example.meanAr}</p><p dir="ltr">{summary.example.meanEn}</p></div></div>}
</section>;
