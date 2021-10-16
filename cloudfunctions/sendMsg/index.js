// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db=cloud.database()
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
  const _openid = event._openid;
  const content = event.content;
  const nickName = event.nickName;
  const time = event.time;
  const chat_id = event.chat_id;

  db.collection('chat_msg').doc(chat_id).update({
    data:{
      msgList: _.push({
        _openid: _openid,
        content: content,
        nickName: nickName,
        time: time
      })
    }
  })
}