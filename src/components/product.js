import axios from 'axios';
import React, { useContext } from 'react'
import { Button, Card } from 'react-bootstrap';
import { Link } from "react-router-dom";
import { Store } from '../Store';
import Rating from './Rating';



export default function Product(props) {
    const { product } = props;

    const { state, dispatch: ctxDispatch } = useContext(Store);
    const {
        cart: { cartItems },
    } = state;
    const addToCartHandler = async (item) => {
        const existItem = cartItems.find((x) => x.id === product.id);
        const quantity = existItem ? existItem.quantity + 1 : 1;

        const { data } = await axios.get(`https://backendweb-heba.up.railway.app/v1/items/${item.id}`);
        if (data.countInStock < quantity) {
            window.alert('Sorry. Product is out of stock');
            return;
        }
        ctxDispatch({
            type: 'CART_ADD_ITEM',
            payload: { ...item, quantity },
        });
    };
    return (
        <Card  key={product.id} className="product">
          <Link to={`/product/${product.id}`}>
            <img src={product.imgUrl} className="card-img-top" alt={product.name} />
          </Link>
          <Card.Body>
            <Link to={`/product/${product.id}`}>
              <Card.Title>{product.name}</Card.Title>
            </Link>
            <Rating rating="3" numReviews={product.numReviews} />
            <Card.Text>${product.price}</Card.Text>
           
              <Button onClick={() => addToCartHandler(product)}>Add to cart</Button>
           
          </Card.Body>
        </Card>
      );
}
