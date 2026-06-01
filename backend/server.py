from flask import Flask, request, jsonify
from flask_cors import CORS
from PIL import Image
import base64
from io import BytesIO
import torch
from model import CnnModel
import numpy as np
from torchvision.transforms import v2

# vai carregar o modelo que reconhece os digitos
# exemplo de como vai ser o load do modelo
# model = CnnModel()
# model = torch.load('Model.pth')
# model.eval(True)


app = Flask(__name__)
CORS(app)


# função responsavel por fazer a predição. a imagem em base64 é convertida em uma imagem PIL e depois é aplicado sobre ela uma serie de transformações
# após isso, é feita a inferencia e retorna a classe que o modelo tem mais confiança de ser a certa, com base no seu treino
def predict(image_base64):
    image = Image.open(BytesIO(base64.b64decode(image_base64)))
    
    transforms = v2.Compose([
    v2.ToImage(),
    v2.Resize((224,224)),
    v2.ToDtype(torch.float32, scale=True),
    v2.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
    ])
    image = transforms(image).unsqueeze(0)
    # inferencia = model(image)
    # maior = torch.argmax(inferencia, dim=1)


# rota que pega a imagem que esta sendo enviada do front end e chama a função preditc, passando como parametro a imagem que foi enviada para a rota /infer_img

@app.route("/infer_img", methods=['POST'])
def process_image():
    try:
        image_base64 = request.files['data'].read()
        result = predict(image_base64)
        return jsonify({
            "digit": int(result),
            "status":"success"
        })
    except Exception as e:
        print(e)
        return jsonify({
            "success": "False",
            "error":str(e)
        }),500
    
if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)


