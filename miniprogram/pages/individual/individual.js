// pages/individual/individual.js
var that;
Page({
  // changeAvatar(){
  //   var that=this;
  //   wx.chooseImage({
  //     count:1,
  //     sizeType:['original','compressed'],
  //     sourceType:['album','camera'],
  //     success(res){
  //       that.setData({
  //         backgroundPicPath:res.backgroundPicPath
  //       })
  //     }
  //   })
  // },

    // //点击头像到个人主页
    // toIndividualPage(event){
    //   let person=event.currentTarget.dataset.person;
    //   console.log(event.currentTarget);
    //   wx.navigateTo({
    //     url:'/pages/individualPage/individualPage?personId=' + person._openid
    //   })
    // },

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
      url:'/pages/vidCollected/vidCollected'
    })
  },

  // toIndividual(){
  //   wx.navigateTo({
  //     url:'/pages/individualPage/individualPage'
  //   })
  // },
   
//   listTap(){
//     wx.navigateTo({
//       url:'/pages/blacklist/blacklist'
//     })
//  },

  // changeBackground(){
  //     var that=this;
  //     wx.chooseImage({
  //       count:1,
  //       sizeType:['original','compressed'],
  //       sourceType:['album','camera'],
  //       success(res){
  //         that.setData({
  //           backgroundPicPath:res.backgroundPicPath
  //         })
  //       }
  //     })
  // },

  /**
   * 页面的初始数据
   */
  data: {
      userInfo:[],
      following:0,
      followers:0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    wx.getStorage({
      key: 'userInfo',
      success (res) {

      that.setData({
        userInfo:JSON.parse(res.data),
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
    if(this.data.userInfo.length!=0){
    wx.cloud.callFunction({
      name: "individualGetInfo",
      data: {
        _openid: this.data.userInfo._openid,
      }
    }).then(res => {
      this.setData({
        userInfo:res.result.data[0],
        following: res.result.data[0].following.length,
        followers: res.result.data[0].followers.length,
      })
    })
  }
  },

  exit(){
     wx.showModal({
      title: '提示',
      content: '您确定要退出登录吗',
      success(res) {
        if (res.confirm) {
          console.log('用户点击确定')
          wx.removeStorageSync('userInfo');
          wx.removeStorageSync('chat7');
          wx.removeStorageSync('userClass');
          wx.redirectTo({
            url: '/pages/login/login',
          })
        } else {
          console.log('用户点击取消')
        }
      }
    })
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