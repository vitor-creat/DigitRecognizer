import './App.css'
import { ReactSketchCanvas, type ReactSketchCanvasRef } from 'react-sketch-canvas'
import {useRef} from "react"
function App() {
  const canvasRef = useRef<ReactSketchCanvasRef>(null)
  const handleUndoClick = ()=>{
    canvasRef.current?.undo()
  }
    const handleClearClick = ()=>{
    canvasRef.current?.clearCanvas()
  }
  return (
    <>
      <div id="center">
              <h1>Draw a Digit</h1>
        <ReactSketchCanvas ref={canvasRef} width='800' height='700' allowOnlyPointerType='mouse'/>
      
        <button
          type="button"
          onClick={handleUndoClick}
        >
          Undo
        </button>
        
        <button
          type="button"
          onClick={handleClearClick}
        >
          Clear
        </button>

      </div>

    </>
    
  )
}

export default App


