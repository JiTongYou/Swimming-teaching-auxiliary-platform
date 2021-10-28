// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database();
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
  const className = event.className
  const classTeacher = event.classTeacher
  const teacher_id = event._openid
  //const classTime = event.classTime

  return await new Promise((resolve) => {
    db.collection('class').count()
    .then(res=>{
      //console.log(res)
      db.collection('class').add({
        data:{
          className: className,
          classTeacher: classTeacher,
          teacher_id: teacher_id,
          _id: classTeacher + (res.total + 1),
          classTime:'',
          notice:[],
          student:[],
        }
      })
    })
  })

}