const request = new XMLHttpRequest();
request.open('POST', '/select_channel');
// Callback function for when request completes
request.onload = () => {
    // Extract JSON data from request
    const data = JSON.parse(request.responseText);

    const channel_id = `${data.channel_id}`
    // Update the messages_display div
    document.querySelector('#messages_display').innerHTML = {{channel_id}};

}
// Add data to send with request
const data = new FormData();
data.append('channel_name', selected_channel);

// Send request
request.send(data);
