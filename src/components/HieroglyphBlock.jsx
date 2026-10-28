const HieroglyphBlock = ({ code, size = "normal", boxed = true, className = "" }) => {
  if (!code) return null;
  const words = code.trim().split(/\s+/);

  // Moderate, natural proportions (authentic Egyptology typography)
  const singleCls = 
    size === "vocab" ? "text-[length:var(--vocab-sign-size)]" :
    size === "flashcard" ? "text-3xl sm:text-4xl" :
    size === "huge" ? "text-3xl sm:text-4xl md:text-5xl" :
    size === "large" ? "text-2xl sm:text-3xl md:text-4xl" :
    size === "compact" ? "text-base sm:text-lg" :
    size === "small" ? "text-sm sm:text-base" :
    "text-xl sm:text-2xl";

  const stackedCls = 
    size === "vocab" ? "text-[length:var(--vocab-stacked-size)]" :
    size === "flashcard" ? "text-xl sm:text-2xl" :
    size === "huge" ? "text-xl sm:text-2xl md:text-3xl" :
    size === "large" ? "text-base sm:text-lg md:text-xl" :
    size === "compact" ? "text-[10px] sm:text-xs" :
    size === "small" ? "text-[10px] sm:text-xs" :
    "text-xs sm:text-sm";

  const wordBoxCls = boxed 
    ? ((size === "compact" || size === "small")
        ? "bg-stone-50 hover:bg-amber-50/60 px-1.5 sm:px-2 py-0.5 rounded-lg border border-stone-200/80 shadow-[0_1px_2px_rgba(0,0,0,0.02)]" 
        : "bg-stone-50 hover:bg-amber-50/60 px-2 sm:px-2.5 py-1 rounded-xl border border-stone-200/80 shadow-[0_1px_2px_rgba(0,0,0,0.02)]")
    : "px-0.5 py-0.5";

  const renderNode = (node, key, isStacked = false) => {
    if (node.type === "sign") {
      if (node.text === "," || node.text === "،") {
        return (
          <span key={key} className="text-sm font-bold text-stone-400 mx-1 select-none">
            ،
          </span>
        );
      }
      return (
        <span key={key} className={`${isStacked ? stackedCls : singleCls} leading-none select-none inline-flex items-center justify-center`}>
          {node.text}
        </span>
      );
    }
    if (node.type === "stack") {
      return (
        <div key={key} className="inline-flex flex-col items-center justify-center leading-none gap-0.5 shrink-0">
          {node.items.map((sub, idx) => renderNode(sub, idx, true))}
        </div>
      );
    }
    if (node.type === "row") {
      return (
        <div key={key} className="inline-flex flex-wrap items-center justify-center gap-x-1 sm:gap-x-1.5 gap-y-2.5 sm:gap-y-3 leading-none max-w-full">
          {node.items.map((sub, idx) => renderNode(sub, idx, isStacked))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className={`inline-flex flex-wrap items-center justify-center ${size === 'compact' ? 'gap-1' : 'gap-1.5'} font-['Segoe_UI_Historic'] py-0.5 max-w-full ${className}`} dir="ltr">
      {words.map((word, wIdx) => {
        const parsed = parseHieroglyphWord(word);
        return (
          <div 
            key={wIdx} 
            className={`inline-flex items-center justify-center transition-colors max-w-full ${wordBoxCls}`}
          >
            {renderNode(parsed, 0, false)}
          </div>
        );
      })}
    </div>
  );
};
