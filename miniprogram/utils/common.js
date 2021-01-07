
// get access key method
async function refreshAccessToken() {

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
    db.collection('access_token').doc('a8831daa5fda92920006174f38470fcc').update({
      data: {
        accessToken: res.data.access_token,
        createTime: Date.now(),
        expiresIn: res.data.expires_in
      }
    });
    return res.data.access_token;
  
}

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
module.exports.addToDb = addToDb;
module.exports.shuffle = shuffle;
