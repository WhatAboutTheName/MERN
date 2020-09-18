import { WSocketIO } from '../socket';
import { ProductModel, IProductModel } from '../models/product.model';
import { UserModel, IUserModel } from '../models/user.model';
import { Request, Response, NextFunction} from 'express';

export class Controllers {

  constructor() {}

  async getProducts (req: Request, res: Response, next: NextFunction) {
    try {
      const prod = await ProductModel.find();
      res.status(200).json({
        message: 'Fetched products successfully.',
        product: prod
      });
    } catch(err) {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    }
  }

  async getProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const prod = await ProductModel.findOne({_id: req.query.prodId});
      res.status(200).json({
        message: 'Fetched product successfully.',
        product: prod
      });
    } catch(err) {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    }
  }

  async addToCart (req: Request, res: Response, next: NextFunction) {
    try {
      const user: IUserModel | null = await UserModel.findOne({_id: req.body.userId});
      const prod: IProductModel | null = await ProductModel.findById(req.body.productId);
      if (prod) {
        user?.addToCart(prod);
        res.status(200).json({
          message: 'Product add in cart!'
        });
      }
    } catch(err) {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    }
  }

  async productInCart (req: Request, res: Response, next: NextFunction) {
    try {
      const user: IUserModel | null = await UserModel.findOne({_id: req.query.id});
      const inCart = await user?.populate('cart.items.productId').execPopulate();
      res.status(200).json({
        message: 'Product in cart!',
        product: inCart?.cart.items
      });
    } catch(err) {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    }
  }
  
  async deleteCartProduct (req: Request, res: Response, next: NextFunction) {
    const userId = req.body.userId;
    const prodId = req.body.prodId;
    try {
      const user: IUserModel | null = await UserModel.findOne({_id: userId});
      await user?.deleteItemFromCart(prodId);
      res.status(200).json({
        message: 'Product delete!'
      });
    } catch(err) {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    }
  }
  
  async orderCreate (req: Request, res: Response, next: NextFunction) {
    const userId = req.body.userId;
    const prodData = req.body.prodData;
    try {
      const admin: IUserModel | null = await UserModel.findOne({admin: true});
      const user: IUserModel | null = await UserModel.findById(userId);
      await user?.deleteCart();
      user?.addToOrder(userId, prodData);
      const orderId = await user?.order[user?.order.length - 1]._id;
      admin?.addToOrder(userId, prodData, orderId);
      res.status(200).json({message: 'Order create!'});
    } catch(err) {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    }
  }
  
  async allOrder (req: Request, res: Response, next: NextFunction) {
    let prodArr = [],
        data = [];
    try {
      const person: IUserModel | null = await UserModel.findById(req.query.id);
      for (let i = 0; i < (person ? person.order.length : 0); i++) {
        prodArr = []
        for (let z = 0; z < (person ? person.order[i].prodData.length : 0); z++) {
          const prod = await ProductModel.findById(person?.order[i].prodData[z].prodId);
          if (prod) {
            let el: object = { quantity: person?.order[i].prodData[z].prodQuantity, prod: prod };
            prodArr.push(el);
          }
        }
        if (person?.admin) {
          const user: IUserModel | null = await UserModel.findById(person?.order[i].userId);
          data.push({
            name: user?.name,
            email: user?.email,
            phoneNumber: user?.phoneNumber,
            order: prodArr,
            userId: user?._id,
            orderId: person.order[i].orderId,
            processing: person.order[i].processing
          });
        } else {
          data.push({
            name: person?.name,
            email: person?.email,
            phoneNumber: person?.phoneNumber,
            order: prodArr,
            userId: person?._id,
            orderId: person?.order[i]._id,
            processing: person?.order[i].processing
          });
        }
      }
      WSocketIO.getIO().emit('Order', {data: data});
      res.status(200).json({message: 'Get order!'});
    } catch (err) {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    }
  }
  
  async deleteOrder (req: Request, res: Response, next: NextFunction) {
    let prodArr = [],
        data = [],
        processing = false;
    const userId = req.body.userId;
    const orderId = req.body.orderId;
    const activUserId = req.body.activUserId;
    try {
      const admin: IUserModel | null = await UserModel.findOne({admin: true});
      const user: IUserModel | null = await UserModel.findById(userId);
      await user?.orderStatisticsAll(false);
      await admin?.deleteOrder(orderId, admin.admin);
      await user?.deleteOrder(orderId, user.admin);
      const activUser: IUserModel | null = await UserModel.findById(activUserId);
      for(let personOrder of (activUser ? activUser.order : [])) {
        for (let i = 0; i < personOrder.prodData.length; i++) {
          const prod = await ProductModel.findById(personOrder.prodData[i].prodId);
          if (prod) {
            let el: object = { quantity: personOrder.prodData[i].prodQuantity, prod: prod };
            processing = personOrder.processing;
            prodArr.push(el);
          }
        }
        data.push({
          name: activUser?.name,
          email: activUser?.email,
          phoneNumber: activUser?.phoneNumber,
          order: prodArr,
          userId: activUser?._id,
          orderId: personOrder._id,
          processing: processing
        });
      }
      WSocketIO.getIO().emit('Order', {data: data});
      res.status(200).json({message: 'Delete order!'});
    } catch (err) {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    }
  }

  async updateOrderProduct (req: Request, res: Response, next: NextFunction) {
    const prodId = req.body.prodId;
    const quantity = req.body.quantity;
    const userId = req.body.userId;
    const orderId = req.body.orderId;
    try {
      const admin: IUserModel | null = await UserModel.findOne({admin: true});
      const user: IUserModel | null = await UserModel.findById(userId);
      await admin?.updateOrderProduct(prodId, quantity, orderId, true);
      await user?.updateOrderProduct(prodId, quantity, orderId, false);
      res.status(200).json({message: 'Product in order update!'});
    } catch(err) {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    }
  }

  async updateCartProduct (req: Request, res: Response, next: NextFunction) {
    const prodId = req.body.prodId;
    const quantity = req.body.quantity;
    const userId = req.body.userId;
    try {
      const user: IUserModel | null = await UserModel.findById(userId);
      await user?.updateCartProduct(prodId, quantity);
      res.status(200).json({message: 'Product in cart update!'});
    } catch(err) {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    }
  }
}
