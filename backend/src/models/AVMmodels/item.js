import mongoose from 'mongoose'

const ItemSchema = new mongoose.Schema({

    //itemname: the name of product,  use create item to model it 
    itemname :{ type:String, require:true},

    //price: the cost of the product, changeable
    price:{ type:Number, required: true},

    //amount : the number ot the item left, initialized as zero
    amount:{type:String},

    //unit : the unit of the product
    unit:{type:String, required:true},

    //description:
    description:{ type:String },

    //newName : the updated name of the item
    newname:{type:String},

    //user: the user who create the post
    user:{ type:String },
});

const ItemModel = mongoose.model('Item', ItemSchema)
export default ItemModel