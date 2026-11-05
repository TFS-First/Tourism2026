# إضافة محاضرة لمواد التاريخ

هذا الدليل لصفحات المحاضرات في `history/` و`graeco-roman/` و`islamic-history/` و`modern-history/`. دروس **اللغة المصرية القديمة** تُضاف عبر `docs/ADDING_LESSONS.md` وملفات `src/lessons/`.

## قبل كتابة الصفحة

1. افحص `git status` والفرع، ولا تستبدل عملًا مفتوحًا في صفحة المادة.
2. اطلب صفحات المصدر والطبعة أو الملف المعتمد، ودوّن المصدر. لا تضف حقائق تاريخية بالتخمين.
3. استخدم صفحة محاضرة موجودة في **نفس المادة** أساسًا للتنسيق، وحافظ على روابط البوابة وفهرس المادة وصور المادة.

## بنية الأقسام المطوية

كل قسم من القاموس والاستزادة والتدريبات يبدأ **مغلقًا**. لا تضع `open` على العنصر الخارجي. استخدم هذه البنية في كل محاضرة جديدة:

```html
<section id="vocabulary" class="scroll-mt-36">
  <details class="course-fold">
    <summary dir="rtl">افتح قاموس ومصطلحات الدرس</summary>
    <div class="course-fold-body">
      <!-- بطاقات المفردات وآلية فتحها المفردة هنا -->
    </div>
  </details>
</section>

<section id="guide-briefing" class="scroll-mt-36">
  <details class="course-fold">
    <summary dir="rtl">للاستزادة: شرح المرشد السياحي بالإنجليزية</summary>
    <div class="course-fold-body" dir="ltr" style="text-align: left">
      <!-- النص الإنجليزي هنا -->
    </div>
  </details>
</section>

<section id="quiz" class="scroll-mt-36">
  <details class="course-fold">
    <summary dir="rtl">افتح تدريبات وأسئلة الدرس</summary>
    <div class="course-fold-body">
      <!-- الأسئلة والتصحيح هنا -->
    </div>
  </details>
</section>
```

قد تحتوي بطاقات المفردات على عناصر `<details>` داخلية؛ هذا لا يغني عن طيّ قسم `#vocabulary` كاملًا. أبقِ معرّفات الأقسام على `<section>` حتى يستطيع `assets/course-ui.js` فتحها عند الانتقال عبر الرابط المباشر.

أضف إلى `<head>`: `<link rel="stylesheet" href="../assets/course-ui.css">`، وقبل `</body>`: `<script src="../assets/course-ui.js" defer></script>`. استخدم شريط `course-header` الثابت وقائمة `course-mobile-nav` ومحاور الدرس كما في المحاضرات القائمة.

## تحقق قبل التسليم

- القاموس والاستزادة والتدريبات مغلقة عند فتح الصفحة، وتفتح وتغلق بالملخص العربي.
- روابط `#vocabulary` و`#guide-briefing` و`#quiz` تفتح القسم المقصود حتى عند فتح الصفحة بالرابط المباشر.
- النص الإنجليزي LTR ومحاذاته يسار، والعناوين والأزرار العربية RTL.
- لا تمرير أفقي زائد ولا محتوى خلف الشريط الثابت عند 320 و390 و768 و1280 بكسل.
- روابط الصفحات والصور نسبية وصحيحة؛ `npm run build` و`npm run check` و`npm test` ناجحة.
