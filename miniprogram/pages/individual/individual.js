// pages/individual/individual.js
const DB=wx.cloud.database().collection("individual")
var that;
Page({
  changeAvatar(){
    var that=this;
    wx.chooseImage({
      count:1,
      sizeType:['original','compressed'],
      sourceType:['album','camera'],
      success(res){
        that.setData({
          backgroundPicPath:res.backgroundPicPath
        })
      }
    })
  },

  changeInfo(){
    wx.navigateTo({
      url:'/pages/changeInfo/changeInfo',
    })
  },

  usTap(){
    wx.navigateTo({
      url:'/pages/aboutUs/aboutUs'
    })
  },

  favoriteTap(){
    wx.navigateTo({
      url:'/pages/favorites/favorites'
    })
  },

  toIndividual(){
    wx.navigateTo({
      url:'/pages/individualPage/individualPage'
    })
  },
   
  listTap(){
    wx.navigateTo({
      url:'/pages/blacklist/blacklist'
    })
 },

  changeBackground(){
      var that=this;
      wx.chooseImage({
        count:1,
        sizeType:['original','compressed'],
        sourceType:['album','camera'],
        success(res){
          that.setData({
            backgroundPicPath:res.backgroundPicPath
          })
        }
      })
  },
  /**
   * 页面的初始数据
   */
  data: {
      userInfo:[],
      backgroundPicPath:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    wx.getStorage({
      key: 'userInfo',
      success (res) {
       console.log('get storage success', JSON.parse(res.data))
      that.setData({
        userInfo:JSON.parse(res.data),
      })
      console.log(res.data)
     }
   })


   //DB.add({
    //data:{
      //  following:5,
      //  followers:followers
 //   },
  //})
   // console.log(res.data)
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