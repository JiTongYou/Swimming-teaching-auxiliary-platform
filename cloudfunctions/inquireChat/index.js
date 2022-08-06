// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV})
const db = cloud.database();
const _ = db.command

// 云函数入口函数
//入口参数_id:聊天信息id
exports.main = async (event, context) => {
  const chat_id = event.chat_id;

  return await db.collection('chat_msg')
  .where({
    _id: chat_id,
  }).get()
  /*
  ({
    success: res=>{
      if(res.data.length == 0){
        db.collection('chat_group')
        .add({
          data:{
            type:1,
            chat_menbers:[currentId, friendId],
            time: new Date()
          }
        })
        .then(res=>{
          console.log('添加聊天记录成功',res)
          return res
        })
      }
      else{
        console.log('成功查询聊天记录',res)
        return res
      }
    },
    fail: console.error
  })
  */
  /*
  ({
    success(res){
      if(res.data.length == 0){
        db.collection('chat_group')
        .add({
          data:{
            type:1,
            chat_menbers:[currentId, friendId],
            time: new Date()
          }
        })
        .then(res=>{
          console.log('添加聊天记录成功',res)
          return res
        })
      }
      else{
        console.log('成功查询聊天记录',res)
        return res
      }
    },
    fail: console.error
  })
  */
}