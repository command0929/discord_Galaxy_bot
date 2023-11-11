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

const { EmbedBuilder } = require('discord.js');

var client_id = '봇 클라 아이디 설정해죠';

function embedBuild(title, author, icon) {
    var result = new EmbedBuilder()
    .setColor(0x4D4DA8)
    .setTitle(title == undefined ? '\u200b' : title)
    .setAuthor({ name: (author == undefined ? 'Galaxy_Bot' : author), iconURL: 'https://i.postimg.cc/zG02dQCf/1690782447163.jpg' })
    .setThumbnail((icon == undefined ? 'https://i.postimg.cc/zG02dQCf/1690782447163.jpg' : icon));
    return result;
}

function inviteBot() {
    var result = new EmbedBuilder()
    .setColor(0x4D4DA8)
    .setTitle('봇을 초대하려면 여길 클릭하세요!')
    .setURL(`https://discord.com/oauth2/authorize?client_id=${client_id}&scope=bot&permissions=68608`)
    .setAuthor({ name:'Galaxy_Bot', iconURL: 'https://i.postimg.cc/zG02dQCf/1690782447163.jpg' })
    .setThumbnail('https://i.postimg.cc/zG02dQCf/1690782447163.jpg');
    return result;
}

/*

const exampleEmbed = new EmbedBuilder()
	.setColor(0x0099FF)
	.setTitle('Some title')
	.setURL('https://discord.js.org/')
	.setAuthor({ name: 'Some name', iconURL: 'https://i.imgur.com/AfFp7pu.png', url: 'https://discord.js.org' })
	.setDescription('Some description here')
	.setThumbnail('https://i.imgur.com/AfFp7pu.png')
	.addFields(
		{ name: 'Regular field title', value: 'Some value here' },
		{ name: '\u200B', value: '\u200B' },
		{ name: 'Inline field title', value: 'Some value here', inline: true },
		{ name: 'Inline field title', value: 'Some value here', inline: true },
	)
	.addFields({ name: 'Inline field title', value: 'Some value here', inline: true })
	.setImage('https://i.imgur.com/AfFp7pu.png')
	.setTimestamp()
	.setFooter({ text: 'Some footer text here', iconURL: 'https://i.imgur.com/AfFp7pu.png' });
    */

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

var token = '토큰 설정 해죠';

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
        event.channel.send(result);
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
    var channel = event.channel;
    if(user.bot) return;
    if(msg == ';ping') {
        var sT = Date.now();
        FileStream.write('sdcard/ping.ping','react!');
        event.channel.send(embedS('pong, '+(Date.now() - sT)+'ms!'));
    }
    if(msg == ';봇초대') {
        event.reply({ embeds:[inviteBot()] })
    }
    /*
    if(msg.startsWith(';콘솔 ')) {
        event.reply('전송됨!');
        console.log(msg.slice(4));
    }
    */
   function embedS(text, author, imageURL) {
     return { embeds:[embedBuild(text, author, imageURL)] };
   }
   function embedSend(text, author, image) {
     return channel.send(embedS(text, author, image));
   }
    if(msg == ';신청목록') {
        event.reply('신청 목록을 콘솔에 띄웠어요!');
        checkList(event);
    }
    if(msg == ';관리자신청') {
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
    if(msg.startsWith(';이발 ')) {
        if(!check) return;
       var evalS = msg.slice(4);
       try{
        var evalText = String(eval(evalS));
         event.reply(evalText == '' ? 'null' : evalText);
       }catch(e) {
        try{
        event.reply(String(e));
        }catch(e) { event.reply('invaild Error'); }
       }
    }
    if(msg.startsWith(';신청')) {
        var type = msg.slice(3);
        var typeN = msg.slice(6);
        
        if(!check) return event.reply('관리자가 아니에요!');
        
       if(type.startsWith('수락')) {
          acceptRequest(typeN).reply('관리자가 수락되었어요!');
       }
       if(type.startsWith('거절')) {
        deacceptRequest(typeN).reply('관리자가 거절되었어요!');
     }
    }
})
