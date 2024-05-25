console.clear();
//importation
import express from "express";
import Services from "../Models/Services.js";
import User from "../Models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
//costumer middleware
import {
  validation,
  validationRegister,
  validateLogin,
} from "../middleware/validator.js";
import isAuth from "../middleware/isAuth.js";
//end
const router = express.Router();
//techician zone
//post method for service
router.post("/add", async (req, res) => {
  try {
    const newService = Services(req.body);
    await newService.save();
    res.status(200).send({ msg: "service added successfully" });
  } catch (error) {
    res.status(500).send({ msg: "invalid", error });
  }
});
//end
//get method for service
router.get("/service", async (req, res) => {
  try {
    const getService = await Services.find();
    res.status(200).send({ msg: "Service getted successfully", getService });
  } catch (error) {
    res.status(500).send({ msg: "invalid", error });
  }
});
//end
//delete method for service
router.delete("/:id", async (req, res) => {
  try {
    const idServices = req.params.id;
    const ServiceDel = await Services.deleteOne({ _id: idServices });
    ServiceDel.deletedCount
      ? res.status(200).send({ msg: "Service deleted successfully" })
      : res.status(200).send({ msg: "Service alredy deleted " });
  } catch (error) {
    res.status(500).send({ msg: "inviled request ", error });
  }
});
//end
//update method for service
router.put("/:id", async (req, res) => {
  try {
    const updateService = await Services.updateOne(
      { _id: req.params.id },
      { $set: req.body }
    );
    updateService.modifiedCount
      ? res.status(200).send({ msg: "Service updated successfully" })
      : res.status(200).setDefaultEncoding({ msg: "Service already updated" });
  } catch (error) {
    res.status(500).send({ msg: "inviled request ", error });
  }
});
//end
//end techicien zone
//zone admin
//add technicien
router.post("/addTech", async (req, res) => {
  try {
    const newtechnicien = User(req.body);
    await newtechnicien.save();
    res.status(200).send({ msg: "technicien added successfully" });
  } catch (error) {
    res.status(500).send({ msg: "invalid", error });
  }
});
//end
//delete technicien
router.delete("/tech/:id", async (req, res) => {
  try {
    const idTech = req.params.id;
    const TechDel = await User.deleteOne({ _id: idTech });
    TechDel.deletedCount
      ? res.status(200).send({ msg: "technicien deleted successfully" })
      : res.status(200).send({ msg: "technicien alredy deleted " });
  } catch (error) {
    res.status(500).send({ msg: "inviled request ", error });
  }
});
//end
//add client
router.post("/client", async (req, res) => {
  try {
    const newClient = User(req.body);
    await newClient.save();
    res.status(200).send({ msg: "technicien added successfully" });
  } catch (error) {
    res.status(500).send({ msg: "invalid", error });
  }
});
//end
//delete client
router.delete("/client/:id", async (req, res) => {
  try {
    const idClient = req.params.id;
    const ClientDel = await User.deleteOne({ _id: idClient });
    ClientDel.deletedCount
      ? res.status(200).send({ msg: "Client deleted successfully" })
      : res.status(200).send({ msg: "Client alredy deleted " });
  } catch (error) {
    res.status(500).send({ msg: "inviled request ", error });
  }
});
//end
//end zone admin
//client zone
//get info service for user
router.get("/info", async (req, res) => {
  try {
    const infoService = await Services.find();
    res.status(200).send({ msg: "Movie getted successfully", infoService });
  } catch (error) {
    res.status(500).send({ msg: "invalid", error });
  }
});
//end
//demande Service
router.post("/reqService", async (req, res) => {
  try {
    const newSercive = Service(req.body);
    await newSercive.save();
    res.status(200).send({ msg: "Service added successfully" });
  } catch (error) {
    res.status(500).send({ msg: "invalid", error });
  }
});
//end
//end client zone
//login and sign up
// registre
router.post("/registre", validation, validationRegister(), async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const emailFind = await User.findOne({ email });
    const usernameFind = await User.findOne({ username });
    if (emailFind || usernameFind) {
      return res
        .status(400)
        .send({ msg: "username or email is already exited !!" });
    }

    //prep data
    const dataUser = new User({ username, email, password });
    //end

    //hased password
    const saltRounds = 10;
    const salt = bcrypt.genSaltSync(saltRounds);
    const hash = bcrypt.hashSync(password, salt);
    dataUser.password = hash;
    //end hashed

    //save data
    const dataNewUser = await dataUser.save();
    // end save

    //generate acces token
    const payload = { id: dataNewUser._id };
    const scret = process.env.privetKey;
    const option = { expiresIn: 3600 };
    const userToken = jwt.sign(payload, scret, option);
    //end

    res.status(200).send({ msg: "new user added" });
  } catch (error) {
    res.status(500).send({ msg: "can't get user", error });
  }
});
//end
//login
router.post("/login", validateLogin(), validation, async (req, res) => {
  const { email, password } = req.body;
  try {
    const userfind = await User.findOne({ email });
    if (!userfind) {
      return res
        .status(400)
        .send({ msg: "email or password incorrect '<email>' !!" });
    }
    const isMatch = await bcrypt.compare(password, userfind.password);
    if (!isMatch) {
      return res
        .status(400)
        .send({ msg: "email or password incorrect '<pass>'!!" });
    }
    //generate token
    const payload = { id: userfind._id };
    const scret = process.env.privetKey;
    const option = { expiresIn: 3600 };
    const userToken = jwt.sign(payload, scret, option);
    //end

    res.status(200).send({ msg: "welcome", userToken });
  } catch (error) {
    res.status(500).send({ msg: "can't login user", error });
  }
});
//end
//end
//test current user
router.get("/current", isAuth, (req, res) => {
  res.send({ msg: "user is auth", User: req.User });
});
//end

export default router;
