// miniprogram/pages/individualPage/individualPage.js
var that;
const DB=wx.cloud.database();//.collection("defaultUserInfo");
const _ = DB.command
Page({
  /**
   * 页面的初始数据
   */
  data: {
    //_openid,
     ifFollowed:0,
     userInfo:{},
     haveFollowed:[],
     otherUserId:"",
     otherUserAvatar:"",
     otherUserFollowing:0,
     otherUserFollowers:0,
     otherUserNickName:"",
  },

  async clickFollow(e){
    var tmp_str='ifFollowed';
    if(that.data.ifFollowed == 1){
      that.setData({
        [tmp_str]:0
      })
      wx.cloud.callFunction({
        name:"individualAddFollower",
        data:{
          currentId: that.data.userInfo._openid,   
          _id:that.data.otherUserId,
          type:0
        }
      })
    }else{
      that.setData({
        [tmp_str]:1
      })
      wx.cloud.callFunction({
        name:"individualAddFollower",
        data:{
          currentId:that.data.userInfo._openid,
          _id:that.data.otherUserId,
          type:1
        }
      }).then(res=>{
        console.log(res)
        console.log(this.data.userInfo._openid)
      })
    }
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      that = this;
      wx.getStorage({
        key: "userInfo",
      }).then(res => {
        that.setData({
          userInfo: JSON.parse(res.data)
        })
      })
      that.setData({otherUserId:options.personId})
      console.log(that.data.otherUserId)

 wx.cloud.callFunction({
      name: "individualGetInfo",
      data: {
        _openid: that.data.otherUserId,
      }
    }).then(res=>{
         console.log('s',res.result)
              that.setData({
              otherUserAvatar:res.result.data[0].avatarUrl,
              otherUserNickName:res.result.data[0].nickName,
              otherUserFollowing:res.result.data[0].following.length,
              otherUserFollowers:res.result.data[0].followers.length,
            }) 
         console.log(that.data.otherUserId)
    })

      for(var i=0;i<that.data.haveFollowed.length;i++){
        if(that.data.haveFollowed[i]==that.data.userInfo._openid){
           that.setData({
              ifFollowed:1,
           })
        }
      }
    
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})