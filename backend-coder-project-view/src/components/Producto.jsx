import { useRef, useState, useContext } from 'react';
import '../styles/css/Producto.css'
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';

export default function Producto({ item }) {
    const imgModal = useRef(null);
    const [info, setInfo] = useState(false);
    const { nombre, precio, thumbnail, descripcion, id } = item;
    const { addToCart, removeFromCart } = useContext(CartContext)
    const { user } = useContext(AuthContext)
    const [waiting, setWaiting] = useState(false);

    const modalCloseClick = (e) => { if (e.target === imgModal.current) { window.removeEventListener("click", modalCloseClick); imgModal.current.close() } };
    const modalCloseScroll = () => { window.removeEventListener("scroll", modalCloseScroll); imgModal.current.close() }

    return (
        <div className={waiting?'producto waiting':'producto'}>
            <div className='producto__innerContainer'>
                <button className='producto__imgContainer' onClick={() => {
                    imgModal.current.showModal();
                    window.addEventListener("click", modalCloseClick);
                    window.addEventListener("scroll", modalCloseScroll)
                }}><img alt={`img-${nombre}`} src={thumbnail} loading="lazy" />

                    <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" className="producto__expand" viewBox="0 0 16 16">
                        <path fillRule="evenodd" d="M5.828 10.172a.5.5 0 0 0-.707 0l-4.096 4.096V11.5a.5.5 0 0 0-1 0v3.975a.5.5 0 0 0 .5.5H4.5a.5.5 0 0 0 0-1H1.732l4.096-4.096a.5.5 0 0 0 0-.707zm4.344-4.344a.5.5 0 0 0 .707 0l4.096-4.096V4.5a.5.5 0 1 0 1 0V.525a.5.5 0 0 0-.5-.5H11.5a.5.5 0 0 0 0 1h2.768l-4.096 4.096a.5.5 0 0 0 0 .707z" />
                    </svg>
                </button>


                <p className='producto__name'>{nombre} - ${precio}</p>

                {user.role === 'user' && <div className="producto__controlsContainer">
                    <button className="producto__controlsContainer__remove" onClick={async () => {setWaiting(true); await removeFromCart(id); setWaiting(false)}}>-</button>
                    <button className="producto__controlsContainer__add" onClick={ async () => {setWaiting(true); await addToCart(id); setWaiting(false)}}>+</button>
                </div>}

                <button className={`producto__dots ${info && "active"}`} onClick={() => setInfo(setInfo => !setInfo)}><svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z" />
                </svg></button>
                <dialog className='producto__imgModal' ref={imgModal}>
                    <button onClick={() => { imgModal.current.close() }}>X</button>
                    <img alt={`img-${nombre}`} src={thumbnail} loading="lazy"></img>
                </dialog>
            </div>
            {info &&
                <div className="producto__innerTextContainer">
                    <div className="producto__innerText">
                        <h4>{nombre.toUpperCase()}</h4>
                        <p>{descripcion.charAt(0).toUpperCase() + descripcion.slice(1) + '.' }</p>
                    </div>
                </div>
            }
        </div>
    )
}