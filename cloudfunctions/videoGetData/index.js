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
    return await db.collection("videos").orderBy('time','desc').skip(alreadyNum).limit(num).get()

    //const vidId=event.vidId
    //const videoList=event.videoList
    // const num=event.num;
    // const alreadyNum=event.alreadyNum;
    // return await db.collection("videos").orderBy('time','desc').skip(alreadyNum).limit(num).get()
   // update({
      //data:{
       // videoList:_.push({
       // vidId:vidId,
       // vidUrl:vidUrl, 
       // title:title,
      //  ranking:ranking,
        ///})    
     // } 
   // }).then(res => {
   // console.log('i')
  //  that.setData({
    //  videoList:db.videoList.push({
      ///  vidId:vidId,
      //  vidUrl:vidUrl, 
      //  title:title,
       // ranking:ranking,
       // })    
   // })
  //})
  }catch(e){
    console.error(e)
  }
}