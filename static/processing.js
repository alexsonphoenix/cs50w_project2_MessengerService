//Function to find index in an array
function logArrayElements(element, index, array) {
  console.log('a[' + index + '] = ' + element);
}

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
          li.innerHTML = '<span>' + message_info.username +' '+'</span>' + '<small>' + message_info.timestamp + '</small>' + '<div class="hide_wrapper">' + '<button class="hide">' +'Hide'+ '</button>' + '</div>'+
          '<p>' + message_info.message +'</p>';

          document.querySelector('#messages_view').append(li);
          // When hide button is clicked, remove post.
          document.querySelectorAll('.hide').forEach(function(button, index) {
              button.onclick = () => {
                  button.parentElement.parentElement.remove();  // delete message client-side (delete the <li></li>)

                  // figure out the index of the deleted message:
                  console.log("message index is " + index);

                  // make a POST request to delete message server-side
                  const request = new XMLHttpRequest();
                  request.open('POST', '/delete_message');
                  // Callback function for when request completes
                  request.onload = () => {
                      // Extract JSON data from request
                      const data = JSON.parse(request.responseText);
                      // Notify user
                      if (data.deleted) {
                          alert("You've deleted a message")
                      }
                      else {
                          alert("There was an error.");
                      }
                  }
                  // Add data to send with request
                  const data = new FormData();
                  data.append('index', index);
                  // Send request
                  request.send(data);
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


  // When hide button is clicked, remove post.
  document.querySelectorAll('.hide').forEach(function(button, index) {
      button.onclick = () => {
          button.parentElement.parentElement.remove();  // delete message client-side (delete the <li></li>)

          // figure out the index of the deleted message:
          console.log("message index is " + index);

          // make a POST request to delete message server-side
          const request = new XMLHttpRequest();
          request.open('POST', '/delete_message');
          // Callback function for when request completes
          request.onload = () => {
              // Extract JSON data from request
              const data = JSON.parse(request.responseText);
              // Notify user
              if (data.deleted) {
                  alert("You've deleted a message")
              }
              else {
                  alert("There was an error.");
              }
          }
          // Add data to send with request
          const data = new FormData();
          data.append('index', index);
          // Send request
          request.send(data);
      }
  });
});
