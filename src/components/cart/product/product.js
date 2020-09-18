import React, { useState, useContext, useEffect } from 'react';
import { Button, Image, Modal } from 'react-bootstrap';
import { Http } from '../../../hooks/http.hook';
import { AuthContext } from '../../../context/auth-context';

export const Product = (props) => {
    const auth = useContext(AuthContext);
    const [show, setShow] = useState(false);
    const {request, errorHandler, error, cleanError} = Http();
    const [product, setProduct] = useState({
        id: props.product.productId._id,
        title: props.product.productId.title,
        price: props.product.productId.price,
        image: props.product.productId.image,
        quantity: props.product.quantity
    });

    const setValue = event => {
        setProduct({
            ...product,
            [event.target.name]: event.target.value
        });
    }

    const edit = () => setShow(true);

    const close = () => setShow(false);

    const accept = async () => {
        const data = { userId: auth.userId, prodId: product.id, quantity: product.quantity };
        await request('/all/update-cart-product', 'put', data, {
            Authorization: `Bearer ${auth.token}`
        });
        setShow(false);
        props.getData();
    }

    const delProd = async prodId => {
        const data = {prodId: prodId, userId: auth.userId};
        await request('/all/delete-cart-product', 'post', data, {
            Authorization: `Bearer ${auth.token}`
        });
        props.getData();
    }

    useEffect(() => {
        errorHandler();
    }, [error, cleanError]);

    return (
        <div className="prod_content">
            <div className="prod_image">
                <Image src={product.image} alt={product.title} thumbnail />
            </div>
            <div className="prod_info">
                <p>Title: {product.title}</p>
                <p>Quantity: {product.quantity}</p>
                <p>Price: ${product.price * product.quantity}</p>
            </div>
            <div className="btn_content">
                <Button
                    variant="primary"
                    onClick={edit}>
                    Edit
                </Button>
                <Button
                    variant="primary"
                    onClick={() => delProd(product.id)}>
                    Delete
                </Button>
            </div>
            <Modal show={show} onHide={close}>
                        <Modal.Header>
                            <h4>Edit product</h4>
                        </Modal.Header>
                        <Modal.Body>
                            <div>
                                <div>
                                    <label>
                                        Title:
                                        {product.title}
                                    </label>
                                </div>
                                <div>
                                    <label>
                                        Price:
                                        {product.price}
                                    </label>
                                </div>
                                <div>
                                    <label>
                                        Quantity:
                                        <input value={product.quantity} name="quantity" type="text" onChange={setValue}/>
                                    </label>
                                </div>
                                <div className="prod_image">
                                    <Image src={product.image} alt={product.title} thumbnail />
                                </div>
                                <Button variant="primary" onClick={() => accept(product._id)}>accept</Button>
                                <Button variant="primary" onClick={close}> Close </Button>
                            </div>
                        </Modal.Body>
                    </Modal>
        </div>
    );
}