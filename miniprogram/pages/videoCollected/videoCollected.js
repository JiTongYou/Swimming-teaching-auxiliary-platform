// miniprogram/pages/videoCollected/videoCollected.js
const DB=wx.cloud.database().collection("videos");
const _ = DB.command
var that;
//let videoList=[]
Page({
  /**
   * 页面的初始数据
   */
  data: {
    videoList:[],//视频列表数据
    vidId:'',
    isTriggered: false,
    userInfo:{},
  },

  //路由跳转至视频页面
  toVideo(event){
    let video=event.currentTarget.dataset.video;
    // console.log(event.currentTarget.dataset.video)
    wx.navigateTo({
      url:'/pages/videoPage/videoPage?vidId=' + video._id
    })
  },

  //获取视频列表
  async getVideoList(){
    for(var i = 0;i<this.data.userInfo.videoCollected.length;i++){
      console.log("s")
    wx.cloud.callFunction({
      name: "getCollectData",
      data: {
        _id:this.data.userInfo.videoCollected[i]
      }
    }).then(res => {
      console.log(res.result.data.length)
     if (res.result.data.length == "0"){}else {
       var oldVideoItem = this.data.videoList;
       var newVideoItem = oldVideoItem.concat(res.result.data);
        this.setData({
         videoList:newVideoItem,
       })
    }
    
    })
  }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
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
    this.getVideoList()
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
    if (this.data.navId == "0") {
      var alreadyNum = this.data.videoList.length
      this.getVideoList(4, alreadyNum)
    } 
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})