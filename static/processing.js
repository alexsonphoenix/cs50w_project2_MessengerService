document.addEventListener('DOMContentLoaded', () => {
  // Connect to websocket
  var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);

  // When connected, configure buttons
  socket.on('connect', () => {

      // When a message is sent:
      document.querySelector('#send_message').onclick = () =>{
        let message = document.querySelector('#textarea_input');

        let today = new Date();
        let date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
        let time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        let dateTime = date+' '+time;

        const message_infor = [username, dateTime, message.value];

        message.value = '';
        message.focus();
        socket.emit('submit message', {'message_infor': message_infor});
      }
  });


  // When a new message is announced, add to the unordered list
  socket.on('announce message', data => {
      document.querySelector('#messages_view').innerHTML = '';
      const conversation = data.conversation;
      console.log("conversation:" + conversation);
      conversation.forEach( message_info => {
          const li = document.createElement('li');
          li.classname = 'message_info';
          li.innerHTML = '<span>' + message_info.username +' '+'</span>' + '<small>' + message_info.timestamp + '</small>' + '<p>' + message_info.message +'</p>'
                        + '<div class="hide_wrapper">' + '<button class="hide">' +'Hide'+ '</button>' + '</div>';

          document.querySelector('#messages_view').append(li);
          // When hide button is clicked, remove post.
          document.querySelectorAll('.hide').forEach(button => {
              button.onclick = () => {
                  button.parentElement.parentElement.remove();
              }
      });

  });


  });

  // When a Channel is Selected:
  document.querySelectorAll('.channel_name').forEach(button => {
    button.onclick = () => {
      const selected_channel = button.dataset.channel;
      console.log("selected channel is"+selected_channel);

      // make a POST request to indicate currently_selected_channel with the server
      const request = new XMLHttpRequest();
      request.open('POST', '/select_channel');
      // Add data to send with request
      const data = new FormData();
      data.append('channel_name', selected_channel);

      // Send request
      request.send(data);
    };
  });


});
