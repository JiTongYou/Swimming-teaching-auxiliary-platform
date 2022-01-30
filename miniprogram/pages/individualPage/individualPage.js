// miniprogram/pages/individualPage/individualPage.js
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
    console.log(this.data.userInfo._openid)
    if(this.data.ifFollowed == 1){
      this.setData({
        [tmp_str]:0
      })
      wx.cloud.callFunction({
        name:"individualAddFollower",
        data:{
          currentId: this.data.userInfo._openid,   
          _id:this.data.otherUserId,
          type:0
        }
      })
    }else{
      this.setData({
        [tmp_str]:1
      })
      wx.cloud.callFunction({
        name:"individualAddFollower",
        data:{
          currentId:this.data.userInfo._openid,
          _id:this.data.otherUserId,
          type:1
        }
      }).then(res=>{
        console.log(res)
        console.log(this.data.otherUserId)
      })
    }
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
     var that = this;
      wx.getStorage({
        key: "userInfo",
      }).then(res => {
        that.setData({
          userInfo: JSON.parse(res.data)
        })
      })
      that.setData({otherUserId:options.personId})
      wx.cloud.callFunction({
         name: "individualGetInfo",
         data: {
         _openid: that.data.otherUserId,
      }
      }).then(res=>{
          that.setData({
            otherUserAvatar:res.result.data[0].avatarUrl,
            otherUserNickName:res.result.data[0].nickName,
            otherUserFollowing:res.result.data[0].following.length,
            otherUserFollowers:res.result.data[0].followers.length,
          }) 
      })

      for(var i=0;i<that.data.haveFollowed.length;i++){
        if(that.data.haveFollowed[i]==that.data.userInfo._openid){
           that.setData({
              ifFollowed:1,
           })
        }
      }
    
    
  },

//跳转至聊天页面
  clickChat(event){
    console.log(this.data.otherUserId)
    wx.navigateTo({
      url:'/pages/chat/chat?userId=' + this.data.otherUserId//跳转传当前主页对应用户的_openid给chat页面
    })
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