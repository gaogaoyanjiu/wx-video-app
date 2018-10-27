//app.js
App({
 //serverUrl: "http://localhost:8081",
 serverUrl: "http://192.168.200.1:8081",
 //serverUrl: "http://192.168.43.188:8081",
 // serverUrl: "http://192.168.1.101:8081",
  
  userInfo: null,

  //设置本地缓存,供下次进入程序时不需登录
  setGlobalUserInfo: function(user) {
    wx.setStorageSync("userInfo", user);
  },
  //再次进入程序,获取本地缓存
  getGlobalUserInfo: function () {
    return wx.getStorageSync("userInfo");
  },

  reportReasonArray: [
    "色情低俗",
    "政治敏感",
    "涉嫌诈骗",
    "辱骂谩骂",
    "广告垃圾",
    "诱导分享",
    "引人不适",
    "过于暴力",
    "违法违纪",
    "其它原因"
  ]
})