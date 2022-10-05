const express = require('express')
const app = express()
const upload = require("express-fileupload")
const fs = require('fs');
var ip = require("ip");

const port = 3000

app.set("view engine", "ejs")

app.get("/download/:filename", (req, res) => {
    file_download = `${__dirname}/uploads/${req.params.filename}`
    res.download(file_download);
})

app.get("/delete/:filename", (req, res) => {
    file_delete = `${__dirname}/uploads/${req.params.filename}`
    fs.unlinkSync(file_delete);
    res.redirect('/');
})

app.use(upload())

app.get('/', (req, res) => {
  //res.sendFile(__dirname + "/index.html")
    const folder = './uploads/';

    fs.readdir(folder, (err, files) => {
        files.forEach(file => {
            console.log(file);
        });
        const id = files.indexOf('.gitignore'); // 2
        const removedFile = files.splice(id,  1);
        console.log("removed: " + removedFile)
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

        file.mv("./uploads/" + filename, function (err) {
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

