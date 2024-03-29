// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database();
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
  const class_id = event.class_id;
  const head = event.head;
  const content = event.content;
  const time = event.time;
  let notice = {};
  notice.head = head;
  notice.content = content;
  notice.time = time;
  db.collection('class').where({
    _id:class_id
  }).update({
    data:{
      notice:_.push({
        each: [notice],
        position: 0,
      })
    }
  })
}