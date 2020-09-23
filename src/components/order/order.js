import React, { useState, useContext, useCallback, useEffect, Component } from 'react';
import { Http } from '../../hooks/http.hook';
import { AuthContext } from '../../context/auth-context';
import { Button, Container, Row, Col, Tab, Nav } from 'react-bootstrap';
import { Product } from './template/product';
import io from 'socket.io-client';
import './order.scss';

const Order = () => {
    const {request, errorHandler, error, cleanError} = Http();
    const auth = useContext(AuthContext);
    const [order, setOrder] = useState([]);

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
        const socket = io('http://localhost:8000');
        socket.on('Order', soketData => {
            setOrder(soketData.data);
        })
        return () => socket.disconnect();
    }, []);

    useEffect(() => {
        getData();
    }, [getData]);
    
    const cancelOrder = async (userId, orderId) => {
        try {
            const data = {userId: userId, orderId: orderId, activUserId: auth.userId};
            await request('/all/delete-order', 'patch', data, {
                Authorization: `Bearer ${auth.token}`
            });
        } catch(e) {}
    }

    const inProcessing = async (userId, orderId) => {
        try {
            const data = {userId: userId, orderId: orderId};
            await request('/all/in-processing', 'put', data, {
                Authorization: `Bearer ${auth.token}`
            });
        } catch(e) {}
    }

    const executeOrder = async (userId, orderId) => {
        try {
            const data = {userId: userId, orderId: orderId};
            await request('execute-order', 'patch', data, {
                Authorization: `Bearer ${auth.token}`
            });
        } catch(e) {}
    }

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
                                    userId={item.userId}
                                    orderId={item.orderId}
                                    key={item.orderId}
                                />
                            </Row>
                        </Container>
                        <br />
                        <div className="btn_container">
                            <Button
                                variant="primary"
                                onClick={() => cancelOrder(item.userId, item.orderId)}
                            >
                                cancel
                            </Button>
                            { auth.admin && 
                                <Button
                                    variant="success"
                                    onClick={() => executeOrder(item.userId, item.orderId)}
                                >
                                    execute
                                </Button>
                            }
                            { auth.admin &&
                                <Button
                                    variant="secondary"
                                    onClick={() => inProcessing(item.userId, item.orderId)}
                                >
                                    in processing
                                </Button>
                            }
                        </div>
                    </Tab.Pane>
                </Tab.Content>
            );
        });
        return template;
    }

    return (
        <Tab.Container id="left-tabs-example" defaultActiveKey="first">
            <Row>
                <Col xs={0} sm={2} md={2} lg={2} xl={2}>
                    {tabTemplate()}
                </Col>
                <Col xs={12} sm={9} md={10} lg={9} xl={10} className="text-center">
                    {tabContentTemplate()}
                </Col>
            </Row>
        </Tab.Container>
    );
}

export default Order;
