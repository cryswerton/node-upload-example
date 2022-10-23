const express = require('express')
const app = express()
const upload = require("express-fileupload")
const fs = require('fs');
var ip = require("ip");

const port = 3000

app.use(express.static('public'))

app.set("view engine", "ejs")

app.get("/download/:filename", (req, res) => {
    file_download = `${__dirname}/public/uploads/${req.params.filename}`
    res.download(file_download);
})

app.get("/delete/:filename", (req, res) => {
    file_delete = `${__dirname}/public/uploads/${req.params.filename}`
    fs.unlinkSync(file_delete);
    res.redirect('/');
})

app.get("/watch/:filename", (req, res) => {
    subtitle = false

    const folder = './public/uploads/subtitles';

    fs.readdir(folder, (err, files) => {
        let id = files.indexOf('.gitignore'); // 2
        const removedFile = files.splice(id,  1);

        const expected_subtitle = req.params.filename.substr(0, req.params.filename.lastIndexOf(".")) + ".vtt"

        if(files.indexOf(expected_subtitle) !== -1){
            subtitle = expected_subtitle
        }
        res.render("watch", { file: req.params.filename, subtitle: subtitle})
    });
})

app.use(upload())

app.get('/', (req, res) => {
  //res.sendFile(__dirname + "/index.html")
    const folder = './public/uploads/';

    fs.readdir(folder, (err, files) => {
        files.forEach(file => {
            console.log(file);
        });
        let id = files.indexOf('.gitignore');
        files.splice(id,  1);

        id = files.indexOf('subtitles');
        files.splice(id,  1);
        
        res.render("index", { files: files})
    });  
})

app.get('/upload', (req, res) => {
    //res.sendFile(__dirname + "/index.html")
    res.render("upload") 
  })

app.post("/", (req, res) => {
    if(req.files){
        let file = req.files.file
        let filename = file.name

        file.mv("./public/uploads/" + filename, function (err) {
            if(err){
                res.send(err)
            }else{
                res.redirect('/');
            }
        })
    }else{
        res.redirect('/');
    }
})

app.listen(port, ip.address(), () => {
  console.log(`Example app listening on ${ip.address()}:${port}`)
})

