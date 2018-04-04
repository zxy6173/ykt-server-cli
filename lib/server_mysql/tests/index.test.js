let request = require("supertest");
let app = require("../app");

describe('test index',function(){
    describe('test get',function(){
        it('test get one',function(done){
            // request(app).get("/t_film?f_name_en=%a%&fuzzyFields="+JSON.stringify(["f_name_en"])).then(function(res){
            //     console.log("Res",res.body.length);
                done();
            // });
        });
        it('test get multi',function(done){
            // request(app).get("/t_film/t_film_schedule?f_id=fs_f_id&f_name_en=Girls").then(function(res){
            //     console.log("Res",res.body.length);
                done();
            // });
        });
        it('test get multi',function(done){
            // request(app).get("/t_film/t_film_schedule?f_id=fs_f_id&f_name_en=Alien: Covenant&page=1&rows=5").then(function(res){
            //     console.log("Res",res.body);
                done();
            // });
        });
    });
    describe('test post',function(){
        it('test login',function(done){
            request(app).post("/login").send("u_phone=18988888888&u_pwd=1111111").then(function(res){
                console.log("Res",res.body);
                done();
            });
        });
        it('test post',function(done){
            // request(app).post("/t_film").send("f_name=honghai").then(function(res){
            //     console.log("Res",res.body);
                done();
            // });
        });
    });
    describe('test put',function(){
        it('test put',function(done){
            // request(app).put("/t_film/f_id!38").send("f_name=honghai2").then(function(res){
            //     console.log("Res",res.body);
                done();
            // });
        });
    })
    describe('test delete',function(){
        it('test delete',function(done){
            // request(app).delete("/t_film/f_id!38").then(function(res){
            //     console.log("Res",res.body);
                done();
            // });
        });
    })
    
});