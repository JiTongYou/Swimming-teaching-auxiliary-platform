// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database();
//const _ = db.command
// 云函数入口函数
exports.main = async (event, context) => {
 
  try{ 
    const num=event.num;
    const alreadyNum=event.alreadyNum;
    return await db.collection("videos").skip(alreadyNum).limit(num).get()
  }catch(e){
    console.error(e)
  }
}