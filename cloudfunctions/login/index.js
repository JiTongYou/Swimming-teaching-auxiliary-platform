// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database();
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
  var userInfo = event.userInfo
  const wxcontext = cloud.getWXContext()
  userInfo.class = [];
  userInfo.identity = 1;
  userInfo.followers = [];
  userInfo.following = [];
  userInfo.vidCollected = [];
  userInfo.history = [];
  userInfo._openid = wxcontext.OPENID;

  //promise处理异步
  return await new Promise((resolve) => {
    db.collection('defaultUserInfo').where({
        _openid: _.eq(userInfo._openid)
      }).get()
      .then(res => {
        if (res.data.length > 0) {
          resolve(res);
        } else {
          db.collection('defaultUserInfo').add({
            data: {
              nickName: userInfo.nickName,
              avatarUrl: userInfo.avatarUrl,
              _openid: wxcontext.OPENID,
              gender: userInfo.gender,
              class: [],
              identity: 1,
              following: [],
              followers: [],
              vidCollected: [],
              history:[],
            }
          }).then(res=>{
            db.collection('defaultUserInfo').where({
              _openid: _.eq(userInfo._openid)
            }).get()
            .then(res => {
              resolve(res);
            })
          })
        }
      })
  })
}
/*const wxContext = cloud.getWXContext()
  const {
    nickName,
    avatarUrl,
    gender,
    following,
    followers,
    class:[],
  } = event;
  return db.where({
    _openid: wxContext.OPENID
  }).get()
    .then(res=>{
    if(res.data.length<0){
      return{
        code:200,
        errMsg:'用户已存在',
       userInfo:res.data[0],
      //  _openid:wxContext.OPENID
      }
    }
    else{
      return db.add({
        data:{
          _openid:wxContext.OPENID,
          nickName:nickName,
          avatarUrl:avatarUrl,
          gender:gender,
          following:following,
          followers:followers,
          time: new Date(),
        }
      }).then(res=>{
        console.log(res.data.nickname)
        return{
          code:201,
          errMsg:'用户注册成功',
          _openid:wxContext.OPENID
        }
      })
      .catch(error=>{
        return {
          code: 301,
          errMsg: '用户注册失败',
        }
      })
    }
  }).catch(error=>{
    return {
      code: 300,
      errMsg:'用户查询失败',
    }
  })
  //return {
    //event,
    //openid: wxContext.OPENID,
    //appid: wxContext.APPID,
    //unionid: wxContext.UNIONID,
  //}
}
*/