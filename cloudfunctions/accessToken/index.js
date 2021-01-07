// 云函数入口文件
const cloud = require('wx-server-sdk');
const request = require('request');
const access_token = require('AccessToken');
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
let appid = 'wx36099d6755ed5e96';
let secret = '0019475c8c6022af76eb056988885df0';

// 云函数入口函数
exports.main = async (event, context) => {
  let atn = new access_token({
    appid,
    secret
  });
  return atn.getCacheToken();
}