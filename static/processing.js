document.addEventListener('DOMContentLoaded', () => {
  // Connect to websocket
  alert("I'm Active!!");
  console.log("im activeeee");
  //var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);

  // When connected, configure buttons

  //});



  // When a Channel is Selected:
  document.querySelectorAll('.channel_name').forEach(button => {
    button.onclick = () => {
      const selected_channel = button.dataset.channel;
      console.log(selected_channel);
      document.querySelector('#channel_selected').innerHTML = selected_channel;
    };
  });

});
