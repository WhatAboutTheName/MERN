import React, { useState, useEffect, useContext } from 'react';
import { Http } from '../../hooks/http.hook';
import { AuthContext } from '../../context/auth-context';
import { Button } from 'react-bootstrap';
import './add-product.scss';

export const AddProduct = () => {
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

    useEffect(() => {
        errorHandler();
    }, [error, cleanError]);

    return (
        <div className="contauner">
            <div className="form">
                <label>
                    Title:
                    <input name="title" type="text" onChange={setValue} />
                </label>
                <label>
                    Price:
                    <input name="price" type="text" onChange={setValue} />
                </label>
                <div className="image">
                    <input name="image" type="file" onChange={filePicker} />
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
            </div>
        </div>
    );
}
