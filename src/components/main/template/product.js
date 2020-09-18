import React, { useContext, useState, useEffect, createRef } from 'react';
import { AuthContext } from '../../../context/auth-context';
import { Button, Modal, Image } from 'react-bootstrap';
import { Http } from '../../../hooks/http.hook';
import  './product.scss';

export const Product = (props) => {
    const fileInputRef = createRef();
    const auth = useContext(AuthContext);
    const {request, errorHandler, error, cleanError} = Http();
    const [show, setShow] = useState(false);
    const [imagePreview, setImagePreview] = useState(undefined);
    const [product, setProduct] = useState({
        title: props.title,
        price: props.price,
        image: props.image
    });

    const edit = () => setShow(true);

    const close = () => setShow(false);

    const accept = async prodId => {
        try {
            const data = new FormData();
            data.append("prodId", prodId);
            data.append("title", product.title);
            data.append("price", product.price);
            data.append("image", product.image, product.title);
            await request('/admin/update-product', 'put', data, {
                Authorization: `Bearer ${auth.token}`
            });
            setShow(false);
        } catch(e) {}
    }

    const setValue = event => {
        setProduct({
            ...product,
            [event.target.name]: event.target.value
        });
    }

    const filePicker = event => {
        setProduct({
            ...product,
            image: event.target.files[0]
        });
        const reader = new FileReader();
        reader.onload = () => {
            setImagePreview(reader.result);
        };
        reader.readAsDataURL(event.target.files[0]);
    }

    const addToCart = async productId => {
        try {
            await request('/all/add-cart-product', 'patch', {productId: productId, userId: auth.userId}, {
                Authorization: `Bearer ${auth.token}`
            });
        } catch(e) {}
    }

    const filePickerClick = () => {
        fileInputRef.current.click();
    }

    useEffect(() => {
        errorHandler();
    }, [error, cleanError]);

    return (
        <>
            <div>
                <div>
                    { imagePreview ?
                        <Image src={imagePreview} alt={product.title} thumbnail />
                        :
                        <Image src={product.image} alt={product.title} thumbnail />
                    }
                </div>
                <div>
                    <p>Title: {product.title}</p>
                    <p>Price: ${product.price}</p>
                </div>
                <div>
                    {
                        auth.isLogin && <Button variant="primary" onClick={() => addToCart(props.id)}>In cart</Button>
                    }
                    {
                        auth.isLogin && auth.admin && <Button variant="primary" onClick={edit}>Edit</Button>
                    }
                    <Modal show={show} onHide={close}>
                        <Modal.Header>
                            <h4>Edit product</h4>
                        </Modal.Header>
                        <Modal.Body>
                            <div>
                                <div>
                                    <label>
                                        Title:
                                        <input value={product.title} name="title" type="text" onChange={setValue}/>
                                    </label>
                                </div>
                                <div>
                                    <label>
                                        Price:
                                        <input value={product.price} name="price" type="text" onChange={setValue}/>
                                    </label>
                                </div>
                                <div>
                                    <Button variant="primary" onClick={filePickerClick}>Change Image</Button>
                                    <input name="image" type="file" ref={fileInputRef} onChange={filePicker} />
                                </div>
                                { imagePreview ?
                                    <div>
                                        <Image src={imagePreview} alt={product.title} thumbnail />
                                    </div> :
                                    <div>
                                        <Image src={product.image} alt={product.title} thumbnail />
                                    </div>
                                }
                                <Button variant="primary" onClick={() => accept(props.id)}>accept</Button>
                                <Button variant="primary" onClick={close}> Close </Button>
                            </div>
                        </Modal.Body>
                    </Modal>
                </div>
            </div>
        </>
    );
}
