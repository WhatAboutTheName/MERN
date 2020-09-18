export interface IProduct {
    title: string,
    price: string,
    image: string,
    quantity?: number
}

export interface IOrderItem {
  _id: string,
  userId: string,
  prodData: [{
    prodId: string,
    prodQuantity: number
  }],
  orderId: string,
  processing: boolean
}