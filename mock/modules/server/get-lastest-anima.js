const { formatMockData } = require('../utils/util');
const Mock = require('mockjs');


const formatData = formatMockData("", "", "", {
  code: 0,
  'data|0-10': [
    {
      'area|1': ["日本", '美国', '国产'],
      'arealimit|0-923456789': 0,
      'attention|0-923456789': 0,
      'bangumi_id|0-923456789': 0,
      'bgmcount|1': [/\d{1,6}/, 'SP'],
      cover: '@url(http)',
      'danmaku_count|0-923456789': 0,
      'ep_id|-1-923456789': 0,
      'favorites|0-923456789': 0,
      'is_finish|1': [0, 1],
      'lastupdate|0-1966120600': 0,
      'lastupdate_at': '@datetime', // bilibili 这边返回的接口中，有时候这个属性会少，导致反向校验出错
      'new|1': true,
      'play_count|0-923456789': 0,
      pub_time: '@datetime',
      'season_id|0-9123456789': 5978,
      'season_status|0-9123456789': 13,
      'spid|0-9123456789': 0,
      square_cover: '@url(http)',
      title: "@cword(1,20)",
      'viewRank|0-912345678': 0,
      'weekday|1': [0, 1, 2, 3, 4, 5, 6]
    }
  ],
  message: '@cword(1,10)'
})
let url = "/api/timeline_v2_global";
// let method = "get";

// module.exports = [
//   url,
//   method,
  // function (options) {
  //   console.log("options:>>>", options)
  //   // options:
  //   // body: null
  //   // type: "GET"
  //   // url: "http://localhost:1385/api/timeline_v2_global"
  //   // 此处 body 就是前端请求的参数集合
  //   // 在此处可以根据 body 里面的参数，来修改 Mock.mock(formatData) 渲染后的数据
  //   // 比如 修改 code = 404 
  //   // 设置各种成功、异常状态
  //   return Mock.mock(formatData)
  // },
//   {
//     url,
//     method,
//     formatData
//   }
// ]

module.exports = {
  router: url,
  data:   function (options) {
    console.log("options:>>>", options)
    // options:
    // body: null
    // type: "GET"
    // url: "http://localhost:1385/api/timeline_v2_global"
    // 此处 body 就是前端请求的参数集合
    // 在此处可以根据 body 里面的参数，来修改 Mock.mock(formatData) 渲染后的数据
    // 比如 修改 code = 404 
    // 设置各种成功、异常状态
    return Mock.mock(formatData)
  },
}
