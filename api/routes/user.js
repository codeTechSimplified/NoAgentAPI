const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/user");
const CheckAuth = require('../middleware/check-auth');

router.post("/signup", (req, res, next) => {
  User.find({ number: req.body.number })
    .exec()
    .then(user => {
      if (user.length >= 1) {
        return res.status(409).json({
          message: "Number exists"
        });
      } else {
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          if (err) {
            return res.status(500).json({
              error: err
            });
          } else {
            const user = new User({
              name:req.body.name,
              number: req.body.number,
              password: hash
            });
            user
              .save()
              .then(result => {
                console.log(result);
                res.status(201).json({
                  message: "User created",
                  code:1
                });
              })
              .catch(err => {
                console.log(err);
                res.status(500).json({
                  error: err
                });
              });
          }
        });
      }
    });
});

router.post("/login", (req, res, next) => {
  User.find({ number: req.body.number })
    .exec()
    .then(user => {
      if (user.length < 1) {
        return res.status(401).json({
          message: "Auth failed"
        });
      }
      bcrypt.compare(req.body.password, user[0].password, (err, result) => {
        if (err) {
          return res.status(401).json({
            message: "Auth failed"
          });
        }
        if (result) {
          const token = jwt.sign(
            {
              number: user[0].number,
              userId: user[0]._id
            },
            "key-very-hard-very-very",
            {
                expiresIn: "1h"
            }
          );
          return res.status(200).json({
            message: "Auth successful",
            // user_id:user._id,
            token: token,
            user_id:user[0]._id,
            name:user.user[0].name
          });
        }
        res.status(401).json({
          message: "Auth failed"
        });
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});





module.exports = router;
