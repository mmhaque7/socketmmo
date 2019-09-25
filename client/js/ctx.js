  var ctx = document.getElementById("ctx").getContext("2d");
  ctx.font = '30px Arial';
  var socket = io();

  socket.on('newPosition', (data) => {
      ctx.clearRect(0, 0, 500, 500);
      for (var i = 0; i < data.length; i++) {
          ctx.fillText(data[i].number, data[i].x, data[i].y)
      };

  });

  document.onkeydown = (e) => {
      if (e.keyCode == 68)
          socket.emit('keyPress', {
              inputID: 'right', //d
              state: true
          });
      else if (e.keyCode == 83)
          socket.emit('keyPress', {
              inputID: 'down', //s
              state: true
          });
      else if (e.keyCode == 65)
          socket.emit('keyPress', {
              inputID: 'left', //a
              state: true
          });
      else if (e.keyCode == 87)
          socket.emit('keyPress', {
              inputID: 'up', //w
              state: true
          });
  }

  document.onkeyup = (e) => {
      if (e.keyCode == 68)
          socket.emit('keyPress', {
              inputID: 'right', //d
              state: false
          });
      else if (e.keyCode == 83)
          socket.emit('keyPress', {
              inputID: 'down', //s
              state: false
          });
      else if (e.keyCode == 65)
          socket.emit('keyPress', {
              inputID: 'left', //a
              state: false
          });
      else if (e.keyCode == 87)
          socket.emit('keyPress', {
              inputID: 'up', //w
              state: false
          });
  }