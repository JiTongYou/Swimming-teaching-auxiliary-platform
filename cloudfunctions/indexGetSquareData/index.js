// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db=cloud.database();

// 云函数入口函数
//入口参数num:单次加载条目数
//入口参数alreadyNum:已加载条目数
exports.main = async (event, context) => {
  try{
    const num=event.num;
    const alreadyNum=event.alreadyNum;
    return await db.collection("square").orderBy('time','desc').skip(alreadyNum).limit(num).get()
  }catch(e){
    console.error(e)
  }

}