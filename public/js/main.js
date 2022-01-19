const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const userList = document.getElementById('users');
const audioArea = document.getElementById('audioArea');
// Get username and room from URL
const { username, color } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

let room = 'room';
const socket = io();

// Join chatroom
socket.emit('joinRoom', { username, room, color });
// Get room and users
socket.on('roomUsers', ( {users} ) => {
  outputUsers(users);
});

// Message from server
socket.on('message', ( message, c  ) => {
  outputMessage(message, c);
  // Scroll down
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

socket.on('audio', ( message, c , blob ) => {
	outputMessage(message, c);
	var binaryData = [];
	binaryData.push(blob);
	var blobURL = window.URL.createObjectURL(new Blob(binaryData, {type: 'audio/wav'}))
	var audio0 = new Audio(blobURL);
	audio0.play();
  // Scroll down
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

// Message submit
chatForm.addEventListener('submit', (e) => {
  // Get message text
  e.preventDefault();
  if(audioArea.checked == true ){
    	console.log('Audio Time');
    	navigator.mediaDevices.getUserMedia({ audio: true })
  	  .then(stream => {
  	    const mediaRecorder = new MediaRecorder(stream);
  	    mediaRecorder.start();
  	    const audioChunks = [];
  	    mediaRecorder.addEventListener("stop", () => {
			const audioBlob = new Blob(audioChunks, {type : 'audio/wav'});
			socket.emit('audioMessage', audioBlob);
  	    });
		mediaRecorder.ondataavailable = function(e) {
  	      audioChunks.push(e.data);
  	    }
  	    setTimeout(() => {
  	      mediaRecorder.stop();
  	    }, 2000);
  	  });
	} else {
		  let msg = e.target.elements.msg.value;
		  msg = msg.trim();
		  if (!msg) {
			return false;
		  }
		  socket.emit('chatMessage', msg );
		  e.target.elements.msg.value = '';
		  e.target.elements.msg.focus();
	}
});

// Output message to DOM
function outputMessage(message, c) {
  const div = document.createElement('div');
  div.classList.add('message');
  const p = document.createElement('p');
  p.classList.add('meta');
  p.innerText = message.username;
  p.innerHTML += `<span>${message.time}</span>`;
  p.style.color = c;
  div.appendChild(p);
  const para = document.createElement('p');
  para.classList.add('text');
  para.innerText = message.text;
  div.appendChild(para);
  document.querySelector('.chat-messages').appendChild(div);
}

// Add users to DOM
function outputUsers(users) {
  userList.innerHTML = '';
  users.forEach((user) => {
    const li = document.createElement('li');
    li.innerText = user.username;
	li.style.color = user.color;
    userList.appendChild(li);
  });
}

//Prompt the user before leave chat room
document.getElementById('leave-btn').addEventListener('click', () => {
  const leaveRoom = confirm('Are you sure you want to leave the chatroom?');
  if (leaveRoom) {
    window.location = '../index.html';
  } 
});
function validate()
{
	if (audioArea.checked){
		document.querySelector('#ShowButton').innerHTML = 'Record';
	}
	else{
		document.querySelector('#ShowButton').innerHTML = 'Send';
	}
}