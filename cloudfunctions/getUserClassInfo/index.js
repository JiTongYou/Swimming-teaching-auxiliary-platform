// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database();
const _ = db.command

// 云函数入口函数
//入口参数_openid:用户_openid
exports.main = async (event, context) => {
  var _openid = event._openid
  return await db.collection("class").where({
    student: _.elemMatch({
      _openid: _.eq(_openid),
    })
  }).get()
}