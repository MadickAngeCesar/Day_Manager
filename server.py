from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import os

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

UPLOAD_FOLDER = 'public/media'
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

@app.route('/upload', methods=['POST'])
def upload_file():
    try:
        if 'file' not in request.files:
            return jsonify(error="No file part"), 400
        file = request.files['file']
        if file.filename == '':
            return jsonify(error="No selected file"), 400
        file_path = os.path.join(UPLOAD_FOLDER, file.filename)
        file.save(file_path)
        app.logger.info(f"File saved successfully: {file_path}")
        return jsonify(file_path=file_path), 200
    except Exception as e:
        app.logger.error(f"Error uploading file: {str(e)}")
        return jsonify(error="Upload failed"), 500

@app.route('/media/<filename>')
def uploaded_file(filename):
    try:
        app.logger.info(f"Requested file: {filename}")
        return send_from_directory(UPLOAD_FOLDER, filename)
    except FileNotFoundError:
        app.logger.error(f"File not found: {filename}")
        return jsonify(error="File not found"), 404
    except Exception as e:
        app.logger.error(f"Error serving file: {str(e)}")
        return jsonify(error="Error serving file"), 500

@app.route('/delete/<filename>', methods=['DELETE'])
def delete_file(filename):
    try:
        file_path = os.path.join(UPLOAD_FOLDER, filename)
        if os.path.exists(file_path):
            os.remove(file_path)
            app.logger.info(f"File deleted successfully: {file_path}")
            return jsonify(success=True)
        else:
            return jsonify(error="File not found"), 404
    except Exception as e:
        app.logger.error(f"Error deleting file: {str(e)}")
        return jsonify(error="Error deleting file"), 500

if __name__ == '__main__':
    app.run(port=5000)