// miniprogram/pages/publishNotice/publishNotice.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    wordNum: 0,
    noticeContent:'',
    headContent:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      class_id: options.class_id
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

  bindNoticeHead(e){
    this.setData({
      headContent:e.detail.value,
    })
  },

  countWord(e){
    //console.log(e)
    this.setData({
      wordNum:e.detail.cursor,
      noticeContent:e.detail.value
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
      name: "publishNotice",
      data:{
        class_id:this.data.class_id,
        head:this.data.headContent,
        content:this.data.noticeContent,
        time:this.js_date_time(new Date())
      }
    }).then(res=>{
      wx.hideLoading()
      wx.showToast({
        title: '发布成功',
        icon: 'none',
      })
      console.log('发布成功')
    })
    this.setData({
      wordNum:0,
      noticeContent:''
    })

    //let pages = getCurrentPages();
    //let before = pages[pages.length - 2]
    //刷新页面
    /*
    before.setData({
      squareItem:[],
    })
    before.getSquareData()
    */
    //回到先前页面
    wx.navigateBack({
      delta: 1
    })
  },

  //转换时间
  js_date_time(unixtime) {
    var date = new Date(unixtime);
    var y = date.getFullYear();
    var m = date.getMonth() + 1;
    m = m < 10 ? ('0' + m) : m;
    var d = date.getDate();
    d = d < 10 ? ('0' + d) : d;
    var h = date.getHours();
    h = h < 10 ? ('0' + h) : h;
    var minute = date.getMinutes();
    var second = date.getSeconds();
    minute = minute < 10 ? ('0' + minute) : minute;
    second = second < 10 ? ('0' + second) : second;
    return y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + second; //年月日时分秒
  },

})