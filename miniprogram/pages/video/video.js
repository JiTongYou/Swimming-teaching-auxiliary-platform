// pages/video/video.js
const DB=wx.cloud.database().collection("videos");
const _ = DB.command
var that;
//let videoList=[]
Page({
  /**
   * 页面的初始数据
   */
  data: {
    videoList:[],//视频列表数据
   // videoCategory:[], //视频分类
    favorites:[],
    navId:'0',//导航标识
    vidId:'',
    isTriggered: false,
    showCategory:false,
    toCategory:1,
  },

  //路由跳转至视频页面
  toVideo(event){
    let video=event.currentTarget.dataset.video;
    // console.log(event.currentTarget.dataset.video)
    wx.navigateTo({
      url:'/pages/videoPage/videoPage?vidId=' + video._id
    })
  },

  // toCategory(event){
  //   let category=event.currentTarget.dataset.video.vidCategory;
  //   console.log(category);
  // },


  // //获取视频列表
  // async getVideoList(navId){
  //   if(!navId){
  //     return;
  //   }
  //   let videoListData=await request("", {id:navId});
  //   wx.hideLoading();
  //   let index=0;
  //   let videoList=videoListData.datas.map(item=>{
  //     item.id=index++;
  //     return item;
  //   })
  //   this.setData({
  //     videoList,
  //     isTriggered: false
  //   })
  // },

  //切换导航回调
  changeNav(event){
    let navId=event.currentTarget.id;
    this.setData({
      navId:navId*1,
      videoList:[]
    })
   // wx.showLoading({
     // title: '加载中',
    //})
    this.getVideoList(this.data.navId);
  },

  //点击播放/继续播放的回调
  handlePlay(event){
    let videoContext=wx.createVideoContext();
   // this.videoContext !==vid && this.videoContext && this.videoContext.stop();
    //this.vid=vid;   
    this.setData({
      videoId:vid
    })
    this.videoContext=wx.createVideoContext(vid);
    let {videoUpdateTime}=this.data;
    let videoItem=videoUpdateTime.find(item => item.vid === vid);
    if(videoItem){
      this.videoContext.seek(videoItem.currentTime);
    }
    this.videoContext.play();
  },

  //控制播放暂停的功能函数
  videoControl(isPlay){
     if(isPlay){
       let backgroundAudioManger=wx.getBackgroundAudioManager();
       let musicLinkData=await_request('/song/detail',{ids: videoId})
       backgroundAudioManger
     }
  },

  //视频播放结束的回调
  handleEneded(event){
     let {videoUpdateTime}=this.data;
     videoUpdateTime.splice(videoUpdateTime.findIndex(item => item.vid === event.currentTarget),1);
     this.setData({
       videoUpdateTime
     })
  },

  //监听视频播放进度的回调
  handleTimeUpdate(event){
    let videoTimeObj={vid:event.currentTarget.id,currentTime:event.detail.currentTime};
    let {videoUpdateTime} = this.data;
    if(videoItem){
      videoItem.currentTime = event.detail.currentTime;
    }
    videoUpdateTime.push(videoTimeobj);
    this.setData({videoUpdateTime});
  },

  //自定义下拉刷新的回调
  handleRefresher(){
    this.getVideoList(this.data.navId)
  },

  //自定义上拉加载的回调
  handleTolower(){
    let newVideoList=[];
    let videoList=this.data.videoList;
    this.setData({
      data:{
        videoList
      }
    })  
  },

  //跳转至分类页面
  getCategory(){
    that.setData({
       showCategory:true,
    }) 
  },

  concealShowCategory(){
    that.setData({
      showCategory:false,
    }) 
  },

 toAll(){
     that.setData({
       toCategory:1,
       showCategory:false,
     })
 },

 toBreast(){
  that.setData({
    toCategory:2,
    showCategory:false,
  })
},

toFree(){
  that.setData({
    toCategory:3,
    showCategory:false,
  })
},

toBack(){
  that.setData({
    toCategory:4,
    showCategory:false,
  })
},

toButter(){
  that.setData({
    toCategory:5,
    showCategory:false,
  })
},

toWater(){
  that.setData({
    toCategory:6,
    showCategory:false,
  })
},

toBody(){
  that.setData({
    toCategory:7,
    showCategory:false,
  })
},
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    // for(var i=0;i<6;i++){
    //   that.data.videoCategory[i]={i};
    // }

    wx.cloud.callFunction({
      name: "videoGetData",
    }).then(res => {
      var lengths = res.result.data.length; 
    //  for (var i = 0; i < lengths; i++) {
        //let temp_str='that.data.videoCategory[res.result.data['+i+'].vidCategory-2]';
        that.setData({
           //[`that.data.videoCategory[res.result.data[${i}].vidCategory-2]`]:res.result.data[i],
         //  [temp_str]:res.result.data[i],
           videoList:res.result.data,
        })
      //}
   // console.log(res.result.data[lengths-1])
    //  console.log(that.data.videoCategory[1])
    })
   

    // for(var i=1;i<8;i++){ 
    //   var videoData={};
    //   videoData.title="video-"+i;
    //   videoData.ranking="videoRanking-"+i;
    //   videoData.vidId="as";
    //  // var cover = [];
    //   that.data.videoList.push(videoData);
    // }     
    // console.log('a')
    // that.setData({
    //   videoList:that.data.videoList
    // })
   
    //  wx.cloud.callFunction({
    //    name:'videoUpdateData',
    //    data:{
    //      videoList:{}
    //    }
    //  }).then(res=>{ 
    //    console.log(res)
    //   })
   
 },

  addVideo(){
    DB.add({
      data:{
          
            //  title:'test6',
            //  ranking:'ssss',
            // cover:'cloud://cloud1-7gh3ock7a08defbd.636c-cloud1-7gh3ock7a08defbd-1306690875/cover/DSC_7627.JPG',
            // vidUrl:'cloud://cloud1-7gh3ock7a08defbd.636c-cloud1-7gh3ock7a08defbd-1306690875/video/DSC_7511.MOV',
            // collect:0,
            // likes:0,
            //  vidCategory:7,
            //  comments:[],
            //  introduction:"g",
            //  vidUpdateTime:new Date(),
          

          
            // title:'test2',
            // ranking:'sssss',
            // cover:'cloud://cloud1-7gh3ock7a08defbd.636c-cloud1-7gh3ock7a08defbd-1306690875/cover/DSC_7654.JPG',
            // vidUrl:'cloud://cloud1-7gh3ock7a08defbd.636c-cloud1-7gh3ock7a08defbd-1306690875/video/DSC_7520.MOV',
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