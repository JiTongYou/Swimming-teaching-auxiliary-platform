// miniprogram/pages/teaching class/teaching class.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    tapJoinNewClass: 0,
    classNum: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //promise风格，解决异步
    var that = this
    wx.getStorage({
      key: "userInfo",
    }).then(res => {
      that.setData({
        userInfo: JSON.parse(res.data)
      })
    }).then(res => {
      //若放在外部，会因为异步操作而导致无法正常获取数据
      that.setUserClassInfo()
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
    this.setUserClassInfo()

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

  //获取用户课程信息并更新存储中用户课程信息
  setUserClassInfo() {

    wx.cloud.callFunction({
      name: "getUserClassInfo",
      data: {
        _openid: this.data.userInfo._openid,
      }
    }).then(res => {
      this.setData({
        userInfo: res.result.data[0]
      })
    }).then(res => {
      wx.setStorage({
        key: "userClass",
        data: this.data.userInfo.class
      })
    })

  },

  toSingleClass() {
    wx.navigateTo({
      url: '/pages/single class/single class',
    })
  },

  //显示加课弹窗
  showPopup() {
    this.setData({
      tapJoinNewClass: 1,
    })
  },

  //隐藏加课弹窗
  concealPopup() {
    this.setData({
      tapJoinNewClass: 0,
    })
  },

  //监听input输入课号
  getClassNum(e) {
    this.setData({
      classNum: e.detail.value,
    })
  },

  //点击界面其他位置，加入课程窗口隐藏
  concealAddClass() {
    this.setData({
      tapJoinNewClass: 0,
      classNum: '',
    })
  },

  //加入课程
  joinClass(e) {

    wx.showLoading({
      title: '加入班级中...',
    })

    wx.cloud.callFunction({
      name: "addClass",
      data: {
        classNum: this.data.classNum,
        _openid: this.data.userInfo._openid,
      }
    }).then(res => {
      console.log(res)
      if (res.result == 0) {
        wx.hideLoading()
        wx.showToast({
          title: '课号不存在',
          icon: 'none',
        })
        console.log('加入班级失败')
        this.setUserClassInfo()
        this.setData({
          tapJoinNewClass: 0,
          classNum: '',
        })
      } else if (res.result == 2) {
        wx.hideLoading()
        wx.showToast({
          title: '已在班级中',
          icon: 'none',
        })
        console.log('已在班级中')
        this.setUserClassInfo()
        this.setData({
          tapJoinNewClass: 0,
          classNum: '',
        })
      } else {
        wx.hideLoading()
        wx.showToast({
          title: '加入班级成功',
          icon: 'none',
        })
        console.log('加入班级成功')
        this.setUserClassInfo()
        this.setData({
          tapJoinNewClass: 0,
          classNum: '',
        })
      }
    })
  },

})