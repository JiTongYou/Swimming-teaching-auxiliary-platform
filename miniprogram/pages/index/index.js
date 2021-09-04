// miniprogram/pages/index/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navId: "0",
    /*用于设置悬浮导航条（已废弃）
    navFixed: false,
    */
    /*用于设置广场及消息展示内容*/
    //scrollHeight: 0,
    squareItem: [],
    oldSquareItem: [],
    oldChatItem: [],
    chatItem: [],
    haveLiked: [],
    userInfo:{},
    //用于实现评论功能
    currentSquareIndex: -1,
    showCommentAdd: false,
    commentContent:'',
    heightBottom:'',
  },

  //点击切换主页导航条的回调
  changeNav(event) {
    let navId = event.currentTarget.id;
    this.setData({
      navId: navId
    })
    /*
    wx.pageScrollTo({
      缺数值，应在判断后返回顶部
    })
    */
  },

  /* 浮动导航条
  原文链接：https://blog.csdn.net/qq_43764578/article/details/105706732
  效果较为糟糕，卡顿明显，使用体验差
  floatNav: function (e) {
    let that = this;
    wx.createSelectorQuery().select('#indexNav').boundingClientRect(function (rect) {
      if(0 <= rect.top){
        that.setData({
          navFixed:false
        })
      }else{
        that.setData({
          navFixed:true
        })
      }
    }).exec()
  },
  */

  toPublish(){
    wx.navigateTo({
      url: '/pages/publish/publish',
    })
  },

  //跳转至聊天页
  toChat() {
    wx.navigateTo({
      url: '/pages/im/room/room',
    })
  },

  //跳转至通知中班级页面
  toSingleClass() {
    wx.navigateTo({
      url: '/pages/single class/single class',
    })
  },

  /*获取屏幕高度，设置scroll-view高度（否则下拉刷新无法被触发）
  getScrollHeight(){
    let scrollHeight = wx.getSystemInfoSync().windowHeight;
    this.setData({
      scrollHeight: scrollHeight
    })
  },
  */

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

  //广场下拉触底新增
  getSquareData(num = 5, alreadyNum = 0) {
    wx.cloud.callFunction({
      name: "indexGetSquareData",
      data: {
        num: num,
        alreadyNum: alreadyNum
      }
    }).then(res => {
      if (res.result.data.length == "0") {} else {
        var oldSquareItem = this.data.squareItem;
        for(var i = 0; i<res.result.data.length; i++){
          //将页面中用于判断点赞按钮的数据进行初始化
          var tmp_str = 'haveLiked[' + (alreadyNum + i) + ']'
          this.setData({
            [tmp_str]:0
          });
          //判断当前用户是否点赞了该条广场信息，若是，则置haveLiked对应位置数字为1，否则不改变，仍为0
          for(var j = 0; j<res.result.data[i].likes.length; j++){
            //this.data.userInfo._openid
            //测试数据：2
            if(this.data.userInfo._openid == res.result.data[i].likes[j]){
              var tmp_str = 'haveLiked[' + (alreadyNum + i) + ']'
              this.setData({
                [tmp_str]:1
              })
              break
            }
          };
          res.result.data[i].time = this.js_date_time(res.result.data[i].time)
        };
        //拼接信息，保证页面重新渲染时留有原有内容
        var newSquareItem = oldSquareItem.concat(res.result.data);
        this.setData({
          squareItem: newSquareItem
        })
      }
    })
  },

  //消息下拉触底新增
  getChatData(num = 5, alreadyNum = 0) {
    wx.cloud.callFunction({
      name: "indexGetChatData",
      data: {
        num: num,
        alreadyNum: alreadyNum
      }
    }).then(res => {
      if (res.result.data.length == "0") {} else {
        var oldChatItem = this.data.chatItem;
        var newChatItem = oldchatItem.concat(res.result.data)
        this.setData({
          chatItem: newchatItem
        })
      }
    })
  },

  clickLike(e){
    var index = e.currentTarget.dataset.index
    var tmp_str='haveLiked[' + index + ']';
    if(this.data.haveLiked[index] == 1){
      this.setData({
        [tmp_str]:0
      })
      wx.cloud.callFunction({
        name:"squareAddLike",
        data:{
          _openid:this.data.userInfo._openid,
          //this.data.userInfo._openid
          //测试数据:'2'
          _id:this.data.squareItem[index]._id,
          type:0
        }
      }).then(res =>{
        this.data.squareItem[index].likes.pop()
        var tmp_str='squareItem[' + index + '].likes'
        this.setData({
          [tmp_str]:this.data.squareItem[index].likes
        })
        console.log("取消点赞成功")
      })
    }else{
      this.setData({
        [tmp_str]:1
      })
      wx.cloud.callFunction({
        name:"squareAddLike",
        data:{
          _openid:this.data.userInfo._openid,
          //this.data.userInfo._openid
          //测试数据:'2'
          _id:this.data.squareItem[index]._id,
          type:1
        }
      }).then(res =>{
        this.data.squareItem[index].likes.push(2)
        var tmp_str='squareItem[' + index + '].likes'
        this.setData({
          [tmp_str]:this.data.squareItem[index].likes
        })
        console.log("点赞成功")
      })
    }
  },
  
  bindInput(e){
    //console.log('bindInput:', e)
    this.setData({
      commentContent:e.detail.value
    })
  },

  bindFocus(e){
    //console.log('bindFocus:',e)
    var tmp_height = e.detail.height + 5
    this.setData({
      heightBottom:tmp_height
    })
  },

  clickComment(e){
    //console.log('clickComment:',e)
    this.setData({
      currentSquareIndex:e.currentTarget.dataset.index,
      showCommentAdd: true
    })
  },

  clickSend(e){
    var squareData = this.data.squareItem[this.data.currentSquareIndex];
    var commentList = squareData.comment;

    //console.log(commentList)

    var commentData = {};
    commentData.nickName = this.data.userInfo.nickName;
    //this.data.userInfo.nickName
    //测试数据:'2'
    commentData.content = this.data.commentContent;
    commentData._openid = this.data.userInfo._openid;
    //this.data.userInfo._openid
    //测试数据:'2'

    commentList.push(commentData);

    let tmp_str = 'squareItem[' + this.data.currentSquareIndex + '].comment'

    wx.cloud.callFunction({
      name:"squareComment",
      data:{
        _id:squareData._id,
        _openid: this.data.userInfo._openid,
        //this.data.userInfo._openid
        //测试数据:'2'
        nickName: this.data.userInfo.nickName,
        //this.data.userInfo.nickName
        //测试数据:'2'
        commentContent:this.data.commentContent
      }
    })

    this.setData({
      [tmp_str]:this.data.squareItem[this.data.currentSquareIndex].comment,
      showCommentAdd: false,
      commentContent:''
    })

    console.log("评论成功")
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //this.getScrollHeight(),

    //不可省略var that=this，否则无法访问
    var that=this
    wx.getStorage({
      key:"userInfo",
      success(res){
        that.setData({
          userInfo:JSON.parse(res.data)
        })
      }
    })
    
    this.getSquareData()
    this.getChatData()
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
    this.setData({
      squareItem:[],
    })
    this.getSquareData()
    this.getChatData()
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
    this.setData({
      squareItem:[],
    })
    this.getSquareData()
    this.getChatData()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.data.navId == "0") {
      var alreadyNum = this.data.squareItem.length
      this.getSquareData(5, alreadyNum)
    } else {

    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

})