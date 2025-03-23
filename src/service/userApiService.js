import { where } from 'sequelize/dist/index.js';
import db from '../models/index';
import {hashUserPassword, checkEmailExist, checkPhoneExist} from './AuthenService';

const getAllUser = async () => {
    try {
        let users = await db.User.findAll({
            attributes: ["id", "username", "email", "phone", "sex"],
            include: {model: db.Group, attributes: ["name", "description"]},
        });
        if(users) {
            return {
                EM: 'Ok',
                EC: 0,
                DT: users
            }
        } else {
            return {
                EM: 'Ok',
                EC: 0,
                DT: []
            }
        }
    } catch (error) {
        console.log(error);
        return {
            EM: 'Error in server',
            EC: 1,
            DT: []
        }
    }
}

const getUserWithPagination = async (page, limit) => {
    try {
        let offset = (page - 1) * limit;
        let {count, rows} = await db.User.findAndCountAll({
            offset: offset,
            limit: limit,
            attributes: ["id", "username", "email", "phone", "sex", "address"],
            include: {model: db.Group, attributes: ["name", "description","id"]},
            order: [['id','DESC']],
        })
        let totalPages = Math.ceil(count/limit);
        let data = {
            totalRows: count,
            totalPages: totalPages,
            users: rows
        }
        return {
            EM: 'Ok',
            EC: 0,
            DT: data
        }
    } catch (error) {
        console.log(error);
        return {
            EM: 'Error in server',
            EC: 1,
            DT: []
        }
    }
}

const createNewUser = async (data) => {
    try {
        let isEmailExist = await checkEmailExist(data.email);
    if (isEmailExist === true) {
      return {
        EM: "Email is already exist",
        EC: 1,
        DT: 'email'
      };
    }

    let isPhoneExist = await checkPhoneExist(data.phone);
    if (isPhoneExist === true) {
      return {
        EM: "Phone number is already exist",
        EC: 1,
        DT: 'phone'
      };
    }

    let hashPassword = await hashUserPassword(data.password);

        await db.User.create({...data, password: hashPassword});
        return {
            EM: 'Create ok',
            EC: 0,
            DT: []
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

const updateUser = async (data) => {
    try {
        if(!data.groupId) {
            return {
                EM: 'Error with empty group',
                EC: 1,
                DT: 'group'
            }
        }

        let user = await db.User.findOne({
            where: {id: data.id}
        })
        if(user) {
            await user.update({         
                username: data.username,
                address: data.address,
                sex: data.sex,
                groupId: data.groupId     
            })
            return {
                EM: 'Update User succeed!',
                EC: 0,
                DT: ''
            }
        } else {
            return {
                EM: 'Cannot find User',
                EC: 2,
                DT: ''
            }
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

const deleteUser = async (id) => {
    try {
        let user = await db.User.findOne({
            where: {id: id}
        })

        if(user) {
            await user.destroy();
            return {
                EM: 'Delete User succeed!',
                EC: 0,
                DT: []
            }
        } else {
            return {
                EM: 'User is not exist!',
                EC: 2,
                DT: []
            }
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
    getAllUser,
    createNewUser,
    updateUser,
    deleteUser,
    getUserWithPagination
}