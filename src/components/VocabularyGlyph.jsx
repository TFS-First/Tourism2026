const VocabularyGlyph = ({ code, revealed = false }) => {
  const frameRef = useRef(null);
  const contentRef = useRef(null);
  const [fit, setFit] = useState(1);
  const count = [...(code || '')].filter(char => {
    const point = char.codePointAt(0);
    return point >= 0x13000 && point <= 0x1342f;
  }).length;
  const fontSize = revealed
    ? (count <= 2 ? 54 : count <= 4 ? 48 : count <= 7 ? 44 : 40)
    : (count <= 2 ? 66 : count <= 4 ? 58 : count <= 7 ? 50 : 44);

  React.useLayoutEffect(() => {
    let active = true;
    const measure = () => {
      const frame = frameRef.current;
      const content = contentRef.current;
      if (!active || !frame || !content) return;
      const width = content.offsetWidth;
      const height = content.offsetHeight;
      if (width && height) {
        setFit(Math.min(1, Math.max(0, frame.clientWidth - 12) / width,
          Math.max(0, frame.clientHeight - 14) / height));
      }
    };
    const observer = new ResizeObserver(measure);
    observer.observe(frameRef.current);
    observer.observe(contentRef.current);
    measure();
    document.fonts.ready.then(measure);
    return () => { active = false; observer.disconnect(); };
  }, [code, revealed, fontSize]);

  return (
    <div ref={frameRef} className="vocab-glyph-frame" data-code={code}
      style={{ position: 'relative', width: '100%', height: revealed ? 94 : 112, overflow: 'hidden', flexShrink: 0 }}>
      <div ref={contentRef} className="vocab-glyph-content"
        style={{ position: 'absolute', left: '50%', top: '50%', width: 'max-content',
          '--vocab-sign-size': `${fontSize}px`, '--vocab-stacked-size': `${fontSize * 0.60}px`,
          transform: `translate(-50%, -50%) scale(${fit})`, transformOrigin: 'center' }}>
        <HieroglyphBlock code={code} size="vocab" boxed={false} />
      </div>
    </div>
  );
};
