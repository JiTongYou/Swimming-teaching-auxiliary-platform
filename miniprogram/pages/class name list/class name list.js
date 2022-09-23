// miniprogram/pages/class name list/class name list.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    student: {},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      student: JSON.parse(options.detail)
    })
    wx.getStorage({
      key: "userInfo"
    }).then(res=>{
      this.setData({
        userInfo: JSON.parse(res.data)
      })
      if(JSON.parse(res.data).identity == 0){
        this.setData({
          classId: JSON.parse(options.classId)
        })
      }
    })
    wx.cloud.callFunction({
      name: "getNameList",
      data: {
        studentList: this.data.student
      }
    }).then(res => {
      this.setData({
        studentList: res.result.data
      })
      // console.log(res)
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

 toIndividual(e){
  console.log(e)
  wx.navigateTo({
    url:'/pages/individualPage/individualPage?personId=' + this.data.studentList[e.currentTarget.dataset.index]._openid
  })
 },

 showDeleteStudent(e){
   this.setData({
     tapDeleteStudent: 1,
     target: e.currentTarget.dataset.index
   })
 },

 concealDeleteStudentPopup(){
  this.setData({
    tapDeleteStudent: 0
  })
 },
 
 deleteStudent(e){
   var tmp = JSON.parse(JSON.stringify(this.data.studentList))
   tmp.splice(this.data.target, 1)
   wx.showLoading({
     title: '移除中...',
   })
   wx.cloud.callFunction({
     name:"exitClass",
     data:{
       studentId: this.data.studentList[this.data.target]._openid,
       classId: this.data.classId
     }
   }).then(res=>{
     console.log(res)
     this.setData({
       target: 0,
       tapDeleteStudent: 0,
       studentList: tmp
     })
     wx.hideLoading()
   })
 }
})