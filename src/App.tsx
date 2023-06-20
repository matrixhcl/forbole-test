import "./App.css";
import GamePlayground from "./components/GamePlayground";
import GameHistory from "./components/GameHistory";

function App() {
  return (
    <div className="App grid grid-cols-12 h-screen bg-gray-600">
      <GameHistory></GameHistory>
      <GamePlayground></GamePlayground>
    </div>
  );
}

export default App;
