const app = getApp()

Page({
  data: {
    faceUrl: "../resource/images/noneface.png",
    isMe:true

  },
  onLoad: function () {

    var me= this;

    var user = app.userInfo;

    var serverUrl = app.serverUrl;

    wx.showLoading({
      title: '请等待...',
    });
    // 调用后端
    wx.request({
      url: serverUrl + '/user/query?userId='+user.id,
      method: "POST",
      data: {
       
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        console.log(res.data);
        wx.hideLoading();
        if (res.data.status == 200) {
        
         var userInfo = res.data.data;
        
          var faceUrl ="../resource/images/noneface.png";

          if (userInfo.faceImage != null && userInfo.faceImage != '' && userInfo.faceImage!=undefined){
            faceUrl = serverUrl + userInfo.faceImage;
          }

         me.setData({
           faceUrl: faceUrl,
           nickname: userInfo.nickname,
           fansCounts: userInfo.fansCounts,
           followCounts: userInfo.followCounts,
           receiveLikeCounts: userInfo.receiveLikeCounts

         })
        }
      }
    })

  },
  // 注销  
  logout: function () {
    var user =app.userInfo;
    console.log(user)
      var serverUrl = app.serverUrl;
      wx.showLoading({
        title: '请等待...',
      });
      // 调用后端
      wx.request({
        url: serverUrl + '/logout?userId='+user.id,
        method: "POST",
        header: {
          'content-type': 'application/json' // 默认值
        },
        success: function (res) {
          wx.hideLoading();
          if (res.data.status == 200) {
            // 登录成功跳转 
            wx.showToast({
              title: '注销成功',
              icon: 'success',
              duration: 2000
            });

            app.userInfo = null;//清空用户信息

            wx.redirectTo({
              url: '../userLogin/login',
            })

          }
        }     
      });
  },
  //选择头像
  changeFace :function(){
    var me=this;
    wx.chooseImage({
      count: 1,//默认是 9
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        // tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths
        console.log(tempFilePaths)

        wx.showLoading({
          title: '上传中...',
        })
        var serverUrl=app.serverUrl;
        wx.uploadFile({
          url: serverUrl + '/user/uploadFace?userId=' + app.userInfo.id, 
          filePath: tempFilePaths[0],
          header: {
            'content-type': 'application/json' // 默认值
          },
          name: 'file',
          // formData: {
          //   'user': 'test'
          // },
          success(res) {
            var data = JSON.parse(res.data);//返回的字符串，而不是json，需要转换json
            console.log(data)
            wx.hideLoading();
            if (data.status == 200) {
                wx.showToast({
                  title: '上传成功！！！',
                  icon:'success'
                });

                var imageUrl=data.data;
                me.setData({
                  faceUrl:serverUrl + imageUrl
                })
            } else if (data.status == 500) {
                wx.showToast({
                  title: data.msg
                });
          }
        }
      });
    }
  });
 }

});