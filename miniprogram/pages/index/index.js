//index.js
const app = getApp()
const common = require('../../utils/common.js')
Page({
  data: {
    list: [],
    display: [],
    extraClasses: ''
  },

  onLoad: function() {
    wx.stopPullDownRefresh();
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        // env 参数说明：
        //   env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
        //   此处请填入环境 ID, 环境 ID 可打开云控制台查看
        //   如不填则使用默认环境（第一个创建的环境）
        env: 'home-2gkxjfu87d968e84',
        traceUser: true,
      })
    }

    if (Object.keys(app.globalData.access).length === 0) {
      common.refreshAccessToken().then( res => {
        app.globalData.access = res;
      })
    }
    wx.cloud.callFunction({
      name: 'fetchArticles',
      data: {},
      success: res => {
        let arts = [];
        console.log(res.result.data.length);
        res.result.data.forEach(item => {
          if (item.thumb_url) {
            arts.push(item);
          }
        });
        this.setData({
          'list': arts
        });
        this.setData({
          'display': common.shuffle(arts)
        }) 
        console.log(this.data)
      },
      fail: err => {
        console.log(err)
      }
    })
    
    this.setData({
      extraClasses: 'show'
    })
   },

   bindViewTap: function(e) {
    let link = e.currentTarget.dataset.id;
    encodeURIComponent(this.data.display[link].url)
    console.log(this.data.display[link].url)
     wx.navigateTo({
       url: '../webview/webview?source=' + encodeURIComponent(this.data.display[link].url), 
     })
   },

   onPullDownRefresh: function() {
     this.onLoad();
   }
});
