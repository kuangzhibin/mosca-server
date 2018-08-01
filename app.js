/*
 * @Author: kuangkwan
 * @Date:   2018-08-01 15:12:35
 * @Last Modified by:   kuangkwan
 * @Last Modified time: 2018-08-01 16:52:42
 */
var Mosca = require('mosca')
var users = require('./user.json')

console.log(users)

var moscaSettings = {
  port: 1883,
}

var authenticate = function(client, username, password, callback) {
  var authorized = users.some(function (item) {
    return username === item.name && password.toString() === item.pwd
  })
  if (authorized) client.user = username;
  callback(null, authorized);
}

// 授权为alice的客户端可以发布/alice/**，
// 从主题中取得用户名，并校验与授权用户一致
var authorizePublish = function(client, topic, payload, callback) {
  callback(null, client.user == topic.split('/')[1]);
}

// 授权为alice的客户端可以订阅/alice/**，
// 从主题中取得用户名，并校验与授权用户一致
var authorizeSubscribe = function(client, topic, callback) {
  callback(null, client.user == topic.split('/')[1]);
}

var server = new Mosca.Server(moscaSettings)

server.on('ready', setup)

function setup() {
  server.authenticate = authenticate;
  server.authorizePublish = authorizePublish;
  server.authorizeSubscribe = authorizeSubscribe;
  console.log('server is running at port ' + moscaSettings.port)
}

server.on('clientConnected', function(client) {
  console.log('Client Connected: ', client.id);
});

server.on('clientDisconnected', function(client) {
  console.log('Client Disconnected: ', client.id);
});


server.on('published', function(packet, client) {

  // mqtt服务测试
  switch (packet.topic.split('/')[2]) {
    case 'test':
      console.log("payload: ", packet.payload.toString());
      var msg = {
        topic: '/' + client.user + '/repeat',
        payload: packet.payload,
        qos: 0,
        retain: false
      };
      server.publish(msg, function() {
        console.log('repeat!  ');
      });
      break;
  }
});