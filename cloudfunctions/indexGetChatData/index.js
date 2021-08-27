// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db=cloud.database();

// 云函数入口函数
exports.main = async (event, context) => {
  var num=event.num;
  var alreadyNum=event.alreadyNum;
  return await db.collection("chat_msg").skip(alreadyNum).limit(num).get()

}