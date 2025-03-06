import { where } from "sequelize/lib/sequelize";
import db from "../models/index";
import bcrypt from "bcryptjs";
import { Op } from "sequelize";
import { raw } from "body-parser";

const salt = bcrypt.genSaltSync(10);

let hashUserPassword = (userPassword) => {
  let hashPassword = bcrypt.hashSync(userPassword, salt);
  return hashPassword;
};

const checkEmailExist = async (userEmail) => {
  let user = await db.User.findOne({
    where: { email: userEmail },
  });

  if (user) {
    return true;
  }
  return false;
};

const checkPhoneExist = async (userPhone) => {
  let user = await db.User.findOne({
    where: { phone: userPhone },
  });

  if (user) {
    return true;
  }
  return false;
};

const registerNewUser = async (rawUserData) => {
  try {
    let isEmailExist = await checkEmailExist(rawUserData.email);
    if (isEmailExist === true) {
      return {
        EM: "Email is already exist",
        EC: 1,
        DT: []
      };
    }

    let isPhoneExist = await checkPhoneExist(rawUserData.phone);
    if (isPhoneExist === true) {
      return {
        EM: "Phone number is already exist",
        EC: 1,
        DT: []
      };
    }

    let hashPassword = await hashUserPassword(rawUserData.password);

    await db.User.create({
      email: rawUserData.email,
      username: rawUserData.username,
      password: hashPassword,
      phone: rawUserData.phone,
    });

    return {
        EM: "User is created successfully!",
        EC: 0
    }
  } catch (error) {
    console.log(error);
    return {
        EM: "Something is wrong in service!",
        EC: -2
    }
  }
};

const checkPassword = (inputPassword, hashPassword) => {
  return bcrypt.compareSync(inputPassword, hashPassword);
}

const handleUserLogin = async (rawData) => {
  try {
    // let isEmailExist = await checkEmailExist(rawUserData.email);
    // let isPhoneExist = await checkPhoneExist(rawUserData.phone);
    let user = await db.User.findOne({
      where: {
        [Op.or]: [
          {email: rawData.valueLogin},
          {phone: rawData.valueLogin}
        ]
      }
    })
    if(user) {
      console.log("Found user with email/phone");
      let isCorrectPassword = checkPassword(rawData.password, user.password);
      if(isCorrectPassword === true) {
        return {
          EM: "Ok!",
          EC: 0,
          DT: ''
        };
      }
    }
      console.log("Input user with email/phone: ", rawData.valueLogin, "password: ", rawData.password);
      return {
        EM: " Your Email/phone number or password is incorrect!",
        EC: 1,
        DT: ''
      };
    // if (isEmailExist === false) {
    //   return {
    //     EM: "Email or phone number ",
    //     EC: 1,
    //     DT: ''
    //   };
    // }

    // if (isPhoneExist === false) {
    //   return {
    //     EM: "Phone number is already exist",
    //     EC: 1,
    //     DT: ''
    //   };
    // }
  } catch (error) {
    console.log(error);
    return {
        EM: "Something is wrong in service!",
        EC: -2
    }
  }
}

module.exports = {
  registerNewUser,
  handleUserLogin,
  hashUserPassword,
  checkEmailExist,
  checkPhoneExist
};
