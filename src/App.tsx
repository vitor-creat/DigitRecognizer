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
  const handleExportImage = async () =>{
    const x = await canvasRef.current?.exportImage('png')
    //o x é uma constante que contém a uri do que foi desenhado
    //a uri tem o seguinte formato: data:image/png;base64
    //vou enviar essa uri para o back-end e com o python, vou transformar ela em uma image pillow com o base64
    console.log(x)
  }
  return (
    <>
      <div id="center">
              <h1>Draw a Digit</h1>
        <ReactSketchCanvas ref={canvasRef} width='800' height='700' allowOnlyPointerType='mouse' strokeColor='black'/>
      
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

        <button
          type="button"
          onClick={handleExportImage}

        >
          save
        </button>
      </div>

    </>
    
  )
}

export default App


