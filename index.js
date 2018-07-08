console.log('test')
// var page = require('webpage').create();

var request = require("request");



    // request.get("http://www.pbc.gov.cn/diaochatongjisi/resource/cms/2018/05/2018051714330596946.htm", function(err, res, body) {
    //     if(err) {
    //         return console.error(err);
    //     }

    //     console.log("Got a response!", res);
    //     // console.log("Response body:", body);
    // });




const phantom = require('phantom');
(async function() {
  const instance = await phantom.create();
  const page = await instance.createPage();
    page.addCookie({
      name: 'ccpassport',
      value: 'f4dae74e5821c96a4fcb8f77c22cc9d5',
      domain: 'www.pbc.gov.cn'
    })
    // page.addCookie({
    //   name: 'wzwschallenge',
    //   value: '-1',
    //   domain: 'www.pbc.gov.cn'
    // });
    // page.addCookie({
    //   name: 'wzwstemplate',
    //   value: 'MQ==',
    //   domain: 'www.pbc.gov.cn'
    // });
    // page.addCookie({
    //   name: 'wzwsvtime',
    //   value: '1527953174',
    //   domain: 'www.pbc.gov.cn'
    // });
    // page.addCookie({
    //   name: 'wzwsconfirm',
    //   value: '41f480661515c4e516004dc498e7bc1b',
    //   domain: 'www.pbc.gov.cn'
    // });
  await page.on('onResourceRequested', function(requestData) {
    console.info('Requesting', requestData.url);
  });
 
  const status = await page.open('http://www.pbc.gov.cn/diaochatongjisi/resource/cms/2018/05/2018051714330596946.htm');
  const content = await page.property('content');
  console.log(content);
 
  await instance.exit();
})();



// var Crawler = require("crawler");
 
// var c = new Crawler({
//     maxConnections : 10,
//     // This will be called for each crawled page
//     callback : function (error, res, done) {
//         if(error){
//             console.log(error);
//         }else{
//             var $ = res.$;
//             // $ is Cheerio by default
//             //a lean implementation of core jQuery designed specifically for the server
//             console.log($("body").text());
//         }
//         done();
//     }
// });
 
// Queue just one URL, with default callback
// c.queue('http://www.pbc.gov.cn/diaochatongjisi/resource/cms/2018/05/2018051714330596946.htm');