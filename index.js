const express = require('express'),
    http =require('http'),
    app = express(),
    path = require('path'),
    server = http.createServer(app),
    bodyParser = require('body-parser'),
    exif = require('exiftool'),
    fs = require('fs-then'),
    fileUpload = require('express-fileupload'),
    MongoClient = require('mongodb').MongoClient,
    url = "mongodb://localhost:27017/metadata";



app.use(fileUpload());

const PORT = process.env.PORT || 8080;;

app.use(bodyParser.json() ); 
app.use(bodyParser.urlencoded({ extended: true }));

const handleListening = () => {
    console.log(`✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅ Server Running on : http://localhost:8080 ✅ ✅ ✅ ✅ ✅ ✅ ✅ `);
}

const moveFile = (file , name) => {
    return new Promise(function(resolve, reject){
        if(!file){
            reject(res.send("No file"));
        }
        else{
            file.mv('./src/'+ name);
            resolve(name);
        }
    })

}

const makeExifAsync = (file) => {
    return new Promise(function(resolve, reject){
        exif.metadata(file, function(err, data){
            if(err !== null) return reject(err);
            resolve(data)
        })
    })
}

const aatoJson = (aa) => {
    return new Promise(function(resolve, reject){
        let resultJson = {}
        for(properties in aa){
            resultJson[properties] = aa[properties];
            // let stringified = JSON.stringify(resultJson);
            // let parsed = JSON.parse(stringified)
            // console.log(parsed);
        }
        let stringified = JSON.stringify(resultJson);
        let parsed = JSON.parse(stringified)
         resolve(parsed);
        
    })
}



app.post('/upload', function(req, res){
    if(!req.files)
        return res.status(400).send('No files were uploaded');

    let uploadedFile = req.files.image;
    let uploadedFileName = uploadedFile.name;

    moveFile(uploadedFile, uploadedFileName)
        .then(result => fs.readFile('./src/'+ result))
        .then(file => makeExifAsync(file))
        .then(metadata => aatoJson(metadata))
        .then(result => res.send(result))
        .catch(err => console.error(err));

        // .then(exifImage => exif.metadata(exifImage))
        // .then(metadata => console.log(metadata))
        // .catch(err => console.error(err));
})

server.listen(PORT, handleListening);
app.use(express.static(path.join(__dirname, "public")));