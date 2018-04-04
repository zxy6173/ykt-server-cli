const db = require("ykt-mysql");
module.exports.reduce = async function(params){
    let {method,id} = params;
   
    if(method == "get"){
        return await find(params);
    }else if(method == "post"){
        return await insert(params);
    }else if(method == "put"){
        return await update(params);
    }else if(method == "delete"){
        return await del(params);
    }else{
        console.error("请求方法错误："+method);
    }
}

const find = async function({tables,param = {},id}){

    let page = param.page;
    let rows = param.rows;
    let fuzzyFields = param.fuzzyFields;
    let orderBy = param.orderBy;
    delete param.page;
    delete param.rows;
    delete param.fuzzyFields;
    delete param.orderBy;
    let paramAry = [tables];
    let sql = "select * from ?? ";
    let sqlTemp ='';
    if(id){
        let idsAry = id.split("!");
        param[idsAry[0]] = idsAry[1];
    }
    //如果传递了参数则拼接where子句
    if(Object.keys(param).length > 0){
        
        for(let key in param){
            if(key.indexOf("id") >= 0 && param[key].indexOf("id") >= 0){
                sqlTemp += `and ${key}=?? `;
            }else{
                if(fuzzyFields && fuzzyFields.findIndex(field => (field == key)) >= 0){
                    sqlTemp += `and ${key} like ? `;
                }else{
                    sqlTemp += `and ${key}=? `;
                } 
                
            }               
            paramAry.push(param[key]);
        }
        // paramAry.push(paramTemp);
        sql += "where "+sqlTemp.replace(/and/,"");
    }
    if(orderBy){
        let orderTemp = "";
        orderBy.forEach(ele => {
            let temp = ele.split(/\s+/);
            orderTemp += `,${temp[0]} ${temp[1] || ""}`
        });
        sql += `order by ` + orderTemp.replace(/,/,"");
        paramAry.push(orderBy);
    }   
    let res;
    if(page && rows){
        res = await db.queryByPage(sql,page,rows,paramAry);
    }else{
        // console.log("sql:",sql,paramAry);
        res = await db.query(sql,paramAry);
    }
    return res.results;
}

var insert = async function({tables,param = {}}){

    let keys = Object.keys(param);
    let values = Object.values(param);
    let sql = "insert into ??(??) values(?)";
    let paramAry = [tables,keys,values];
    let res = await db.query(sql,paramAry);
    return {insertId:res.results.insertId};

}

var update = async function({tables,param = {},id}){
    
    let sql = "update ?? set ?";
    let paramAry = [tables,param];

    if(id){
        let idsAry = id.split("!");
        sql += `where ${idsAry[0]}=?`;
        paramAry.push(idsAry[1]);
    }
    let res = await db.query(sql,paramAry);
    return {affectedRows:res.results.affectedRows};
   
}

var del = async function({tables,param = {},id}){

    let sql = "delete from ?? ";
    let paramAry = [tables];
    let sqlTemp ='';
    let fuzzyFields = param.fuzzyFields;
    delete param.fuzzyFields;
    if(id){
        let idsAry = id.split("!");
        param[idsAry[0]] = idsAry[1];
    }
    
     //如果传递了参数则拼接where子句
     if(Object.keys(param).length > 0){
        
        for(let key in param){
            
            if(fuzzyFields && fuzzyFields.findIndex(field => (field == key)) >= 0){
                sqlTemp += `and ${key} like ? `;
            }else if(typeof param[key] == "object"){
                sqlTemp += `and ${key} in (${param[key].join(",")})`
            }else{
                sqlTemp += `and ${key}=? `;
            } 
                           
            paramAry.push(param[key]);
        }
        // paramAry.push(paramTemp);
        sql += "where "+sqlTemp.replace(/and/,"");
    }
    let res = await db.query(sql,paramAry);
    return {affectedRows:res.results.affectedRows};

    

}
