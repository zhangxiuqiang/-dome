var http = require("http"),
    url = require("url"),
    fs = require("fs");
var server1 = http.createServer(function (req, res) {
    var urlObj = url.parse(req.url, true),
        pathname = urlObj["pathname"],
        query = urlObj["query"];

    //->静态资源(项目)文件的请求处理:服务端接收到具体的请求文件后把文件中的源代码返回给客户端进行渲染即可
    var reg = /\.(HTML|CSS|JS|ICO|IMG|PNG)/i;
    if (reg.test(pathname)) {
        var suffix = reg.exec(pathname)[1].toUpperCase(),
            suffixMIME = suffix === "HTML" ? "text/html" : (suffix === "CSS" ? "text/css" : "text/javascript");
        try {
            res.writeHead(200, {'content-type': suffixMIME + ';charset=utf-8;'});
            res.end(fs.readFileSync("." + pathname, "utf-8"));
        } catch (e) {
            res.writeHead(404);
            res.end("file is not found~");
        }
        return;
    }

    //->API接口文档中规定的数据请求处理
    // var jsonData = JSON.parse(fs.readFileSync("./svg.json", "utf-8"));
    if (pathname === "/getList") {
        var W=parseInt(query['W']),//屏幕宽度
            H=parseInt(query['H']),//屏幕高度
            L=parseInt(query['L']),//划过横坐标
            T=parseInt(query['T']),//划过纵坐标
            S=parseInt(query['S']),//缩放比
            dw=parseInt(W)+parseInt(L),//范围横坐标
            dh=parseInt(T)+parseInt(H),//范围纵坐标
            ary = [],
            data={};
        for (var key in jsonData) {
            data[key]=[];
            for(var i=0;i<jsonData[key].length;i++){
                var curData=jsonData[key][i];
                if(L<curData.x && curData.x<dw && T<curData.y && curData.y<dh){
                    data[key].push(curData);
                }
            }
        }
     
           console.log (L,T, dw,dh);
        res.writeHead(200, {'content-type': 'application/json;charset=utf-8;'});
        res.end(JSON.stringify({
            code: 0,
            msg: "200",
            total: Math.ceil(data.length / 10),
            data: data
        }));
        return;
    }

    if (pathname === "/getInfo") {
        var studentId = query["id"],
            obj = null;
        for (i = 0; i < data.length; i++) {
            if (data[i]["id"] == studentId) {
                obj = data[i];
            }
        }
        var result = {code: 1, msg: "内容不存在!", data: null};
        if (obj) {
            result = {
                code: 0,
                msg: "成功",
                data: obj
            };
        }

        res.writeHead(200, {'content-type': 'application/json;charset=utf-8;'});
        res.end(JSON.stringify(result));
        return;
    }

    //->请求的接口地址不存在的话,返回404
    res.writeHead(404);
    res.end("request api url is not found~");
});
server1.listen(88, function () {
    console.log("server is success,listening on 88 port!");
});