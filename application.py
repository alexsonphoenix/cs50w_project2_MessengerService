import os

from flask import Flask, redirect, render_template, request, session
from flask_session import Session
from tempfile import mkdtemp

from flask_socketio import SocketIO, emit

app = Flask(__name__)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
socketio = SocketIO(app)

# Configure session to use filesystem (instead of signed cookies(default))
app.config["SESSION_FILE_DIR"] = mkdtemp()
app.config["SESSION_PERMANENT"] = False
app.config["SESSION_TYPE"] = "filesystem"
Session(app)    # to store information specific to a user from one request to the next


# Global Varibles:
channel_list = [("Example1", "original channel"), ("Example2", "original channel"), ("Example3", "original channel")] # a list of tuple


@app.route("/")
def index():
    needLogin = True
    if not session.get('username'):
        needLogin = True
    else:
        needLogin = False
    return render_template("index.html", needLogin=needLogin, user_username=session.get('username'), channel_list=channel_list)


@app.route("/login", methods=["POST"])
def login():
    session.clear()
    session['username'] = request.form.get('username')
    return redirect('/')


@app.route("/add_channel", methods=["POST"])
def add_channel():
    channel_name = request.form.get('channel_name')
    channel_description = request.form.get('channel_description')
    if not any(channel_name in i for i in channel_list) :
        channel_list.append((channel_name,channel_description))
    else:
        return "Already taken",401
    return redirect('/')

#@app.route("/check_channel", methods=["POST"])
#def check_channel():
    #return jsonify(True)
