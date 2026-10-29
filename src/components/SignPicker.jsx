const SignPicker = ({ signs, selected, onChoose }) => {
  const [open, setOpen] = useState(false);
  const dialogRef = useRef(null);
  useEffect(() => {
    if (!open) return;
    const dialog = dialogRef.current;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    dialog.showModal();
    dialog.querySelector('[aria-current="true"]')?.focus();
    return () => { dialog.close(); document.body.style.overflow = previous; };
  }, [open]);
  return <>
    <button className="sign-picker-trigger" aria-haspopup="dialog" aria-expanded={open} onClick={() => setOpen(true)}><Icon name="Layers" size={18}/><span>الرموز</span><small>{selected.step} / {signs.length}</small><Icon name="ChevronDown" size={15}/></button>
    <dialog ref={dialogRef} className="sign-picker" aria-labelledby="sign-picker-title" dir="rtl" onCancel={e => {e.preventDefault();setOpen(false);}} onClick={e => {if(e.target===e.currentTarget){const r=e.currentTarget.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)setOpen(false);}}}>
      <div className="sign-picker-heading"><div><span>كمّل رحلتك بين العلامات</span><h2 id="sign-picker-title">اختر الرمز</h2></div><button onClick={() => setOpen(false)} aria-label="إغلاق قائمة الرموز"><Icon name="X" size={20}/></button></div>
      <div className="sign-picker-grid">{signs.map(sign => <button key={sign.step} aria-current={selected.step===sign.step?'true':undefined} aria-label={`الرمز ${sign.step}: ${sign.descAr || sign.meaning} (${sign.trans})`} onClick={() => {setOpen(false);onChoose(sign);}}><small>{sign.step}</small><span className="sign-picker-glyph" dir="ltr">{sign.h}</span><b dir="ltr">{sign.trans}</b></button>)}</div>
      <p className="sign-picker-foot">اختار أي رمز لعرض شرحه وأمثلته والتدرّب على رسمه.</p>
    </dialog>
  </>;
};
