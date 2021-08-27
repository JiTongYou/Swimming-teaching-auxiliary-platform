// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db=cloud.database();
const _ =db.command

// 云函数入口函数
//入口参数_openid:用户_openid
//入口参数_id:广场说说_id
//入口参数nickName:发表评论的用户昵称
//入口参数content:评论内容
exports.main = async (event, context) => {
  try{
    const _id=event._id
    const _openid=event._openid
    const nickName=event.nickName
    const content=event.commentContent
    return await db.collection("square").doc(_id).update({
      data:{
        comment:_.push({
          nickName:nickName,
          _openid:_openid,
          content:content
        })
      }
    })
  }catch(e){
    console.error(e)
  }
}