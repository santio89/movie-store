import React from 'react'
import { useState, useEffect, useContext } from 'react';
import { createContext } from 'react'
import { AuthContext } from './AuthContext';

export const CartContext = createContext();

export default function CartContextProvider({ children }) {
    const [cart, setCart] = useState([])
    const [cartItems, setCartItems] = useState(0)
    const [cartTotal, setCartTotal] = useState(0)
    const [compraSuccess, setCompraSuccess] = useState(false)
    const { user, setUser } = useContext(AuthContext)

    const addToCart = async (id) => {
        try{
            const data = await fetch(`/api/cart/${user.cartId}/productos/${id}`, {
                method: "POST",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
            });
            const dataFinal = await data.json();

            if (dataFinal.code && dataFinal.code === "invalid credentials") {
                setUser(null)
            } else if (!dataFinal.error) {
                setCart(dataFinal.data);
            }
        }
        catch (e){
            console.log("error adding to cart: ", e)
        }
    }

    const removeFromCart = async (id) => {
        try{
            const data = await fetch(`/api/cart/${user.cartId}/productos/${id}`, {
                method: "DELETE",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
            });
            const dataFinal = await data.json();
    
            if (dataFinal.code && dataFinal.code === "invalid credentials") {
                setUser(null)
            } else if (!dataFinal.error) {
                setCart(dataFinal.data);
            }
        } catch(e){
            console.log("error removing from cart: ", e)
        }
    }

    const emptyCart = async () => {
        try{
            const data = await fetch(`/api/cart/empty/${user.cartId}`, {
                method: "DELETE",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
            });
            const dataFinal = await data.json();
            if (dataFinal.message === "success") {
                setCart([])
            }
        } catch(e){
            console.log("error: ", e)
        }
    }

    const cartCheckout = async () => {
        if (cart.length < 1){
            return
        }

        try{
            const pedido = {
                email: user.email,
                name: user.name,
                productos: cart,
                totalItems: cartItems,
                total: cartTotal,
                cartId: user.cartId,
                phone: user.phone,
                address: user.address
            }
    
            const data = await fetch(`/api/pedidos/${user.id}`, {
                method: "POST",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(pedido),
                credentials: 'include'
            });
            
            const dataFinal = await data.json()
    
            if (dataFinal.error === false) {
                window.scrollTo(0, 0);
                setCart([]);
                setCompraSuccess(true);
                setTimeout(()=>{
                  setCompraSuccess(false)
                }, 30000)
            }
        } catch(e){
            console.log("error creating order: ", e)
        }
    }

    useEffect(() => {
        if (user) {
            fetch(`api/cart/${user?.cartId}/productos`).then(res => res.json()).then(res => {
                if (!res.data.error) {
                    setCart(res.data)
                } else {
                    setCart([])
                }
            })
        } else {
            setCart([])
        }
    }, [user])

    useEffect(() => {
        setCartItems(cart.reduce((total, item) => total + item.count, 0));
        setCartTotal(cart.reduce((total, item) => total + item.precio*item.count, 0));
    }, [cart])

    return (
        <CartContext.Provider value={{ cart, setCart, cartItems, cartTotal, addToCart, removeFromCart, emptyCart, cartCheckout, compraSuccess, setCompraSuccess }}>
            {children}
        </CartContext.Provider>
    )
}
