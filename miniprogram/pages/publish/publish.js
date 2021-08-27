// miniprogram/pages/publish/publish.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    wordNum: 0,
    publishContent: ''
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
        _openid: '2',
        //this.data.userInfo._openid
        //
        //
        //
        nickName: '2',
        //this.data.userInfo.nickName
        //
        //
        //
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

    wx.switchTab({
      url: '/pages/index/index',
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.getStorage({
      key:"userInfo",
      success(res){
        this.setData({
          userInfo:JSON.parse(Res.data)
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
})