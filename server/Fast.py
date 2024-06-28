import pickle
import numpy as np
from flask import Flask, request, jsonify
import tensorflow as tf
import tensorflow_hub as hub
from sklearn.cluster import KMeans  
from flask_cors import CORS


app = Flask(__name__)
CORS(app)

# Load the KMeans model
with open("kmeans_model.pkl", "rb") as f:
    model = pickle.load(f)

# Load the Universal Sentence Encoder
embed = hub.load("https://tfhub.dev/google/universal-sentence-encoder/4")

def preprocess(text):
    # Convert text to embeddings
    embeddings = embed([text])
    return np.array(embeddings).astype(np.float32)

def predict_cluster(embeddings, model):
    # Convert the embeddings to float32 using tf.cast
    embeddings = tf.cast(embeddings, tf.float32)
    
    # Reshape the embeddings array if it has a single embedding
    if embeddings.shape[0] == 1:
        embeddings = tf.reshape(embeddings, (1, -1))

    # Predict the cluster ID
    cluster_id = model.predict(embeddings)[0]

    return int(cluster_id)

@app.route('/cluster', methods=['POST'])
def cluster():
    text = request.json['text']  # Assuming the message is passed in JSON format
    embeddings = preprocess(text)
    cluster_id = predict_cluster(embeddings, model)
        
    # Check if the predicted cluster is 8
    result = cluster_id == 8    
    return jsonify(result)
    

if __name__ == '__main__':      
    app.run(debug=True)
