// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database();
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
  const _id= [].concat(event._id);
  const length=event.length
  if(length==1){
    return await db.collection("videos").where({
      _id:_id[0],
    }).get()
  }
  if(length==2){
    return await db.collection("videos").where(_.or([
    {
      _id:_id[0]
    },
    {
      _id:_id[1]
    }
  ])).get()
  }
  
  // return await db.collection("videos").where({
  //   _id:_id[0],
  // }).get()
  // .then(res=>{
  //   console.log(res)
  //   if(_id.length>1){
  //     db.collection("videos").where({
  //       _id:_id[1],
  //     }).get()
  //   }
  // })
}