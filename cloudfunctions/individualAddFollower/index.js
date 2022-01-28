// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db=cloud.database();
const _ =db.command

// 云函数入口函数
//入口参数_openid:用户_openid
//入口参数_id:被关注用户_openid
//入口参数type:1:关注;0:取消关注
exports.main = async (event, context) => {
  try{
    const currentId=event.currentId
    const _openid=event._id
    const type=event.type
    if(type == 1){
      return await db.collection("defaultUserInfo").doc(_openid).update({
        data:{
          followers:_.push({
            each: [currentId]
          })
        }
      })
    }else{
      return await db.collection("defaultUserInfo").doc(_openid).update({
        data:{
          followers:_.pull(currentId)
        }
      })
    }
  }catch(e){
    console.error(e)
  }
}