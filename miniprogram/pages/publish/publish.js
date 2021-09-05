// miniprogram/pages/publish/publish.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    wordNum: 0,
    publishContent: '',
    userInfo: {},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this
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

  },

  countWord(e){
    console.log(e)
    this.setData({
      wordNum:e.detail.cursor,
      publishContent:e.detail.value
    })
  },

  clickPublish(e){
    if(this.data.wordNum==0){
      wx.showToast({
        title: '请发布点内容吧',
        icon: 'none',
      })
      return;
    }

    wx.showLoading({
      title: '上传数据中，请稍等',
    })

    wx.cloud.callFunction({
      name: "squarePublish",
      data:{
        _openid: this.data.userInfo._openid,
        //this.data.userInfo._openid
        //测试数据:'2'
        nickName: this.data.userInfo.nickName,
        //this.data.userInfo.nickName
        //测试数据:'2'
        avatarUrl: this.data.userInfo.avatarUrl,
        content: this.data.publishContent,
        time: new Date(),
      }
    })
    wx.hideLoading()
    wx.showToast({
      title: '发布成功',
      icon: 'none',
    })
    console.log('发布成功')

    this.setData({
      wordNum:0,
      publishContent:''
    })

    let pages = getCurrentPages();
    let before = pages[pages.length - 2]
    //刷新页面
    before.setData({
      squareItem:[],
    })
    before.getSquareData()
    //回到先前页面
    wx.switchTab({
      url: '/pages/index/index',
    })
  },

})