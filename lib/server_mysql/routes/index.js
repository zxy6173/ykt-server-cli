let express = require('express');
const router = express.Router();
const baseDAO = require('../dao/BaseDAO');
const multiparty = require('multiparty');
const jwt = require("jsonwebtoken");
const config = require("../token.config");
const sql = require("../sql");

const fs = require('fs');
// const publicKey = fs.readFileSync('./public.pub');
const qs = require('querystring');
const url = require('url');


/* GET home page. */
router.all('/*', async function(req, res, next) {
    // res.setHeader("Access-Control-Allow-Origin","*");
    // res.setHeader("Access-Control-Allow-Methods","GET,POST");
    let baseUrl = unescape(req.baseUrl);
    if(baseUrl.indexOf(".") >= 0){
        res.send("");
        return;
    }
    let param;
    let newParam = {};
    if(req.method.toUpperCase() == "GET"){
        param = req.query;
    }else{
        param = req.body;
    }
    
    for(k in param){
        let v = param[k];
        if(typeof(v) == "string" && v.length >= 2 && (/^\[.*\]$/.test(v) || /^\{.*\}$/.test(v))){
            try{
                param[k] = JSON.parse(param[k]);
            }catch(e){}
        }
        if(k){
            newParam[k] = param[k];
        }
    }
    
    if(sql[baseUrl]){
        let result = await baseDAO.exec(sql[baseUrl].sql,param);
        res.send(result);
        return;
    }
    let pathes = baseUrl.split(/\/+/);
    if(pathes.length > 0){

        if(pathes[0] == ''){

            pathes.shift();
        }
        if(pathes[0].toLowerCase() == "upload"){
            upload(req,res);
        }else if(pathes[0].toLowerCase() == "getsession"){
            getSession(req,res);
        }else if(pathes[0].toLowerCase() == "removesession"){
            removeSession(req,res);
        }else if(pathes[0].toLowerCase() == "login"){
            let addSession = newParam.addSession;
            delete newParam.addSession;
            let result = await baseDAO.reduce({
                method:"get",
                tables:["t_user"],
                param:newParam
            });
            if(result.length > 0){
                req.session.data = result[0];
                if(config.token){
                    let authToken = jwt.sign(result[0], publicKey);
                    res.send({token: authToken});
                }else{
                    res.send(result[0]);
                }
                
            }else{
                res.send({});
            }
           
        }else{
            let paramObj = {
                method:req.method.toLocaleLowerCase(),
                param:newParam
            };
            if(pathes.findIndex(field => (/^\S+_id[!\-\|]\S+$/.test(field))) >= 0){
                let id = pathes.pop();
                paramObj.id = id;
            }
            paramObj.tables = pathes;
            let result = await baseDAO.reduce(paramObj);
            res.send(result);
        }
    }else{
        console.error("error:请求的路径不正确");
        res.send("error:请求的路径不正确");
    }


});
let getSession = function(req,res){
    let data = req.session.data || {};
    res.send(data);
}
let removeSession = function(req,res){
    req.session.data = null;
    res.send({});
}
let upload = function(req,res){
    let form=new multiparty.Form({uploadDir:'./public/images'});
    form.parse(req,function(err,fields,files){
        if(err){
            res.send(err);
        }else{

            let path=files.file[0].path.substring(files.file[0].path.indexOf("images"));
            res.send(path);
        }
    });
}
module.exports = router;
