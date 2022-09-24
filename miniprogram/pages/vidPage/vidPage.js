// miniprogram/pages/vidPage/vidPage.js
const DB=wx.cloud.database().collection("vids");
const _ = DB.command
var that;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo:[],
     navId:"0" ,
     vidId:"",
     vidUrl:'',
     comments:[],
     introduction:"",
     ifCollected:0,
     ifLiked:0,
     haveCollected:[],
     haveLiked:[],
  },

  changeNav(event){
    let navId = event.currentTarget.id;
    this.setData({
      navId: navId*1
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */

  onLoad: function (options) {
    that = this;
    that.data.vidId=options;
    //获取openid
    wx.getStorage({
      key:"userInfo",
      success(res){
        that.setData({
          userInfo:JSON.parse(res.data)
        })
      }
    })

    wx.getStorage({
      key: "homeCurrentTime",
      success(res){
        console.log("获取缓存成功",res);   
        //that.vidContext.seek(res.data)
      }
    })

    DB.where({
      _id: that.data.vidId.vidId
    }).get().then(res=>{
      if(res.data.length>0) {
          that.setData({
            vidUrl:res.data[0].vidUrl,
            comments:res.data[0].comments,
            introduction:res.data[0].introduction,
            haveLiked:res.data[0].likes,
            haveCollected:res.data[0].collect,
          }) 
        }  
        else{
          console.log("fail")
        }

      for(var i=0;i<that.data.haveCollected.length;i++){
        if(that.data.haveCollected[i]==that.data.userInfo._openid){
           that.setData({
              ifCollected:1,
           })
           console.log("Sdadasddadad")
        }
      }

      for(var i=0;i<that.data.haveLiked.length;i++){
        if(that.data.haveLiked[i]==that.data.userInfo._openid){
           that.setData({
              ifLiked:1,
           })
        }
      }
    })  
  },

  async clickCollect(e){
   // console.log(that.data.userInfo._openid)
    var tmp_str='ifCollected';
    if(that.data.ifCollected == 1){
       console.log("取消")
      that.setData({
        [tmp_str]:0
      })
      wx.cloud.callFunction({
        name:"vidAddCollect",
        data:{
          _openid: that.data.userInfo._openid,   
          _id:that.data.vidId.vidId,
         //_id:that.data.squareItem[index]._id,
        type:0
        },
      }).then(res=>{
        console.log(res)
      })
     // console.log(_openid)
    }
    else{
      console.log("收藏" ,that.data.userInfo._openid)
      console.log("sad",that.data.vidId.vidId)
      that.setData({
        [tmp_str]:1
      })
      wx.cloud.callFunction({
        name:"vidAddCollect",
        data:{
          _openid:that.data.userInfo._openid,
          _id:that.data.vidId.vidId,
         //_id:this.data.squareItem[index]._id,
          type:1
        },
        // success(res){
        //     console.log("yep")
        // }
      })
    }
  },

  async clickLike(e){
    // console.log(that.data.userInfo._openid)
     var tmp_str='ifLiked';
     if(that.data.ifLiked == 1){
        console.log("取消")
       that.setData({
         [tmp_str]:0
       })
       wx.cloud.callFunction({
         name:"vidAddLike",
         data:{
           _openid: that.data.userInfo._openid,   
           _id:that.data.vidId.vidId,
          //_id:that.data.squareItem[index]._id,
         type:0
         },
       }).then(res=>{
         console.log(res)
       })
      // console.log(_openid)
     }
     else{
     //  console.log("喜欢" ,that.data.userInfo._openid)
      // console.log("sad",that.data.vidId.vidId)
       that.setData({
         [tmp_str]:1
       })
       wx.cloud.callFunction({
         name:"vidAddLike",
         data:{
           _openid:that.data.userInfo._openid,
           _id:that.data.vidId.vidId,
          //_id:this.data.squareItem[index]._id,
           type:1
         },
        //  success(res){
        //      console.log("yep")
        //  }
       })
     }
   },

  //  handleTimeUpdate(event){
  //   var detail = event.detail;
  //   wx.setStorage({
  //    key:"homeCurrentTime",
  //    data:detail.currentTime,
  //    success(res){
  //      console.log("保存成功")
  //    }
  //    })
  //  },

   handlePlay(){
     console.log(that.data.vidId.vidId)
       if(this.data.userInfo.history.length<2){
        wx.cloud.callFunction({
          name:"addHistory",
          data:{
            _openid: that.data.userInfo._openid,   
            _id:that.data.vidId.vidId,
          type:1
          },
        }).then(res=>{
            console.log(res)
        })
       }
      else{
       wx.cloud.callFunction({
         name:"addHistory",
         data:{
           _openid:that.data.userInfo._openid,
           _id:that.data.vidId.vidId,
           type:0
         },
       }).then(res=>{
        console.log(res.result)
       })
     }
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