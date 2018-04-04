const db = require('../dao/database');
describe('test database',function(){
    describe('test query',function(){
        it('query',async function(){
            let res = await db.query("select name,age from ?? where f_id=??",[["t_film","t_film_schedule"],['fs_f_id']]);
            console.log("res",res.results);
        });
    });
});