// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db=cloud.database();
const _ =db.command

// 云函数入口函数
//入口参数_openid:用户_openid
exports.main = async (event, context) => {
  try{
    const _openid=event._openid
    const _id=event._id
    const type=event.type
    if(type == 1){
      return await db.collection("vids").doc(_id).update({
        data:{
          likes:_.push({
            each: [_openid]
          })
        }
      })
    }else if(type == 0){
      return await db.collection("vids").doc(_id).update({
        data:{
          likes:_.pull(_openid)
        }
      })
    }
  }catch(e){
    console.error(e)
  }
}