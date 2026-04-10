import sys
import os
os.environ["TF_USE_LEGACY_KERAS"] = "1"
from pathlib import Path
import tensorflow as tf
try:
    import keras
    tf.keras = keras
    sys.modules['tensorflow.keras'] = keras
except ImportError:
    pass
import random

# Fix warnings by setting env var
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '2'

sys.path.append(os.path.dirname(__file__))
from train import _load_samples, _stratified_split, _build_dataset, _build_model, MODEL_IMAGE_SIZE, MODEL_PREPROCESSORS

def eval_model(model_name, weights_path, dataset_path):
    print(f"Loading {model_name} from {weights_path}...")
    random.seed(42)
    tf.random.set_seed(42)
    
    dp = Path(dataset_path).expanduser().resolve()
    samples = _load_samples(dp)
    _, _, test_samples = _stratified_split(samples)
    
    image_size = MODEL_IMAGE_SIZE[model_name]
    preprocess_fn = MODEL_PREPROCESSORS[model_name]
    
    test_ds = _build_dataset(test_samples, batch_size=16, image_size=image_size, preprocess_fn=preprocess_fn, training=False)
    
    model, _ = _build_model(model_name, image_size)
    model.load_weights(weights_path)
    
    print("Evaluating...")
    metrics = model.evaluate(test_ds, verbose=0)
    print(f"--- {model_name} Metrics ---")
    print(f"  Test Loss:     {metrics[0]:.4f}")
    print(f"  Test Accuracy: {metrics[1]:.4%}")
    print(f"  Test AUC:      {metrics[2]:.4%}")
    print()

if __name__ == "__main__":
    dataset = r"C:\Users\HP\OneDrive\Desktop\DR model code\RETINAL-IQ-model-main\data"
    
    weights_dir = Path(__file__).parent
    
    b3_path = weights_dir / "retinaiq_efficientnetv2b3.weights.h5"
    if b3_path.exists():
        eval_model("efficientnetv2b3", str(b3_path), dataset)
    
    mv3_path = weights_dir / "retinaiq_mobilenetv3_improved.weights_best.weights.h5"
    if mv3_path.exists():
        eval_model("mobilenetv3", str(mv3_path), dataset)
