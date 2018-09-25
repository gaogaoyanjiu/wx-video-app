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
  doRegist:function(e){
    var formObject =e.detail.value;
    var username=formObject.username;
    var password=formObject.password;
    if (username.length == 0 || password.length == 0){
      wx.showToast({
        title: '用户名和密码不能为空！！！',
        icon: 'none',
        duration:3000
      })
    }else{
      var serverUrl = app.serverUrl;  
      wx.request({
        url: serverUrl+'/regist',
        method:'POST',
        data:{
            username:username,
            password:password
        },
        header: {
          'content-type': 'application/json' //默认值
        },
        success:function(res){
            console.log(res.data)
            var status=res.data.status;

            if(status==200){
              wx.showToast({
                title:'用户注册成功！！！',
                icon: 'none',
                duration: 3000
              });

              app.userInfo=res.data.data;

            }else if(status==500){
              wx.showToast({
                title: res.data.msg,
                icon: 'none',
                duration: 3000
              })

            }


        }
      })

    }

    console.log(username+':'+password)
  },
   goLoginPage:function() {
    wx.redirectTo({
      url: '../userLogin/login',
    })
  }
})