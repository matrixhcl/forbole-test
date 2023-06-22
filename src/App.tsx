import "./App.css";
import GamePlayground from "./components/GamePlayground";
import GameHistory from "./components/GameHistory";

function App() {
  return (
    <div className="grid h-screen grid-cols-12 bg-gray-600">
      <GameHistory></GameHistory>
      <GamePlayground></GamePlayground>
    </div>
  );
}

export default App;
