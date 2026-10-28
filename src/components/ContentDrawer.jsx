const ContentDrawer = ({ open, onClose, groups, current, onChoose, sectionName }) => {
  const dialogRef = useRef(null);
  const searchRef = useRef(null);
  const [query,setQuery] = useState('');
  const [expanded,setExpanded] = useState({});
  const normalize = value => String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[أإآ]/g,'ا').toLowerCase();
  const q = normalize(query.trim());
  const shown = groups.filter(g => !q || normalize(g.label+' '+g.detail).includes(q) || g.children.some(c => normalize(c.label+' '+c.detail).includes(q)));
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!open) { if (dialog.open) dialog.close(); return; }
    setQuery(''); setExpanded({[current]:true});
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    dialog.showModal(); searchRef.current?.focus();
    return () => { document.body.style.overflow = previous; if (dialog.open) dialog.close(); };
  },[open]);
  return (
    <dialog ref={dialogRef} className="content-drawer" aria-labelledby="content-drawer-title" dir="rtl" onCancel={e=>{e.preventDefault();onClose();}} onClick={e=>{if(e.target===e.currentTarget){const r=e.currentTarget.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)onClose();}}}>
      <div className="drawer-head"><div><span className="drawer-eyebrow">كل شيء في مكانه</span><h2 id="content-drawer-title">محتوى {sectionName}</h2></div><button className="drawer-close" onClick={onClose} aria-label="إغلاق المحتوى"><Icon name="X" size={20}/></button></div>
      <div className="drawer-search"><Icon name="Search" size={18}/><input ref={searchRef} type="search" dir={searchTextDirection(query)} style={{textAlign:'start'}} value={query} onChange={e=>setQuery(e.target.value)} placeholder="ابحث عن درس أو عنوان…" aria-label="البحث في المحتوى"/></div>
      <div className="drawer-count" aria-live="polite">{shown.length} من {groups.length} <span>اختر درسًا، أو افتح عناوينه</span></div>
      <div className="drawer-list">
        {shown.map((group,index)=>{const expandedNow=!!q||expanded[group.id];const matchesParent=normalize(group.label+' '+group.detail).includes(q);const children=group.children.filter(c=>!q||matchesParent||normalize(c.label+' '+c.detail).includes(q));return(
          <section key={group.id} className={`drawer-group ${group.id===current?'is-current':''}`}>
            <div className="drawer-group-head"><button className="drawer-destination" onClick={()=>onChoose(group)} aria-current={group.id===current?'location':undefined}><span className="drawer-index">{groups.indexOf(group)+1}</span><span><b>{group.label}</b>{group.detail&&<small>{group.detail}</small>}</span>{group.id===current&&<span className="drawer-current-dot" aria-label="المحتوى الحالي"/>}</button>{group.children.length>0&&<button className="drawer-expand" aria-label={`عناوين ${group.label}`} aria-expanded={!!expandedNow} aria-controls={`drawer-children-${group.id}`} onClick={()=>setExpanded(p=>({...p,[group.id]:!p[group.id]}))}><Icon name="ChevronDown" size={18} className={expandedNow?'rotate-180':''}/></button>}</div>
            {expandedNow&&children.length>0&&<div className="drawer-children" id={`drawer-children-${group.id}`}>{children.map(child=><button key={child.id} onClick={()=>onChoose(group,child)}><span>{child.label}</span>{child.detail&&<small>{child.detail}</small>}<span className="drawer-child-arrow" aria-hidden="true">←</span></button>)}</div>}
          </section>
        );})}
        {!shown.length&&<p className="drawer-empty">مفيش نتائج بالاسم ده. جرّب عنوانًا تاني.</p>}
      </div>
      <div className="drawer-foot">اختار مكانك… وكمّل رحلتك.</div>
    </dialog>
  );
};
