// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db=cloud.database();
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
  // var time=event.time;
  var chat_members=event.chat_members;

  db.collection('chat_group').count().then(res=>{
    num = res.total

  db.collection('chat_msg').add({
    data:{
      msgList:[],
      _id: num + 1
    }
  })

  db.collection('chat_group').add({
    data:{
      chat_msg_id: num + 1,
      // time: time,
      chat_members: chat_members,
      type: "1"
    }
  })

  });
}