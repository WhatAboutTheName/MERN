import * as mongoose from 'mongoose';
import { IProduct } from '../interfaces/product.interface';

export interface IProductModel extends IProduct, mongoose.Document {}

const Schema = mongoose.Schema;

const productSchema: mongoose.Schema = new Schema({
    title: {
        type: String,
        require: true
    },
    price: {
        type: String,
        require: true
    },
    image: {
        type: String,
        required: true
    }
});

export const ProductModel: mongoose.Model<IProductModel> = mongoose.model<IProductModel>('Product', productSchema);