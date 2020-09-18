import * as express from 'express';
import { Controllers } from '../controllers/controllers';
import { checkAuth } from '../route-protector/auth';

export const AllRoutes = express.Router();

const routeControllers = new Controllers();

AllRoutes.get('/get-products', routeControllers.getProducts);

AllRoutes.get('/get-product/:prodId', checkAuth, routeControllers.getProduct);

AllRoutes.patch('/add-cart-product', checkAuth, routeControllers.addToCart);

AllRoutes.get('/get-cart-product/:id', checkAuth, routeControllers.productInCart);

AllRoutes.post('/delete-cart-product', checkAuth, routeControllers.deleteCartProduct);

AllRoutes.patch('/order-create', checkAuth, routeControllers.orderCreate);

AllRoutes.get('/all-order/:id', checkAuth, routeControllers.allOrder);

AllRoutes.patch('/delete-order', checkAuth, routeControllers.deleteOrder);

AllRoutes.put('/update-order-product', checkAuth, routeControllers.updateOrderProduct);

AllRoutes.put('/update-cart-product', checkAuth, routeControllers.updateCartProduct);
