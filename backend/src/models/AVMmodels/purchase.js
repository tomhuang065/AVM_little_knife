import mongoose from 'mongoose'

const PurchaseSchema = new mongoose.Schema({
    

    //time:the time of the purchase
    time:{type:Date, require:true}, 
    
    //items : the name of items bought
    items: [{ type : mongoose.Types.ObjectId, ref: 'Item', required:true}],

    //amounts: the amount of items bought, corresponding to items
    amounts: [{type:Number, require:true}],

    //comment: comment of the purchase
    comment:{type:String },

    //onjective: 價值標的
    objective:{type:String, require: true},

    //user: the user who create the post
    user:{ type: String },
    
});

const PurchaseModel = mongoose.model('Purchase', PurchaseSchema)
export default PurchaseModel