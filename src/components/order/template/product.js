import React, { Component } from 'react';
import { Col, Image } from 'react-bootstrap';

export const Product = (props) => {

    const prodTemplate = () => {
        console.log(props);
        const template = props.prod.map(item => {
            return(
                <Col key={item.prod._id}>
                    <div>
                        <Image src={item.prod.image} alt={item.prod.title} thumbnail />
                    </div>
                    <div>
                        <p>Title: {item.prod.title}</p>
                        <p>Quantity: {item.prod.quantity}</p>
                        <p>Price: ${item.prod.price * item.quantity}</p>
                    </div>
                </Col>
            );
        });
        return template;
    }

    return(
        <>
            {prodTemplate()}
        </>
    );
}