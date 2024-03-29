import axios from 'axios'
import React, { useContext, useEffect, useReducer, useState } from 'react'
import { Badge, Button, Card, Col, ListGroup, Row } from 'react-bootstrap'
import { Helmet } from 'react-helmet-async'
import { Navigate, useNavigate, useParams } from "react-router-dom"
import LoadingBox from '../components/LoadingBox'
import MessageBox from '../components/MessageBox'
import Rating from '../components/Rating'
import { Store } from '../Store'
import { getError } from '../utils'

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true }
    case 'FETCH_SUCCESS':
      return { ...state, product: action.payload, loading: false }
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
}

export default function ProductScreen() {
  const params = useParams();
  const { slug } = params;

  const [{ loading, error, product }, dispatch] = useReducer(reducer, {
    product: [],
    loading: true,
    error: '',
  })

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: 'FETCH_REQUEST' })
      try {
        const result = await axios.get(`https://backendweb-heba.up.railway.app/v1/items/${slug}`)
        dispatch({ type: 'FETCH_SUCCESS', payload: result.data })
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(err) })
      }
    }
    fetchData()
  }, [slug]);

  const { state, dispatch: ctxDispatch } = useContext(Store);
  
  // const[empty,setEmpty]=useState(true)
  const { cart, userInfo } = state;
  const navigate = useNavigate();

  const addToCartHandler = async () => {
    const existItem = cart.cartItems.find((x) => x.id === product.id);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    const { data } = await axios.get(`https://backendweb-heba.up.railway.app/v1/items/${product.id}`);
    if (data.countInStock < quantity) {
      // setEmpty(false)
      window.alert('Sorry. Product is out of stock');
      return;
    }
    ctxDispatch({
      type: 'CART_ADD_ITEM',
      payload: { ...product, quantity },
    });
    navigate('/cart');

  }
  return loading ? (
    <LoadingBox />
  ) : error ? (
    <MessageBox variant="primary">{error}</MessageBox>
  ) : (
    <div>
      <Row>
        <Col md={6}>
          <img src={product.imgUrl} className="image-large" alt={product.name} />
        </Col>
        <Col md={3}>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <Helmet>
                <title>{product.name}</title>
              </Helmet>

              <h1>{product.name}</h1>

            </ListGroup.Item>
            <ListGroup.Item>
              <Rating rating="3" numReviews={product.numReviews}></Rating>
            </ListGroup.Item>
            <ListGroup.Item>
              price:{product.price}
            </ListGroup.Item>
            <ListGroup.Item>
              description:<p>{product.description}</p>
            </ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={3}>
          <Card>
            <Card.Body>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <Row>
                    <Col>Price:</Col>
                    <Col>{product.price}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                <Row>
                    <Col>Status:</Col>
                    <Col>
                      {product.countInStock>0 ? (
                      <Badge bg="success">In Stock</Badge>
                      ) : (
                        <Badge bg="danger">Unavailable</Badge>
                      )}
                    </Col>
                  </Row>
                   
                </ListGroup.Item>

                {product.countInStock > 0 && (
                  <ListGroup.Item>
                    <div className='d-grid'>
                      <Button onClick={addToCartHandler} variant="primary">Add to cart</Button>
                    </div>
                  </ListGroup.Item>
                )}

              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>

  );

}
