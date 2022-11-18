import './styles/css/App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './components/Home';
import LogIn from './components/LogIn'
import Register from './components/Register'
import NotFound from './components/NotFound';
import Cart from './components/Cart';
import Main from './components/Main';
import { useState, useEffect } from 'react';
import AuthContextProvider from './context/AuthContext';
import CartContextProvider from './context/CartContext';
import ErrorContextProvider from './context/ErrorContext';

function App() {
  const [darkTheme, setDarkTheme] = useState(false || JSON.parse(localStorage.getItem("backProjDarkTheme")));

  const toggleDarkTheme = () => {
    setDarkTheme(current => !current);
  }

  useEffect(() => {
    localStorage.setItem("backProjDarkTheme", JSON.stringify(darkTheme));
  }, [darkTheme])


  return (
    <>
      <ErrorContextProvider>
        <AuthContextProvider>
          <CartContextProvider>
            <div className={darkTheme ? 'root-theme dark-theme' : 'root-theme'}>
              <BrowserRouter>
                <Navbar />
                <Main>
                  <Routes>
                    <Route path="/*" element={<NotFound />} />
                    <Route path='/' element={<Home />} />
                    <Route path='/login' element={<LogIn />} />
                    <Route path='/register' element={<Register />} />
                    <Route path='/cart' element={<Cart />} />
                  </Routes>
                </Main>
                <Footer darkTheme={darkTheme} toggleDarkTheme={toggleDarkTheme} />
              </BrowserRouter>
            </div>
          </CartContextProvider>
        </AuthContextProvider>
      </ErrorContextProvider>
    </>
  );
}

export default App;
