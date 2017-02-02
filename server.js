var express = require('express');
var app = express();
var multiparty = require('multiparty');
var http = require('http');
var util = require('util');
var fs = require('fs');
var formidable = require('formidable')
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/', function(req, res) {
  res.writeHead(200, {'content-type': 'text/html'});
  res.end(
    '<form action="/upload" enctype="multipart/form-data" method="post">'+
    '<input type="text" name="title"><br>'+
    '<input type="file" name="upload" multiple="multiple"><br>'+
    '<input type="submit" value="Upload">'+
    '</form>'
  );
});

app.post('/upload', function(req, res) {
  if (req.url == '/upload' && req.method.toLowerCase() == 'post') {
    // parse a file upload
    var form = new formidable.IncomingForm();
    form.uploadDir = "./imagesPath";
    
    form.parse(req, function(err, fields, files) {
      console.log(files);
      console.log(fields);
      var newFileName = fields.fileName[0];
      console.log(newFileName);
      res.writeHead(200, {'content-type': 'text/plain'});
      res.write('received upload:\n\n');
      res.end(util.inspect({fields: fields, files: files}));
    });
    
    form.on('file', function(field, file) {
        //rename the incoming file to the file's name
            fs.rename(file.path, form.uploadDir + "/" + file.name);
    });
    
    form.on('error', function(err) {
        console.log("an error has occured with form upload");
        console.log(err);
        req.resume();
    });

    form.on('aborted', function(err) {
        console.log("user aborted upload");
    });

    form.on('end', function() {
        console.log('-> upload done');
    });
  
    return;
  }
});


var server = app.listen(8080, function() {
     var host = process.env.IP
      var port = process.env.PORT
   
   console.log("Example app listening at http://%s:%s", host, port)
})
