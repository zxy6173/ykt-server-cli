module.exports = {
    "/privileges":{
        sql:"select functionKey from functions f join privileges p on f._id=p.functionId join users u on u._id=p.userId where u._id=?"
    }
}