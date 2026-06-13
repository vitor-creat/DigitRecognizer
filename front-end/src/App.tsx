import "./App.css";
import "./index.css"
import {
  ReactSketchCanvas,
  type ReactSketchCanvasRef,
} from "react-sketch-canvas";
import { useRef, useState } from "react";
import axios from "axios";
function App() {
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);

  const canvasRef = useRef<ReactSketchCanvasRef>(null);
  const handleUndoClick = () => {
    canvasRef.current?.undo();
    setPrediction(null);
  };
  const handleClearClick = () => {
    canvasRef.current?.clearCanvas();
    setPrediction(null);
  };
  const handleDrawnDigit = async () => {
    let drawFile = await canvasRef.current?.exportImage("png");
    if (!drawFile) return;
    const formData = new FormData();
    formData.append("image", drawFile);

    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:5000/infer_img",
        formData,
      );
      setPrediction(response.data.digit);
    } 
    catch (error) {
      console.error("Erro ao enviar imagem:", error);
    } 
    finally {
      setLoading(false);
    }
  };

  return (
    <>
    <div style={{padding: 20, textAlign: "center", fontFamily: "sans-serif", fontSize: 50}}> Digit Recognizer</div>
    <div id="center">
        <h1>Draw a Digit</h1>
        <ReactSketchCanvas
          ref={canvasRef}
          width="200px"
          height="400px"
          allowOnlyPointerType="all"
          strokeColor="black"
          strokeWidth={24}
        />
     
      <div id="button-group">

        <button className="btn btn-undo" type="button" onClick={handleUndoClick}>
          Undo
        </button>

        <button className="btn btn-clear" type="button" onClick={handleClearClick}>
          Clear
        </button>

        <button className="btn btn-predict" type="button" onClick={handleDrawnDigit} disabled={loading} >
          {loading ? "Processando" : "Reconhecer Digito"}
        </button>
      </div>
      </div>

      
        {prediction !== null && (
       <div style={{ marginTop: '20px', fontSize: '2rem' }}>
         Resultado: <strong>{prediction}</strong>
        </div>
        )}

    </>
  );
}

export default App;
