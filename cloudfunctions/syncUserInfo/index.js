// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database();
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
  const _openid = event._openid
  return await db.collection('defaultUserInfo').where({
    _openid: _.eq(_openid)
  }).get()
}