
// get access key method
async function refreshAccessToken() {
  //const cloud = require('wx-server-sdk');
  // if (!wx.cloud) {
  //   console.error('请使用 2.2.3 或以上的基础库以使用云能力')
  // } else {
  //   wx.cloud.init({
  //     // env 参数说明：
  //     //   env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
  //     //   此处请填入环境 ID, 环境 ID 可打开云控制台查看
  //     //   如不填则使用默认环境（第一个创建的环境）
  //     env: 'home-2gkxjfu87d968e84',
  //     traceUser: true,
  //   });
  // }
  const db = wx.cloud.database();
  const previous = async() => {
    return new Promise((resolve, reject) => {
      db.collection('access_token').doc('a8831daa5fda92920006174f38470fcc').get({
        success: res => resolve(res),
        fail: err => reject(err)
      })
    })
  }

  let old_access_json = await previous();
  if (old_access_json.data.accessToken !== "") {
    let current_time = Date.now();
    if (current_time <= (old_access_json.data.createTime + old_access_json.data.expiresIn*1000)) {
      return old_access_json.data.accessToken;
    }
  }
    const rp = async () => {
      return new Promise((resolve, reject) => {
        wx.request({
          url: 'https://service-aut7yof4-1304518463.gz.apigw.tencentcs.com/release/',
          method: 'GET',
          data: {
          },
          header: {
            'content-type': 'application/json' // 默认值
            },
          success: res => resolve(res),
          fail: res => reject(res)
        });
      });
    }
  
    const res = await rp();
   // console.log(res)
    db.collection('access_token').doc('a8831daa5fda92920006174f38470fcc').update({
      data: {
        accessToken: res.data.access_token,
        createTime: Date.now(),
        expiresIn: res.data.expires_in
      }
    });
    return res.data.access_token;
  
}

// async function fetchArticles(access) {
//   wx.request({
//     url: 'https://api.weixin.qq.com/cgi-bin/material/batchget_material?access_token=' + access,
//     data: {
//       type: 'news',
//       offset: 0,
//       count: 1
//     },
//     method: 'POST',
//     success: res => {
//       let totalCount = res.data.total_count;
//       /**
//        * 结构：{
//        *  文章id，
//        *  作者，
//        *  标题，
//        *  摘要，
//        *  封面图URL，
//        *  文章url
//        * }
//        */
//       let art = {
//         media_id: res.data.item[0].media_id,
//         author: res.data.item[0].content.news_item[0].author, 
//         title: res.data.item[0].content.news_item[0].title, 
//         digest: res.data.item[0].content.news_item[0].digest,
//         thumb_url: res.data.item[0].content.news_item[0].thumb_url,
//         url: res.data.item[0].content.news_item[0].url,
//       };
//       console.log(art)
//       for (let i = 1; i < totalCount; i++){
//         let article = {
//           type: 'news',
//           offset: i,
//           count: 1
//         };
//         wx.request({
//           url: 'https://api.weixin.qq.com/cgi-bin/material/batchget_material?access_token=' + access,
//           data: article,
//           method: 'POST',
//           success: res => {
//             let art = {
//               media_id: res.data.item[0].media_id,
//               author: res.data.item[0].content.news_item[0].author, 
//               title: res.data.item[0].content.news_item[0].title, 
//               digest: res.data.item[0].content.news_item[0].digest,
//               thumb_url: res.data.item[0].content.news_item[0].thumb_url,
//               url: res.data.item[0].content.news_item[0].url,
//             };
//             db.collection('articles').add({
//               data: art,
//               success: res => console.log(res)
//             }) 
//           }
//         });
//       }
//     }
//   });
// }

function addToDb(object) {
  const db = wx.cloud.database();
  db.collection('articles').add({
    data: object,
    success: res => console.log(res)
  })
}

function shuffle(array) {
  var i = array.length,
      j = 0,
      temp;

  while (i--) {
    j = Math.floor(Math.random() * (i+1));
    // swap randomly chosen element with current element
    temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }

  return array.slice(0,3);
}

module.exports.refreshAccessToken = refreshAccessToken;
//module.exports.fetchArticles = fetchArticles;
module.exports.addToDb = addToDb;
module.exports.shuffle = shuffle;
