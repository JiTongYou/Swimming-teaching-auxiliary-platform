// pages/vid/vid.js
const DB=wx.cloud.database().collection("vids");
const _ = DB.command
var that;
//let vidList=[]
Page({
  /**
   * 页面的初始数据
   */
  data: {
    vidList:[],//视频列表数据
   // vidCategory:[], //视频分类
   // favorites:[],
    navId:'0',//导航标识
    vidId:'',
    isTriggered: false,
    showCategory:false,
    toCategory:1,
  },

  //路由跳转至视频页面
  tovid(event){
    let vid=event.currentTarget.dataset.vid;
    // console.log(event.currentTarget.dataset.vid)
    wx.navigateTo({
      url:'/pages/vidPage/vidPage?vidId=' + vid._id
    })
  },

  // toCategory(event){
  //   let category=event.currentTarget.dataset.vid.vidCategory;
  //   console.log(category);
  // },

  //获取视频列表
  async getvidList(num = 8, alreadyNum = 0){
    wx.cloud.callFunction({
      name: "vidGetData",
      data: {
        num: num,
        alreadyNum: alreadyNum
      }
    }).then(res => {
     if (res.result.data.length == "0"){}else {
       var oldvidItem = that.data.vidList;
       var newvidItem = oldvidItem.concat(res.result.data);
        this.setData({
         vidList:newvidItem,
       })
    }
    })

    // if(!navId){
    //   return;
    // }
    // let vidListData=await request("", {id:navId});
    // wx.hideLoading();
    // let index=0;
    // let vidList=vidListData.datas.map(item=>{
    //   item.id=index++;
    //   return item;
    // })
    // this.setData({
    //   vidList,
    //   isTriggered: false
    // })
   },
 
  //切换导航回调
  changeNav(event){
    let navId=event.currentTarget.id;
    this.setData({
      navId:navId*1,
      vidList:[]
    })
   // wx.showLoading({
     // title: '加载中',
    //})
    this.getvidList();
  },

  // //点击播放/继续播放的回调
  // handlePlay(event){
  //   let vidContext=wx.createvidContext();
  //  // this.vidContext !==vid && this.vidContext && this.vidContext.stop();
  //   //this.vid=vid;   
  //   this.setData({
  //     vidId:vid
  //   })
  //   this.vidContext=wx.createvidContext(vid);
  //   let {vidUpdateTime}=this.data;
  //   let vidItem=vidUpdateTime.find(item => item.vid === vid);
  //   if(vidItem){
  //     this.vidContext.seek(vidItem.currentTime);
  //   }
  //   this.vidContext.play();
  // },

  // //控制播放暂停的功能函数
  // vidControl(isPlay){
  //    if(isPlay){
  //      let backgroundAudioManger=wx.getBackgroundAudioManager();
  //      let musicLinkData=await_request('/song/detail',{ids: vidId})
  //      backgroundAudioManger
  //    }
  // },

  // //视频播放结束的回调
  // handleEneded(event){
  //    let {vidUpdateTime}=this.data;
  //    vidUpdateTime.splice(vidUpdateTime.findIndex(item => item.vid === event.currentTarget),1);
  //    this.setData({
  //      vidUpdateTime
  //    })
  // },

  // //监听视频播放进度的回调
  // handleTimeUpdate(event){
  //   let vidTimeObj={vid:event.currentTarget.id,currentTime:event.detail.currentTime};
  //   let {vidUpdateTime} = this.data;
  //   if(vidItem){
  //     vidItem.currentTime = event.detail.currentTime;
  //   }
  //   vidUpdateTime.push(vidTimeobj);
  //   this.setData({vidUpdateTime});
  // },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    console.log("Asd")
    this.setData({
      vidList:[],
    })
    this.getvidList()
    wx.stopPullDownRefresh()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.data.navId == "0") {
      var alreadyNum = this.data.vidList.length
      this.getvidList(4, alreadyNum)
    } 
  },


//   //跳转至分类页面
//   getCategory(){
//     that.setData({
//        showCategory:true,
//     }) 
//   },

//   concealShowCategory(){
//     that.setData({
//       showCategory:false,
//     }) 
//   },

//  toAll(){
//      that.setData({
//        toCategory:1,
//        showCategory:false,
//      })
//  },

//  toBreast(){
//   that.setData({
//     toCategory:2,
//     showCategory:false,
//   })
// },

// toFree(){
//   that.setData({
//     toCategory:3,
//     showCategory:false,
//   })
// },

// toBack(){
//   that.setData({
//     toCategory:4,
//     showCategory:false,
//   })
// },

// toButter(){
//   that.setData({
//     toCategory:5,
//     showCategory:false,
//   })
// },

// toWater(){
//   that.setData({
//     toCategory:6,
//     showCategory:false,
//   })
// },

// toBody(){
//   that.setData({
//     toCategory:7,
//     showCategory:false,
//   })
// },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    that.getvidList();
   
 },

  addvid(){
    DB.add({
      data:{
          
            //  title:'test10',
            //  ranking:'ssss',
            // cover:'cloud://cloud1-7gh3ock7a08defbd.636c-cloud1-7gh3ock7a08defbd-1306690875/cover/DSC_7627.JPG',
            // vidUrl:'cloud://cloud1-7gh3ock7a08defbd.636c-cloud1-7gh3ock7a08defbd-1306690875/vid/DSC_7511.MOV',
            // collect:0,
            // likes:0,
            //  vidCategory:7,
            //  comments:[],
            //  introduction:"h",
            //  vidUpdateTime:new Date(),
          

          
            // title:'test2',
            // ranking:'sssss',
            // cover:'cloud://cloud1-7gh3ock7a08defbd.636c-cloud1-7gh3ock7a08defbd-1306690875/cover/DSC_7654.JPG',
            // vidUrl:'cloud://cloud1-7gh3ock7a08defbd.636c-cloud1-7gh3ock7a08defbd-1306690875/vid/DSC_7520.MOV',
            // vidCategory:1,
            // vidUpdateTime:new Date(),
      }
    }) 
  },

  /**
   * 生命周期函数--监听页面初 次渲染完成
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
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})