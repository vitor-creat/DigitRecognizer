from flask import Flask, request, jsonify
from flask_cors import CORS
from PIL import Image
import io
import base64
import numpy as np
from model import CnnModel
import torch
from torchvision.transforms import v2

model = CnnModel()
model.load_state_dict(torch.load("Model.pth"))
model.eval()

app = Flask(__name__)
CORS(app)


CLS2LABEL = ['Gato', 'Cachorro']

def predict(image_bytes):
    image = Image.open(io.BytesIO(image_bytes))
    
    transforms = v2.Compose([
    v2.ToImage(),
    v2.Resize((224,224)),
    v2.ToDtype(torch.float32, scale=True),
    v2.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
    ])
    image = transforms(image).unsqueeze(0)
    inferencia = model(image)
    maior = torch.argmax(inferencia, dim=1)
    classe_predita = CLS2LABEL[maior]


    # import matplotlib.pyplot as plt
    # plt.imshow(image, cmap='gray')
    # plt.show()
    
    return classe_predita

@app.route('/infer_img', methods=['POST'])
def process_image():
    try:
        image_bytes = request.files['image'].read()

        result = predict(image_bytes)
        # print(result)
        
        return jsonify({
            'digit': str(result),
            'status': 'success'
        })

    except Exception as e:
        print(e)
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)