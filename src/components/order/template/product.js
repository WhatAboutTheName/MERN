import React, { useContext, useState, useEffect } from 'react';
import { Modal, Button, Col, Image } from 'react-bootstrap';
import { Http } from '../../../hooks/http.hook';
import { useSelector } from 'react-redux';

export const Product = (props) => {
    const [show, setShow] = useState(false);
    const {request, errorHandler, error, cleanError} = Http();
    const auth = useSelector(state => state.auth);
    const [product, setProduct] = useState({
        title: '',
        price: '',
        image: '',
        quantity: '',
        id: ''
    });

    const edit = (item) => {
        setProduct({
            title: item.prod.title,
            price: item.prod.price,
            image: item.prod.image,
            quantity: item.quantity,
            id: item.prod._id
        });
        setShow(true);
    }

    const close = () => setShow(false);

    const setValue = event => {
        setProduct({
            ...product,
            [event.target.name]: event.target.value
        });
    }

    const editDelOrder = async (prodId, quantity, userId, orderId) => {
        try {
            const data = {prodId: prodId, quantity: quantity, userId: userId, orderId: '5f6066c7ace62b1a8c2b7438'};
            await request('/all/update-order-product', 'put', data, {
                Authorization: `Bearer ${auth.token}`
            });
            setShow(false);
        } catch(e) {}
    }

    useEffect(() => {
        errorHandler();
    }, [error, cleanError]);

    const prodTemplate = () => {
        const template = props.prod.map(item => {
            return(
                <Col key={item.prod._id}>
                    <div>
                        <Image src={item.prod.image} alt={item.prod.title} thumbnail />
                    </div>
                    <div>
                        <p>Title: {item.prod.title}</p>
                        <p>Quantity: {item.quantity}</p>
                        <p>Price: ${item.prod.price * item.quantity}</p>
                    </div>
                    <Button
                        variant="primary"
                        onClick={() => edit(item)}
                    >
                        Edit
                    </Button>
                    <Button
                        variant="danger"
                        onClick={() => editDelOrder(item.prod._id, 0, props.userId, props.orderId)}
                    >
                        Delete
                    </Button>
                </Col>
            );
        });
        return template;
    }

    return(
        <>
            {prodTemplate()}
            <Modal show={show} onHide={close}>
                <Modal.Header>
                    <h4>Edit product</h4>
                </Modal.Header>
                <Modal.Body>
                <div>
                    <div>
                        <label>
                            Title: {product.title}
                        </label>
                    </div>
                    <div>
                        <label>
                            Price: {product.price}
                        </label>
                    </div>
                    <div>
                        <label>
                            Quantity:
                            <input value={product.quantity} name="quantity" type="text" onChange={setValue}/>
                        </label>
                    </div>
                    <div>
                        <Image src={product.image} alt={product.title} thumbnail />
                    </div>
                    <Button
                        variant="primary"
                        onClick={() => editDelOrder(product.id, product.quantity, props.userId, props.orderId)}
                    >
                        accept
                    </Button>
                    <Button variant="primary" onClick={close}> Close </Button>
                </div>
                </Modal.Body>
            </Modal>
        </>
    );
}