from flask import Flask, jsonify, send_from_directory, abort
from flask_cors import CORS
import os
import requests

BASE_DIR = os.path.abspath(os.path.dirname(__file__))
app = Flask(__name__, static_folder=BASE_DIR)
CORS(app)

@app.route('/')
def serve_index():
    return send_from_directory(app.static_folder, 'index.html')

@app.route('/api/users', methods=['GET'])
def get_users():
    try:
        response = requests.get('https://jsonplaceholder.typicode.com/users', timeout=5)
        response.raise_for_status()
        return jsonify(response.json())
    except Exception as e:
        return jsonify({'error': 'No se pudo obtener la lista de usuarios', 'details': str(e)}), 500

@app.route('/api/users/<int:user_id>', methods=['GET'])
def get_user(user_id):
    try:
        response = requests.get(f'https://jsonplaceholder.typicode.com/users/{user_id}', timeout=5)
        if response.status_code == 404:
            return jsonify({'error': 'Usuario no encontrado'}), 404
        response.raise_for_status()
        return jsonify(response.json())
    except Exception as e:
        return jsonify({'error': 'No se pudo obtener el usuario', 'details': str(e)}), 500

@app.route('/<path:path>')
def serve_static(path):
    file_path = os.path.join(app.static_folder, path)
    if not os.path.isfile(file_path):
        abort(404)
    return send_from_directory(app.static_folder, path)

if __name__ == '__main__':
    app.run(debug=True)
