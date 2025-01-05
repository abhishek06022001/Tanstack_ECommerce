const db = require("../models/index");
const Users = db.users;
const UserInfo = db.user_info;
const Op = db.Sequelize.Op;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const { where } = require("sequelize");
const { count, log } = require("console");
const userController = {
  // user basic login logout register
  register: async (req, res) => {
    try {
      const { name, email, password } = req.body;
      const users = await Users.findAll({
        where: {
          email: email,
        },
      });
      if (users.length > 0) {
        return res.status(400).json({ msg: "User already exists!" });
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new Users({
        ...req.body,
        password: hashedPassword,
      });
      const reg_user = await newUser.save();

      await UserInfo.create({
        ...req.body,
        password: hashedPassword,
        user_id: reg_user.id,
      });
      return res.status(200).json({ msg: "New User Created " });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await Users.findOne({
        where: {
          email: email,
          is_deleted: 0,
        },
      });
      if (user == null) {
        return res.status(400).json({ msg: "Wrong Email" });
      }
      bcrypt.compare(password, user.password, function (err, response) {
        if (err) {
          throw err;
        }
        if (response) {
          const payload = {
            id: user.id,
          };
          const token = jwt.sign(payload, "JWT_SECRET_KEY", {
            expiresIn: "12h",
          });
          return res.status(200).json({
            success: true,
            message: token,
          });
        } else {
          return res.status(400).json({
            success: false,
            message: "passwords do not match",
          });
        }
      });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  // for testing normally
  test: async (req, res) => {
    return res.status(200).json({ valid: true });
  },
  get_all_users: async (req, res) => {
    try {
      const users = await db.sequelize.query(
        `SELECT * FROM users inner join user_infos on users.id= user_infos.user_id where is_deleted = 0 `
      );
      return res.status(200).json({ count: count, data: users[0] });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  // create user by admin
  create_user: async (req, res) => {
    try {
      let default_password = req.body.password; 
      if (!default_password){
        default_password = "root";
      }
      const hashedPassword = await bcrypt.hash(default_password, 10);
      let newUser = {
        ...req.body,
        password: hashedPassword,
        image: req?.file?.filename,
      };
      const is_duplicate = await Users.findOne({
        where: { email: req.body.email },
      });
      if (is_duplicate) {
        return res
          .status(400)
          .json({ msg: "User Already exists for the email" });
      }
      const user = await Users.create(newUser);
      newUser = { ...newUser, user_id: user.id };
      await UserInfo.create(newUser);
      return res.status(200).json({ msg: "SuccessFully created" });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  //  update the user by both admin and user
  update_user: async (req, res) => {
    try {
      const id = req.params.id;
      const user_obj = await UserInfo.findOne({
        where: { user_id: id },
      });
      // return res.status(200).json({ msg: req.file });
      const user = await Users.findByPk(id);
      if (req.file) {
        if (user_obj.image) {
          //
          fs.unlink(process.cwd() + "/uploads/" + user_obj.image, (err) => {
            if (err) throw err;
          });
        }
        req.body.image = req.file.filename;
      }
      await Users.update({ ...req.body }, { where: { id: id } });
      await UserInfo.update({ ...req.body }, { where: { user_id: id } });
      return res.status(200).json({ ...req.body });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  // get all user data by user
  get_users: async (req, res) => {
    try {
      const limit = 6;
      const skip = (parseInt(req.query.skip) - 1) * 6 || 0;
      const count = await Users.count({
        where: {
          is_deleted: 0,
        },
      });
      const query = req.query.name;
      let mini_query = (query ? `AND users.name like '${query}%'` : ``);

      const users = await db.sequelize.query(
        `SELECT * FROM users inner join user_infos on users.id= user_infos.user_id where is_deleted = 0 ${mini_query} LIMIT ${limit} offset ${skip} `
      );

      return res.status(200).json({ count: count, data: users[0] });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  // user profile page
  get_user_byId: async (req, res) => {
    try {
      const id = req.params.id;
      const user_information = await db.sequelize.query(
        "SELECT * FROM users inner join user_infos on users.id= user_infos.user_id where users.id = ? ",
        {
          replacements: [id],
        }
      );

      return res.status(200).json(user_information[0]);
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  // delete user by admin
  delete_user: async (req, res) => {
    try {
      const id = req.params.id;
      await Users.update({ is_deleted: 1 }, { where: { id: id } });
      return res
        .status(200)
        .json({ success: true, msg: "deleted successFully" });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
};

module.exports = userController;
