// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV})
const db=cloud.database();
const _ = db.command
const $ = db.command.aggregate

// 云函数入口函数
exports.main = async (event, context) => {
  var currentId=event.currentId;
  
  return await db.collection('chat_group')
  .where({
    chat_members: _.elemMatch({
      _openid: _.eq(currentId)
    }),
  })
  .limit(50)
  .get()//.then(res => {console.log(currentId)})
  

}