const DrawingPad = ({ sign, isExercise = false }) => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);

  const startDraw = (e) => {
    e.preventDefault();
    setIsDrawing(true);
    draw(e);
  };

  const endDraw = () => {
    setIsDrawing(false);
    const ctx = canvasRef.current?.getContext('2d');
    if (ctx) ctx.beginPath();
  };

  const draw = (e) => {
    if (!isDrawing) return;
    e.preventDefault();
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    
    let clientX, clientY;
    if (e.touches && e.touches.length > 0) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }
    
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (clientX - rect.left) * scaleX;
    const y = (clientY - rect.top) * scaleY;
    
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#1e293b';
    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const clearPad = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  useEffect(() => {
    clearPad();
  }, [sign]);

  return (
    <div className={`flex flex-col items-center w-full ${isExercise ? 'bg-white p-4 md:p-6 rounded-2xl border border-stone-200 shadow-sm' : ''}`}>
      <div 
        className={`relative w-full ${isExercise ? 'max-w-full h-40 md:h-44' : 'max-w-[260px] sm:max-w-[280px] md:max-w-[320px] aspect-square'} bg-stone-50 border-2 border-dashed border-stone-300 rounded-xl overflow-hidden touch-none hover:border-amber-400 transition-colors mx-auto`}
        style={{ touchAction: 'none' }}
      >
        {!isExercise && (
          <div className="absolute inset-0 flex items-center justify-center text-[160px] md:text-[180px] text-stone-200 pointer-events-none select-none font-['Segoe_UI_Historic'] pb-6">
            {sign}
          </div>
        )}
        <canvas
          ref={canvasRef}
          width={isExercise ? 450 : 320}
          height={isExercise ? 180 : 320}
          className="absolute inset-0 w-full h-full cursor-crosshair z-10"
          onMouseDown={startDraw} onMouseMove={draw} onMouseUp={endDraw} onMouseLeave={endDraw}
          onTouchStart={startDraw} onTouchMove={draw} onTouchEnd={endDraw}
        />
      </div>

      <button onClick={clearPad} className="mt-4 flex items-center gap-2 px-6 py-2.5 bg-stone-100 hover:bg-amber-50 hover:text-amber-800 text-stone-700 rounded-full transition-colors font-semibold text-sm">
        <Icon name="Eraser" size={16} /> مسح اللوحة
      </button>
    </div>
  );
};
