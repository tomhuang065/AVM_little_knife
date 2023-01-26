import mongoose from 'mongoose'

const CustomerSchema = new mongoose.Schema({

    //username: used to identify the user in the database, create when first login
    username:{type:String, require:true},
    
    //account/password: used for login
    mail:{ type:String , require:true},//account: email
    password:{ type:String , require:true}, //need to be changed to bcript


    //asset: store the asset of the user, useful when it comes to generate forms
    asset:{ type : Number },

    //description: for profile
    description:{type:String},

    //items: used to store the total items available for use
    items: [{ type : mongoose.Types.ObjectId, ref: 'Item'}],

    //products: used to store the total items available for use
    products: [{ type : mongoose.Types.ObjectId, ref: 'Product'}]

});

const CustomerModel = mongoose.model('Customer', CustomerSchema)
export default CustomerModel