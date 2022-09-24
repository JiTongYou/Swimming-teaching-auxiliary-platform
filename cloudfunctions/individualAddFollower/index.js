// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db=cloud.database();
const _ =db.command

// 云函数入口函数
//入口参数 currentId:用户_openid
//入口参数 _id:被关注用户_openid
//入口参数 type:1:关注;0:取消关注
exports.main = async (event, context) => {
  try{
    const currentId=event.currentId
    const _openid=event._id
    const type=event.type
    if(type == 1){
      return await db.collection("defaultUserInfo").where({
        _openid: _openid
      }).update({
        data:{
          followers:_.push([currentId])
        }
      }).then(
        db.collection("defaultUserInfo").where({
          _openid:currentId
        }).update({
          data:{
            following:_.push([_openid])
          }
        })
      )
    }else{
      return await db.collection("defaultUserInfo").where({
        _openid: _openid
      }).update({
        data:{
          followers:_.pull(currentId)
        }
      }).then(
        db.collection("defaultUserInfo").where({
          _openid:currentId
        }).update({
          data:{
            following:_.pull(_openid)
          }
        })
      )
    }
  }catch(e){
    console.error(e)
  }
}