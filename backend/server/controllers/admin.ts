import { WSocketIO } from '../socket';
import { ProductModel } from '../models/product.model';
import { UserModel, IUserModel } from '../models/user.model';
import { Request, Response, NextFunction } from 'express';

export class AdminControllers {

  constructor() {}

  async addProduct(req: Request, res: Response, next: NextFunction) {
    const image = req.protocol + "://" + req.get("host");
    const title = req.body.title;
    const price = req.body.price;
    try {
      const product = new ProductModel({
        title: title,
        price: price,
        image: image + "/images/" + req['file'].filename
      });
      const prod = await product.save();
      const prods = await ProductModel.find();
      WSocketIO.getIO().emit('newProduct', {product: prods});
      res.status(201).json({message: "Post added successfully"});
    } catch (err) {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    }
  }

  async executeOrder(req: Request, res: Response, next: NextFunction) {
    const userId = req.body.userId;
    const orderId = req.body.orderId;
    try {
      const user: IUserModel | null = await UserModel.findById(userId);
      const admin: IUserModel | null = await UserModel.findOne({admin: true});
      await admin?.deleteOrder(orderId, admin.admin);
      await user?.deleteOrder(orderId, user.admin);
      await user?.orderStatisticsAll(true);
      res.status(200).json({message: 'Execute order!'});
    } catch (err) {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    }
  }

  async updateProduct (req: Request, res: Response, next: NextFunction) {
    const image = req['file'] !== undefined ?
      req.protocol + "://" + req.get("host") + "/images/" + (req['file'] as {filename: string}).filename :
      req.body.image;
    try {
      const prod = new ProductModel({
        _id: req.body.prodId,
        title: req.body.title,
        price: req.body.price,
        image: image
      });
      await ProductModel.updateOne({ _id: req.body.prodId }, prod);
      res.status(200).json({message: 'Update successfully!'});
    } catch (err) {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    }
  }

  async inProcessing(req: Request, res: Response, next: NextFunction) {
    const userId = req.body.userId;
    const orderId = req.body.orderId;
    try {
      const user: IUserModel | null = await UserModel.findById(userId);
      const admin: IUserModel | null = await UserModel.findOne({admin: true});
      await admin?.inProcessing(orderId, admin.admin);
      await user?.inProcessing(orderId, user.admin);
      res.status(200).json({message: 'In processing!'});
    } catch (err) {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    }
  }
}
