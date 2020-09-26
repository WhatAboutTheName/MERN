import React, { useEffect, useState, useCallback } from 'react';
import { Product } from './template/product';
import { Http } from '../../hooks/http.hook';
import { Container, Row, Col } from 'react-bootstrap';
import io from 'socket.io-client';
import './main.scss';

export const Main = () => {
  const {request, errorHandler, error, cleanError} = Http();
  const [products, setProducts] = useState([]);

  const getData = useCallback(async () => {
    try {
      const res = await request('/all/get-products');
      setProducts(
        ...products,
        res.data.product
      );
    } catch(e) {}
  }, [request]);

  useEffect(() => {
    const socket = io('http://localhost:8000');
    socket.on('newProduct', soketData => {
      setProducts(
        ...products,
        soketData.product
      );
    })
    return () => socket.disconnect();
  }, []);

  useEffect(() => {
    errorHandler();
  }, [error, cleanError]);

  useEffect(() => {
    getData();
  }, [getData]);

  let prod = <h1>Some error</h1>;
  if (!error) {
    prod = products.map(prod => {
      return (
        <Col className="col" key={prod._id}>
          <Product
            title={prod.title}
            price={prod.price}
            image={prod.image}
            id={prod._id}
            key={prod._id}
          />
        </Col>
      )
    });
  }
  return (
    <Container>
      <Row xs={2} sm={5} md={6} lg={7} xl={8}>
        {prod}
      </Row>
    </Container>
  );
}
