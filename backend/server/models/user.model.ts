import * as mongoose from 'mongoose';
import { IUser } from '../interfaces/uesr.interface';
import { IProduct, IOrderItem } from '../interfaces/product.interface';

export interface IUserModel extends IUser, mongoose.Document {
  addToCart(product: IProduct): IUser;
  deleteItemFromCart(productId: mongoose.Schema.Types.ObjectId): IUser;
  deleteCart(): IUser;
  addToOrder(userId: mongoose.Schema.Types.ObjectId,
    prodData: [{ prodId: string, prodQuantity: number }],
    orderId?: mongoose.Schema.Types.ObjectId): IUser;
  deleteOrder(orderId: mongoose.Schema.Types.ObjectId, admin: boolean): IUser;
  orderStatisticsAll(value: boolean): IUser;
  updateOrderProduct(prodId: string, quantity: number, orderId: string, admin: boolean): IUser;
  updateCartProduct(prodId: string, quantity: number): IUser;
  inProcessing(orderId: string, admin: boolean): IUser;
  isLoginChange(flag: boolean): IUser;
}

const Schema = mongoose.Schema;

const userSchema: mongoose.Schema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  phoneNumber: {
    type: String,
    required: true
  },
  admin: {
    type: Boolean,
    required: true,
    default: false
  },
  isLogin: {
    type: Boolean,
    required: true,
    default: false
  },
  cart: {
    items: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: 'Product',
          required: true
        },
        quantity: { type: Number, required: true }
      }
    ]
  },
  orderStatistics: {
    Successful: {
      type: Number,
      required: true,
      default: 0
    },
    Unsuccessful: {
      type: Number,
      required: true,
      default: 0
    }
  },
  order: [
    {
      userId: {
        type: Schema.Types.ObjectId,
        required: true
      },
      prodData: [
        {
          prodId: {
            type: Schema.Types.ObjectId,
            required: true
          },
          prodQuantity: {
            type: Number,
            required: true
          }
        }
      ],
      orderId: {
        type: Schema.Types.ObjectId,
        required: false
      },
      processing: {
        type: Boolean,
        required: false,
        default: false
      }
    }
  ]
}, 
  {
    versionKey: false
  }
);

interface ICartItem {
  _id: string,
  productId: string,
  quantity: number
}

interface IProductItem {
  _id: string,
  title: string,
  price: string,
  image: string
}

userSchema.methods.isLoginChange = function(flag: boolean) {
  this.isLogin = flag;
  return this.save();
};

userSchema.methods.addToCart = function(product: IProductItem) {
  const cartProductIndex = this.cart.items.findIndex((item: ICartItem) => {
    return item.productId.toString() === product._id.toString();
  });
  let newQuantity = 1;
  const updatedCartItems = [...this.cart.items];

  if (cartProductIndex >= 0) {
    newQuantity = this.cart.items[cartProductIndex].quantity + 1;
    updatedCartItems[cartProductIndex].quantity = newQuantity;
  } else {
    updatedCartItems.push({
      productId: product._id,
      quantity: newQuantity
    });
  }
  const updatedCart = {
    items: updatedCartItems
  };
  this.cart = updatedCart;
  return this.save();
};

userSchema.methods.deleteItemFromCart = function(productId: string) {
  const updatedCartItems = this.cart.items.filter((item: ICartItem) => {
    return item.productId.toString() !== productId.toString();
  });
  this.cart.items = updatedCartItems;
  return this.save();
};

userSchema.methods.deleteCart = function() {
  this.cart.items = [];
  return this.save();
};

userSchema.methods.addToOrder = function(
    userId: string,
    prodData: [{ prodId: string, prodQuantity: number }],
    orderId: string
  ) {
  const newOrder = [...this.order];
  newOrder.push({userId: userId, prodData: prodData, orderId: orderId});
  this.order = newOrder;
  return this.save();
}

userSchema.methods.deleteOrder = function(orderId: string, admin: boolean) {
  let newOrder = [];
  if (admin) {
    newOrder = this.order.filter((item: IOrderItem) => item.orderId.toString() !== orderId.toString());
  } else {
    newOrder = this.order.filter((item: IOrderItem) => item._id.toString() !== orderId.toString());
  }
  this.order = newOrder;
  return this.save();
}

userSchema.methods.orderStatisticsAll = function(value: boolean) {
  if (!value) {
    this.orderStatistics.Unsuccessful += 1;
  } else {
    this.orderStatistics.Successful += 1;
  }
  return this.save();
}

userSchema.methods.updateOrderProduct = function(prodId: string, quantity: number, orderId: string, admin: boolean) {
  let flag = false;
  this.order.filter((item: IOrderItem) => {
    if (admin) {
      item.orderId.toString() === orderId.toString() ? flag = !flag : flag;
    } else {
      item._id.toString() === orderId.toString()? flag = !flag : flag;
    }
    if (flag) {
      flag = !flag;
      return item.prodData.filter(prod => {
        if (prod.prodId.toString() === prodId.toString()) {
          Number(quantity) === 0 ? item.prodData.splice(item.prodData.indexOf(prod), 1) : prod.prodQuantity = quantity;
        }
        return item;
      });
    }
  });
  return this.save();
}

userSchema.methods.updateCartProduct = function(prodId: string, quantity: number) {
  let newCartItem = [];
  newCartItem = this.cart.items.filter((item: ICartItem) => {
    if (item.productId.toString() === prodId.toString()) {
      item.quantity = quantity;
    }
    return item;
  });
  this.cart.items = newCartItem;
  return this.save();
};

userSchema.methods.inProcessing = function(orderId: string, admin: boolean) {
  let newOrder = [];
  if (admin) {
    newOrder = this.order.filter((item: IOrderItem) => {
      if (item.orderId.toString() === orderId.toString()) {
        item.processing = !item.processing;
      }
      return item;
    });
  } else {
    newOrder = this.order.filter((item: IOrderItem) => {
      if (item._id.toString() === orderId.toString()) {
        item.processing = !item.processing;
      }
      return item;
    });
  }
  this.order = newOrder;
  return this.save();
}

export const UserModel: mongoose.Model<IUserModel> = mongoose.model<IUserModel>('User', userSchema);