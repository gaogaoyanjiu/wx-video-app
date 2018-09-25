const app = getApp()

Page({
  data: {

    imgUrls: [
      'http://ykimg.alicdn.com/product/image/2018-09-16/34771a98eb61a5e662ea22e71a56853b.jpg',
      'http://ykimg.alicdn.com/product/image/2018-09-15/ec824da32b1e8fe623bf484240ed3cc7.jpg',
      'http://ykimg.alicdn.com/product/image/2018-09-15/5c95f634fadd6136a2f8b288b9c65e51.jpg',
      'http://ykimg.alicdn.com/product/image/2018-09-16/b37afafb46961e4361845dd9fb48b473.jpg',
      'http://ykimg.alicdn.com/product/image/2018-09-05/a0fc1a79223ec8d6cb0cd76a176ebc44.jpg'
    ],
    indicatorDots: true,
    autoplay: true,
    interval: 4000,
    duration: 2000

  },

  // onLoad: function (params) {
  //   var me = this;
  //   var redirectUrl = params.redirectUrl;
  //   // debugger;
  //   if (redirectUrl != null && redirectUrl != undefined && redirectUrl != '') {
  //     redirectUrl = redirectUrl.replace(/#/g, "?");
  //     redirectUrl = redirectUrl.replace(/@/g, "=");

  //     me.redirectUrl = redirectUrl;
  //   }
  // },

  // 登录  
  doLogin: function (e) {
    var me = this;
    var formObject = e.detail.value;
    var username = formObject.username;
    var password = formObject.password;
    // 简单验证
    if (username.length == 0 || password.length == 0) {
      wx.showToast({
        title: '用户名或密码不能为空',
        icon: 'none',
        duration: 3000
      })
    } else {
      var serverUrl = app.serverUrl;
      wx.showLoading({
        title: '请等待...',
      });
      // 调用后端
      wx.request({
        url: serverUrl + '/login',
        method: "POST",
        data: {
          username: username,
          password: password
        },
        header: {
          'content-type': 'application/json' // 默认值
        },
        success: function (res) {
          console.log(res.data);
          wx.hideLoading();
          if (res.data.status == 200) {
            // 登录成功跳转 
            wx.showToast({
              title: '登录成功',
              icon: 'success',
              duration: 2000
            });
            app.userInfo = res.data.data;
            app.setGlobalUserInfo(res.data.data);
            // 页面跳转
               wx.redirectTo({
                 url: '../mine/mine',
               })
          } else if (res.data.status == 500) {
            // 失败弹出框
            wx.showToast({
              title: res.data.msg,
              icon: 'none',
              duration: 3000
            })
          }
        }
      })
    }
  },

   goRegistPage:function() {
     wx.redirectTo({
       url: '../userRegist/regist',
     })
   }
})