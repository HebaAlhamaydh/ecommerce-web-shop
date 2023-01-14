import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react'
import { Button, Container, Form, Toast } from 'react-bootstrap';
import { Helmet } from 'react-helmet-async';
import { Link, useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { Store } from '../Store';
import { getError } from '../utils';
import superAgent from "superagent";
import base64 from "base-64";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function SigninScreen() {

    const navigate = useNavigate();
    const { search } = useLocation();
    const redirectInUrl = new URLSearchParams(search).get('redirect');
    const redirect = redirectInUrl ? redirectInUrl : '/';
  
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
  
    const { state, dispatch: ctxDispatch } = useContext(Store);
    const { userInfo } = state;

    const submitHandler = async (e) => {
     
      e.preventDefault();
      try {
        let username = email;
      console.log(username);
      const response = await superAgent.post("http://localhost:5000/signin")
      .set('authorization',`Basic ${base64.encode(`${username}:${password}`)}`);

      console.log(response.body);
      ctxDispatch({ type: 'USER_SIGNIN', payload: response});
      localStorage.setItem('userInfo', JSON.stringify(response.body));
      navigate(redirect || '/');
  } catch (err) {
    toast.error("invalid password or username");
  }
}
  
    useEffect(() => {
      if (userInfo) {
        navigate(redirect);
      }
    }, [navigate, redirect, userInfo]);



  return (
      <Container className="small-container">
      <Helmet>
        <title>Sign In</title>
      </Helmet>
      <h1 className="my-3">Sign In</h1>
      <Form onSubmit={submitHandler}>
      <Form.Group className="mb-3" controlId="email">
          <Form.Label>Email</Form.Label>
          <Form.Control
           type="text"
            required
            onChange={(e) => setEmail(e.target.value)}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            required
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>
        <div className="mb-3">
          <Button type="submit">Sign In</Button>
        </div>
        <div className="mb-3">
          New customer?{' '}
          <Link to={`/signup?redirect=${redirect}`}>Create your account</Link>
        </div>
      </Form>
      </Container>
  )
}
