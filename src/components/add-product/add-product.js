import React, { useState, useEffect, useContext, createRef } from 'react';
import { Http } from '../../hooks/http.hook';
import { AuthContext } from '../../context/auth-context';
import { Button, Container, Row, Col } from 'react-bootstrap';
import './add-product.scss';

export const AddProduct = () => {
    const fileInputRef = createRef();
    const auth = useContext(AuthContext);
    const {request, errorHandler, error, cleanError} = Http();
    const [imagePreview, setImagePreview] = useState(undefined);
    const [product, setProduct] = useState({
        title: undefined,
        price: undefined,
        image: null
    });

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

    const uploadImage = async () => {
        try {
            const data = new FormData();
            data.append("title", product.title);
            data.append("price", product.price);
            data.append("image", product.image, product.title);
            await request('/admin/addProduct', 'post', data, {
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
        <Container>
            <Row className="justify-content-md-center">
                <Col
                    xs={{ span: 3, offset: 1 }}
                    sm={{ span: 3, offset: 1 }}
                    md={{ span: 3, offset: 1 }}
                    lg={{ span: 3, offset: 1 }}
                    xl={{ span: 3, offset: 1 }}
                >
                    <div>
                        <label>
                            Title:
                            <input name="title" type="text" onChange={setValue} />
                        </label>
                    </div>
                    <div>
                        <label>
                            Price:
                            <input name="price" type="text" onChange={setValue} />
                        </label>
                    </div>
                    <div className="image">
                        <Button variant="primary" onClick={filePickerClick}>Change Image</Button>
                        <input name="image" type="file" ref={fileInputRef} onChange={filePicker} />
                    </div>
                    { imagePreview ? 
                        <div className="image-preview">
                            <img src={imagePreview} alt={product.title} />
                        </div>
                        :
                        <div className="image-preview">
                            <h4>No image!</h4>
                        </div>
                    }
                    <Button variant="primary" onClick={uploadImage} className="btn">accept</Button>
                </Col>
            </Row>
        </Container>
    );
}
