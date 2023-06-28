import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addToCart, getCartItems } from '../../Actions/cart.actions'
import PriceDetails from '../../components/PriceDetails/PriceDetails'
import CartItem from './CartItem/CartItem'
import './style.css'
import { Link } from 'react-router-dom';

const CartPage = (props) => {
  
  const cart = useSelector((state)=>state.cart)
  const auth = useSelector((state)=>state.auth)
  const dispatch = useDispatch()

  const [cartItems,setCartItems] = useState(cart.cartItems)

  useEffect(()=>{
    setCartItems(cart.cartItems)
  },[cart.cartItems])

  useEffect(()=>{
    if(auth.authenticate){
      dispatch(getCartItems())
    }
  },[auth.authenticate])
 
  const carNames = Object.keys(cartItems).map(key => cartItems[key].name).join(',');
  const tokenPrices = Object.keys(cartItems).map(key => (cartItems[key].totalPrice / (cartItems[key].totalSupply/1000000000000000000))).join(',');
  const totalTokenPrice = Object.keys(cart.cartItems).reduce(function(qty,key){
    return qty + cart.cartItems[key].qty;
  },0)
  

  const onQuantityIncrement=(_id,qty)=>{
    console.log({_id,qty});
    const {name,totalPrice,tokenPrices,img} = cartItems[_id];
    dispatch(addToCart({_id,name,totalPrice,tokenPrices,img},1))
}

const onQuantityDecrement = (_id,qty) => {
    const {name,totalPrice,tokenPrices,img} = cartItems[_id];
    dispatch(addToCart({_id,name,totalPrice,tokenPrices,img},-1))
}

if(props.onlyCartItems){
  return(
      <>
      {Object.keys(cartItems).map((key,index)=>
      (
          <CartItem
              key={index}
              cartItem={cartItems[key]}
              onQuantityInc={onQuantityIncrement}
              onQuantityDec={onQuantityDecrement}
          />
          )
      )}
      </>
  )
}


  return (
      <div className='containerInCartPage'>
        
        <div className='CartLeft'>
        <div class="cart-header">
        <h2>Checkout</h2>
      </div>
      <br/>
        {Object.keys(cartItems).map((key,index)=>(
          <CartItem
            key={index}
            cartItem={cartItems[key]}
            onQuantityInc={onQuantityIncrement}
            onQuantityDec={onQuantityDecrement}
          />
        ))}
        </div>
        <div class="cartC">
    <div class="cart">
      <div class="cart-header">
        <h2>Order Summary</h2>
      </div>
      <div class="cart-items">
            <p><PriceDetails
          totalItem={Object.keys(cart.cartItems).reduce(function(qty,key){
            return qty + cart.cartItems[key].qty;
          },0)}
          totalPrice={Object.keys(cart.cartItems).reduce((totalPrice,key)=>{
            const {tokenPrice,qty} = cart.cartItems[key]
            return totalPrice + tokenPrices * qty
          },0)}
        /></p>
    </div>
    <div class="cart-footer">
    <Link to={{ pathname: "/dashboard", search: `?cars=${carNames}&prices=${tokenPrices}&tokens=${totalTokenPrice}` }}>
    <button type="button" className="button1">Checkout</button>
    </Link>
      </div>
      
  </div>
        </div>
      </div>
      
  )
}


export default CartPage