// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV})
const db=cloud.database();
const _ = db.command
const $ = db.command.aggregate

// 云函数入口函数
exports.main = async (event, context) => {
  var currentId=event.currentId;
  
  var result = await db.collection('chat_group')
  .where({
    chat_members: _.elemMatch({
      _openid: _.eq(currentId)
    }),
  })
  .limit(50)
  .get()
  const tasks = [];
  for(let i = 0; i < result.data.length; ++i){
    var selectId = result.data[i].chat_members[0]._openid == currentId ? result.data[i].chat_members[1]._openid : result.data[i].chat_members[0]._openid;
    const promise = db.collection("defaultUserInfo").where({
      _openid: selectId
    }).get()
    tasks.push(promise)
  }
  var i = 0;
  return (await Promise.all(tasks)).reduce((acc, cur) => {
    // console.log("cur",cur);
    // console.log("acc",acc)
    if(acc.data[i].chat_members[0]._openid == currentId){
      acc.data[i].chat_members[0].avatarUrl = cur.data[0].avatarUrl;
      acc.data[i].chat_members[0].nickName = cur.data[0].nickName;
      acc.data[i].other = 0;
    }
    else{
      acc.data[i].chat_members[1].avatarUrl = cur.data[0].avatarUrl;
      acc.data[i].chat_members[1].nickName = cur.data[0].nickName;
      acc.data[i].other = 1;
    }
    i++;
    // console.log("result", result);
    return {
      data: acc.data
    }
  },
  result)

}