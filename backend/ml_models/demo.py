import os
os.environ["TF_USE_LEGACY_KERAS"] = "1"
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '2'

import sys
from pathlib import Path
import tensorflow as tf
import numpy as np

try:
    import keras
    tf.keras = keras
    sys.modules['tensorflow.keras'] = keras
except ImportError:
    pass

import gradio as gr

sys.path.append(os.path.dirname(__file__))
from train import _build_model, MODEL_IMAGE_SIZE, MODEL_PREPROCESSORS

MODEL_NAME = "mobilenetv3"
WEIGHTS_PATH = Path(__file__).parent / "retinaiq_mobilenetv3_improved.weights_best.weights.h5"

print("Loading Retinal-IQ Model for UI Demo...")
image_size = MODEL_IMAGE_SIZE[MODEL_NAME]
preprocess_fn = MODEL_PREPROCESSORS[MODEL_NAME]

model, _ = _build_model(MODEL_NAME, image_size)
model.load_weights(str(WEIGHTS_PATH))
print("Model uniquely loaded successfully.")

DIAGNOSIS_MAP = {
    0: "No DR",
    1: "Mild",
    2: "Moderate",
    3: "Severe",
    4: "Proliferative DR"
}

def predict_dr(image):
    if image is None: 
        return "Please upload an image."
    
    img = image.resize((image_size, image_size))
    img_array = np.array(img).astype("float32")
    
    img_array = preprocess_fn(img_array)
    img_array = np.expand_dims(img_array, axis=0)
    
    preds = model.predict(img_array, verbose=0)[0]
    
    result = {DIAGNOSIS_MAP[i]: float(preds[i]) for i in range(5)}
    return result

with gr.Blocks(theme=gr.themes.Soft(primary_hue="blue")) as demo:
    gr.Markdown("# 👁️ RetinaIQ - Local Live Demo")
    gr.Markdown("Upload a retinal fundus image to see the selected model's real-time prediction. Currently running: **MobileNetV3 (Optimized)**")
    
    with gr.Row():
        with gr.Column():
            img_input = gr.Image(type="pil", label="Retinal Image")
            submit_btn = gr.Button("Analyze Image", variant="primary")
        with gr.Column():
            output_lbl = gr.Label(num_top_classes=5, label="Diagnosis Probability")
            
    submit_btn.click(fn=predict_dr, inputs=img_input, outputs=output_lbl)

if __name__ == "__main__":
    demo.launch(server_name="127.0.0.1", server_port=8080)
