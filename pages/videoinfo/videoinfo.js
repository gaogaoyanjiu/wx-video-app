// pages/video/video.js
const app = getApp()


Page({
  data: {
    cover: "cover",
    videoId: "",
    serverUrl: '',
    src: "",
    videoInfo: {},

    userLikeVideo: false,//收藏


    commentsPage: 1,
    commentsTotalPage: 1,
    commentsList: [],


    placeholder: "说点什么..."

  },
  videoCtx: {},
  onLoad: function (params) {
    var me = this;

    me.videoCtx = wx.createVideoContext("myVideo", me);//创建视频操作的上下文对象
    console.log(params.videoInfo)
    // 获取上一个页面传入的参数
    var videoInfo = JSON.parse(params.videoInfo);

    //获取视频参数
    var height = videoInfo.videoHeight;
    var width = videoInfo.videoWidth;
    var cover = "cover";
    if (width >= height) {
      cover = "";
    }

    var serverUrl = app.serverUrl;
    me.setData({
      videoId: videoInfo.id,
      src: app.serverUrl + videoInfo.videoPath,
      videoInfo: videoInfo,
      cover: cover,
      serverUrl: serverUrl
    });


    //
    var user = app.getGlobalUserInfo();
    var loginUserId = "";
    if (user != null && user != undefined && user != '') {
      loginUserId = user.id;
    }
    //查询发布者信息
    wx.request({
      url: serverUrl + '/user/queryPublisher?loginUserId=' + loginUserId + "&videoId=" + videoInfo.id + "&publishUserId=" + videoInfo.userId,
      method: "POST",
      success: function (res) {
        console.log(res.data);

        var publisher = res.data.data.publisher;
        var userLikeVideo = res.data.data.userLikeVideo;

        me.setData({
          serverUrl: serverUrl,
          publisher: publisher,
          userLikeVideo: userLikeVideo
        });
      }
    })

    me.getCommentsList(1);
  

  },

//视频操作的上下文对象的播放
  onShow: function () {
    var me = this;
    me.videoCtx.play();
  },
//视频操作的上下文对象的暫停
  onHide: function () {
    var me = this;
    me.videoCtx.pause();
  },

  showSearch:function(){
    var me=this;

    wx.navigateTo({
      url: '../searchVideo/searchVideo'
    })
  },

//显示发布者信息,只是页面跳转
  showPublisher: function () {
    var me = this;

    var user = app.getGlobalUserInfo();

    var videoInfo = me.data.videoInfo;
    var realUrl = '../mine/mine#publisherId@' + videoInfo.userId;

    if (user == null || user == undefined || user == '') {
      //没有登录，先跳转登录页面
      wx.navigateTo({
        url: '../userLogin/login?redirectUrl=' + realUrl,
      })
    } else {
       //已经登录，跳转到复用的个人主页，可以对发布者进行关注
      wx.navigateTo({
        url: '../mine/mine?publisherId=' + videoInfo.userId,
      })
    }

  },

  // commentsPage: 1,
  //   commentsTotalPage: 1,
  //   commentsList: []
   
   
   //获取所有评论
  getCommentsList: function (page) {
    var me = this;

    var videoId = me.data.videoInfo.id;

    wx.request({
      url: app.serverUrl + '/video/getVideoComments?videoId=' + videoId +
       "&page=" + page + "&pageSize=5",
      method: "POST",
      success: function (res) {
        console.log(res.data);

        var commentsList = res.data.data.rows;
        var newCommentsList = me.data.commentsList;

        me.setData({
          commentsList: newCommentsList.concat(commentsList),
          commentsPage: page,
          commentsTotalPage: res.data.data.total
        });
      }
    })
  },

  //跳转到视频列表页index
  showIndex: function () {
    wx.redirectTo({
      url: '../index/index',
    })
  },
//跳转到我的个人主页
  showMine: function () {
    var user = app.getGlobalUserInfo();

    if (user == null || user == undefined || user == '') {
    //未登录跳转 登录页面
      wx.navigateTo({
        url: '../userLogin/login',
      })
    } else {
      // 已经登录跳转到我的主页
      wx.navigateTo({
        url: '../mine/mine',
      })
    }
  },

//分享按钮功能
  shareMe: function () {
    var me = this;
    var user = app.getGlobalUserInfo();

    wx.showActionSheet({
      itemList: ['下载到本地', '举报用户', '分享到朋友圈', '分享到QQ空间', '分享到微博'],
      success: function (res) {
        console.log(res.tapIndex);
        if (res.tapIndex == 0) {
          // 下载
          wx.showLoading({
            title: '下载中...',
          })
          wx.downloadFile({
            url: app.serverUrl + me.data.videoInfo.videoPath,
            success: function (res) {
              // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
              if (res.statusCode === 200) {
                console.log(res.tempFilePath);

                wx.saveVideoToPhotosAlbum({
                  filePath: res.tempFilePath,
                  success: function (res) {
                    console.log(res.errMsg)
                    wx.hideLoading();
                  }
                })
              }
            }
          })
        } else if (res.tapIndex == 1) {
          // 举报
          var videoInfo = JSON.stringify(me.data.videoInfo);
          var realUrl = '../videoinfo/videoinfo#videoInfo@' + videoInfo;

          if (user == null || user == undefined || user == '') {
            wx.navigateTo({
              url: '../userLogin/login?redirectUrl=' + realUrl,
            })
          } else {
            var publishUserId = me.data.videoInfo.userId;
            var videoId = me.data.videoInfo.id;
            var currentUserId = user.id;
            wx.navigateTo({
              url: '../report/report?videoId=' + videoId + "&publishUserId=" + publishUserId
            })
          }
        } else {
          wx.showToast({
            title: '官方暂未开放...',
          })
        }
      }
    })
  },

  onShareAppMessage: function (res) {

    var me = this;
    var videoInfo = me.data.videoInfo;

    return {
      title: '短视频内容分析',
      path: "pages/videoinfo/videoinfo?videoInfo=" + JSON.stringify(videoInfo)
    }
  },



//点击收藏或者取消收藏
  likeVideoOrNot: function () {
    var me = this;
    var videoInfo = me.data.videoInfo;
    var user = app.getGlobalUserInfo();

    if (user == null || user == undefined || user == '') {
      //用户不存在，跳转到登录页面
      wx.navigateTo({
        url: '../userLogin/login',
      })
    } else {

      var userLikeVideo = me.data.userLikeVideo;
      var url = '/video/userLike?userId=' + user.id + '&videoId=' + videoInfo.id + '&videoCreaterId=' + videoInfo.userId;
      if (userLikeVideo) {
        url = '/video/userUnLike?userId=' + user.id + '&videoId=' + videoInfo.id + '&videoCreaterId=' + videoInfo.userId;
      }

      var serverUrl = app.serverUrl;
      wx.showLoading({
        title: '...',
      })
      wx.request({
        url: serverUrl + url,
        method: 'POST',
        header: {
          'content-type': 'application/json', // 默认值
          'headerUserId': user.id,
          'headerUserToken': user.userToken
        },
        success: function (res) {
          wx.hideLoading();
          me.setData({
            userLikeVideo: !userLikeVideo   //取反
          });
        }
      })


    }
  },
  leaveComment:function(){
    var me=this;
    me.setData({
      commentFocus:true
    })
  },
  //点我回复
  replyFocus: function (e) {
    var fatherCommentId = e.currentTarget.dataset.fathercommentid;
    var toUserId = e.currentTarget.dataset.touserid;
    var toNickname = e.currentTarget.dataset.tonickname;

    this.setData({
      placeholder: "回复  @" + toNickname,
      replyFatherCommentId: fatherCommentId,
      replyToUserId: toUserId,
      commentFocus: true
    });
  },
  //保存到服務器
  saveComment: function (e) {
    var me = this;
    var content = e.detail.value;

    // 获取评论回复的fatherCommentId和toUserId
    var fatherCommentId = e.currentTarget.dataset.replyfathercommentid;
    var toUserId = e.currentTarget.dataset.replytouserid;

    var user = app.getGlobalUserInfo();
    var videoInfo = JSON.stringify(me.data.videoInfo);
    var realUrl = '../videoinfo/videoinfo#videoInfo@' + videoInfo;

    if (user == null || user == undefined || user == '') {
      wx.navigateTo({
        url: '../userLogin/login?redirectUrl=' + realUrl,
      })
    } else {
      wx.showLoading({
        title: '请稍后...',
      })
      wx.request({
        url: app.serverUrl + '/video/saveComment?fatherCommentId=' + fatherCommentId + "&toUserId=" + toUserId,
        method: 'POST',
        header: {
          'content-type': 'application/json', // 默认值
          'headerUserId': user.id,
          'headerUserToken': user.userToken
        },
        data: {
          fromUserId: user.id,
          videoId: me.data.videoInfo.id,
          comment: content
        },
        success: function (res) {
          console.log(res.data)
          wx.hideLoading();
         //清除表单内容
          me.setData({
            contentValue: "",
            commentsList: []
          });

          me.getCommentsList(1);
        }
      })
    }
  },

  // commentsPage: 1,
  //   commentsTotalPage: 1,
  //   commentsList: []

//获取评论列表
  getCommentsList: function (page) {
    var me = this;

    var videoId = me.data.videoInfo.id;

    wx.request({
      url: app.serverUrl + '/video/getVideoComments?videoId=' + videoId + "&page=" + page + "&pageSize=5",
      method: "POST",
      success: function (res) {
        console.log(res.data);

        var commentsList = res.data.data.rows;
        var newCommentsList = me.data.commentsList;

        me.setData({
          commentsList: newCommentsList.concat(commentsList),
          commentsPage: page,
          commentsTotalPage: res.data.data.total
        });
      }
    })
  },

//上拉刷新
  onReachBottom: function () {
    var me = this;
    var currentPage = me.data.commentsPage;
    var totalPage = me.data.commentsTotalPage;
    if (currentPage === totalPage) {
      return;
    }
    var page = currentPage + 1;
    me.getCommentsList(page);
  },
  // @作者,给作者留言
  showPubform:function(){
    wx.showToast({
      title: '@作者,给作者留言,暂未开发,敬请期待...',
      icon:'none'
    })
  },

  // 给我点赞(参数自增1)
  zanMe:function(){
    wx.showToast({
      title: '给我点赞(参数自增1),暂未开发,敬请期待...',
      icon: 'none'
    })
  },
  // 我的关注
  showFollow: function () {
    wx.showToast({
      title: '我的关注,暂未开发,敬请期待...',
      icon: 'none'
    })
  },
})