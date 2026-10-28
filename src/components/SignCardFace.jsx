const SignCardFace = ({ item, isGrid = false }) => {
  if (item.forms && item.forms.length > 1) {
    return (
      <div className={`flex items-center justify-center ${isGrid ? 'gap-1.5' : 'gap-3'}`} dir="ltr">
        <div className="flex flex-col items-center">
          <span className="text-[10px] text-stone-400 font-serif font-bold leading-none mb-1">({item.forms[0].num})</span>
          <span className={`${isGrid ? 'text-2xl sm:text-3xl' : 'text-3xl sm:text-4xl'} font-['Segoe_UI_Historic'] text-slate-800 transition-transform group-hover:scale-105`}>
            {item.forms[0].sign}
          </span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-[10px] text-stone-400 font-serif font-bold leading-none mb-1">({item.forms[1].num})</span>
          <span className={`${isGrid ? 'text-2xl sm:text-3xl' : 'text-3xl sm:text-4xl'} font-['Segoe_UI_Historic'] text-slate-800 transition-transform group-hover:scale-105`}>
            {item.forms[1].sign}
          </span>
        </div>
      </div>
    );
  }
  return (
    <span className={`${isGrid ? 'text-3xl sm:text-4xl' : 'text-4xl sm:text-5xl'} font-['Segoe_UI_Historic'] text-slate-800 transition-transform group-hover:scale-110`}>
      {item.h}
    </span>
  );
};
