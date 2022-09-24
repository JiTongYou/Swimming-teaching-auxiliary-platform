// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db=cloud.database();
const _ =db.command

// 云函数入口函数
//入口参数_openid:用户_openid
//入口参数changedname：修改后的昵称
//入口参数type: 0:修改昵称;
exports.main = async (event, context) => {
  try{
    const _openid=event._openid
    const changedname=event.changedname
    const type=event.type
    if(type == 0){
      return await db.collection("defaultUserInfo").where({
        _openid: _openid
      }).update({
        data:{
          nickName:changedname
        }
      })
    }
    // else{
    //   return await db.collection("defaultUserInfo").where({
    //     _openid: _openid
    //   }).update({
    //     data:{
    //       followers:_.pull(currentId)
    //     }
    //   })
    // }
  }catch(e){
    console.error(e)
  }
}