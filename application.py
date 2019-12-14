import os
import requests

from flask import Flask, redirect, render_template, request, session, jsonify
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
channel_list = [] # a list of tuple

message_channel = [
    []              # list of list of dictionaries to store messages for individual channel
]



@app.route("/")
def index():
    needLogin = True
    if not session.get('username'):
        needLogin = True
    else:
        needLogin = False
    return render_template("index.html", needLogin=needLogin,
                                        user_username=session.get('username'),
                                        channel_list=channel_list,
                                        message_channel=message_channel,
                                        currently_selected_channel=session.get('currently_selected_channel'))

@socketio.on("submit message")
def submit_message(data):
    currently_selected_channel =session.get('currently_selected_channel')
    message_infor = data["message_infor"]
    print("currently_selected_channel is", currently_selected_channel)
    if len(message_channel[currently_selected_channel]) < 100:    # Ensure to remember only 100 most current messages
        message_channel[currently_selected_channel].append({"username": message_infor[0], "timestamp": message_infor[1], "message": message_infor[2]})
    else:
        message_channel[currently_selected_channel].pop(0)
        message_channel[currently_selected_channel].append({"username": message_infor[0], "timestamp": message_infor[1], "message": message_infor[2]})

    emit("announce message", {"conversation": message_channel[currently_selected_channel]}, broadcast=True)


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
        channel_list.append((channel_name,channel_description)) # append a new channel to the channel list
        message_channel.append([]) # append a new message channel

    elif len(channel_list) >9:      # limit to 10 channel maximum
        return "Too much channels", 401
    else:
        return "Already taken",401


    return redirect('/')


@app.route("/select_channel", methods=["POST"])
def select_channel():
    channel_name = request.form.get("channel_name")
    channel_id = [channel[0] for channel in channel_list].index(channel_name)
    session['currently_selected_channel'] = channel_id
    return redirect("/")
