import React, { Component, useState, useContext, useCallback, useEffect } from 'react';
import { Http } from '../../hooks/http.hook';
import { AuthContext } from '../../context/auth-context';
import { Button, Container, Row, Col, Tab, Nav } from 'react-bootstrap';
import { Product } from './template/product';
import './order.scss';
import io from 'socket.io-client';

const Order = () => {
    const {loading, request, errorHandler, error, cleanError} = Http();
    const auth = useContext(AuthContext);
    const [order, setOrder] = useState([]);
    const socket = io('http://localhost:8000');

    const getData = useCallback( async () => {
        try {
            await request(`/all/all-order/:?id=${auth.userId}`, 'get', null, {
                Authorization: `Bearer ${auth.token}`
            });
        } catch(e) {}
    }, [request]);

    useEffect(() => {
        errorHandler();
    }, [error, cleanError]);

    useEffect(() => {
        loading ?
        socket.on('Order', soketData => {
            setOrder(soketData.data);
        }) :
        socket.off('Order');
    }, [loading]);

    useEffect(() => {
        getData();
    }, [getData]);

    const tabTemplate = () => {
        const template = order.map(item => {
            return(
                <Nav
                    key={item.orderId}
                    variant="pills"
                    className="flex-column"
                >
                    <Nav.Item key={item.orderId}>
                        <Nav.Link
                            key={item.orderId}
                            eventKey={item.orderId}
                        >
                            {item.name} {item.phoneNumber} {item.email}
                        </Nav.Link>
                    </Nav.Item>
                </Nav>
            );
        });
        return template;
    }

    const tabContentTemplate = () => {
        const template = order.map(item => {
            return(
                <Tab.Content key={item.orderId}>
                    <Tab.Pane
                        eventKey={item.orderId}
                        key={item.orderId}
                    >
                        <Container>
                            <Row xs={2} sm={5} md={6} lg={7} xl={8}>
                                <Product
                                    prod={item.order}
                                    key={item.orderId}
                                />
                            </Row>
                        </Container>
                    </Tab.Pane>
                </Tab.Content>
            );
        });
        return template;
    }

    return (
        <Tab.Container id="left-tabs-example" defaultActiveKey="first">
            <Row>
                <Col sm={3}>
                    {tabTemplate()}
                </Col>
                <Col sm={9}>
                    {tabContentTemplate()}
                </Col>
            </Row>
        </Tab.Container>
    );
}

export default Order;
