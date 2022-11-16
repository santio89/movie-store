import '../styles/css/Navbar.css';
import { Link } from 'react-router-dom';
import { NavLink } from "react-router-dom";
import useScrollPosition from '../utils/useScrollPosition';
import { useContext, useState } from 'react';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
    const scrollPosition = useScrollPosition()
    const { cartItems, cartTotal } = useContext(CartContext)
    const [navOpen, setNavOpen] = useState(false);
    const { user, logout } = useContext(AuthContext)

    const navToggle = () => {
        setNavOpen(navOpen => !navOpen)
    }

    return (
        <div className={`navbar ${scrollPosition > 80 ? 'scrolled' : ''}`}>
            <div className='link-logo'>
                <Link className="btn-logo" to='/'>
                    <h1 className="logo-btn">MOVIESTORE</h1>
                </Link>
            </div>
            <button className={`navbar__burger ${navOpen ? "is-active" : ""}`} aria-label="menu" onClick={() => navToggle()}>
                <span></span>
                <span></span>
                <span></span>
            </button>
            <div className={`navbar__links${navOpen ? " is-active" : ""}`}>
                {user ?
                    <>
                        <div className="cart-info">
                            <p>{cartItems} items - ${cartTotal}</p>
                        </div>
                        {user.role === 'user' &&
                            <div className='link-btn'>
                                <NavLink className="btn" to='/cart'>
                                    <p className="titulo-btn">CART</p>
                                </NavLink>
                            </div>
                        }
                        <div className='link-btn'>
                            <button className="btn" onClick={() => logout()}>
                                <p className="titulo-btn">LOGOUT</p>
                            </button>
                        </div>
                    </> :
                    <div className='link-btn'>
                        <button className="btn">
                            <Link className="titulo-btn" to="login">LOGIN</Link>
                        </button>
                    </div>
                }
            </div>
        </div>
    );
};

export default Navbar;