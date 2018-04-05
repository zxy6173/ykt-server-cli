module.exports = {
    "/privileges":{
        sql:"select f_key from t_function join t_privilege on f_id=p_f_id join t_user on u_id=p_u_id where u_id=?"
    }
}