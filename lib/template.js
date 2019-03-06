module.exports = {
    HTML : function(title, list, body, control){
        return `
        <!DOCTYPE html>
        <html>
        <head>
        <meta charset="utf-8">
        <title>${title}</title>
        </head>
        
        <body>
        <h1><a href="/">WEB</a></h1>
        <h3>${list}</h3>
        ${control}
        ${body}
        </body>
        </html>
        `;
    }, list :function(filelist){           
        var i = 0;
        var list = `<ul>`;
        while (i < filelist.length){
            list = list + `<li><a href="/?id=${filelist[i]}">${filelist[i]}</a></li>`;
            i = i + 1;
        }
        list = list + `</ul>`;
        return list;
    }
}