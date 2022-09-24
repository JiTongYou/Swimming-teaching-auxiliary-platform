// miniprogram/pages/changeInfo/changeName/changeName.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    changedName:"",
    userInfo:[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.getStorage({
      key: 'userInfo',
      success (res) {
      that.setData({
        userInfo:JSON.parse(res.data),
      })
     }
   })
  },

  changename(option){
    this.setData({
      changedName:option.detail.value,
    })
  },

  comfirmed(){
    wx.cloud.callFunction({
      name: "changeInfo",
      data: {
        _openid: this.data.userInfo._openid,
        changedname: this.data.changedName,
        type: 0
      }
    }).then(
      wx.cloud.callFunction({
        name: "individualGetInfo",
        data: {
          _openid: this.data.userInfo._openid,
        }
      }).then(res=>{
        console.log(res.result.data[0])
        this.setData({
          userInfo:res.result.data[0],
        })
      }).then(
        console.log(this.data.userInfo),
        wx.setStorage({
           key:'userInfo',
           data: JSON.stringify(this.data.userInfo)
       }).then(
          wx.navigateBack({
          delta: 1,
          })
        )
      )
    )
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