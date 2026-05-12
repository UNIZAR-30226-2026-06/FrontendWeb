import React from 'react';
import '../styles/Card.css';

const SPECIAL_TYPES = new Set(['+2', 'reverse', '+2R', 'skip', 'extraTurn', 'playOdd', 'playEven', 'wild', '+4', '+4R', '+1', 'swapHands', 'discardHandRedraw', 'restartGame', 'specialOnly', 'changeColor', 'cancelColor', 'changeRole', 'addRoleUse']);

const VORTEX_TYPES = new Set(['wild', '+4', '+4R', '+1', 'swapHands', 'discardHandRedraw', 'restartGame', 'specialOnly', 'changeColor', 'cancelColor', 'changeRole', 'addRoleUse']);

const BACKEND_VALUE_ALIAS = { '+1': 'draw1All' };

const ArrowIcon = ({ className }) => (
  <svg viewBox="0 0 100 100" className={className}>
    <path d="M15 50 L35 35 L35 45 L80 45 L80 55 L35 55 L35 65 Z" fill="white" stroke="#000" strokeWidth="2" />
  </svg>
);

const SkipIcon = () => (
  <svg viewBox="0 0 100 100" className="icon-skip">
    <circle cx="50" cy="50" r="38" fill="none" stroke="white" strokeWidth="10" />
    <line x1="28" y1="28" x2="72" y2="72" stroke="white" strokeWidth="10" strokeLinecap="round" />
  </svg>
);

const ExtraTurnIcon = () => (
  <svg viewBox="0 0 100 100" className="icon-extra-turn">
    <path d="M20 30 A35 25 0 0 1 80 30" fill="none" stroke="white" strokeWidth="7" strokeLinecap="round" />
    <path d="M75 20 L92 30 L75 40 Z" fill="white" transform="rotate(45 80 30)" />
    <path d="M80 70 A35 25 0 0 1 20 70" fill="none" stroke="white" strokeWidth="7" strokeLinecap="round" />
    <path d="M25 80 L8 70 L25 60 Z" fill="white" transform="rotate(45 20 70)" />
  </svg>
);

const NumbersRingIcon = () => (
  <svg viewBox="0 0 100 100" className="icon-numbers-ring">
    {[0, 90, 180, 270].map((rot) => (
      <g transform={`rotate(${rot} 50 50)`} key={rot}>
        <path d="M50 15 A35 35 0 0 1 75 25" fill="none" stroke="white" strokeWidth="6" strokeLinecap="round" />
        <path d="M70 15 L87 25 L70 35 Z" fill="white" transform="rotate(45 75 25)" />
      </g>
    ))}
  </svg>
);

const ExchangeHandsIcon = () => (
  <svg viewBox="0 0 100 100" className="icon-exchange">
    <path d="M30 30 q-8 0 -8 8 v8 q0 8 8 8 h6 v-24 z" fill="white" stroke="black" strokeWidth="2" />
    <rect x="32" y="22" width="3" height="14" fill="white" stroke="black" strokeWidth="1.2" />
    <rect x="36" y="20" width="3" height="16" fill="white" stroke="black" strokeWidth="1.2" />
    <rect x="40" y="22" width="3" height="14" fill="white" stroke="black" strokeWidth="1.2" />
    <g transform="rotate(180 50 50)">
      <path d="M30 30 q-8 0 -8 8 v8 q0 8 8 8 h6 v-24 z" fill="white" stroke="black" strokeWidth="2" />
      <rect x="32" y="22" width="3" height="14" fill="white" stroke="black" strokeWidth="1.2" />
      <rect x="36" y="20" width="3" height="16" fill="white" stroke="black" strokeWidth="1.2" />
      <rect x="40" y="22" width="3" height="14" fill="white" stroke="black" strokeWidth="1.2" />
    </g>
    <path d="M62 30 Q80 50 62 70" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" />
    <path d="M58 65 L62 70 L67 67" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M40 30 Q22 50 40 70" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" />
    <path d="M44 35 L40 30 L35 33" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const NewHandIcon = () => (
  <svg viewBox="0 0 100 100" className="icon-new-hand">
    <path d="M22 55 q-6 0 -6 6 v6 q0 6 6 6 h28 v-18 z" fill="white" stroke="black" strokeWidth="2" />
    <rect x="24" y="48" width="3" height="9" fill="white" stroke="black" strokeWidth="1.2" />
    <rect x="29" y="44" width="3" height="13" fill="white" stroke="black" strokeWidth="1.2" />
    <rect x="34" y="46" width="3" height="11" fill="white" stroke="black" strokeWidth="1.2" />
    <g transform="translate(48 28) rotate(-12)">
      <rect x="0" y="0" width="18" height="26" rx="2" fill="white" stroke="black" strokeWidth="1.5" />
    </g>
    <g transform="translate(54 26) rotate(0)">
      <rect x="0" y="0" width="18" height="26" rx="2" fill="white" stroke="black" strokeWidth="1.5" />
    </g>
    <g transform="translate(60 28) rotate(12)">
      <rect x="0" y="0" width="18" height="26" rx="2" fill="white" stroke="black" strokeWidth="1.5" />
    </g>
  </svg>
);

const RestartIcon = () => (
  <svg viewBox="0 0 100 100" className="icon-restart">
    <path d="M50 18 A32 32 0 1 1 18 50" fill="none" stroke="white" strokeWidth="8" strokeLinecap="round" />
    <path d="M50 8 L50 28 L62 18 Z" fill="white" />
  </svg>
);

const CancelColorIcon = () => (
  <svg viewBox="0 0 100 100" className="icon-cancel-color">
    <g>
      <path d="M50 50 L50 14 A36 36 0 0 1 86 50 Z" fill="#ECD407" />
      <path d="M50 50 L86 50 A36 36 0 0 1 50 86 Z" fill="#379711" />
      <path d="M50 50 L50 86 A36 36 0 0 1 14 50 Z" fill="#0956BF" />
      <path d="M50 50 L14 50 A36 36 0 0 1 50 14 Z" fill="#D72600" />
    </g>
    <circle cx="50" cy="50" r="36" fill="none" stroke="white" strokeWidth="4" />
    <line x1="22" y1="22" x2="78" y2="78" stroke="white" strokeWidth="8" strokeLinecap="round" />
  </svg>
);

const ChangeColorIcon = () => (
  <svg viewBox="0 0 100 100" className="icon-change-color">
    <g>
      <path d="M50 50 L50 14 A36 36 0 0 1 86 50 Z" fill="#ECD407" />
      <path d="M50 50 L86 50 A36 36 0 0 1 50 86 Z" fill="#379711" />
      <path d="M50 50 L50 86 A36 36 0 0 1 14 50 Z" fill="#0956BF" />
      <path d="M50 50 L14 50 A36 36 0 0 1 50 14 Z" fill="#D72600" />
    </g>
    <circle cx="50" cy="50" r="36" fill="none" stroke="white" strokeWidth="4" />
    <path d="M70 22 q12 6 12 18" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" />
    <path d="M82 36 L82 44 L76 40 Z" fill="white" />
  </svg>
);

const SpecialsOnlyIcon = () => (
  <svg viewBox="0 0 100 100" className="icon-specials-only">
    <polygon points="50,15 60,40 87,42 65,60 73,86 50,72 27,86 35,60 13,42 40,40" fill="white" stroke="black" strokeWidth="2" />
    <path d="M38 50 L46 58 L62 42" fill="none" stroke="black" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const Draw1AllIcon = () => (
  <svg viewBox="0 0 100 100" className="icon-draw1all">
    <rect x="38" y="30" width="24" height="34" rx="3" fill="white" stroke="black" strokeWidth="2" />
    <text x="50" y="52" textAnchor="middle" fontFamily="Arial Black" fontSize="14" fill="black">+1</text>
    <path d="M50 26 L46 18 L54 18 Z" fill="white" />
    <path d="M70 50 L78 46 L78 54 Z" fill="white" />
    <path d="M50 70 L46 78 L54 78 Z" fill="white" />
    <path d="M30 50 L22 46 L22 54 Z" fill="white" />
  </svg>
);

const ChangeRoleIcon = () => (
  <svg viewBox="0 0 100 100" className="icon-change-role">
    <path d="M22 42 q0 -10 10 -10 h36 q10 0 10 10 v8 q0 10 -10 10 h-8 l-8 6 -8 -6 h-8 q-10 0 -10 -10 z" fill="white" stroke="black" strokeWidth="2" />
    <circle cx="38" cy="46" r="4" fill="black" />
    <circle cx="62" cy="46" r="4" fill="black" />
    <path d="M18 72 q-2 8 6 12" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" />
    <path d="M22 80 L26 84 L20 86 Z" fill="white" />
    <path d="M82 72 q2 8 -6 12" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" />
    <path d="M78 80 L74 84 L80 86 Z" fill="white" />
  </svg>
);

const AddRoleUseIcon = () => (
  <svg viewBox="0 0 100 100" className="icon-add-role-use">
    <polygon points="50,18 58,40 82,42 63,57 70,80 50,67 30,80 37,57 18,42 42,40" fill="white" stroke="black" strokeWidth="2" />
    <circle cx="73" cy="73" r="14" fill="#62b155" stroke="white" strokeWidth="2" />
    <text x="73" y="78" textAnchor="middle" fontFamily="Arial Black" fontSize="13" fill="white" fontWeight="900">+1</text>
  </svg>
);

const CenterContent = ({ value }) => {
  switch (value) {
    case '+2':
      return <span className="value-large">+2</span>;
    case 'reverse':
      return <ArrowIcon className="icon-reverse" />;
    case '+2R':
      return <ArrowIcon className="icon-reverse combo-arrow" />;
    case 'skip':
      return <SkipIcon />;
    case 'extraTurn':
      return (
        <div className="center-stack">
          <ExtraTurnIcon />
          <span className="badge-overlay">2x</span>
        </div>
      );
    case 'playOdd':
    case 'playEven': {
      const nums = value === 'playOdd' ? [1, 3, 5, 7, 9] : [0, 2, 4, 6, 8];
      return (
        <div className="center-stack">
          <NumbersRingIcon />
          <div className="numbers-grid">
            <div className="numbers-row">
              {nums.slice(0, 3).map((n) => <span key={n}>{n}</span>)}
            </div>
            <div className="numbers-row">
              {nums.slice(3).map((n) => <span key={n}>{n}</span>)}
            </div>
          </div>
        </div>
      );
    }
    case 'wild':
    case 'changeColor':
      return <ChangeColorIcon />;
    case 'cancelColor':
      return <CancelColorIcon />;
    case '+4':
      return <span className="value-large stroke">+4</span>;
    case '+4R':
      return (
        <div className="center-stack">
          <span className="value-large stroke">+4</span>
          <ArrowIcon className="icon-reverse combo-arrow combo-arrow-faded" />
        </div>
      );
    case '+1':
    case 'draw1All':
      return (
        <div className="center-stack">
          <Draw1AllIcon />
          <span className="card-label-mini">DRAW 1 ALL</span>
        </div>
      );
    case 'swapHands':
      return (
        <div className="center-stack">
          <ExchangeHandsIcon />
          <span className="card-label-mini">EXCHANGE</span>
        </div>
      );
    case 'discardHandRedraw':
      return (
        <div className="center-stack">
          <NewHandIcon />
          <span className="card-label-mini">NEW HAND</span>
        </div>
      );
    case 'restartGame':
      return (
        <div className="center-stack">
          <RestartIcon />
          <span className="card-label-mini">RESTART</span>
        </div>
      );
    case 'specialOnly':
      return (
        <div className="center-stack">
          <SpecialsOnlyIcon />
          <span className="card-label-mini">SPECIALS<br />ONLY</span>
        </div>
      );
    case 'changeRole':
      return (
        <div className="center-stack">
          <ChangeRoleIcon />
          <span className="card-label-mini">CHANGE<br />ROLE</span>
        </div>
      );
    case 'addRoleUse':
      return (
        <div className="center-stack">
          <AddRoleUseIcon />
          <span className="card-label-mini">+1 USE</span>
        </div>
      );
    default:
      return <span className="value-large">{value}</span>;
  }
};

const CornerValue = ({ value }) => {
  switch (value) {
    case 'reverse':
      return (
        <span className="corner-with-arrow">
          <span className="corner-r">R</span>
          <ArrowIcon className="corner-arrow" />
        </span>
      );
    case '+2R':
      return (
        <span className="corner-with-arrow">
          <span className="corner-val">+2</span>
          <ArrowIcon className="corner-arrow" />
        </span>
      );
    case '+4R':
      return (
        <span className="corner-with-arrow">
          <span className="corner-val">+4</span>
          <ArrowIcon className="corner-arrow" />
        </span>
      );
    case 'skip': return <span className="corner-badge">SKIP</span>;
    case 'extraTurn': return <span className="corner-badge">EXTRA</span>;
    case 'playOdd': return <span className="corner-mini">ODD</span>;
    case 'playEven': return <span className="corner-mini">EVEN</span>;
    case 'wild': return <span className="corner-mini">WILD</span>;
    case 'changeColor': return <span className="corner-mini">COLOR</span>;
    case 'cancelColor': return <span className="corner-mini">CANCEL</span>;
    case '+4': return <span className="corner-val">+4</span>;
    case '+1':
    case 'draw1All': return <span className="corner-val">+1</span>;
    case 'swapHands': return <span className="corner-mini">SWAP</span>;
    case 'discardHandRedraw': return <span className="corner-mini">NEW</span>;
    case 'restartGame': return <span className="corner-mini">RESTART</span>;
    case 'specialOnly': return <span className="corner-mini">SPEC.</span>;
    case 'changeRole': return <span className="corner-mini">ROLE</span>;
    case 'addRoleUse': return <span className="corner-mini">+1 USE</span>;
    default: return <span className="corner-val">{value}</span>;
  }
};

const Card = ({ value, color = 'blue', type = 'normal', style = 'basic', chosenColor = null }) => {
  const renderValue = value;
  const isSpecial = SPECIAL_TYPES.has(renderValue);
  const hasVortex = VORTEX_TYPES.has(renderValue);
  const borderTint = hasVortex && chosenColor ? `tint-${chosenColor}` : '';
  const colorClass = hasVortex ? 'black' : color;

  return (
    <div className={['uno-card', `style-${style}`, type, colorClass, hasVortex ? 'vortex-anim' : '', isSpecial ? 'is-special' : '', borderTint].filter(Boolean).join(' ')}>
      {style === 'gold' && <div className="gold-shine-overlay" aria-hidden="true" />}
      <div className="card-inner">
        {style === 'retro' && <div className="retro-texture" />}
        <div className="corner top-left">
          <CornerValue value={renderValue} />
        </div>
        <div className="center-content">
          <CenterContent value={renderValue} />
        </div>
        <div className="corner bottom-right">
          <CornerValue value={renderValue} />
        </div>
      </div>
    </div>
  );
};

export default Card;