const app = getApp();
//var inputVal = '';
//var msgList = [];
var windowWidth = wx.getSystemInfoSync().windowWidth;
var windowHeight = wx.getSystemInfoSync().windowHeight;
var keyHeight = 0;


/**
 * 初始化数据
 
function initData(that) {
  //初始化信息
  inputVal = '';

  msgList = [{
      speaker: 'server',
      contentType: 'text',
      content: '欢迎来到英雄联盟，敌军还有30秒到达战场，请做好准备！'
    },
    {
      speaker: 'customer',
      contentType: 'text',
      content: '我怕是走错片场了...'
    }
  ]
  that.setData({
    msgList,
    inputVal
  })
}
*/
/**
 * 计算msg总高度
 */
/**
 function calScrollHeight(that, keyHeight) {
   var query = wx.createSelectorQuery();
   query.select('.scrollMsg').boundingClientRect(function(rect) {
    that.setData({
      scrollTop: rect.height+'px'
    });
   }).exec();
  }
  */

Page({

  /**
   * 页面的初始数据
   */
  data: {
    //scrollHeight: '100vh',
    inputBottom: 0,
    msgContent: '',
    userInfo: {},
    msgList: [],
    chat_msg_id: '',
    scrollHeight: '',
    keyHeight:0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //获取用户数据
    var that = this
    wx.getStorage({
      key: "userInfo",
    }).then(res => {
      that.setData({
        userInfo: JSON.parse(res.data)
      })
    })
    //calScrollHeight();
    //initData(this);
    this.setData({
      cusHeadIcon: this.data.userInfo.avatarUrl,
      chat_msg_id: options.chat_msg_id,
      //msgList: [],
    })

    wx.cloud.callFunction({
      name:"inquireChat",
      data:{
        chat_id:options.chat_msg_id,
      }
    }).then(res =>{
      this.setData({
        msgList: res.result.data[0].msgList
      })
    }).then(res=>{
      this.setData({
        toView: 'msg-' + (this.data.msgList.length - 1)
      })
    })

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

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
   * 获取聚焦
   */
  focus: function (e) {
    keyHeight = e.detail.height;
    this.setData({
      toView: 'msg-' + (this.data.msgList.length - 1),
      //scrollHeight: (windowHeight - keyHeight) + 'px',
      inputBottom: keyHeight + 'px',
    })

    //计算msg高度
    // calScrollHeight(this, keyHeight);

  },

  //失去聚焦(软键盘消失)
  blur: function (e) {
    this.setData({
      //scrollHeight: '100vh',
      inputBottom: 0,
      toView: 'msg-' + (this.data.msgList.length - 1)
    })
  },

  //监听评论框中内容
  bindInput(e){
    //console.log('bindInput:', e)
    this.setData({
      msgContent:e.detail.value
    })
  },

  /**
   * 发送点击监听
   */
  sendClick: function (e) {
    var msgData = {};
    msgData.nickName = this.data.userInfo.nickName;
    msgData.content = this.data.msgContent;
    msgData._openid = this.data.userInfo._openid;
    msgData.time = new Date();
    this.data.msgList.push(msgData);

    wx.cloud.callFunction({
      name:"sendMsg",
      data:{
        chat_id: this.data.chat_msg_id,
        _openid: this.data.userInfo._openid,
        content: this.data.msgContent,
        nickName: this.data.userInfo.nickName,
        time: msgData.time,
      }
    })

    this.data.msgContent = '';
    let tmp_str = 'this.data.msgList';
    this.setData({
      msgList: this.data.msgList,
      msgContent: '',
    });

  },

  /**
   * 退回上一页
   */
  toBackClick: function () {
    wx.navigateBack({})
  }

})
