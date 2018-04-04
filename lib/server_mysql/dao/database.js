'use strict';
const path = require("path");
const config = require(path.resolve("./package.json",));
const mysql = require("mysql");
const url = config.db.url+"/"+config.db.dbname;
const option = {
    host:config.db.url,
    user:config.db.user,
    password:config.db.password,
    database:config.db.database
}


const query = function(sql,params){  
    return new Promise(function(resolve,reject){
        const connection = mysql.createConnection(option);
        connection.query(sql,params,function(error, results, fields){
            connection.end();
            if(error) {console.error("查询出错：",error);reject(error);return;};
            resolve({results, fields});
            
        })
    });
}
const queryByPage = function(sql,page,rows,params){
    return new Promise(function(resolve,reject){
        const connection = mysql.createConnection(option);
        let totalSql = sql.replace(/select[\s\S]+from/,"select count(*) total from");
        connection.query(totalSql,params,function(error, results, fields){
            if(error) {console.error("查询出错：",error);reject(error);return;};
            let total = results[0].total;
            let maxpage = Math.ceil(total/rows);
            sql += ` limit ${(page - 1) * rows},${rows}`;
            connection.query(sql,params,function(error, results, fields){
                connection.end();
                if(error) {console.error("查询出错：",error);reject(error);return};
                resolve({results:{curpage:page,eachpage:rows,total,maxpage,rows:results}, fields});
            })           
        })
    });
}

module.exports = {
    query,queryByPage
}

