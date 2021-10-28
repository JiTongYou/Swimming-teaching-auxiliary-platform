// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database();
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
  const teacher_id = event._openid

  return await db.collection('class').where({
    teacher_id: _.eq(teacher_id)
  }).get()
}