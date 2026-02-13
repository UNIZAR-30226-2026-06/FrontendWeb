export default function GameBoard() {
  return (
    <div style={{ color: "white", textAlign: "center", marginTop: "50px" }}>
      <h1>Tablero de Juego</h1>
      <button onClick={() => window.history.back()}>Volver</button>
    </div>
  );
}