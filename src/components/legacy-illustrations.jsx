const PharaohHeadSVG = ({ className = "" }) => (
  <svg viewBox="0 0 300 380" className={className} xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="goldSkin" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#f5c842"/>
        <stop offset="50%" stopColor="#d4a030"/>
        <stop offset="100%" stopColor="#a67c25"/>
      </linearGradient>
      <linearGradient id="nemes1" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#2563eb"/>
        <stop offset="100%" stopColor="#1e40af"/>
      </linearGradient>
      <linearGradient id="nemesGold" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#fbbf24"/>
        <stop offset="100%" stopColor="#d97706"/>
      </linearGradient>
      <linearGradient id="goldCollar" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#fde68a"/>
        <stop offset="40%" stopColor="#f59e0b"/>
        <stop offset="100%" stopColor="#b45309"/>
      </linearGradient>
      <radialGradient id="faceShadow" cx="0.5" cy="0.3" r="0.6">
        <stop offset="0%" stopColor="#f5c842" stopOpacity="1"/>
        <stop offset="100%" stopColor="#8b6914" stopOpacity="1"/>
      </radialGradient>
      <filter id="pharaohGlow">
        <feGaussianBlur stdDeviation="6" result="blur"/>
        <feFlood floodColor="#f59e0b" floodOpacity="0.3"/>
        <feComposite in2="blur" operator="in"/>
        <feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
    </defs>
    <g filter="url(#pharaohGlow)">
      {/* Nemes Headdress - Left side drape */}
      <path d="M70,160 Q60,200 55,260 Q52,300 65,340 L95,340 Q90,300 92,260 Q95,220 100,180 Z" fill="url(#nemes1)" stroke="#1e3a5f" strokeWidth="1"/>
      {/* Nemes stripes left */}
      <path d="M66,200 Q70,240 72,280" stroke="#fbbf24" strokeWidth="2.5" fill="none" opacity="0.7"/>
      <path d="M74,195 Q78,235 79,275" stroke="#fbbf24" strokeWidth="2.5" fill="none" opacity="0.7"/>
      <path d="M82,190 Q85,230 86,265" stroke="#fbbf24" strokeWidth="2.5" fill="none" opacity="0.7"/>
      {/* Nemes Headdress - Right side drape */}
      <path d="M230,160 Q240,200 245,260 Q248,300 235,340 L205,340 Q210,300 208,260 Q205,220 200,180 Z" fill="url(#nemes1)" stroke="#1e3a5f" strokeWidth="1"/>
      {/* Nemes stripes right */}
      <path d="M234,200 Q230,240 228,280" stroke="#fbbf24" strokeWidth="2.5" fill="none" opacity="0.7"/>
      <path d="M226,195 Q222,235 221,275" stroke="#fbbf24" strokeWidth="2.5" fill="none" opacity="0.7"/>
      <path d="M218,190 Q215,230 214,265" stroke="#fbbf24" strokeWidth="2.5" fill="none" opacity="0.7"/>
      {/* Nemes top */}
      <path d="M70,160 Q80,80 150,55 Q220,80 230,160 Q200,140 150,135 Q100,140 70,160 Z" fill="url(#nemes1)" stroke="#1e3a5f" strokeWidth="1.5"/>
      {/* Nemes top stripes */}
      <path d="M100,120 Q130,95 150,88" stroke="#fbbf24" strokeWidth="3" fill="none" opacity="0.6"/>
      <path d="M110,135 Q135,110 150,100" stroke="#fbbf24" strokeWidth="3" fill="none" opacity="0.6"/>
      <path d="M200,120 Q170,95 150,88" stroke="#fbbf24" strokeWidth="3" fill="none" opacity="0.6"/>
      <path d="M190,135 Q165,110 150,100" stroke="#fbbf24" strokeWidth="3" fill="none" opacity="0.6"/>
      {/* Golden band across forehead */}
      <path d="M80,150 Q150,130 220,150" stroke="url(#nemesGold)" strokeWidth="8" fill="none"/>
      <path d="M82,150 Q150,132 218,150" stroke="#fde68a" strokeWidth="2" fill="none" opacity="0.5"/>
      {/* Face */}
      <ellipse cx="150" cy="210" rx="60" ry="75" fill="url(#faceShadow)"/>
      {/* Eyes */}
      <g>
        {/* Left eye */}
        <path d="M115,195 Q130,185 140,195 Q130,202 115,195 Z" fill="#1a1a1a"/>
        <ellipse cx="128" cy="195" rx="5" ry="4" fill="#3b2506"/>
        <ellipse cx="128" cy="194" rx="2" ry="2" fill="white" opacity="0.6"/>
        {/* Kohl line left */}
        <path d="M112,195 Q105,198 100,205" stroke="#1a1a1a" strokeWidth="2.5" fill="none"/>
        {/* Right eye */}
        <path d="M160,195 Q175,185 185,195 Q175,202 160,195 Z" fill="#1a1a1a"/>
        <ellipse cx="172" cy="195" rx="5" ry="4" fill="#3b2506"/>
        <ellipse cx="172" cy="194" rx="2" ry="2" fill="white" opacity="0.6"/>
        {/* Kohl line right */}
        <path d="M188,195 Q195,198 200,205" stroke="#1a1a1a" strokeWidth="2.5" fill="none"/>
      </g>
      {/* Eyebrows */}
      <path d="M112,183 Q128,173 142,183" stroke="#5c3d10" strokeWidth="2.5" fill="none"/>
      <path d="M158,183 Q172,173 188,183" stroke="#5c3d10" strokeWidth="2.5" fill="none"/>
      {/* Nose */}
      <path d="M148,200 Q145,220 140,232 Q148,236 155,232 Q152,220 150,200" stroke="#a67c25" strokeWidth="1.5" fill="none"/>
      {/* Lips */}
      <path d="M130,248 Q140,242 150,244 Q160,242 170,248" stroke="#c4873a" strokeWidth="2" fill="none"/>
      <path d="M132,249 Q150,258 168,249" stroke="#a8703a" strokeWidth="1.5" fill="none"/>
      {/* Chin/Jaw line */}
      <path d="M95,230 Q100,270 150,285 Q200,270 205,230" stroke="#a67c25" strokeWidth="1" fill="none" opacity="0.4"/>
      {/* Royal false beard (braided) */}
      <path d="M140,280 Q142,300 143,330 Q150,340 157,330 Q158,300 160,280" fill="url(#nemesGold)" stroke="#b45309" strokeWidth="1"/>
      <line x1="145" y1="290" x2="155" y2="290" stroke="#a67c25" strokeWidth="1" opacity="0.5"/>
      <line x1="145" y1="300" x2="155" y2="300" stroke="#a67c25" strokeWidth="1" opacity="0.5"/>
      <line x1="145" y1="310" x2="155" y2="310" stroke="#a67c25" strokeWidth="1" opacity="0.5"/>
      <line x1="145" y1="320" x2="155" y2="320" stroke="#a67c25" strokeWidth="1" opacity="0.5"/>
      {/* Uraeus (cobra on forehead) */}
      <g>
        <path d="M150,146 Q148,130 145,118 Q143,108 148,100 Q152,95 155,100 Q158,108 156,118 Q153,130 150,146" fill="#d4a030" stroke="#b45309" strokeWidth="1.2"/>
        <circle cx="151" cy="100" r="5" fill="#d4a030" stroke="#b45309" strokeWidth="1"/>
        <ellipse cx="149" cy="98" rx="1.5" ry="2" fill="#1a1a1a"/>
        <ellipse cx="153" cy="98" rx="1.5" ry="2" fill="#1a1a1a"/>
        {/* Cobra hood */}
        <path d="M143,105 Q150,93 157,105" stroke="#b45309" strokeWidth="1.5" fill="url(#nemesGold)"/>
      </g>
      {/* Usekh Collar (broad collar) */}
      <path d="M85,270 Q150,300 215,270 Q210,285 150,310 Q90,285 85,270 Z" fill="url(#goldCollar)" stroke="#b45309" strokeWidth="1"/>
      {/* Collar detail rows */}
      <path d="M92,275 Q150,298 208,275" stroke="#fde68a" strokeWidth="1.5" fill="none" opacity="0.5"/>
      <path d="M95,282 Q150,303 205,282" stroke="#92400e" strokeWidth="1" fill="none" opacity="0.4"/>
      <path d="M98,289 Q150,307 202,289" stroke="#fde68a" strokeWidth="1" fill="none" opacity="0.3"/>
      {/* Collar gems */}
      <circle cx="120" cy="282" r="3" fill="#dc2626" opacity="0.7"/>
      <circle cx="150" cy="290" r="3" fill="#2563eb" opacity="0.7"/>
      <circle cx="180" cy="282" r="3" fill="#16a34a" opacity="0.7"/>
    </g>
  </svg>
);

const PyramidsSVG = ({ className = "" }) => (
  <svg viewBox="0 0 800 200" className={className} xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMax meet">
    <defs>
      <linearGradient id="pyramidFace1" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#d4a030"/>
        <stop offset="100%" stopColor="#8b6914"/>
      </linearGradient>
      <linearGradient id="pyramidFace2" x1="1" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#a67c25"/>
        <stop offset="100%" stopColor="#6b4f15"/>
      </linearGradient>
      <linearGradient id="sand" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#c4873a"/>
        <stop offset="100%" stopColor="#8b6914"/>
      </linearGradient>
    </defs>
    {/* Sand ground */}
    <path d="M0,180 Q200,168 400,175 Q600,168 800,180 L800,200 L0,200 Z" fill="url(#sand)" opacity="0.4"/>
    {/* Great Pyramid (Khufu) */}
    <polygon points="350,40 270,180 350,180" fill="url(#pyramidFace1)" opacity="0.9"/>
    <polygon points="350,40 350,180 430,180" fill="url(#pyramidFace2)" opacity="0.9"/>
    {/* Medium Pyramid (Khafre) */}
    <polygon points="480,60 420,180 480,180" fill="url(#pyramidFace1)" opacity="0.8"/>
    <polygon points="480,60 480,180 540,180" fill="url(#pyramidFace2)" opacity="0.8"/>
    {/* Small Pyramid (Menkaure) */}
    <polygon points="570,95 535,180 570,180" fill="url(#pyramidFace1)" opacity="0.7"/>
    <polygon points="570,95 570,180 605,180" fill="url(#pyramidFace2)" opacity="0.7"/>
    {/* Stars */}
    <circle cx="100" cy="30" r="1.5" fill="#fde68a" opacity="0.5"/>
    <circle cx="200" cy="60" r="1" fill="#fde68a" opacity="0.4"/>
    <circle cx="680" cy="25" r="1.5" fill="#fde68a" opacity="0.5"/>
    <circle cx="720" cy="70" r="1" fill="#fde68a" opacity="0.3"/>
    <circle cx="50" cy="80" r="1" fill="#fde68a" opacity="0.3"/>
    <circle cx="750" cy="50" r="1.2" fill="#fde68a" opacity="0.4"/>
    <circle cx="300" cy="15" r="1" fill="#fde68a" opacity="0.4"/>
    <circle cx="620" cy="45" r="1" fill="#fde68a" opacity="0.3"/>
    {/* Moon crescent */}
    <g opacity="0.35">
      <circle cx="650" cy="35" r="18" fill="#fde68a"/>
      <circle cx="656" cy="30" r="16" fill="#1a120b"/>
    </g>
  </svg>
);

const EyeOfHorusSVG = ({ className = "", size = 60 }) => (
  <svg viewBox="0 0 100 80" width={size} height={size * 0.8} className={className} xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="eyeGold" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#fde68a"/>
        <stop offset="100%" stopColor="#d97706"/>
      </linearGradient>
    </defs>
    {/* Outer eye shape */}
    <path d="M10,35 Q30,10 55,20 Q80,10 95,35 Q80,55 55,48 Q30,55 10,35 Z" fill="none" stroke="url(#eyeGold)" strokeWidth="3"/>
    {/* Iris */}
    <circle cx="55" cy="33" r="12" fill="url(#eyeGold)" opacity="0.3"/>
    <circle cx="55" cy="33" r="7" fill="url(#eyeGold)"/>
    <circle cx="55" cy="33" r="3.5" fill="#1a1a1a"/>
    <circle cx="53" cy="31" r="1.5" fill="white" opacity="0.5"/>
    {/* Teardrop marking */}
    <path d="M48,42 Q44,55 40,70" stroke="url(#eyeGold)" strokeWidth="3" fill="none" strokeLinecap="round"/>
    {/* Spiral curl */}
    <path d="M40,70 Q35,75 42,78 Q48,75 45,70" stroke="url(#eyeGold)" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
    {/* Eyebrow line top */}
    <path d="M8,30 Q30,5 55,15 Q80,5 97,30" stroke="url(#eyeGold)" strokeWidth="2" fill="none" opacity="0.5"/>
  </svg>
);
