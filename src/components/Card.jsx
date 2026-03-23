import React from 'react';
import '../styles/Card.css';

const Card = ({ value, color = 'blue', type = 'normal', style = 'basic' }) => {
    const isPlusTwo = value === "+2";
    const isReverse = value === "reverse";
    const isPlusTwoReverse = value === "+2R";
    const isSkip = value === "skip";
    const isExtraTurn = value === "extraTurn";
    const isPlayOdd = value === "playOdd";
    const isPlayEven = value === "playEven";
    const isWild = value === "wild";
    const isWildPlusFour = value === "+4";
    const isDraw1All = value === "draw1All";
    const isSpecialsOnly = value === "specialsOnly";
    const isPlus4Reverse = value === "+4R";
    const isCancelColor = value === "cancelColor";
    const isExchangeHands = value === "exchangeHands";
    const isNewHand = value === "newHand";
    const isRestartGame = value === "restartGame";

    const isSpecialCard = isPlusTwo || isReverse || isPlusTwoReverse || isSkip || 
                          isExtraTurn || isPlayOdd || isPlayEven || isWild || 
                          isWildPlusFour || isDraw1All || isSpecialsOnly || 
                          isPlus4Reverse || isCancelColor || isExchangeHands || 
                          isNewHand || isRestartGame;

    const hasVortexBackground = isSpecialCard && (
        isWild || isWildPlusFour || isDraw1All || isSpecialsOnly || 
        isPlus4Reverse || isCancelColor || isExchangeHands || 
        isNewHand || isRestartGame
    );

    const colorClass = hasVortexBackground ? 'black' : color;

    const renderCornerArrow = () => (
        <svg viewBox="0 0 100 100" className="icon-corner-arrow">
            <path d="M15 50 L35 35 L35 45 L80 45 L80 55 L35 55 L35 65 Z" fill="white" stroke="#000" strokeWidth="2" />
        </svg>
    );

    const renderCenterContent = () => {
        if (isDraw1All) return (
            <div className="special-content-container">
                <div className="card-stack-icon">🎴</div>
                <div className="special-main-label">DRAW 1 ALL</div>
            </div>
        );
        if (isSpecialsOnly) return (
            <div className="special-content-container">
                <div className="star-check-icon">⭐</div>
                <div className="special-main-label">SPECIALS ONLY</div>
            </div>
        );
        if (isPlus4Reverse) return (
            <div className="plus-four-reverse-wrapper">
                <span className="plus-four-text">+4</span>
                <svg viewBox="0 0 100 100" className="icon-reverse-overlay">
                    <path d="M15 50 L35 35 L35 45 L80 45 L80 55 L35 55 L35 65 Z" fill="white" stroke="#000" strokeWidth="2" />
                </svg>
            </div>
        );
        if (isReverse || isPlusTwoReverse) return (
            <svg viewBox="0 0 100 100" className={`icon-reverse-arrow ${isPlusTwoReverse ? 'combo-arrow' : ''}`}>
                <path d="M15 50 L35 35 L35 45 L80 45 L80 55 L35 55 L35 65 Z" fill="white" stroke="#000" strokeWidth="2" />
            </svg>
        );
        if (isSkip) return (
            <svg viewBox="0 0 100 100" className="icon-skip-center">
                <circle cx="50" cy="50" r="38" fill="none" stroke="white" strokeWidth="10" />
                <line x1="28" y1="28" x2="72" y2="72" stroke="white" strokeWidth="10" strokeLinecap="round" />
            </svg>
        );
        if (isExtraTurn) return (
            <div className="extra-turn-container">
                <svg viewBox="0 0 100 100" className="icon-extra-turn">
                    <path d="M 20 30 A 35 25 0 0 1 80 30" fill="none" stroke="white" strokeWidth="7" strokeLinecap="round" />
                    <path d="M 75 20 L 92 30 L 75 40 Z" fill="white" transform="rotate(45 80 30)" />
                    <path d="M 80 70 A 35 25 0 0 1 20 70" fill="none" stroke="white" strokeWidth="7" strokeLinecap="round" />
                    <path d="M 25 80 L 8 70 L 25 60 Z" fill="white" transform="rotate(45 20 70)" />
                </svg>
                <span className="extra-turn-number">2x</span>
            </div>
        );
        if (isPlayOdd || isPlayEven) return (
            <div className="play-numbers-container">
                <svg viewBox="0 0 100 100" className="icon-numbers-ring">
                    {[0, 90, 180, 270].map((rot) => (
                        <g transform={`rotate(${rot} 50 50)`} key={rot}>
                            <path d="M 50 15 A 35 35 0 0 1 75 25" fill="none" stroke="white" strokeWidth="6" strokeLinecap="round" />
                            <path d="M 70 15 L 87 25 L 70 35 Z" fill="white" transform="rotate(45 75 25)" />
                        </g>
                    ))}
                </svg>
                <div className="numbers-grid-layout">
                    <div className="numbers-row">
                        {isPlayOdd ? <span>1</span> : <span>0</span>}
                        {isPlayOdd ? <span>3</span> : <span>2</span>}
                        {isPlayOdd ? <span>5</span> : <span>4</span>}
                    </div>
                    <div className="numbers-row row-bottom">
                        {isPlayOdd ? <span>7</span> : <span>6</span>}
                        {isPlayOdd ? <span>9</span> : <span>8</span>}
                    </div>
                </div>
            </div>
        );
        if (isWild) return <div className="wild-circle"></div>;
        if (isWildPlusFour) return (
            <div className="plus-four-container">
                <span className="plus-four-text">+4</span>
            </div>
        );
        if (isCancelColor) return (
            <div className="cancel-color-container">
                <div className="multi-color-ring">
                    <div className="color-segment red"></div>
                    <div className="color-segment blue"></div>
                    <div className="color-segment green"></div>
                    <div className="color-segment yellow"></div>
                    <div className="cancel-line"></div>
                </div>
                <div className="special-main-label">CANCEL COLOR</div>
            </div>
        );
        if (isExchangeHands) return (
            <div className="exchange-hands-container">
                <svg viewBox="0 0 100 100" className="icon-exchange">
                    <path d="M50 10 A40 40 0 0 1 90 50" stroke="white" strokeWidth="8" fill="none"/>
                    <polygon points="88,40 95,55 80,55" fill="white"/>
                    <path d="M50 90 A40 40 0 0 1 10 50" stroke="white" strokeWidth="8" fill="none"/>
                    <polygon points="12,60 5,45 20,45" fill="white"/>
                </svg>
                <div className="hands-icon">🤝</div>
                <div className="special-main-label">EXCHANGE HANDS</div>
            </div>
        );
        if (isNewHand) return (
            <div className="new-hand-container">
                <div className="cards-icon">🃏🃏🃏</div>
                <svg viewBox="0 0 100 100" className="icon-refresh">
                    <path d="M20 50 A30 30 0 1 1 80 50" stroke="white" strokeWidth="8" fill="none"/>
                    <polygon points="78,35 95,50 78,65" fill="white"/>
                </svg>
                <div className="special-main-label">NEW HAND</div>
            </div>
        );
        if (isRestartGame) return (
            <div className="restart-game-container">
                <svg viewBox="0 0 100 100" className="icon-restart">
                    <path d="M20 50 A30 30 0 1 1 80 50" stroke="white" strokeWidth="8" fill="none"/>
                    <polygon points="20,35 5,50 20,65" fill="white"/>
                </svg>
                <div className="restart-label">RESTART</div>
                <div className="special-main-label">GAME</div>
            </div>
        );

        return value;
    };

    return (
        <div className={`uno-card style-${style} ${type} ${colorClass} 
            ${hasVortexBackground ? 'vortex-anim' : ''}
            ${style === 'gold' && !isSpecialCard ? 'card-gold-shine' : ''}`}> 
            
            <div className="card-inner">
                {style === 'retro' && <div className="retro-texture-overlay"></div>}

                <div className="top-left">
                    {isDraw1All ? <span className="corner-plus-one">+1</span> :
                     isSpecialsOnly ? <span className="corner-star">★</span> :
                     isPlus4Reverse ? <span className="corner-plus-four-r">+4R</span> :
                     isSkip ? <div className="skip-label">SKIP</div> : 
                     isExtraTurn ? <div className="extra-label">EXTRA</div> :
                     isPlayOdd ? <div className="mini-label">ODD</div> :
                     isPlayEven ? <div className="mini-label">EVEN</div> :
                     isCancelColor ? <div className="mini-label">CANCEL</div> :
                     isWild ? <div className="mini-label">WILD</div> :
                     isWildPlusFour ? <span className="corner-plus-four">+4</span> :
                     isPlusTwoReverse ? (
                        <>
                            <span className="corner-val">+2</span>
                            <div className="arrow-right">{renderCornerArrow()}</div>
                        </>
                    ) : isReverse ? (
                        <>
                            <span className="corner-r">R</span>
                            <div className="arrow-right">{renderCornerArrow()}</div>
                        </>
                    ) : value}
                </div>

                <div className="center-content">
                    {renderCenterContent()}
                </div>

                <div className="bottom-right">
                    {isDraw1All ? <span className="corner-plus-one">+1</span> :
                     isSpecialsOnly ? <span className="corner-star">★</span> :
                     isPlus4Reverse ? <span className="corner-plus-four-r">+4R</span> :
                     isSkip ? <div className="skip-label">SKIP</div> : 
                     isExtraTurn ? <div className="extra-label">EXTRA</div> :
                     isWildPlusFour ? <span className="corner-plus-four">+4</span> :
                     isPlusTwoReverse ? (
                        <>
                            <div className="arrow-left">{renderCornerArrow()}</div>
                            <span className="corner-val">+2</span>
                        </>
                    ) : isReverse ? (
                        <>
                            <div className="arrow-left">{renderCornerArrow()}</div>
                            <span className="corner-r">R</span>
                        </>
                    ) : value}
                </div>
            </div>
        </div>
    );
};

export default Card;