const express = require('express')
const app = express()
const upload = require("express-fileupload")
var ip = require("ip");

const port = 3000

app.use(upload())

app.get('/', (req, res) => {
  res.sendFile(__dirname + "/index.html")
})

app.post("/", (req, res) => {
    if(req.files){
        let file = req.files.file
        let filename = file.name

        file.mv("./uploads/" + filename, function (err) {
            if(err){
                res.send(err)
            }else{
                res.send("File uploaded.")
            }
        })
    }
})

app.listen(port, ip.address(), () => {
  console.log(`Example app listening on ${ip.address()}:${port}`)
})

