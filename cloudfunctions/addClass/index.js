// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database();
const _ = db.command

// 云函数入口函数
//入口参数classNum:对应class集合中班级_id
//入口参数_openid:用户_openid
exports.main = async (event, context) => {
  var classNum = event.classNum
  var _openid = event._openid
  const result = await db.collection("class").where({
    _id: _.eq(classNum)
  }).get()
  //判断班级是否存在
  if (result.data.length > 0) {
    var studentInfo = {
      _openid: _openid,
    }
    //判断是否已在班级中
    const exist = await db.collection("class").where({
      _id: _.eq(classNum),
      student: _.elemMatch({
        _openid: _.eq(_openid)
      })
    }).get()
    if (exist.data.length > 0) {
      return 2
    } else {
      //加入班级
      await db.collection("class").doc(classNum).update({
        data: {
          student: _.push({
            each: [studentInfo]
          })
        }
      })
      //在个人数据的class中加入当前班级信息
      const targetClass = await db.collection("class").where({
        _id: _.eq(classNum)
      }).get()
      var teachingClass = {
        classNum: targetClass.data[0]._id,
        className: targetClass.data[0].className,
        classTeacher: targetClass.data[0].classTeacher,
        classTime: targetClass.data[0].classTime,
        notice: targetClass.data[0].notice
      }
      await db.collection("defaultUserInfo").where({
        _openid: _.eq(_openid)
      }).update({
        data:{
          class: _.push({
            each: [teachingClass]
          })
        }
      })
      return 1
    }
  } else {
    return 0
  }
}