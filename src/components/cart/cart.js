import React, { useState, useContext, useEffect, useCallback } from 'react';
import { Http } from '../../hooks/http.hook';
import { Product } from './product/product';
import { AuthContext } from '../../context/auth-context';
import { Button, Container, Row, Col } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import './cart.scss';

export const Cart = () => {
    const history = useHistory();
    const [allSum, setAllSum] = useState(0);
    const auth = useContext(AuthContext);
    const {request, errorHandler, error, cleanError} = Http();
    const [products, setProducts] = useState([]);
    const [prodData, setProdData] = useState([]);

    const getData = useCallback(async () => {
        try {
            const res = await request(`/all/get-cart-product/:?id=${auth.userId}`, 'get', null, {
                Authorization: `Bearer ${auth.token}`
            });
            setProducts(
                ...products,
                res.data.product
            );
            let sum = 0;
            let data = [];
            res.data.product.map(el => {
                sum += +el.quantity * +el.productId.price;
                data.push({ prodId: el.productId._id, prodQuantity: el.quantity });
            });
            setProdData(data);
            setAllSum(sum);
        } catch(e) {}
    }, [request]);

    const postOrder = async () => {
        try {
            const data = {userId: auth.userId, prodData: prodData};
            await request('/all/order-create', 'patch', data, {
                Authorization: `Bearer ${auth.token}`
            });
            history.push('/Order');
        } catch(e) {}
    }

    useEffect(() => {
        errorHandler();
    }, [error, cleanError]);

    useEffect(() => {
        getData();
    }, [getData]);

    return (
        <div className="conteiner">
            <div className="order">
                <p>All sum: {allSum}</p>
                <Button variant="primary" onClick={postOrder}>Accept</Button>
            </div>
            <Container>
                <Row xs={2} sm={4} md={5} lg={6} xl={7}>
                    {
                        !!products.length ? 
                        products.map((product, i) => {
                            return (
                                <Col className="col" key={i}>
                                    <Product
                                        key={product._id}
                                        product={product}
                                        getData={getData}
                                    />
                                </Col>
                            );  
                        }) :
                        <h4>No products in cart!</h4>
                    }
                </Row>
            </Container>
        </div>
    );
}
