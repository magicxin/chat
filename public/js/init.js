var page = getBrowserInterfaceSize();
		  console.log(page.pageWidth);
		  var body = document.getElementById('body');
		  body.style.height = page.pageHeight + 'px';
		  
		  var input = document.getElementById('input');
		  input.style.height = page.pageHeight*0.06 + 'px';
		  input.style.width = parseInt(page.pageWidth)*0.84-8 + 'px';
		  
		  var btn = document.getElementById('send');
		  btn.style.height = page.pageHeight*0.06 + 'px';
		  btn.style.width = parseInt(page.pageWidth)*0.16-8 + 'px';
		  
		  var content = document.getElementById('chat');
		  content.style.height = parseInt(page.pageHeight)*0.94-86 + 'px';
		  
		  var action = document.getElementById('workplace');
		  action.style.height = page.pageHeight*0.06 + 'px';
		 
          var ws = io.connect('http://139.199.168.15:8888');
          var sendMsg = function(msg){
              ws.emit('send.message', msg);
          }
          var addMessage = function(from, msg){
              var li = document.createElement('li');
              li.innerHTML = '<span>' + from + '</span>' + ' : ' + msg;
              document.querySelector('#chat_conatiner').appendChild(li);

              // 设置内容区的滚动条到底部
              document.querySelector('#chat').scrollTop = document.querySelector('#chat').scrollHeight;

              // 并设置焦点
              document.querySelector('input').focus();

          }
		 var _displayImage = function(from, imgData) {
			var li = document.createElement('li');
					  li.innerHTML = '<span>' + from + '</span>' + ' : <input type="image" class="send_img" src="'+ imgData +'" />' ;
					  document.querySelector('#chat_conatiner').appendChild(li);

					  // 设置内容区的滚动条到底部
					  document.querySelector('#chat').scrollTop = document.querySelector('#chat').scrollHeight;

					  // 并设置焦点
					  document.querySelector('input').focus();
			}
          var send = function(){
              var ele_msg = document.getElementById('input');
              var msg = ele_msg.value.replace('\r\n', '').trim();
              //console.log(msg);
              if(!msg) return;
              sendMsg(msg);
              // 添加消息到自己的内容区
              addMessage('你', msg);
              ele_msg.value = '';
          }
//引入socket监听
          scoketListener(ws);
		  
		  document.getElementById('img').addEventListener('change', function() {
			//检查是否有文件被选中
			 if (this.files.length != 0) {
				//获取文件并用FileReader进行读取
				 var file = this.files[0],
					 reader = new FileReader();
				 if (!reader) {
					 //that._displayNewMsg('system', '!your browser doesn\'t support fileReader', 'red');
					 console.log(2);
					 this.value = '';
					 return;
				 };
				 reader.onload = function(e) {
					//读取成功，显示到页面并发送到服务器
					console.log(1);
					 this.value = '';
					 ws.emit('img', e.target.result);
					 _displayImage('你', e.target.result);
				 };
				 reader.readAsDataURL(file);
			 };
		 }, false);
          document.querySelector('input').addEventListener('keypress', function(event){
              if(event.which == 13){
                  send();
              }
          });
          document.querySelector('input').addEventListener('keydown', function(event){
              if(event.which == 13){
                  send();
              }
          });
          document.querySelector('#send').addEventListener('click', function(){
              send();
          });
//添加scoket监听
		  function scoketListener(ws){
			  //监听登陆
			  ws.on('connect', function(){
              var nickname = window.prompt('输入你的昵称!');
              while(!nickname){
                  nickname = window.prompt('昵称不能为空，请重新输入!')
              }
              ws.emit('join', nickname);
          });

          // 昵称有重复
          ws.on('nickname', function(){
              var nickname = window.prompt('昵称有重复，请重新输入!');
              while(!nickname){
                  nickname = window.prompt('昵称不能为空，请重新输入!')
              }
              ws.emit('join', nickname);
          });

          ws.on('send.message', function(from, msg){
              addMessage(from, msg);
          });
		  ////监听说话用户昵称
          ws.on('announcement', function(from, msg){
              addMessage(from, msg);
          });
		  //监听在线人数
		  ws.on('people', function(msg){
              var span = document.getElementById('people_num');
			  span.innerHTML = '当前在线人数：' + msg + '人';
          });
		  //监听发送图片
		  ws.on('newImg', function(from, img) {
			 _displayImage(from, img);
		 });
		  }