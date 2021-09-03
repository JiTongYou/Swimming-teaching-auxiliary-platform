// miniprogram/pages/individualPage/individualPage.js
var that;
Page({

  /**
   * 页面的初始数据
   */
  data: {
     ifFollowed:0,
     userInfo:[]
  },

  clickFollow(e){
    var index = e.currentTarget.dataset.index
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
      console.log(_openid)
    }else{
      that.setData({
        [tmp_str]:1
      })
      wx.cloud.callFunction({
        name:"individualAddFollower",
        data:{
          _openid:
          this.data.userInfo._openid,
       //   _id:this.data.squareItem[index]._id,
          type:1
        }
      })
      
    }console.log(userInfo)
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      that = this;

      wx.getStorage({
        key:"userInfo",
        success(res){
          that.setData({
            userInfo:JSON.parse(res.data)
          })
        }
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