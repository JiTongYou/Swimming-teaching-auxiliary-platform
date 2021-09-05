// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV})
const db = cloud.database().collection('defaultUserInfo');
// 云函数入口函数
exports.main = async (event, context) => {
  
  const wxContext = cloud.getWXContext()
  const {
    nickName,
    avatarUrl,
    gender,
    following,
    followers,
   // _openid,
  } = event;
  return db.where({
    _openid: wxContext.OPENID
  }).get()
    .then(res=>{
    if(res.data.length>0){
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
          time: new Date()
        }
      }).then(res=>{
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