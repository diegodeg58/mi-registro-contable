//Dependencias
const axios = require("axios").default;
const moment = require("moment");
const { v4 } = require("uuid");
const _ = require("lodash");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

//Modelo de base de datos
const DB = require("../model/model.js");

//Variables de entorno
const privateKey = process.env.privateKey;
const devUser = process.env.devUser;
const devPass = process.env.devPass;
const devRole = process.env.devRole;
const port = process.env.PORT || 3000;
const url = process.env.BASE_URL || `http://localhost:${port}`;

const verifyToken = (req, res, next) => {
  const token = req.cookies["token"];
  try {
    if (typeof token == "undefined") throw new Error("Token no definido");
    req.authData = jwt.verify(token, privateKey);
    req.token = token;
    next();
  } catch (error) {
    console.error(error.message);
    res.cookie("banner_color", "warning", { maxAge: 2000 });
    res.cookie("notification", error.message, {
      maxAge: 2000,
    });
    res.clearCookie("token");
    return res.redirect("/login");
  }
};

const getIndex = (req, res) => {
  const authData = req.authData;

  if (authData.user == devUser && authData.role == devRole) {
    return res.render("admin");
  }

  axios
    .get(`${url}/ultimas`)
    .then((data) => {
      res.render("index", {
        // lista: data.data.results,
      });
    })
    .catch((error) => {
      console.error("Error en la petición:", error.code);
      res.sendStatus(500);
    });
};

const getLastTransactions = async (req, res) => {
  try {
    /* let lista = await DB.getLastTransactions(8);
    lista = lista.results.map(async (finanza) => {
      const item = await DB.getTransaction(finanza.key);
      return {
        id: finanza.key,
        tipo: item.props.tipo,
        monto: item.props.monto,
        persona: item.props.persona,
        descripcion: item.props.descripcion,
      };
    });
    let jsonData = await Promise.all(lista); */
    res.json({
      // results: jsonData,
    });
  } catch (error) {
    console.error(error.message);
    res.status(400).json({
      error: "Ha ocurrido un error obteniendo los datos",
      code: error.code,
    });
  }
};

const getFinanzas = async (req, res) => {
  const n = parseInt(req.query.n);
  const cantidad = n > 0 ? n : 5;

  const page = parseInt(req.query.page);
  const pagina = page > 0 ? page : 1;

  ////////////////
  //TODO: Sección donde se obtiene un arreglo de los <id> que retorna el método list()
  //El tamaño del arreglo depende de la cantidad de páginas que se obtenga a través de list()
  //Para obtener el arreglo se debe realizar un ciclo while hasta que la variable LastEvaluatedKey retorne null
  ////////////////

  try {
    let lista = await DB.getLastTransactions(
      cantidad /* {
          "keys_gsi": "finanzas",
          "sk": "finanzas#c84e410f",
          "pk": "finanzas#c84e410f",
          "keys_gsi_sk": "2022-07-05T02:47:41.383Z"
      } */
    );
    const next = lista.next;
    lista = lista.results.map(async (finanza, index) => {
      let lastItem;
      if (index == cantidad - 1) {
        lastItem = finanza;
        console.log(lastItem);
      }

      const item = await DB.getTransaction(finanza.key);
      return {
        id: finanza.key,
        tipo: item.props.tipo,
        monto: item.props.monto,
        persona: item.props.persona,
        descripcion: item.props.descripcion,
      };
    });
    let jsonData = await Promise.all(lista);

    res.json({
      results: jsonData,
      next: next,
    });
  } catch (error) {
    console.log(error.message);
    res.status(400).json({
      error: "Ha ocurrido un error",
      code: error.$metadata.httpStatusCode,
    });
  }
};

const getLogin = (req, res) => {
  res.render("login");
};

const postLogin = (req, res) => {
  const { user, password } = req.body;

  if (user == devUser && password == devPass) {
    const adminObj = {
      user: devUser,
      role: devRole,
    };
    const token = jwt.sign(adminObj, privateKey, {
      expiresIn: "1d",
    });
    return res.status(201).json({
      status: "ok",
      token,
    });
  }
  //TODO: Hacer validaciones y chequear BD para crear un JWT
  const BDUser = DB.getUser(user);
  BDUser.then((data) => {
    if (data) {
      const valid = bcrypt.compareSync(password, data.password);
      if (valid) {
        const userObj = {
          user: data.user,
        };
        const token = jwt.sign(userObj, privateKey, {
          expiresIn: "1d",
        });
        return res.status(201).json({
          status: "ok",
          token,
        });
      }
    }
    res.status(401).json({
      status: "error",
      msg: "Usuario o contraseña incorrectos",
    });
  });
};

const getRegister = (req, res) => {
  res.render("register");
};

const postRegister = (req, res) => {
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(req.body.password, salt);

  DB.setNewUser({
    user: req.body.user,
    email: req.body.email,
    password: hash,
  })
    .then(() => {
      res.status(201).json({
        status: "ok",
        msg: "Usuario creado",
      });
    })
    .catch((error) => {
      console.error(error.message);
      res.status(500).json({
        status: "error",
        msg: DB.getErrorMessage(error.code),
        code: error.code
      });
    });
};

const getFinanza = async (req, res) => {
  const id = req.query.id;
  try {
    const finanza = await DB.getTransaction(id);
    res.json({
      id: finanza.key,
      tipo: finanza.props.tipo,
      monto: finanza.props.monto,
      fecha: finanza.props.fecha,
      persona: finanza.props.persona,
      descripcion: finanza.props.descripcion,
      fijo: finanza.props.fijo,
    });
  } catch (error) {
    console.log(error.message);
    res.status(400).json({
      error: "Ha ocurrido un error",
      code: error.$metadata.httpStatusCode,
    });
  }
};

const postFinanza = async (req, res) => {
  let datos = req.body;

  const id = v4().slice(0, 8);
  let finanza = await DB.setTransaction(id, datos);
  console.log(finanza);

  res.json(datos);
};

const putFinanza = async (req, res) => {};

const deleteFinanza = async (req, res) => {};

module.exports = {
  verifyToken,
  getIndex,
  getLastTransactions,
  getFinanzas,
  getLogin,
  postLogin,
  getRegister,
  postRegister,
  getFinanza,
  postFinanza,
  putFinanza,
  deleteFinanza,
};
