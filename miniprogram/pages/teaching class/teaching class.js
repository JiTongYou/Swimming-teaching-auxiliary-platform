// miniprogram/pages/teaching class/teaching class.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    classInfo:{},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //promise风格，解决异步
    this.setData({
      classId: JSON.parse(options.detail)._id,
      classInfo: JSON.parse(options.detail)
    })
    var that = this
    wx.getStorage({
      key: "userInfo",
    }).then(res => {
      that.setData({
        userInfo: JSON.parse(res.data)
      })
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
  onShow: function (options) {
    setTimeout(()=>wx.cloud.callFunction({
      name: "getClass",
      data: {
        classId: this.data.classId
      }
    }).then(res=>{
      this.setData({
        classInfo: res.result.data[0]
      })
    }), 1000)
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

  },

  toNameList() {
    var detail = this.data.classInfo.student
    wx.navigateTo({
      url: '/pages/class name list/class name list?detail=' + JSON.stringify(detail) + '&classId=' + JSON.stringify(this.data.classInfo._id),
    })
  },

  toPublishNotice(){
    wx.navigateTo({
      url: '/pages/publishNotice/publishNotice?class_id=' + this.data.classInfo._id,
    })
  },

  showDismissClass(){
    this.setData({
      tapDismissClass: 1,
    })
  },

  concealDismissClassPopup(){
    this.setData({
      tapDismissClass: 0,
    })
  },

  dismissClass(){
    this.setData({
      tapDismissClass: 0,
    })
    console.log("dismissClass")
    wx.showLoading({
      title: '解散班级中...',
      mask: true
    })
    wx.cloud.callFunction({
      name: "dismissClass",
      data:{
        classId: this.data.classInfo._id,
        teacher_id: this.data.userInfo._openid
      }
    }).then(res=>{
      console.log("dismissClass", res)
    })
    wx.hideLoading({
      success: (res) => {
        wx.showToast({
          title: '解散班级成功',
        })
      },
    })
    wx.switchTab({
      url: '/pages/single class/single class',
    })
  }

})