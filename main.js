var http = require('http'); 
var fs = require('fs');
var url = require('url');

function templateHTML(title, flist, body){
    return `
    <!DOCTYPE html>
    <html>
    <head>
    <meta charset="utf-8">
    <title>${title}</title>
    </head>
    
    <body>
    <h1><a href="/">WEB</a></h1>
    <h3>${flist}
    </h3>
    <h2>${title}</h2>
    <p>${body}</p>
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
    var queryData = url.parse(_url, true).query;
    var title = queryData.id;
    var pathname = url.parse(_url, true).pathname;

    if(pathname === '/'){
        if(queryData.id === undefined) {
            var title = "Hello WEB";
            var description = "Its Works!"
            fs.readdir('./data', function(error, datalist){
                var flist = makeList(datalist);
                var template = templateHTML(title, flist, description)
                response.writeHead(200);
                response.end(template);
            });

        } else {
            fs.readdir('./data', function(error, datalist){
                var flist = makeList(datalist);
                fs.readFile(`data/${queryData.id}`, 'utf8', function(err, description){
                    var template = templateHTML(title, flist, description)
                    response.writeHead(200);
                    response.end(template);
                });
            });
        }

                
    } else {
        response.writeHead(404);
        response.end('not found!');
    }

});
app.listen(3000);