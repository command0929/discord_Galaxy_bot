/**
 * 코드는 아직 준비중이에요
 * 제작: command0929
 */
 client.on('createMessage', (msg) => {
   if(msg.content == 'ping') {
     msg.reply('pong!');
   }
 });
