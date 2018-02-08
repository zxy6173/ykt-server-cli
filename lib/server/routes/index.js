var express = require('express');
var router = express.Router();
var baseDAO = require('../dao/BaseDAO');
var multiparty = require('multiparty');
/* GET home page. */
router.all('/*', function(req, res, next) {
    // res.setHeader("Access-Control-Allow-Origin","*");
    // res.setHeader("Access-Control-Allow-Methods","GET,POST");
    var param;
    var newParam = {};
    if(req.method.toUpperCase() == "GET"){
        param = req.query;
    }else{
        param = req.body;
    }
    for(k in param){
        var v = param[k];
        if(typeof(v) == "string" && v.length >= 2 && (/^\[.*\]$/.test(v) || /^\{.*\}$/.test(v))){
            try{
                param[k] = JSON.parse(param[k]);
            }catch(e){}
        }
        if(k){
            newParam[k] = param[k];
        }
    }
    var pathes = req.baseUrl.split(/\/+/);
    console.log("path",pathes);
    if(pathes.length > 0){

        if(pathes[0] == ''){

            pathes.shift();
        }
        if(pathes[0].toLowerCase() == "upload"){
            upload(req,res);
        }else{
            var addSession = newParam.addSession;
            delete newParam.addSession;
            baseDAO.reduce(req.method.toLocaleLowerCase(),pathes[0],pathes[1],newParam,function(data){
                if(addSession){
                    req.session.data = data.length > 0 ? data[0]:data;
                }
                res.send(data);
            });
        }
    }else{
        console.error("error:请求的路径不正确");
        res.send("error:请求的路径不正确");
    }


});

var upload = function(req,res){
    var form=new multiparty.Form({uploadDir:'./public/images'});
    form.parse(req,function(err,fields,files){
        if(err){
            res.send(err);
        }else{

            var path=files.file[0].path.substring(files.file[0].path.indexOf("images"));
            res.send(path);
        }
    });
}
module.exports = router;
