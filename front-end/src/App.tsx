// import './App.css'
// import { ReactSketchCanvas, type ReactSketchCanvasRef } from 'react-sketch-canvas'
// import {useRef, useState} from "react"
// import axios from "axios"
// function App() {


//   const [drawFile, setDrawFile] = useState(null)
//   const [prediction, setPrediction] = useState(null)
//   const [loading, setLoading] = useState(false)

//   const handleDrawnDigit = async() =>{
//     if (!drawFile) return;

//     const formData = new FormData()
//     formData.append("image", drawFile)

//     setLoading(true)

//     try {
//       const response
//     } catch (error) {
      
//     }

//   }
//   const canvasRef = useRef<ReactSketchCanvasRef>(null)
//   const handleUndoClick = ()=>{
//     canvasRef.current?.undo()
//   }
//     const handleClearClick = ()=>{
//     canvasRef.current?.clearCanvas()
//   }
//   const handleExportImage = async () =>{
//     const x = await canvasRef.current?.exportImage('png')
//     //o x é uma constante que contém a uri do que foi desenhado
//     //a uri tem o seguinte formato: data:image/png;base64
//     //vou enviar essa uri para o back-end e com o python, vou transformar ela em uma image pillow com o base64
//     console.log(x)
//   }
//   return (
//     <>
//       <div id="center">
//               <h1>Draw a Digit</h1>
//         <ReactSketchCanvas ref={canvasRef} width='800' height='700' allowOnlyPointerType='mouse' strokeColor='black'/>
      
//         <button
//           type="button"
//           onClick={handleUndoClick}
//         >
//           Undo
//         </button>
        
//         <button
//           type="button"
//           onClick={handleClearClick}
//         >
//           Clear
//         </button>

//         <button
//           type="button"
//           onClick={handleExportImage}

//         >
//           save
//         </button>
//       </div>

//     </>
    
//   )
// }

// export default App

import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from './assets/vite.svg'
// import heroImg from './assets/hero.png'
import './App.css'

import axios from 'axios';

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState<null | string>(null);
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const handleFileChange = (e: any) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    setPreview(URL.createObjectURL(file));
    setPrediction(null);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append('image', selectedFile);

    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/infer_img', formData);
      setPrediction(response.data.digit);
    } catch (error) {
      console.error("Erro ao enviar imagem:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', textAlign: 'center', fontFamily: 'sans-serif' }}>
      <h1>MNIST Digit Recognizer</h1>
      
      <input type="file" accept="image/*" onChange={handleFileChange} />
      
      {preview && (
        <div style={{ margin: '20px' }}>
          <img src={preview} alt="Preview" style={{ width: '140px', border: '1px solid #ccc' }} />
        </div>
      )}

      <button onClick={handleUpload} disabled={!selectedFile || loading}>
        {loading ? 'Processando...' : 'Reconhecer Dígito'}
      </button>

      {prediction !== null && (
        <div style={{ marginTop: '20px', fontSize: '2rem' }}>
          Resultado: <strong>{prediction}</strong>
        </div>
      )}
    </div>
  )
}

export default App