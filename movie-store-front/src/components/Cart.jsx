import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../context/AuthContext'
import { CartContext } from '../context/CartContext'
import Chat from './Chat';
import { Navigate, Link } from 'react-router-dom';
import '../styles/css/Cart.css'

export default function Cart() {
  const { user } = useContext(AuthContext);
  const { cart, emptyCart, cartCheckout, compraSuccess, setCompraSuccess, addToCart, removeFromCart, cartTotal } = useContext(CartContext);
  const [sentLoading, setSentLoading] = useState(false);

  useEffect(() => {
    window.scrollTo(0,0);
    setCompraSuccess(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className='section-full cart'>
      {!user || user.role !== "user" ? <Navigate to="/" /> :
        <>
          <h1>CART</h1>
          {compraSuccess ?
            <>
              <div className="cart__success">
                <p>Compra realizada con exito! Se ha enviado un correo con los detalles</p>
                <Link to="/">Volver al Home</Link>
              </div>
            </> :
            <>
              <div className="cart__products">
                <p className='cart__title'>DETALLES</p>
                {cart.map((producto, i) =>
                  <div className="cart__products__product" key={i}>
                    <span>{producto?.nombre?.toUpperCase()} </span>
                    <span><img alt='productImg' src={producto.thumbnail} /></span>
                    <span> ${producto?.precio}</span>
                    <span className='cart__products__product__btns'>
                      <div className="cart__products__product__btns__btnContainer">
                        <button onClick={() => removeFromCart(producto?._id)}>-</button>
                        <span className='cart__products__product__count'>{producto?.count}u</span>
                        <button onClick={() => addToCart(producto?._id)}>+</button>
                      </div>
                      <div className="cart__products__product__btns__subtotal">
                        <span>
                          ${producto?.count * producto?.precio}
                        </span>
                      </div>
                    </span>
                  </div>
                )}
              </div>
              <div className="cart__total">
                <span>TOTAL: ${cartTotal}</span>
              </div>
              <div className="cart__buttons">
                <button disabled={sentLoading} onClick={async ()=>{setSentLoading(true); await emptyCart(); setSentLoading(false)}}>Vaciar Carrito</button>
                <button disabled={sentLoading} onClick={async ()=>{setSentLoading(true); await cartCheckout(); setSentLoading(false)}}>Finalizar Compra</button>
              </div>
              <div className="cart__back"><Link to="/">Volver al Home</Link></div>
            </>
          }
          <Chat />
        </>
      }
    </div >
  )
}
