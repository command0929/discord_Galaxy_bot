const { Client, GatewayIntentBits } = require('discord.js')
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildInvites,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
      ]
})

const fs = require('fs');
const FileStream = {
write: function(path, str) {
   path = path.replace('sdcard/','C:\\discordBot\\');
   path = path.replace(/\//g, '\\');
   try {
    FileOpen = fs.openSync(path, 'w');
    if (FileOpen) {
      fs.writeSync(FileOpen, str, 'utf8');
      fs.closeSync(FileOpen);
      return str;
    } else {
      console.error('cannot file open');
    }
  } catch (err) {
    console.error('파일 쓰기 오류: ' + err);
  }
 },
 read: function(filePath) {
   filePath = filePath.replace('sdcard/', 'C:\\discordBot\\');
   filePath = filePath.replace(/\//g, '\\');
const options = { encoding: 'utf8', flag: 'r' };
try {
 const fileDescriptor = fs.openSync(filePath, options.flag);

 const bufferSize = Math.pow(2, 30);
 const buffer = Buffer.alloc(bufferSize);

 try {
 const bytesRead = fs.readSync(fileDescriptor, buffer, 0, bufferSize);
  return buffer.slice(0, bytesRead).toString();
 
 } catch (err) {
 console.error('파일 읽기 오류:', err);
 } finally {
 fs.closeSync(fileDescriptor);
 }

} catch (err) {
 console.error('( #'+err.lineNumber+' )파일 열기 오류:', err);
}
 }
};

var token = '여기가 토큰 값 설정이에요!';

client.login(token)

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
})

var admin = [];

admin = JSON.parse(FileStream.read('sdcard/admin.json'));

var recentRequest = [];

function checkList(event) {
    var result = '';
    if(recentRequest.length == 0) result = '요청이 없어요!';
    for(var jk = 0; jk < recentRequest.length; jk++) {
        result += '[ No.'+jk+' ] '+recentRequest[jk].name+'\nID : '+recentRequest[jk].id+'\n요청시간: '+timestamp(recentRequest[jk].timestamp)+'\n\n';
    }
    if(event == undefined) console.log(result); else {
        event.reply(result);
    }
}

function acceptRequest(num) {
    num = Number(num);
    var checkDT = recentRequest[num];
    recentRequest = recentRequest.filter(function (e) {
        return e != checkDT;
    });
    admin.push(checkDT);
    FileStream.write('sdcard/admin.json', JSON.stringify(admin));
    console.log(checkDT.name+' ( '+checkDT.id+' ) new admin');
    return checkDT.event;
}
function deacceptRequest(num) {
    num = Number(num);
    var checkDT = recentRequest[num];
    recentRequest = recentRequest.filter(function (e) {
        return e != checkDT;
    });
    return checkDT.event;
}

function timestamp(sT) {
    sT = Number(sT);
    var now = new Date(sT);
    var year = now.getFullYear();
  var month = now.getMonth() + 1;
  var day = now.getDate();
  var hour = now.getHours();
  var minutes = now.getMinutes();
  var seconds = now.getSeconds();
   return year + "년 " + month + "월 " + day + "일 " + hour + "시 " + minutes + "분 " + seconds + "초";
  }

client.on('messageCreate', (event) => {
    var msg = event.content;
    var user = event.author;
    var sender = user.username;
    var userId = user.id;
    if(msg == '*아이디') {
        event.reply("your Id: "+userId);
    }
    if(msg.startsWith('*콘솔 ')) {
        event.reply('전송됨!');
        console.log(msg.slice(4));
    }
    if(msg == '*신청목록') {
        event.reply('신청 목록을 콘솔에 띄웠어요!');
        checkList(event);
    }
    if(msg == '*관리자신청') {
        for(var cA of admin) {
            if(cA.id == userId) return event.reply('이미 관리자에요!');
        }
        for(var aQ of recentRequest) {
            if(aQ.id == userId) return event.reply('이미 신청했어요!');
        }
        recentRequest.push({
            name: sender,
            id: userId,
            timestamp: Date.now(),
            event: event
        })
        event.reply('관리자를 신청했어요!');
    }
    var check = false;
    for(var i=0; i<admin.length;i++) {
        if(admin[i].id == userId) check = true;
    }
    if(msg.startsWith('*이발 ')) {
        if(!check) return;
       var evalS = msg.slice(4);
       try{
         event.reply(String(eval(evalS)));
       }catch(e) {
        event.reply(String(e+'\n'+e.lineNumber));
       }
    }
    if(msg.startsWith('*요청')) {
        var type = msg.slice(3);
        var typeN = msg.slice(6);
        
        if(!check) return event.reply('관리자가 아니에요!');
        
       if(type.startsWith('수락')) {
          acceptRequest(typeN).reply('관리자가 수락되었어요!');
       }
       if(type.startsWith('거절')) {
        acceptRequest(typeN).reply('관리자가 거절되었어요!');
     }
    }
})
