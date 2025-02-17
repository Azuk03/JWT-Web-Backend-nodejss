import bcrypt from "bcryptjs";
import mysql from "mysql2/promise";
import bluebird from "bluebird";
import db from "../models";
import { where } from "sequelize/lib/sequelize";

const salt = bcrypt.genSaltSync(10);

let hashUserPassword = (userPassword) => {
  let hashPassword = bcrypt.hashSync(userPassword, salt);
  return hashPassword;
};

const createNewUser = async (email, password, username) => {
  let hashPass = hashUserPassword(password);

  try {
    await db.User.create({
      username: username,
      email: email,
      password: hashPass
    })
  } catch (error) {
    console.log(error);
  }
};

const getUserList = async () => {
  // test relations
  let newUser = await db.User.findOne({
    where: {id: 1},
    attributes: ["id", "username", "email"],
    include: {model: db.Group, attributes: ["name", "description"]},
    raw: true,
    nest: true
  })

  let role = await db.Role.findAll({
    include: {model: db.Group, where: {id: 1}},
    raw: true,
    nest: true
  })

  console.log("Check relation: ", newUser);

  let users = [];
  try {
    users = await db.User.findAll();
    return users;
  } catch (error) {
    console.log(error);
  }
};

const deleteUser = async (userId) => {
      try {
        await db.User.destroy({
          where: {id: userId}
        })
      } catch (error) {
        console.log(error);
      }
}

const getUserById = async (id) => {
    let user = {};
    user = await db.User.findOne({
      where: {id: id}
    })
    return user.get({plain: true});
}

const updateUserInfor = async (email,username, id) => {   
   await db.User.update(
    {email: email, username: username},
    {
      where: {id: id}
    }
   );
}

module.exports = {
  createNewUser,
  getUserList,
  deleteUser,
  getUserById,
  updateUserInfor,
};
