// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database();
const _ = db.command

// 云函数入口函数
// classId: 班级id
exports.main = async (event, context) => {
  var classId = event.classId
  var teacherId = event.teacherId
  db.collection('class').doc(classId).remove()
  // return await db.collection('defaultUserInfo').doc(teacherId).update({
  //   data:{
  //     class: _.pull(class)
  //   }
  // })
}