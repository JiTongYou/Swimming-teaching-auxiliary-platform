// miniprogram/pages/changeInfo/changeInfo1.js
var that=this;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo:[],
    

  },

  nameTap(){
    wx.navigateTo({
      url:'/pages/changeInfo/changeName/changeName'
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    if(this.data.userInfo.length==0){
      console.log("s")
    wx.getStorage({
      key: 'userInfo',
      success (res) {
      that.setData({
        userInfo:JSON.parse(res.data),
      })
     }
   })

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
    if(this.data.userInfo.length!=0){
      wx.cloud.callFunction({
        name: "individualGetInfo",
        data: {
          _openid: this.data.userInfo._openid,
        }
      }).then(res=>{
        console.log(res.result.data)
        this.setData({
          userInfo:res.result.data[0],
        })
      })
    }
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