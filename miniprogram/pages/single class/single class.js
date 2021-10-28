// miniprogram/pages/single class/single class.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //userClass:{},//注意：一定不可定义！
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    wx.getStorage({
      key: "userInfo",
    }).then(res => {
      that.setData({
        userInfo: JSON.parse(res.data)
      })
    })
    wx.getStorage({
      key: "userClass",
      success(res) {
        //console.log(res)
        that.setData({
          userClass: JSON.parse(res.data)
        })
      },
      fail(res) {
        //do nothing
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
    if(this.data.userInfo.identity){
      this.setUserClassInfo()
    }else{
      this.setTeacherClassInfo()
    }
    wx.stopPullDownRefresh()
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
    var detail = this.data.userClass[0].student
    wx.navigateTo({
      url: '/pages/class name list/class name list?detail=' + JSON.stringify(detail),
    })
  },

  toTeachingClass(e){
    var detail= this.data.userClass[e.currentTarget.dataset.index];
    wx.navigateTo({
      url: '/pages/teaching class/teaching class?detail=' + JSON.stringify(detail),
    })
  },

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

  //获取用户课程信息并更新存储中用户课程信息
  setUserClassInfo() {
    wx.cloud.callFunction({
      name: "getUserClassInfo",
      data: {
        _openid: this.data.userInfo._openid,
      }
    }).then(res => {
      this.setData({
        userClass: res.result.data
      })
    }).then(res => {
      wx.setStorage({
        key: "userClass",
        data: JSON.stringify(this.data.userClass)
      })
    })

  },

  //教师账号用于获取班级信息
  setTeacherClassInfo() {
    wx.cloud.callFunction({
      name: 'getTeacherClassInfo',
      data: {
        _openid: this.data.userInfo._openid
      }
    }).then(res => {
      this.setData({
        userClass: res.result.data
      })
      wx.setStorage({
        key: 'userClass',
        data: JSON.stringify(res.result.data)
      })
    })
  },

  //显示加课弹窗
  showJoinNewClassPopup() {
    this.setData({
      tapJoinNewClass: 1,
    })
  },

  //显示新建课程
  showCreateNewClassPopup() {
    this.setData({
      tapCreateNewClass: 1,
    })
  },

  //隐藏加课弹窗
  concealJoinNewClassPopup() {
    this.setData({
      tapJoinNewClass: 0,
    })
  },

  //隐藏新建课程弹窗
  concealCreateNewClassPopup() {
    this.setData({
      tapCreateNewClass: 0,
    })
  },

  //监听input输入课号
  getClassNum(e) {
    this.setData({
      classNum: e.detail.value,
    })
  },

  //监听input输入课号
  getClassName(e) {
    this.setData({
      className: e.detail.value,
    })
  },

  //点击界面其他位置，加入课程窗口隐藏
  concealAddClass() {
    this.setData({
      tapJoinNewClass: 0,
      tapCreateNewClass: 0,
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

  createClass(e) {

    wx.showLoading({
      title: '创建班级中...',
    })

    wx.cloud.callFunction({
      name: "createClass",
      data: {
        className: this.data.className,
        classTeacher: 'test',
        _openid: this.data.userInfo._openid,
      }
    }).then(res=>{
      this.setTeacherClassInfo()
      wx.getStorage({
      key:'userClass',
    }).then(res=>{
      this.setData({
        userClass: res.data
      })
      wx.hideLoading()
    })
    })
    wx.showToast({
      title: '创建班级成功',
      icon: 'none',
    })
    this.setData({
      tapCreateNewClass: 0,
      className: '',
    })
  }

})