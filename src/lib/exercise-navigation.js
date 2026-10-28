const exerciseNavigation = () => [
  ...Object.entries(exercisesData).filter(([,items]) => Array.isArray(items)).map(([id,items],index) => ({
    id, label: grammarData.find(g => g.id === id)?.titleAr.split(':')[0] || `الدرس ${index + 1}`,
    detail: `${items.length} تدريب`, children: items.map((item,i) => ({
      id: `exercise-${id}-${i}`, label: item.trans || `التدريب ${i + 1}`, detail: item.meanAr || item.meanEn || item.mean || '', anchor: `exercise-${id}-${i}`
    }))
  })),
  { id:'typing', label:'تدريب الكتابة', detail:'اكتب وتحقق من إجابتك', children:[] },
  { id:'quiz', label:'الاختبار الشامل', detail:'اختبر ما تعلمته', children:[] }
];
