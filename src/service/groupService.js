import db from "../models"

const getGroups = async () => {
    try {
        let data = await db.Group.findAll({
            order: [['name','ASC']],
        });
        return {
            EM: 'Get group succeed!',
            EC: 0,
            DT: data
        }
    } catch (error) {
        console.log(error);
        return {
            EM: 'Error in service',
            EC: 1,
            DT: []
        }
    }
}

module.exports = {
    getGroups
}