import { where } from "sequelize/dist/index.js";
import db from "../models/index";

const createNewRoles = async (data) => {
  try {
    // Kiểm tra trùng lặp URL trong data được gửi lên
    const duplicateUrls = data.filter(
      (item, index, self) => index !== self.findIndex((t) => t.url === item.url)
    );

    if (duplicateUrls.length > 0) {
      const duplicateUrlList = duplicateUrls.map((item) => item.url).join(", ");
      return {
        EM: `Duplicate URLs found in request: ${duplicateUrlList}`,
        EC: 1,
        DT: [],
      };
    }

    // Kiểm tra URL trùng với database
    let currentRole = await db.Role.findAll({
      attributes: ["url", "description"],
      raw: true,
      nest: true,
    });

    const persists = data.filter(
      (item) => !currentRole.some((role) => role.url === item.url)
    );

    if (persists.length > 0) {
      await db.Role.bulkCreate(persists);
      return {
        EM: "Create ok",
        EC: 0,
        DT: [],
      };
    } else {
      return {
        EM: "Role already exists",
        EC: 1,
        DT: [],
      };
    }
  } catch (error) {
    console.log(error);
    return {
      EM: "Error in service",
      EC: 1,
      DT: [],
    };
  }
};

const getAllRoles = async () => {
  try {
    let data = await db.Role.findAll({
      order: [["id", "DESC"]],
    });
    return {
      EM: "Get all roles successfully",
      EC: 0,
      DT: data,
    };
  } catch (error) {
    console.log(error);
    return {
      EM: "Error in service",
      EC: 1,
      DT: [],
    };
  }
};

const updateRole = async (data) => {
  try {
    let role = await db.Role.findOne({ where: { id: data.id } });
    if (role) {
      await role.update({
        url: data.url,
        description: data.description,
      });
      return {
        EM: "Update role successfully",
        EC: 0,
        DT: [],
      };
    } else {
      return {
        EM: "Role not found",
        EC: 1,
        DT: [],
      };
    }
  } catch (error) {
    console.log(error);
    return {
      EM: "Error in service",
      EC: 1,
      DT: [],
    };
  }
};

const deleteRole = async (roleId) => {
  try {
    let role = await db.Role.findOne({ where: { id: roleId } });
    if (role) {
      await role.destroy();
      return {
        EM: "Delete role successfully",
        EC: 0,
        DT: [],
      };
    } else {
      return {
        EM: "Role not found",
        EC: 1,
        DT: [],
      };
    }
  } catch (error) {
    console.log(error);
    return {
      EM: "Error in service",
      EC: 1,
      DT: [],
    };
  }
};

const getRoleByGroupService = async (id) => {
  try {
      if(!id) {
        return {
          EM: "Not found Role!",
          EC: 0,
          DT: [],
        };
      }
      let roles = await db.Group.findOne({
          where: {id: id},
          attributes: ["id","name", "description"],
          include: {model: db.Role, attributes: ["id", "url", "description"], through: {attributes: []}}
      })
      return {
        EM: "Get Role by Group succeed!",
        EC: 0,
        DT: roles,
      };
    } catch (error) {
    console.log(error);
    return {
      EM: "Error in service",
      EC: 1,
      DT: [],
    };
  }
}

const assignRoleToGroupService = async (data) => {
  try {
    await db.Group_Role.destroy({
      where: {groupId: +data.groupId}
    })
    await db.Group_Role.bulkCreate(data.groupRoles);
    return {
      EM: "Assign Roles succeed!",
      EC: 0,
      DT: [],
    };
  } catch (error) {
  console.log(error);
  return {
    EM: "Error in service",
    EC: 1,
    DT: [],
  };
}
}


module.exports = {
  createNewRoles,
  getAllRoles,
  updateRole,
  deleteRole,
  getRoleByGroupService,
  assignRoleToGroupService
};
