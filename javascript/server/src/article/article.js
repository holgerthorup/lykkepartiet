const db = require('../../db.js')
const ogs = require('open-graph-scraper');

const insertArticle = db.sql('./src/article/insertArticle.sql')

async function postArticle (request, response) {

  const userId = 1 // collect through auth ...
  const articleUrl = request.body.article;

  const options = {
    'timeout': 10000,
    'url': articleUrl
  };
  console.log(request.params.id);

  ogs(options, function (error, result) {
    console.log(result);
    db.cx.query(insertArticle,
      {
        publisher: result.data.ogSiteName,
        title: result.data.ogTitle,
        preview: result.data.ogDescription,
        imgurl: result.data.ogImage.url,
        linkurl: result.data.ogUrl,
        proposal: request.params.id,
        approved: true,
      });
    response.sendStatus(200)
  });



}

module.exports = {
  postArticle
}