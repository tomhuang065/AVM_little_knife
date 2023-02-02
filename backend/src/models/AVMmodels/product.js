import mongoose from 'mongoose'

const ProductSchema = new mongoose.Schema({

    //productname : used to identify the name of product
    productname:{ type:String, required:true},

    //revenue : how much money we can get by selling one of it, use to generate forms
    productprice:{type:String, require:true},

    //itemlist : the name of items for each product selled
    itemlist: [{ type : String, require:true}],

    //amountlist : the amount of items for each product elled, corresponding to itemlist
    amountlist : [{type:String, require:true}],

    //description : the descriptio of product
    description:{type:String},

    //user: the user who create the post
    user:{ type: String },

});

const ProductModel = mongoose.model('Product', ProductSchema)
export default ProductModel