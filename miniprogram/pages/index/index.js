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
    recordItem:[],
    haveLiked: [],
    userInfo:{},
    //用于实现评论功能
    currentSquareIndex: -1,
    showCommentAdd: false,
    commentContent:'',
    heightBottom:'',
    reply:'',
    //用户班级信息
    userClass:{},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
//this.getScrollHeight(),
    //不可省略var that=this，否则无法访问
    //promise风格，解决异步
    var that = this
    wx.getStorage({
      key: "userInfo",
    }).then(res => {
      that.setData({
        userInfo: JSON.parse(res.data)
      })
    }).then(res => {
      //若放在外部，会因为异步操作而导致无法正常获取数据
      that.syncUserInfoFromDataBase()
      if(that.data.userInfo.identity){
        that.setUserClassInfo()
        }else{
          that.setTeacherClassInfo()
        }
      that.getChatData()
      //that.inquireSpecificChatData()
      that.getSquareData()
      that.getVideoHistory()
    })
    
    setInterval(()=>{
    if(this.data.userInfo.identity){
      this.setUserClassInfo()
      }else{
        this.setTeacherClassInfo()
      }
    }, 1000 * 60)
    
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
    if(this.data.userInfo.identity){
      this.setUserClassInfo()
      }else{
        this.setTeacherClassInfo()
      }
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

 async getVideoHistory(){
   if(this.data.userInfo.history.length==0){}else{
  wx.cloud.callFunction({
    name: "videoGetHistory",
    data: {
      _id:this.data.userInfo.history,
      length:this.data.userInfo.history.length
    }
  }).then(res => {
    console.log(res)
    this.setData({
      recordItem:res.result.data
    })
    console.log(this.data.recordItem)
  })
}
},

  toPublish(){
    wx.navigateTo({
      url: '/pages/publish/publish',
    })
  },

  //跳转至聊天页
  toChat(e) {
    var detail= this.data.chatItem[e.currentTarget.dataset.index];
    wx.navigateTo({
      url: '/pages/chat/chat?detail=' + JSON.stringify(detail),
    })
  },

    //从云端重新拉取用户数据信息，以保证后端进行操作后，用户端能够正常操作
    syncUserInfoFromDataBase(){
      wx.cloud.callFunction({
        name: "syncUserInfo",
        data:{
          _openid: this.data.userInfo._openid,
        }
      }).then(res =>{
        this.setData({
          userInfo: res.result.data[0]
        })
        wx.setStorage({
          key: 'userInfo',
          data: JSON.stringify(res.result.data[0])
        })
      })
    },

  //获取用户课程信息并更新存储中用户课程信息
  setUserClassInfo() {
    wx.cloud.callFunction({
      name: "getUserClassInfo",
      data: {
        _openid: this.data.userInfo._openid,
      }
    }).then(res => {
      // console.log("StudentClassInfo", res)
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
  setTeacherClassInfo(){
    wx.cloud.callFunction({
      name:'getTeacherClassInfo',
      data:{
        _openid: this.data.userInfo._openid
      }
    }).then(res=>{
      this.setData({
        userClass: res.result.data
      })
      wx.setStorage({
        key: 'userClass',
        data: JSON.stringify(res.result.data)
      })
    })
  },

  getChatData(num = 5, alreadyNum = 0){
    wx.cloud.callFunction({
      name: "indexGetChatData",
      data: {
        currentId: this.data.userInfo._openid,
        num: num,
        alreadyNum: alreadyNum
      }
    }).then(res => {
      this.setData({
        chatItem: res.result.data
      })
    })
  },

  inquireSpecificChatData(){
    //获取聊天数据
    wx.cloud.callFunction({
      name: "inquireChat",
      data: {
        currentId: this.data.userInfo._openid,
        // friendId: '2',
        // type: 1
         // type: 1 本来用于区分群聊与私聊，现暂时不实现群聊，故弃置
      }
    }).then(res => {
      //console.log('inquireChat:',res)
      this.setData({
        chatItem: res.result.data
      })
    })
  },

  //跳转至通知中班级页面
  toSingleClass() {
    wx.switchTab({
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
              //console.log(this.data.userInfo._openid)
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
  /*
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
  */

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
        this.data.userInfo.followers.push(2)
        var tmp_str='squareItem[' + index + '].likes'
        this.setData({
          [tmp_str]:this.data.squareItem[index].likes
        })
        console.log("点赞成功")
      })
    }
  },
  
  //监听评论框中内容
  bindInput(e){
    //console.log('bindInput:', e)
    this.setData({
      commentContent:e.detail.value
    })
  },

  //单击评论后弹出键盘高度预留
  bindFocus(e){
    //console.log('bindFocus:',e)
    var tmp_height = e.detail.height + 20
    this.setData({
      heightBottom:tmp_height
    })
  },

  //显示评论框
  clickComment(e){
    //console.log('clickComment:',e)
    this.setData({
      currentSquareIndex:e.currentTarget.dataset.index,
      showCommentAdd: true
    })
  },

  //隐藏评论框
  concealAddComment(e){
    this.setData({
      showCommentAdd: false
    })
  },

  //发送评论
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
    commentData.reply = this.data.reply;

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
        commentContent:this.data.commentContent,
        reply:this.data.reply
      }
    })

    this.setData({
      [tmp_str]:this.data.squareItem[this.data.currentSquareIndex].comment,
      showCommentAdd: false,
      commentContent:'',
      reply:''
    })

    //console.log("评论成功")
  },

  //回复评论
  clickCommentItem(e){
    //获取评论所属的朋友圈信息index
    var circleIndex = e.currentTarget.dataset.index;
    //获取评论在评论列表中的索引
    var commentIndex = e.currentTarget.dataset.commentindex;

    var squareData = this.data.squareItem[e.currentTarget.dataset.index];
    var commentList = squareData.comment;

    var commentData = commentList[commentIndex];
    var nickName = commentData.nickName;
    this.setData({
      currentSquareIndex:e.currentTarget.dataset.index,
      showCommentAdd: true,
      reply: nickName
    })

  },

  //点击头像到个人主页
  toIndividualPageSquare(event){
    let person=event.currentTarget.dataset.person;
    console.log(person._openid)
    wx.navigateTo({
      url:'/pages/individualPage/individualPage?personId=' + person._openid
    })
  },

//路由跳转至视频页面
  toVideo(event){
    let video=event.currentTarget.dataset.video;
    // console.log(event.currentTarget.dataset.video)
    wx.navigateTo({
      url:'/pages/videoPage/videoPage?vidId=' + video._id
    })
  },

})


