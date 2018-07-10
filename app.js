// 引入http模块
let http = require("http");

// 引入文件模块
let fs = require("fs");

// 引入路径模块
let path = require("path");

// 引入第三方模板
let mime = require("mime");

// 引入查询字符串模块
let querystring = require("querystring")

// 把www文件设为网站的根目录
let rootPath = path.join(__dirname,"www")
console.log(rootPath);
http.createServer((request,response)=>{
    // 保存每次访问的路径
        // 用querystring模板的unescape来解析中文
    let filePath = path.join(rootPath,querystring.unescape(request.url));
    console.log(filePath);
    //判断访问的目录或文件是否存在
    let isExist = fs.existsSync(filePath);
    if (isExist){
        // 存在
        // 读取文件目录的内容
        fs.readdir(filePath,(err,files)=>{
            if (err){
                // 如果出错就表示不是一个文件夹，由于之前判断过是否是文件或文件夹，只有可能是文件  读取文件  直接返回
                fs.readFile(filePath,(err,data)=>{               
                    // 设置状态和类型
                    response.writeHead(200,{
                        // 利用第三方模板的getType获取当前文件的类型
                        "content-type": mime.getType(filePath)
                    })
                    // 将文件的内容返回
                    response.end(data);
                })
                // console.log(mime.getType(filePath));
            }else{
                // 是一个文件夹
                // 判断有没有index.html
                if (files.indexOf("index.html") != -1){
                    // 有index.html
                    // 生成路径                   
                    newfiles = path.join(filePath,"index.html")
                    console.log(newfiles);
                    // 读取文件
                    fs.readFile(newfiles,(err,data)=>{
                        if (err){
                            console.log(err)
                        }else{
                            // 返回index.html里的数据
                            response.end(data);
                        }
                    })
                }else{
                    //没有index.html
                    // 把文件夹里目录一一列举出来
                        //声明一个空字符串用来保存数组里的内容
                    let backData = "";
                    for(let i=0; i<files.length; i++){
                        // 判断是在网站根目录还是子目录来决定是否需要/
                        backData += `<h2>
                        <a href="${request.url=='/' ? '':request.url+'/'}${files[i]}">${files[i]}</a>
                        </h2>`
                    }
                    // 设置返回格式
                    response.writeHead(200,{
                        "content-type": "text/html;charset=utf-8"
                    })
                    response.end(backData);
                }
            }
        })
    }else{
        // 不存在
        // 设置状态为404，设置内容类型
        response.writeHead(404,{
            "content-type": "text/html"
        })
        // 返回的内容
        response.end(`
        <html><head>
        <title>404 Not Found</title>
        </head><body>
        <h1>Not Found</h1>
        <p>The requested URL /adhfksdf was not found on this server.</p>
        </body></html>
        `)
    }
    // response.end("hello");
}).listen(80,"127.0.0.1",()=>{
    console.log("listen 127.0.0.1:80  success");
})