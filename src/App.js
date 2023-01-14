import { useContext } from "react";
import { Badge, Container, Nav, Navbar, NavDropdown } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import CartScreen from "./screens/CartScreen";
import HomeScreen from "./screens/HomeScreen";
import ProductScreen from "./screens/ProductScreen";
import SigninScreen from "./screens/SigninScreen";
import SignupScreen from "./screens/SignupScreen";
import { Store } from "./Store";
import { toast, ToastContainer } from 'react-toastify';
import ShippingAddressScreen from "./screens/ShippingAddressScreen";
import PaymentMethodScreen from "./screens/PaymentMethodScreen";
import PlaceOrderScreen from "./screens/PlaceOrderScreen";
// import ProfileScreen from "./screens/ProfileScreen";


function App() {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { fullBox, cart, userInfo } = state;


  const signoutHandler=()=>{
    ctxDispatch({ type: 'USER_SIGNOUT' });
    localStorage.removeItem("userInfo")
    localStorage.removeItem("shippingAdress")
    localStorage.removeItem('paymentMethod');
    window.location.href = '/signin';

  }
  return (
    <BrowserRouter>
    
    <ToastContainer position="top-center" limit={1} />
      <header >
      <Navbar bg="dark" variant="dark">
        <Container>
          <LinkContainer to="/">
          <Navbar.Brand>Amazona</Navbar.Brand>
          </LinkContainer>
          <Nav className="me-auto  w-100  justify-content-end">
                  <Link to="/cart" className="nav-link">
                  <i className="fas fa-shopping-cart"></i>Cart

                  {cart.cartItems.length > 0 && (
                      <Badge pill bg="danger">
                        {cart.cartItems.reduce((a, c) => a + c.quantity, 0)}
                      </Badge>
                    )}
                  </Link>
                  {userInfo ? (
                    <NavDropdown  title={userInfo.username} id="basic-nav-dropdown">
                      <LinkContainer to="/profile">
                        <NavDropdown.Item>User Profile</NavDropdown.Item>
                      </LinkContainer>
                      <LinkContainer to="/orderhistory">
                        <NavDropdown.Item>Order History</NavDropdown.Item>
                      </LinkContainer>
                      <NavDropdown.Divider />
                      <Link
                        className="dropdown-item"
                        to="#signout"
                        onClick={signoutHandler}
                      >
                        Sign Out
                      </Link>
                    </NavDropdown>
                  ) : (
                    <Link className="nav-link" to="/signin">
                      Sign In
                    </Link>
                  )}
                  </Nav>
        </Container>
      </Navbar>
      
      </header>
      
      <main >
      <Container className="mt-3">
        <Routes>
          <Route path="/product/:slug" element={<ProductScreen />}/>
          <Route path="/cart" element={<CartScreen />}/>
          <Route path="/signin" element={<SigninScreen />}/>
          <Route path="/signup" element={<SignupScreen />} />
          <Route path="/shipping" element={<ShippingAddressScreen />}></Route>
          <Route path="/payment" element={<PaymentMethodScreen />}></Route>
          <Route path="/placeorder" element={<PlaceOrderScreen/>}></Route>
          {/* <Route path="/profile" element={ <ProfileScreen />}
              /> */}
          <Route path="/" element={<HomeScreen />}/>
        </Routes>
        </Container>
      </main>
     
      <footer>
          <div className="text-center">All rights reserved &copy; 2022</div>
      </footer>
    
    </BrowserRouter>
  );
}

export default App;
