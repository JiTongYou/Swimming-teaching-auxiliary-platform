import {
  showToast
} from '../../utils/util.js'
const FATAL_REBUILD_TOLERANCE = 10
const SETDATA_SCROLL_TO_BOTTOM = {
  scrollTop: 100000,
  scrollWithAnimation: true,
}
var that

Component({
  properties: {
    envId: String,
    collection: String,
    chatType: Number,
    groupId: String,
    memberIds: Array,
    userId: String,
    userAvatar: String,
    userNickName: String,
    groupName: String,
    userInfo: Object,
    onGetUserInfo: {
      type: Function,
    },
    getOpenID: {
      type: Function,
    },
  },

  data: {
    chats: [],
    textInputValue: '',
    openId: '',
    scrollTop: 0,
    scrollToMessage: '',
    hasKeyboard: false,
    noBefore: false,
    isAudio: false,
    sendType: 0, //发送消息类型，0 文本 1 语音
    isLongPress: false, // 录音按钮是否正在长按
  },
  lifetimes: {
    attached: function () {
      // 在组件实例进入页面节点树时执行
    },
    detached: function () {
      // 在组件实例被从页面节点树移除时执行
      if (this.messageListener) {
        this.messageListener.close();
      }
    },
  },
  methods: {
    onGetUserInfo(e) {
      this.properties.onGetUserInfo(e)
    },

    getOpenID() {
      return this.properties.getOpenID()
    },

    mergeCommonCriteria(criteria) {
      return {
        groupId: this.data.groupId,
        ...criteria,
      }
    },

    async initRoom() {
      that = this;

      this.try(async () => {
        await this.initOpenID()

        const {
          envId,
          collection
        } = this.properties
        const db = this.db = wx.cloud.database({
          env: envId,
        })
        const _ = db.command
        that.resetUnreadCount(that.data.groupId, getApp().globalData.userInfo._openid, Date.now())
        const {
          data: initList
        } = await db.collection(collection).where(this.mergeCommonCriteria()).orderBy('sendTimeTS', 'desc').get()

        console.log('init query chats', initList)

        this.setData({
          chats: initList.reverse(),
          scrollTop: 10000,
        })
        this.scrollToBottom(true);
        this.scrollToBottom2();
        this.initWatch(initList.length ? {
          sendTimeTS: _.gt(initList[initList.length - 1].sendTimeTS),
        } : {})
      }, '初始化失败')
    },

    async initOpenID() {
      return this.try(async () => {
        const openId = await this.getOpenID()

        this.setData({
          openId,
        })
      }, '初始化 openId 失败')
    },

    async initWatch(criteria) {
      this.try(() => {
        const {
          collection
        } = this.properties
        const db = this.db
        const _ = db.command

        console.warn(`开始监听`, criteria)
        this.messageListener = db.collection(collection).where(this.mergeCommonCriteria(criteria)).watch({
          onChange: this.onRealtimeMessageSnapshot.bind(this),
          onError: e => {
            if (!this.inited || this.fatalRebuildCount >= FATAL_REBUILD_TOLERANCE) {
              this.showError(this.inited ? '监听错误，已断开' : '初始化监听失败', e, '重连', () => {
                this.initWatch(this.data.chats.length ? {
                  sendTimeTS: _.gt(this.data.chats[this.data.chats.length - 1].sendTimeTS),
                } : {})
              })
            } else {
              this.initWatch(this.data.chats.length ? {
                sendTimeTS: _.gt(this.data.chats[this.data.chats.length - 1].sendTimeTS),
              } : {})
            }
          },
        })
      }, '初始化监听失败')
    },

    onRealtimeMessageSnapshot(snapshot) {
      console.warn(`收到消息`, snapshot)
      that.resetUnreadCount(that.data.groupId, getApp().globalData.userInfo._openid, Date.now());
      if (snapshot.type === 'init') {
        this.setData({
          chats: [
            ...this.data.chats,
            ...[...snapshot.docs].sort((x, y) => x.sendTimeTS - y.sendTimeTS),
          ],
        })
        this.scrollToBottom()
        this.inited = true
      } else {
        let hasNewMessage = false
        let hasOthersMessage = false
        const chats = [...this.data.chats]
        for (const docChange of snapshot.docChanges) {
          switch (docChange.queueType) {
            case 'enqueue': {
              hasOthersMessage = docChange.doc._openid !== this.data.openId
              const ind = chats.findIndex(chat => chat._id === docChange.doc._id)
              if (ind > -1) {
                if (chats[ind].msgType === 'image' && chats[ind].tempFilePath) {
                  chats.splice(ind, 1, {
                    ...docChange.doc,
                    tempFilePath: chats[ind].tempFilePath,
                  })
                } else chats.splice(ind, 1, docChange.doc)
              } else {
                hasNewMessage = true
                chats.push(docChange.doc)
              }
              break
            }
          }
        }
        this.setData({
          chats: chats.sort((x, y) => x.sendTimeTS - y.sendTimeTS),
        })
        if (hasOthersMessage || hasNewMessage) {
          this.scrollToBottom()
        }
      }
    },

    async onConfirmSendText(e) {
      this.try(async () => {
        if (!e.detail.value) {
          return
        }
        const {
          collection
        } = this.properties
        const db = this.db
        const _ = db.command

        var time = new Date();
        var timeTS = Date.now();
        const doc = {
          _id: `${Math.random()}_${timeTS}`,
          groupId: this.data.groupId,
          avatar: this.data.userInfo.avatarUrl,
          nickName: this.data.userInfo.nickName,
          msgType: 'text',
          textContent: e.detail.value,
          sendTime: time,
          sendTimeTS: timeTS, // fallback
        }

        this.setData({
          textInputValue: '',
          chats: [
            ...this.data.chats,
            {
              ...doc,
              _openid: this.data.openId,
              writeStatus: 'pending',
            },
          ],
        })
        this.scrollToBottom(true)
        await db.collection(collection).add({
          data: doc,
        }).then(res => {
          this.updateSysMsg(e.detail.value, time, timeTS);
        })
        this.setData({
          chats: this.data.chats.map(chat => {
            if (chat._id === doc._id) {
              return {
                ...chat,
                writeStatus: 'written',
              }
            } else return chat
          }),
        })
      }, '发送文字失败')
    },
    updateSysMsg(text, time, timeTS) {
      // 5.发送聊天消息时，除了发送聊天成员，给群组其他成员发送未读数
      for (var id of that.data.memberIds) {
        if (id != getApp().globalData.userInfo._openid) {
          this.updateUnreadCount(this.data.groupId, id, timeTS);
        }
      }
      this.db.collection('sys_msg')
        .where({
          type: this.data.chatType,
          groupId: this.data.groupId,
        })
        .update({
          data: {
            content: text,
            time: time,
            sendTimeTS: timeTS,
            childType: ''
          }
        })
        .then(res => {
          console.log('update msg', res)
          if (res.stats.updated == 1) {
            // 如果更新成功
          } else {
            // 更新不成功

          }
        })
    },
    resetUnreadCount(groupId, userId, timeTS) {
      this.db.collection('unread_count')
        .where({
          groupId: groupId,
          userId: userId
        })
        .update({
          data: {
            count: 0,
            sendTimeTS: timeTS
          }
        })
        .then(res => {
          console.log('resetUnreadCount', res)
        })
    },
    updateUnreadCount(groupId, userId, timeTS) {
      this.db.collection('unread_count')
        .where({
          groupId: groupId,
          userId: userId
        })
        .update({
          data: {
            count: this.db.command.inc(1),
            sendTimeTS: timeTS
          }
        })
        .then(res => {
          console.log('updateUnreadCount', res)
          if (res.stats.updated > 0) {
            // 如果更新成功，已经存在所属用户所属群组的未读数
          } else {
            // 如果更新失败，不存在所属用户所属群组的未读数，去创建
            that.sendUnreadCount(groupId, userId, timeTS)
          }
        })
    },
    sendUnreadCount(groupId, userId, timeTS) {
      this.db.collection('unread_count')
        .add({
          data: {
            type: 2,
            groupId: groupId,
            userId: userId,
            count: 1,
            sendTimeTS: timeTS
          }
        })
        .then(res => {
          console.log('sendUnreadCount', res)
        })
    },

    addSysMsg(text, time, timeTS) {
      this.db.collection('sys_msg')
        .add({
          data: {
            type: this.data.chatType,
            groupId: this.data.groupId,
            userIds: [this.data.userId, this.data.openId],
            users: [this.data.userInfo, {
              _openid: this.data.userId,
              avatarUrl: this.data.userAvatar,
              nickName: this.data.userNickName
            }],
            icon: this.data.userInfo.avatarUrl,
            title: this.data.userInfo.nickName,
            content: text,
            time: time,
            sendTimeTS: timeTS,
            unreadCount: 0
          }
        })
        .then(res => {
          console.log('add msg success', res)
        })

    },

    async onChooseImage(e) {
      var time = new Date();
      var timeTS = Date.now();
      wx.chooseImage({
        count: 1,
        sourceType: ['album', 'camera'],
        success: async res => {
          const {
            envId,
            collection
          } = this.properties
          const doc = {
            _id: `${Math.random()}_${timeTS}`,
            groupId: this.data.groupId,
            avatar: this.data.userInfo.avatarUrl,
            nickName: this.data.userInfo.nickName,
            msgType: 'image',
            sendTime: time,
            sendTimeTS: timeTS, // fallback
          }

          this.setData({
            chats: [
              ...this.data.chats,
              {
                ...doc,
                _openid: this.data.openId,
                tempFilePath: res.tempFilePaths[0],
                writeStatus: 0,
              },
            ]
          })
          this.scrollToBottom(true)

          const uploadTask = wx.cloud.uploadFile({
            cloudPath: `${this.data.openId}/${Math.random()}_${Date.now()}.${res.tempFilePaths[0].match(/\.(\w+)$/)[1]}`,
            filePath: res.tempFilePaths[0],
            config: {
              env: envId,
            },
            success: res => {
              this.try(async () => {
                await this.db.collection(collection).add({
                    data: {
                      ...doc,
                      imgFileID: res.fileID,
                    },
                  })
                  .then(res => {
                    this.updateSysMsg('[图片消息]', time, timeTS);
                  })
              }, '发送图片失败')
            },
            fail: e => {
              this.showError('发送图片失败', e)
            },
          })

          uploadTask.onProgressUpdate(({
            progress
          }) => {
            this.setData({
              chats: this.data.chats.map(chat => {
                if (chat._id === doc._id) {
                  return {
                    ...chat,
                    writeStatus: progress,
                  }
                } else return chat
              })
            })
          })
        },
      })
    },

    onMessageImageTap(e) {
      wx.previewImage({
        urls: [e.target.dataset.fileid],
      })
    },

    scrollToBottom(force) {
      if (force) {
        console.log('force scroll to bottom')
        this.setData(SETDATA_SCROLL_TO_BOTTOM)
        return
      }

      this.createSelectorQuery().select('.body').boundingClientRect(bodyRect => {
        this.createSelectorQuery().select(`.body`).scrollOffset(scroll => {
          if (scroll.scrollTop + bodyRect.height * 3 > scroll.scrollHeight) {
            console.log('should scroll to bottom')
            this.setData(SETDATA_SCROLL_TO_BOTTOM)
          }
        }).exec()
      }).exec()
    },
    /**
     * 滚动页面到底部
     */
    scrollToBottom2() {
      wx.pageScrollTo({
        scrollTop: 999999,
        duration: 100
      })
    },

    async onScrollToUpper() {
      if (this.data.noBefore) {
        return
      }
      if (this.db && this.data.chats.length) {
        const {
          collection
        } = this.properties
        const _ = this.db.command
        const {
          data
        } = await this.db.collection(collection).where(this.mergeCommonCriteria({
          sendTimeTS: _.lt(this.data.chats[0].sendTimeTS),
        })).orderBy('sendTimeTS', 'desc').get()
        if (data && data.length > 0) {
          this.data.chats.unshift(...data.reverse())
          this.setData({
            chats: this.data.chats,
            scrollToMessage: `item-${data.length}`,
            scrollWithAnimation: false,
          })
        } else {
          that.setData({
            noBefore: true
          })
        }


      }
    },
    /**
     * 切换发送文本类型  云信
     */
    switchSendType() {
      this.setData({
        sendType: this.data.sendType == 0 ? 1 : 0,
        focusFlag: false,
        emojiFlag: false
      })
    },
    /**
     * 获取焦点
     */
    inputFocus(e) {
      this.setData({
        emojiFlag: false,
        focusFlag: true
      })
    },
    /**
     * 失去焦点
     */
    inputBlur() {
      this.setData({
        focusFlag: false
      })
    },
    /**
     * 文本框输入事件
     */
    inputChange(e) {
      this.setData({
        inputValue: e.detail.value
      })
    },
    /**
     * 键盘单击发送，发送文本
     */
    inputSend(e) {
      this.onConfirmSendText(e);
      // this.sendRequest(e.detail.value)
    },
    /**
     * 微信按钮长按，有bug，有时候不触发
     */
    voiceBtnLongTap(e) {
      let self = this
      self.setData({
        isLongPress: true
      })
      wx.getSetting({
        success: (res) => {
          let recordAuth = res.authSetting['scope.record']
          if (recordAuth == false) { //已申请过授权，但是用户拒绝
            wx.openSetting({
              success: function (res) {
                let recordAuth = res.authSetting['scope.record']
                if (recordAuth == true) {
                  showToast('success', '授权成功')
                } else {
                  showToast('text', '请授权录音')
                }
                self.setData({
                  isLongPress: false
                })
              }
            })
          } else if (recordAuth == true) { // 用户已经同意授权
            self.startRecord()
          } else { // 第一次进来，未发起授权
            wx.authorize({
              scope: 'scope.record',
              success: () => { //授权成功
                showToast('success', '授权成功')
              }
            })
          }
        },
        fail: function () {
          showToast('error', '鉴权失败，请重试')
        }
      })
    },
    /**
     * 手动模拟按钮长按，
     */
    longPressStart() {
      let self = this
      self.setData({
        recordClicked: true
      })
      setTimeout(() => {
        if (self.data.recordClicked == true) {
          self.executeRecord()
        }
      }, 350)
    },
    /**
     * 语音按钮长按结束
     */
    longPressEnd() {
      this.setData({
        recordClicked: false
      })
      // 第一次授权，
      if (!this.data.recorderManager) {
        this.setData({
          isLongPress: false
        })
        return
      }
      if (this.data.isLongPress === true) {
        this.setData({
          isLongPress: false
        })
        wx.hideToast()
        this.data.recorderManager.stop()
      }
    },
    /**
     * 执行录音逻辑
     */
    executeRecord() {
      let self = this
      self.setData({
        isLongPress: true
      })
      wx.getSetting({
        success: (res) => {
          let recordAuth = res.authSetting['scope.record']
          if (recordAuth == false) { //已申请过授权，但是用户拒绝
            wx.openSetting({
              success: function (res) {
                let recordAuth = res.authSetting['scope.record']
                if (recordAuth == true) {
                  showToast('success', '授权成功')
                } else {
                  showToast('text', '请授权录音')
                }
                self.setData({
                  isLongPress: false
                })
              }
            })
          } else if (recordAuth == true) { // 用户已经同意授权
            self.startRecord()
          } else { // 第一次进来，未发起授权
            wx.authorize({
              scope: 'scope.record',
              success: () => { //授权成功
                showToast('success', '授权成功')
              }
            })
          }
        },
        fail: function () {
          showToast('error', '鉴权失败，请重试')
        }
      })
    },
    /**
     * 开始录音
     */
    startRecord() {
      let self = this
      showToast('text', '开始录音', {
        duration: 60000
      })
      const recorderManager = self.data.recorderManager || wx.getRecorderManager()
      const options = {
        duration: 60 * 1000,
        format: 'mp3'
      }
      recorderManager.start(options)
      self.setData({
        recorderManager
      })
      recorderManager.onStop((res) => {
        if (res.duration < 1000) {
          showToast('text', '录音时间太短')
        } else {
          self.sendAudioMsg(res)
        }
      })
    },
    sendAudioMsg(res) {
      var time = new Date();
      var timeTS = Date.now();
      const audioName = timeTS + ".mp3";
      const audioNames = res.tempFilePath;
      console.log('audioName', audioName)
      console.log('audioNames', audioNames)
      const {
        envId,
        collection
      } = that.properties
      const doc = {
        _id: `${Math.random()}_${timeTS}`,
        groupId: that.data.groupId,
        avatar: that.data.userInfo.avatarUrl,
        nickName: that.data.userInfo.nickName,
        msgType: 'audio',
        duration: res.duration,
        sendTime: time,
        sendTimeTS: timeTS, // fallback
      }

      this.setData({
        chats: [
          ...that.data.chats,
          {
            ...doc,
            _openid: that.data.openId,
            tempFilePath: audioNames,
            duration: res.duration,
            writeStatus: 0,
          },
        ]
      })
      this.scrollToBottom(true)

      const uploadTask = wx.cloud.uploadFile({
        cloudPath: `${this.data.openId}/${Math.random()}_${timeTS}.${audioNames.match(/\.(\w+)$/)[1]}`,
        filePath: audioNames,
        config: {
          env: envId,
        },
        success: res => {
          this.try(async () => {
            await this.db.collection(collection).add({
                data: {
                  ...doc,
                  audioFileID: res.fileID,

                },
              })
              .then(res => {
                this.updateSysMsg('[语音消息]', time, timeTS);
              })
          }, '发送语音失败')
        },
        fail: e => {
          this.showError('发送语音失败', e)
        },
      })

      uploadTask.onProgressUpdate(({
        progress
      }) => {
        this.setData({
          chats: this.data.chats.map(chat => {
            if (chat._id === doc._id) {
              return {
                ...chat,
                writeStatus: progress,
              }
            } else return chat
          })
        })
      })
    },
    playAudio(e) {
      console.log('playAudio', e.target.dataset.fileid)
      if (that.innerAudioContext == null) {
        that.innerAudioContext = wx.createInnerAudioContext();
      }
      that.innerAudioContext.src = e.target.dataset.fileid;
      that.innerAudioContext.play()
    },
    clickAudio() {
      if (that.data.isAudio) {
        that.setData({
          isAudio: false
        })
      } else {
        that.setData({
          isAudio: true
        })
      }
    },
    audioCreate() {
      if (that.innerAudioContext == null) {
        that.innerAudioContext = wx.createInnerAudioContext();
      }
      if (that.recorderManager == null) {
        that.recorderManager = wx.getRecorderManager();
        that.options = {
          duration: 60000,
          format: 'mp3'
        }
      }
      that.recorderManager.onStart(res => {
        console.log('onStart')
      })
      that.recorderManager.onStop(res => {
        console.log('onStop', res.tempFilePath)
        var time = new Date();
        var timeTS = Date.now();
        const audioName = timeTS + ".mp3";
        const audioNames = res.tempFilePath;
        console.log('audioName', audioName)
        console.log('audioNames', audioNames)
        const {
          envId,
          collection
        } = that.properties
        const doc = {
          _id: `${Math.random()}_${timeTS}`,
          groupId: that.data.groupId,
          avatar: that.data.userInfo.avatarUrl,
          nickName: that.data.userInfo.nickName,
          msgType: 'audio',
          duration: res.duration,
          sendTime: time,
          sendTimeTS: timeTS, // fallback
        }

        this.setData({
          chats: [
            ...that.data.chats,
            {
              ...doc,
              _openid: that.data.openId,
              tempFilePath: audioNames,
              duration: res.duration,
              writeStatus: 0,
            },
          ]
        })
        this.scrollToBottom(true)

        const uploadTask = wx.cloud.uploadFile({
          cloudPath: `${this.data.openId}/${Math.random()}_${timeTS}.${audioNames.match(/\.(\w+)$/)[1]}`,
          filePath: audioNames,
          config: {
            env: envId,
          },
          success: res => {
            this.try(async () => {
              await this.db.collection(collection).add({
                  data: {
                    ...doc,
                    audioFileID: res.fileID,

                  },
                })
                .then(res => {
                  this.updateSysMsg('[语音消息]', time, timeTS);
                })
            }, '发送语音失败')
          },
          fail: e => {
            this.showError('发送语音失败', e)
          },
        })

        uploadTask.onProgressUpdate(({
          progress
        }) => {
          this.setData({
            chats: this.data.chats.map(chat => {
              if (chat._id === doc._id) {
                return {
                  ...chat,
                  writeStatus: progress,
                }
              } else return chat
            })
          })
        })
      })
    },
    audioStart() {
      that.audioCreate();
      console.log('audioStart')
      console.log('audioStart11111', that.recorderManager)
      if (that.recorderManager == null) {
        that.recorderManager = wx.getRecorderManager();
        that.options = {
          duration: 60000
        }
      }
      console.log('audioStart2222', that.recorderManager)
      // that.recorderManager.startRecord();
      // that.recorderManager.start()
      that.recorderManager.start(that.options)
      console.log('audioStart2')
    },
    audioStop() {
      console.log('audioStop')
      that.recorderManager.stop();

      console.log('audioStop2')
    },
    audioPlay() {
      console.log('audioPlay')
      this.innerAudioContext.src = value;
      this.innerAudioContext.play();
    },

    async try (fn, title) {
      try {
        await fn()
      } catch (e) {
        this.showError(title, e)
      }
    },

    showError(title, content, confirmText, confirmCallback) {
      console.error(title, content)
      wx.showModal({
        title,
        content: content.toString(),
        showCancel: confirmText ? true : false,
        confirmText,
        success: res => {
          res.confirm && confirmCallback()
        },
      })
    },

  },

  ready() {
    global.chatroom = this
    this.initRoom()
    this.fatalRebuildCount = 0
  },


  /**
   * 更新未读数
   */
  updateUnread() {
    db.collection('unread_count')
      .where({
        type: 1,
        groupId: this.data.groupId,
        userId: _.neq(this.data.openId)
      })
      .update({
        data: {
          count: _.inc(1)
        }
      })
      .then(res => {
        console.log('update msg', res)
        if (res.stats.updated == 1) {
          // 如果更新成功
        } else {
          // 更新不成功
          this.addUnread()
        }
      })
  },
  /**
   * 添加未读数
   */
  addUnread() {
    db.collection('unread_count')
      .add({
        data: {
          type: 1,
          groupId: this.data.groupId,
          userId: this.data.userId,
          count: 1
        }
      })
      .then(res => {
        console.log('add msg success', res)
      })
  },
})