// pages/video/video.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    videoList:[],//视频列表数据
    navId:'0',//导航标识
    vidId:'',
    videoUpdateTime:[],
    isTriggered: false,
  },

  //路由跳转至视频页面
  toVideo(event){
    let video=event.currentTarget.dataset.video
    wx.navigateTo({
      url:'/pages/videoPage/videoPage'//?videoId=' + video.id  传参部分等获得数据再处理
    })
  },

  //获取视频列表
  async getVideoList(navId){
    if(!navId){
      return;
    }
    let videoListData=await request("", {id:navId});
    wx.hideLoading();
    let index=0;
    let videoList=videoListData.datas.map(item=>{
      item.id=index++;
      return item;
    })
    this.setData({
      videoList,
      isTriggered: false
    })
  },

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
      videoList
    })
  },

  //跳转至分类页面
  getCategory(){
     wx.navigateTo({
       url:'/pages/category/category'
     })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
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