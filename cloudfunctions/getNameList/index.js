// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database();
const _ = db.command;

// 云函数入口函数
exports.main = async (event, context) => {
  let result = []
  let tmp = {}
  tmp._openid = ""
  tmp.nickName = ""
  result.push(tmp)
  console.log(result)
  var studentList = event.studentList
  const tasks = []
  // console.log(result)
  for (let i = 0; i < studentList.length; ++i) {
    const promise = db.collection("defaultUserInfo").where({
      _openid: studentList[i]._openid
    }).get()
    tasks.push(promise);
  }
  // 下面的reduce将每次为acc添加一个avatarUrl与nickName，acc初值为result
  var i = 0;
  return (await Promise.all(tasks)).reduce((acc, cur) => {
    console.log("cur",cur)
    console.log("acc",acc)
    acc[i]._openid = cur.data[0]._openid;
    acc[i].nickName = cur.data[0].nickName;
    i++;
    // console.log("result", result);
    return {
      data: acc
    }
  },
  result)
}