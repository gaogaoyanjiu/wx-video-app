// pages/video/video.js
const app = getApp()


Page({

  /**
   * 页面的初始数据
   */
  data: {
   
    screenWidth: "350px",
    danmuList: [
      {
        text: '第 1s 出现的弹幕',
        color: '#ff0000',
        time: 1
      },
      {
        text: '第 3s 出现的弹幕',
        color: '#ff00ff',
        time: 3
      }]

  },
  onLoad: function (params) {
    var me = this;
    // var screenWidth = wx.getSystemInfoSync().screenWidth;
    // this.setData({
    //   screenWidth: screenWidth
    // });

    
  },
  bindplay:function(){
    console.log("播放")
  },
  bindpause: function () {
    console.log("暂停")
  }
})