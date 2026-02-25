import React from 'react';
import '../styles/Card.css';

const Card = ({ value, color = 'blue', type = 'normal' }) => {
    const isPlusTwo = value === "+2";
    const isReverse = value === "reverse";
    const isPlusTwoReverse = value === "+2R";
    const isSkip = value === "skip";
    const isExtraTurn = value === "extraTurn";
    const isPlayOdd = value === "playOdd";
    const isPlayEven = value === "playEven";

    const renderCornerArrow = () => (
        <svg viewBox="0 0 100 100" className="icon-corner-arrow">
            <path d="M15 50 L35 35 L35 45 L80 45 L80 55 L35 55 L35 65 Z" fill="white" stroke="#000" strokeWidth="2" />
        </svg>
    );

    const renderCenterContent = () => {
        if (isReverse || isPlusTwoReverse) {
            return (
                <svg viewBox="0 0 100 100" className={`icon-reverse-arrow ${isPlusTwoReverse ? 'combo-arrow' : ''}`}>
                    <path d="M15 50 L35 35 L35 45 L80 45 L80 55 L35 55 L35 65 Z" fill="white" stroke="#000" strokeWidth="2" />
                </svg>
            );
        }
        if (isSkip) {
            return (
                <svg viewBox="0 0 100 100" className="icon-skip-center">
                    <circle cx="50" cy="50" r="38" fill="none" stroke="white" strokeWidth="10" />
                    <line x1="28" y1="28" x2="72" y2="72" stroke="white" strokeWidth="10" strokeLinecap="round" />
                </svg>
            );
        }
        if (isExtraTurn) {
            return (
                <div className="extra-turn-container">
                    <svg viewBox="0 0 100 100" className="icon-extra-turn">
                        <path 
                            d="M 20 30 A 35 25 0 0 1 80 30" 
                            fill="none" 
                            stroke="white" 
                            strokeWidth="7" 
                            strokeLinecap="round" 
                        />
                        <path 
                            d="M 75 20 L 92 30 L 75 40 Z" 
                            fill="white"
                            transform="rotate(45 80 30)"
                        />
                        <path 
                            d="M 80 70 A 35 25 0 0 1 20 70" 
                            fill="none" 
                            stroke="white" 
                            strokeWidth="7" 
                            strokeLinecap="round" 
                        />
                        <path 
                            d="M 25 80 L 8 70 L 25 60 Z" 
                            fill="white" 
                            transform="rotate(45 20 70)"    
                        />
                    </svg>
                    <span className="extra-turn-number">2x</span>
                </div>
            );
        }
        if (isPlayOdd || isPlayEven) {
            return (
                <div className="play-numbers-container">
                    <svg viewBox="0 0 100 100" className="icon-numbers-ring">
                        {[0, 90, 180, 270].map((rot) => (
                            <g transform={`rotate(${rot} 50 50)`} key={rot}>
                                <path 
                                    d="M 50 12 A 38 38 0 0 1 78 22" 
                                    fill="none" 
                                    stroke="white" 
                                    strokeWidth="5" 
                                    strokeLinecap="round" 
                                />
                                <path 
                                    d="M 70 14 L 87 25 L 70 35 Z" 
                                    fill="white" 
                                    transform="rotate(50 78 25)" 
                                />
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
        }
        return value;
    };

    return (
        <div className={`uno-card ${type} ${color} 
            ${isPlusTwo ? 'card-plus-two' : ''} 
            ${isReverse ? 'card-reverse' : ''}
            ${isPlusTwoReverse ? 'card-plus-two-reverse' : ''}
            ${isSkip ? 'card-skip' : ''}
            ${isExtraTurn ? 'card-extra-turn' : ''}
            ${isPlayOdd || isPlayEven ? 'card-play-number' : ''}`}> 
            <div className="card-inner">
                <div className="top-left">
                    {isSkip ? <div className="skip-label">SKIP</div> : 
                     isExtraTurn ? <div className="extra-label">EXTRA TURN</div> :
                     isPlayOdd ? <div className="mini-label">PLAY ODD</div> :
                     isPlayEven ? <div className="mini-label">PLAY EVEN</div> :
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

                <div className="center-content">{renderCenterContent()}</div>

                <div className="bottom-right">
                    {isSkip ? <div className="skip-label">SKIP</div> : 
                     isExtraTurn ? <div className="extra-label">EXTRA TURN</div> :
                     isPlayOdd ? <div className="black-bar-label">PLAY ODD</div> :
                     isPlayEven ? <div className="black-bar-label">PLAY EVEN</div> :
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