const mongoose = require('mongoose');

const landSchema = mongoose.Schema({
   
   
      
        user_id: {
          type: mongoose.Schema.Types.ObjectId, 
          required: true
        },
        productImage: {
          type: [
            {type:String,
              required: true}
          ]
        },
       
        price: {
          type: Number,
          required: true
        },
        description:{
          type:String,
          required: true
        },
        district: {
          type: String,
          required: true
        },
        municipality: {
          type: String,
          required: true
        },
        ward: {
          type: String,
          required: true
        },
        path: {
          type: String,
          required: true
        },
        
          lat: {
            type: Number,
            required:true
          },
          lng: {
            type: Number,
            required:true
          }
        
      






});

module.exports = mongoose.model('Land', landSchema);