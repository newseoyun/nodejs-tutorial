var http = require('http'); 
var fs = require('fs');
var url = require('url');

var app = http.createServer(function(request, response){
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    var title = "it works";
    
    if(_url == '/'){
        _url = 'index.html';
        console.log("it works!")
     }
    if(_url == '/favicon.ico'){
        return response.writeHead(404);
    }
    var templete = `
    <!DOCTYPE html>
    <html>
        <head>
            <meta charset="utf-8">
        </head>
    
        <body>
            <h1>hello hahahaha</h1>
            <h2>${title}</h2>
        </body>
    </html> `


    response.writeHead(200);
    response.end(templete);
});
app.listen(3000);