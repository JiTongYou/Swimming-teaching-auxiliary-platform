// miniprogram/pages/individualPage/individualPage.js
var that;
const DB=wx.cloud.database().collection("defaultUserInfo");
Page({
  /**
   * 页面的初始数据
   */
  data: {
     ifFollowed:0,
     haveFollowed:[],
     otherUserId:"",
     otherUserAvatar:"",
     otherUserFollowing:0,
     otherUserFollowers:0,
     otherUserNickName:"",
  },

  clickFollow(e){
    var tmp_str='ifFollowed';
    if(that.data.ifFollowed == 1){
      that.setData({
        [tmp_str]:0
      })
      wx.cloud.callFunction({
        name:"individualAddFollower",
        data:{
          _openid: that.data.userInfo._openid,   
         //_id:that.data.squareItem[index]._id,
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
          _openid:
          that.data.userInfo._openid,
       //   _id:this.data.squareItem[index]._id,
          type:1
        }
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      that = this;
      console.log(options)
      that.setData({otherUserId:options.personId})
      

      DB.where({
          _openid:that.data.otherUserId
      }).get().then(res=>{
         console.log('s',res)
              that.setData({
              otherUserAvatar:res.data[0].avatarUrl,
              otherUserNickName:res.data[0].nickName,
              otherUserFollowing:res.data[0].following,
              otherUserFollowers:res.data[0].otherUserFollowers,
            }) 
            console.log(res.data[0].nickName)
    })

      for(var i=0;i<that.data.haveFollowed.length;i++){
        if(that.data.haveFollowed[i]==that.data.userInfo._openid){
           that.setData({
              ifFollowed:1,
           })
           //console.log("Sdadasddadad")
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