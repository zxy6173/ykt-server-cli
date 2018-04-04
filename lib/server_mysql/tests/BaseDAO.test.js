const dao = require('../dao/BaseDAO');
describe('test BaseDAO',function(){
    describe('test find',function(){
        it('test find one',async function(){
            let res =  await dao.reduce({method:'get',tables:['t_film'],param:{f_name_en:'A%'}});
            console.log("Res",res,res.length);
        })
        it('test find multi join',async function(){
            // let res =  await dao.reduce('get',['t_film','t_film_schedule'],{f_id:'fs_f_id',f_name:'新木乃伊',orderBy:['fs_price desc','fs_time']});
            // console.log("Res",res,res.length);
        })
        it('test find by page',async function(){
            // let res =  await dao.reduce('get',['t_film','t_film_schedule'],{page:2,rows:5,f_id:'fs_f_id',f_name:'新木乃伊',orderBy:['fs_price desc','fs_time']});
            // console.log("Res",res,res.length);
        })
    });
    describe('test insert',function(){
        it('test insert one',async function(){
            // let res = await dao.reduce('post',['t_film'],{f_name:'红海行动'});
            // console.log("res",res);
        });
    });
    describe('test update',function(){
        it('test update one',async function(){
            // let res = await dao.reduce({method:'put',tables:['t_film'],id:'f_id!36',param:{f_name:'红海行动3',f_name_en:'honghai'}});
            // console.log("res",res);
        });
    });
    describe('test delete',function(){
        it('test delete one',async function(){
            // let res = await dao.reduce({method:'delete',tables:['t_film'],param:{f_id:['34','35']}});
            // console.log("res",res);
        });
    });
});
