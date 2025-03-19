import db from "../models/index";

const getGroupWithRoles = async (user) => {
    try {
        let role = await db.Group.findOne({
            where: {id: user.groupId},
            attributes: ["id","name", "description"],
            include: {model: db.Role, attributes: ["id", "url", "description"], through: {attributes: []}}
        })
        return role ? role : [];
    } catch (error) {
        console.log("Error in getGroupWithRoles: ", error);
    }
}

module.exports = {
    getGroupWithRoles
}
