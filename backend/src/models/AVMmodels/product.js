import mongoose from 'mongoose'

const ProductSchema = new mongoose.Schema({

    //productname : used to identify the name of product
    productname:{ type:String, required:true},

    //revenue : how much money we can get by selling one of it, use to generate forms
    revenue:{type:Number, require:true},

    //itemlist : the name of items for each product selled
    itemlist: [{ type : mongoose.Types.ObjectId, ref: 'Item', required:true}],

    //amountlist : the amount of items for each product elled, corresponding to itemlist
    amountlist : [{type:Number, require:true}]

});

const ProductModel = mongoose.model('Product', ProductSchema)
export default ProductModel