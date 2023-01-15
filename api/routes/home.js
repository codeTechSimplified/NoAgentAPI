const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const multer = require('multer');
const checkAuth = require('../middleware/check-auth');
const fs = require('fs');
const APIFeatures = require('../../utils/apiFeatures');
const path= require('path');

const storage = multer.diskStorage({


  destination: function(req, file, cb) {
    // :::::::::::::::Create diretories:::::::::::::::::::
    fs.mkdir('./uploads/',(err)=>{
       cb(null, './uploads/');
    });
  },
  filename: function(req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  // reject a file
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5
  },
  fileFilter: fileFilter
});

const Home = require("../models/home");

router.get("/", async (req, res, next) => {


  const features = new APIFeatures(Home.find(), req.query)
  .filter()
  .sort()
  .limitFields()
  .paginate();
const home = await features.query;

// SEND RESPONSE
res.status(200).json({
  status: 'success',
  results: home.length,
  data: {
    home
  }
});
console.log(home);
  // Rent.find()
  //   .exec()
  //   .then(docs => {
  //     const response = {
  //       count: docs.length,
  //       lists: docs.map(doc => {
  //         return {
  //           _id: doc._id,
  //           user_id:doc.user_id,
  //           productImage: doc.productImage,
  //           room_type: doc.room_type,
  //           price: doc.price,
  //           district:doc.district,
  //           municipality:doc.municipality,
  //           ward:doc.ward,
  //           path:doc.path,
  //           request: {
  //             type: "GET",
  //             url: "http://localhost:8000/products/" + doc._id
  //           }
  //         };
  //       })
  //     };
  //     //   if (docs.length >= 0) {
  //     res.status(200).json(response);
  //     //   } else {
  //     //       res.status(404).json({
  //     //           message: 'No entries found'
  //     //       });
  //     //   }
  //   })
  //   .catch(err => {
  //     console.log(err);
  //     res.status(500).json({
  //       error: err
  //     });
  //   });
});
router.post("/", checkAuth, upload.array('productImage'), (req, res, next) => {
  let pImage = [];
  req.files.forEach(file=>{
    pImage.push(`http://localhost:8000/${file.path}`);
  })
  const home = new Home({
    user_id:req.body.user_id,
    productImage:pImage,
    home_type: req.body.home_type,
    price: req.body.price,
    description:req.body.description,
    district:req.body.district,
    municipality:req.body.municipality,
    ward:req.body.ward,
    path:req.body.path,
    lat:req.body.lat,
    lng:req.body.lng,
  });
  // console.log(pImage);
  home
    .save()
    .then(result => {
      console.log(result);
      res.status(201).json({
        message: "Created product successfully",
        createdProduct: {
            _id: result._id,
            user_id:result.user_id,
            productImage:result.productImage,
            home_type: result.home_type,
            price: result.price,
            district:result.district,
            municipality:result.municipality,
            ward:result.ward,
            path:result.path,
          
            lat:result.lat,
            lng:result.lng,

            request: {
                type: 'GET',
                url: "http://localhost:8000/" + result._id
            }
        }
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});

router.get("/:productId", (req, res, next) => {
  const id = req.params.productId;
  Home.findById(id)
    // .select('name price _id productImage')
    .exec()
    .then(doc => {
      // console.log("From database", doc);
      if (doc) {
        res.status(200).json({
            product: doc,
            request: {
                type: 'GET',
                url: 'http://localhost:3000/products'
            }
        });
      } else {
        res
          .status(404)
          .json({ message: "No valid entry found for provided ID" });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: err });
    });
});

router.patch("/:productId", checkAuth, (req, res, next) => {
  const id = req.params.productId;
  const updateOps = {};
  for (const ops of req.body) {
    updateOps[ops.propName] = ops.value;
  }
  Product.update({ _id: id }, { $set: updateOps })
    .exec()
    .then(result => {
      res.status(200).json({
          message: 'Product updated',
          request: {
              type: 'GET',
              url: 'http://localhost:3000/products/' + id
          }
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});

router.delete("/:productId", checkAuth, (req, res, next) => {
  const id = req.params.productId;
  let imagePath =[];
  let Path = path.parse(__dirname).dir

  Home.findById(id)
  .exec()
  .then(doc => {
imagePath.push(...doc.productImage);
for(let i=0;i<imagePath.length;i++){
  fs.unlink(path.parse(Path).dir+'/uploads'+imagePath[i].replace('http://localhost:8000/uploads',''),function(err){
    if(err) return console.log(err);
    console.log('file deleted successfully');
});  
}


Home.remove({ _id: id })
.exec()
.then(result => {
  res.status(200).json({
      message: 'Product deleted',
      request: {
          type: 'POST',
          url: 'http://localhost:3000/products',
          body: { name: 'String', price: 'Number' }
      }
  });
})
.catch(err => {
  console.log(err);
  res.status(500).json({
    error: err
  });
});
  })





})

module.exports = router;
