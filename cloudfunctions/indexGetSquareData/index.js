// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database();
const _ = db.command;

// 云函数入口函数
//入口参数num:单次加载条目数
//入口参数alreadyNum:已加载条目数
exports.main = async (event, context) => {
  const num = event.num;
  const alreadyNum = event.alreadyNum;
  // const log = cloud.logger()
  var result = await db.collection("square").orderBy('time', 'desc').skip(alreadyNum).limit(num).get();
  const tasks = [];
  console.log(result)
  for (let i = 0; i < result.data.length; ++i) {
    const promise = db.collection("defaultUserInfo").where({
      _openid: result.data[i]._openid
    }).get()
    tasks.push(promise);
  }
  // 下面的reduce将每次为acc添加一个avatarUrl与nickName，acc初值为result
  var i = 0;
  return (await Promise.all(tasks)).reduce((acc, cur) => {
    console.log("cur",cur);
    console.log("acc",acc)
    acc.data[i].avatarUrl = cur.data[0].avatarUrl;
    acc.data[i].nickName = cur.data[0].nickName;
    i++;
    console.log("result", result);
    return {
      data: acc.data
    }
  },
  result)
}