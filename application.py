import os

from flask import Flask, redirect, render_template
from flask_socketio import SocketIO, emit

app = Flask(__name__)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
socketio = SocketIO(app)

@app.route("/")
def index():
    needLogin = False
    return render_template("index.html", needLogin=needLogin, user_username="alexInDaHouse")
