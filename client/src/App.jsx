import { useEffect } from "react";

function App() {
  let ws = null;
  useEffect(() => {
    ws = new WebSocket("ws://127.0.0.1:8000/ws")
    ws.onopen = () => console.log("Connected to server");
  });
  return (
    <>
      <div className="bg-slate-600">Hello World</div>
    </>
  );
}

export default App;
