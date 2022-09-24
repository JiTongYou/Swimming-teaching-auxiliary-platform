// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
  const db=cloud.database();
  const _ = db.command

// 云函数入口函数
  exports.main = async (event, context) => {
    var _id = event._id
    return await db.collection("vids").where({
        _id: _.eq(_id),
    }).get()
  }