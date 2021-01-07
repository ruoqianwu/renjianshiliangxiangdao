const cloud = require('wx-server-sdk')
const request = require('request')
class AccessToken{

  constructor({ appid, secret}){
  this.appid=appid
  this.secret=secret
  }

  // wx36099d6755ed5e96
  // 0019475c8c6022af76eb056988885df0
  async getAccessToken() {
    let token_url = "https://service-aut7yof4-1304518463.gz.apigw.tencentcs.com/release/";
    const rp = () =>
    new Promise((resolve, reject) => {
      request({
        url: token_url,
        data: {

        },
        header: {
          'content-type': 'application/json'
        },
        success: resolve,
        fail: reject
      });
    });

    const result = await rp();
  
    return (typeof result.body === 'object') ? result.body : JSON.parse(result.body);;
  }

  async getCacheToken() {
    console.log('hello world')

    let collection = 'access_token';
    let gapTime = 300000;
    cloud.init();
    let db = cloud.database();
    let result = await db.collection(collection).get();
    if (result.code) {
      return null;
    }
    // 数据库没有，获取
    if (!result.data.length) {
      let accessTokenBody = await this.getAccessToken();
      let act = accessTokenBody.access_token;
      let ein = accessTokenBody.expires_in * 1000;
      await db.collection(collection).add({
        data: {
          _id: 1,
          accessToken: act,
          expiresIn: ein,
          createTime: Date.now()
        }
      });
      return act;
    }
    else {
      let data = result.data[0];
      let {
        _id,
        accessToken,
        expiresIn,
        createTime
      } = data;
      // 判断access_token是否有效
      if (Date.now() < createTime + expiresIn - gapTime) {
        return accessToken;
      }
      // 失效，重新获取
      else {
        let accessTokenBody = await this.getAccessToken();
        let act = accessTokenBody.access_token;
        let ein = accessTokenBody.expires_in * 1000;
        await db.collection(collection).doc(_id).set({
          _id: 1,
          accessToken: act,
          expiresIn: ein,
          createTime: Date.now()
        });
        console.log(accessTokenBody.access_token)
        return accessTokenBody.access_token;
      }
    }
  }
}
module.exports=AccessToken