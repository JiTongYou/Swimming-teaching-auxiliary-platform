// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db=cloud.database()

// 云函数入口函数
//入口参数_openid:用户_openid
//入口参数nickName:用户nickName
//入口参数avatarUrl:用于头像
//入口参数content:用户发表的内容
exports.main = async (event, context) => {
    var _openid=event._openid
    // var nickName=event.nickName
    // var avatarUrl=event.avatarUrl
    var content=event.content
    var time=event.time
    db.collection('square').add({
      data:{
        _openid:_openid,
        // nickName:nickName,
        // avatarUrl:avatarUrl,
        content:content,
        time:time,
        likes:[],
        comment:[]
      }
    }).then(res => {
      console.log(res)
    }).catch(console.error)
}