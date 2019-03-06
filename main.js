var http = require('http'); 
var fs = require('fs');
var url = require('url');
var qs = require('querystring');

function templateHTML(title, flist, body, control){
    return `
    <!DOCTYPE html>
    <html>
    <head>
    <meta charset="utf-8">
    <title>${title}</title>
    </head>
    
    <body>
    <h1><a href="/">WEB</a></h1>
    <h3>${flist}</h3>
    ${control}
    ${body}
    </body>
    </html>
    `;
}

function makeList(datalist){           
    var i = 0;
    var flist = `<ul>`;
    while (i < datalist.length){
        flist = flist + `<li><a href="/?id=${datalist[i]}">${datalist[i]}</a></li>`;
        i = i + 1;
    }
    flist = flist + `</ul>`;
    return flist;
}

var app = http.createServer(function(request, response){
    var _url = request.url;
    var queryData = url.parse(_url, true).query;  //url모듈의 parse펑션과 query컨스트럭터(생성자함수)
    var title = queryData.id;
    var pathname = url.parse(_url, true).pathname;

    if(pathname === '/'){
        if(queryData.id === undefined) {
            var title = "Hello WEB";
            var description = "Its Works!"
            fs.readdir('./data', function(error, datalist){
                var flist = makeList(datalist);
                var template = templateHTML(title, flist, `<h2>${title}</h2>${description}`, `<a href="/create">create</a>`);
                response.writeHead(200);
                response.end(template);
            });

        } else {
            fs.readdir('./data', function(error, datalist){
                fs.readFile(`data/${queryData.id}`, 'utf8', function(err, description){
                    var title = queryData.id;
                    var flist = makeList(datalist);
                    var template = templateHTML(title, flist, `<h2>${title}</h2>${description}`, 
                    `<a href="/create">create</a>
                    <a href="/update?id=${title}">update</a>
                    <form action="delete_process" method="post">
                    <input type="hidden" name="id" value="${title}">
                    <input type="submit" value="delete">
                    </form>`);
                    response.writeHead(200);
                    response.end(template);
                });
            });
        }

    } else if(pathname === '/create') {
        fs.readdir('./data', function(error, datalist){
            var title = "Create";
            var flist = makeList(datalist);
            var template = templateHTML(title, flist, 
                `<form action="http://localhost:3000/create_process" method="post">
                <p><input type="text" name="title" placeholder="File Title"></p>
                <p>
                <textarea name="description" placeholder="description"></textarea>
                </p>
                <p>
                    <input type="submit">
                </p>
                </form>
            `, '');
            response.writeHead(200);
            response.end(template);
        });

    } else if(pathname === '/create_process') {
        var formBody = '';
        request.on('data', function(data){
            formBody = formBody + data;
        });
        request.on('end', function(){
            var post = qs.parse(formBody);
            var title = post.title;
            var description = post.description;
            fs.writeFile(`data/${title}`, description, 'utf8', function(err){
                response.writeHead(302, {Location: `/?id=${title}`});
                response.end(); //302는 리다이렉션(이동) 시키라는 것.
            });
        });

    } else if(pathname === '/update'){
        fs.readdir('./data', function(error, datalist){
          fs.readFile(`data/${queryData.id}`, 'utf8', function(err, description){
            var title = queryData.id;
            var flist = makeList(datalist);
            var template = templateHTML(title, flist,
              `
              <form action="/update_process" method="post">
                <input type="hidden" name="id" value="${title}">
                <p><input type="text" name="title" placeholder="title" value="${title}"></p>
                <p>
                  <textarea name="description" placeholder="description">${description}</textarea>
                </p>
                <p>
                  <input type="submit">
                </p>
              </form>
              `,
              `<a href="/create">create</a> <a href="/update?id=${title}">update</a>`
            );
            response.writeHead(200);
            response.end(template);
          });
        });

    } else if(pathname === '/update_process'){
        var body = '';
        request.on('data', function(data){
            body = body + data;
        });
        request.on('end', function(){
            var post = qs.parse(body);
            var id = post.id;
            var title = post.title;
            var description = post.description;
            fs.rename(`data/${id}`, `data/${title}`, function(error){
              fs.writeFile(`data/${title}`, description, 'utf8', function(err){
                response.writeHead(302, {Location: `/?id=${title}`});
                response.end();
              })
            });
        });

    } else if(pathname === '/delete_process'){
        var body = '';
        request.on('data', function(data){
            body = body + data;
        });
        request.on('end', function(){
            var post = qs.parse(body);
            var id = post.id;
            fs.unlink(`data/${id}`, function(error){
              response.writeHead(302, {Location: `/`});
              response.end();
            })
        });
    
    } else {
        response.writeHead(404);
        response.end('not found!');
    }

});
app.listen(3000);