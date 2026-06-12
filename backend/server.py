from flask import Flask, request, jsonify
from flask_cors import CORS
from PIL import Image
import base64
from io import BytesIO
import torch
from model import DigitModel
import numpy as np
from torchvision.transforms import v2
import matplotlib.pyplot as plt
# vai carregar o modelo que reconhece os digitos
# exemplo de como vai ser o load do modelo
model = DigitModel().cuda()
model.load_state_dict(torch.load("ModelDigit.pth"))
model.eval()

CLS2LABEL = list({'X':0, '9':1, 'C':2, 'H':3, 'P':4, 'R':5, 'U':6, 'Z':7, 'E':8, '2':9, 'L':10, '5':11, 'T':12, 'F':13, 'A':14, 'M':15, 'W':16, '0':17, 'Y':18, 'D':19, 'S':20, '1':21, 'I':22, 'G':23, 'V':24, 'N':25, '3':26, '8':27, '6':28, 'Q':29, '4':30, '7':31, 'B':32, 'J':33, 'K':34})

# print(CLS2LABEL)
app = Flask(__name__)
CORS(app)


# função responsavel por fazer a predição. a imagem em base64 é convertida em uma imagem PIL e depois é aplicado sobre ela uma serie de transformações
# após isso, é feita a inferencia e retorna a classe que o modelo tem mais confiança de ser a certa, com base no seu treino
def predict(image_base64, transforms):

    image_bytes = base64.b64decode(image_base64)

    LoadImage = Image.open(BytesIO(image_bytes)).convert("RGB")
    plt.imshow(LoadImage)
    plt.show()
    
    image = transforms(LoadImage).unsqueeze(0).cuda()

    inferencia = model(image)

    maior = torch.argmax(inferencia, dim=1)
    print(maior)
    classe_predita = CLS2LABEL[maior]

    return classe_predita


# rota que pega a imagem que esta sendo enviada do front end e chama a função preditc, passando como parametro a imagem que foi enviada para a rota /infer_img

@app.route("/infer_img", methods=['POST'])
def process_image():
    transforms = v2.Compose([
    v2.ToImage(),
    v2.Resize((128,128)),
    v2.ToDtype(torch.float32, scale=True),
    v2.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
    ])
    try:
        image_base64 = request.form['image']
        # remove o cabeçalho "data:image/png;base64," da string enviada
        image_base64 = image_base64.split(",")[1]

        result = predict(image_base64, transforms)
        return jsonify({
            "digit": str(result),
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


