// miniprogram/pages/index/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navId: "0",
    navFixed: false,
  },

  //点击切换主页导航条的回调
  changeNav(event){
    let navId = event.currentTarget.id;
    this.setData({
      navId: navId
    })
    wx.pageScrollTo({
      /** 缺数值，应在判断后返回顶部 */
    })
  },

   /* 浮动导航条
  原文链接：https://blog.csdn.net/qq_43764578/article/details/105706732
  效果较为糟糕，卡顿明显，使用体验差
 */
  floatNav: function (e) {
    let that = this;
    wx.createSelectorQuery().select('#indexNav').boundingClientRect(function (rect) {
      if(0 <= rect.top){
        that.setData({
          navFixed:false
        })
      }else{
        that.setData({
          navFixed:true
        })
      }
    }).exec()
  },

  toChat(){
    wx.navigateTo({
      url: '/pages/chat/chat',
    })
  },

  toSingleClass(){
    wx.navigateTo({
      url: '/pages/single class/single class',
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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