// miniprogram/pages/vidCollected/vidCollected.js
const DB=wx.cloud.database().collection("vids");
const _ = DB.command
var that;
//let vidList=[]
Page({
  /**
   * 页面的初始数据
   */
  data: {
    vidList:[],//视频列表数据
    vidId:'',
    isTriggered: false,
    userInfo:{},
  },

  //路由跳转至视频页面
  tovid(event){
    let vid=event.currentTarget.dataset.vid;
    // console.log(event.currentTarget.dataset.vid)
    wx.navigateTo({
      url:'/pages/vidPage/vidPage?vidId=' + vid._id
    })
  },

  //获取视频列表
  async getvidList(){
    for(var i = 0;i<this.data.userInfo.vidCollected.length;i++){
      console.log("s")
    wx.cloud.callFunction({
      name: "getCollectData",
      data: {
        _id:this.data.userInfo.vidCollected[i]
      }
    }).then(res => {
      console.log(res.result.data.length)
     if (res.result.data.length == "0"){}else {
       var oldvidItem = this.data.vidList;
       var newvidItem = oldvidItem.concat(res.result.data);
        this.setData({
         vidList:newvidItem,
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
    this.getvidList()
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
      var alreadyNum = this.data.vidList.length
      this.getvidList(4, alreadyNum)
    } 
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})