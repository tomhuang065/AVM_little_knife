import mongoose from 'mongoose'

const ProfitSchema = new mongoose.Schema({

    //productname : used to identify the name of product
    productname:{ type:String, required:true},

    //total : how much money we can get by selling one of it, use to generate forms
    total:{type:Number, require:true},

    //total : how much money we can get by selling one of it, use to generate forms
    amount:{type:Number, require:true},

    //time:the time of the purchase
    time:{type:Date, require:true}, 

    //description : the descriptio of product
    description:{type:String},

    //user: the user who create the post
    user:{ type: String },

});

const ProfitModel = mongoose.model('Profit', ProfitSchema)
export default ProfitModel