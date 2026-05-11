import React from 'react';
import Card from '../components/Card'; 

const CardGallery = () => {
    const colors = ['blue', 'red', 'green', 'yellow'];
    const numbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
    const coloredSpecials = ['+2', 'reverse', '+2R', 'skip', 'extraTurn', 'playOdd', 'playEven'];
    const blackSpecials = [
        'wild', '+4', 'draw1All', 'specialsOnly', '+4R', 
        'cancelColor', 'exchangeHands', 'newHand', 'restartGame'
    ];

    return (
        <div className="page-wrapper" style={{ overflowY: 'auto', padding: '20px' }}>
            <h1 style={{ color: 'white', textAlign: 'center' }}>Galería de Cartas</h1>
            
            <h2 style={{ color: '#aaa' }}>Numéricas</h2>
            <div style={gridStyle}>
                {colors.map(color => 
                    numbers.map(num => <Card key={`${color}-${num}`} value={num} color={color} />)
                )}
            </div>

            <h2 style={{ color: '#aaa', marginTop: '40px' }}>Especiales con Color</h2>
            <div style={gridStyle}>
                {colors.map(color => 
                    coloredSpecials.map(spec => <Card key={`${color}-${spec}`} value={spec} color={color} type="special" />)
                )}
            </div>

            <h2 style={{ color: '#aaa', marginTop: '40px' }}>Comodines y Efectos (Vortex)</h2>
            <div style={gridStyle}>
                {blackSpecials.map(spec => (
                    <Card key={spec} value={spec} type="wild" />
                ))}
            </div>
            
            <button 
                onClick={() => window.history.back()}
                style={backButtonStyle}
            >
                Volver
            </button>
        </div>
    );
};

const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
    gap: '20px',
    padding: '20px',
    justifyItems: 'center'
};

const backButtonStyle = {
    position: 'fixed',
    bottom: '20px',
    right: '20px',
    padding: '10px 20px',
    borderRadius: '20px',
    border: 'none',
    backgroundColor: '#ff0055',
    color: 'white',
    cursor: 'pointer',
    fontWeight: 'bold'
};

export default CardGallery;