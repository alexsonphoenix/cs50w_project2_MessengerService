document.addEventListener('DOMContentLoaded', () => {
  // Connect to websocket
  var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);

  // When connected, configure buttons
  socket.on('connect', () => {

      // When a message is sent:
      document.querySelector('#send_message').onclick = () =>{
        let username = "random";

        let message = document.querySelector('#textarea_input');

        let today = new Date();
        let date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
        let time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        let dateTime = date+' '+time;

        const message_infor = [username, dateTime, message.value];

        message.innerHTML = '';

        socket.emit('submit message', {'message_infor': message_infor});
      }
  });


  // When a new message is announced, add to the unordered list
  socket.on('announce message', data => {
      const li = document.createElement('li');
      li.innerHTML = `${data.message_infor}`;
      document.querySelector('#messages_view').append(li);
  });


  // When a Channel is Selected:
  document.querySelectorAll('.channel_name').forEach(button => {
    button.onclick = () => {
      const selected_channel = button.dataset.channel;
      console.log(selected_channel);
      document.querySelector('#channel_selected').innerHTML = selected_channel;
    };
  });

});
