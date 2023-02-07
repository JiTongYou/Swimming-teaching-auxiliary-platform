// miniprogram/pages/individualPage/individualPage.js
const DB = wx.cloud.database(); //.collection("defaultUserInfo");
const _ = DB.command
Page({
  /**
   * 页面的初始数据
   */
  data: {
    //_openid,
    ifFollowed: 0,
    userInfo: {},
    haveFollowed: [],
    otherUserId: "",
    otherUserAvatar: "",
    otherUserFollowing: [],
    otherUserFollowers: [],
    otherUserNickName: "",
    chat_data: -1,
  },

  async clickFollow(e) {
    var tmp_str = 'ifFollowed';
    if (this.data.ifFollowed == 1) {
      this.setData({
        [tmp_str]: 0
      })
      wx.cloud.callFunction({
        name: "individualAddFollower",
        data: {
          currentId: this.data.userInfo._openid,
          _id: this.data.otherUserId,
          type: 0
        }
      })
      // .then(
      //   this.setData({
      //     ifFollowed: 0,
      //     otherUserFollowers: _.pull()
      //   })
      // )
      .then(res => {
        wx.cloud.callFunction({
          name: "individualGetInfo",
          data: {
            _openid: this.data.otherUserId,
          }
        }).then(res => {
          this.setData({
            otherUserFollowers: res.result.data[0].followers,
          })
        })
      })
    } 
    else {
      this.setData({
        [tmp_str]: 1
      })
      wx.cloud.callFunction({
        name: "individualAddFollower",
        data: {
          currentId: this.data.userInfo._openid,
          _id: this.data.otherUserId,
          type: 1
        }
      }).then(res => {
        wx.cloud.callFunction({
          name: "individualGetInfo",
          data: {
            _openid: this.data.otherUserId,
          }
        }).then(res => {
          this.setData({
            otherUserFollowers: res.result.data[0].followers,
          })
        })
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
        userInfo: JSON.parse(res.data),
      })

    })

    that.setData({
      otherUserId: options.personId
    })
    wx.cloud.callFunction({
      name: "individualGetInfo",
      data: {
        _openid: that.data.otherUserId,
      }
    }).then(res => {
      that.setData({
        otherUserAvatar: res.result.data[0].avatarUrl,
        otherUserNickName: res.result.data[0].nickName,
        otherUserFollowing: res.result.data[0].following,
        otherUserFollowers: res.result.data[0].followers,
      })

      for (var i = 0; i < that.data.otherUserFollowers.length; i++) {
        if (that.data.otherUserFollowers[i] == that.data.userInfo._openid) {
          that.setData({
            ifFollowed: 1,
          })
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    wx.cloud.callFunction({
      name: "indexGetChatData",
      data: {
        currentId: this.data.userInfo._openid
      }
    }).then(res => {
      //console.log(res)
      for (var i = 0; i < res.result.data.length; i++) {
        if ((res.result.data[i].chat_members[0]._openid == this.data.userInfo._openid &&
            res.result.data[i].chat_members[1]._openid == this.data.otherUserId) ||
          (res.result.data[i].chat_members[1]._openid == this.data.userInfo._openid &&
            res.result.data[i].chat_members[0]._openid == this.data.otherUserId)) {
          this.setData({
            chat_data: res.result.data[i]
          })
          break;
        }
      }
    })

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

  //跳转至聊天页面
  clickChat(event) {
    // console.log(typeof this.data.chat_data)
    if (this.data.otherUserId == this.data.userInfo._openid) {
    } else {
      if (typeof this.data.chat_data == 'number') {
        // 创建聊天
        var chat_members = [{
            _openid: this.data.userInfo._openid
            // avatarUrl: this.data.userInfo.avatarUrl,
            // nickName: this.data.userInfo.nickName
          },
          {
            _openid: this.data.otherUserId
            // avatarUrl: this.data.otherUserAvatar,
            // nickName: this.data.otherUserNickName
          }
        ]
        wx.cloud.callFunction({
          name: "addChat",
          data: {
            chat_members: chat_members,
            // time: new Date()
          }
        }).then(
          wx.cloud.callFunction({
            name: "countChat",
          }).then(res => {
            console.log(res)
            this.setData({
              chat_data: {
                chat_members: chat_members,
                time: new Date(),
                chat_msg_id: res.result.total + 1,
                type: "1"
              }
            })
            wx.navigateTo({
              url: '/pages/chat/chat?detail=' + JSON.stringify(this.data.chat_data)
            })
          })
        )
      } else {
        wx.navigateTo({
          url: '/pages/chat/chat?detail=' + JSON.stringify(this.data.chat_data)
        })
      }
    }
  }
})