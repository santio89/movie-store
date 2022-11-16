import React from 'react'
import { useEffect, useState, useRef, useContext } from 'react';
import Producto from './Producto';
import { AuthContext } from '../context/AuthContext';

export default function UserView() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)
  const [searchCat, setSearchCat] = useState("")
  const { user } = useContext(AuthContext)
  const serverInfoModal = useRef();

  const fetchProductsData = async () => {
    try {
      setLoading(true)
      const data = await fetch("/api/productos");
      const dataFinal = await data.json();
      setItems(dataFinal.data)
      setLoading(false)
    } catch (err) {
      console.log("error fetching data", err);
    }
  };

  const fetchProductsCat = async () => {
    try {
      setLoading(true)
      const data = await fetch(`/api/productos/category/${searchCat}`);
      const dataFinal = await data.json();
      setItems(dataFinal.data)
      setLoading(false);

    } catch (err) {
      console.log("error fetching data", err);
    }
  };

  const modalCloseClick = (e) => { if (e.target === serverInfoModal.current) { window.removeEventListener("click", modalCloseClick); serverInfoModal.current.close() } };

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchProductsData();
  }, []);

  useEffect(() => {
    searchCat !== "" && fetchProductsCat();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchCat])

  return (
    <>
      <button className="serverInfoBtn" onClick={() => { serverInfoModal.current.showModal(); window.addEventListener("click", modalCloseClick); serverInfoModal.current.scrollTop = 0; }}>User Info</button>
      <dialog className='producto__imgModal serverInfoWrapper' ref={serverInfoModal}>
        <div className="serverInfoWrapper__serverInfo">
          <p><span className='serverInfoWrapper__serverInfo__key'>• {`Nombre: `}</span><span>{`${user.name}`}</span></p>

          <p><span className='serverInfoWrapper__serverInfo__key'>• {`E-Mail: `}</span><span>{`${user.email}`}</span></p>

          <p><span className='serverInfoWrapper__serverInfo__key'>• {`Dirección: `}</span><span>{`${user.address}`}</span></p>

          <p><span className='serverInfoWrapper__serverInfo__key'>• {`Edad: `}</span><span>{`${user.age}`}</span></p>

          <p><span className='serverInfoWrapper__serverInfo__key'>• {`Teléfono: `}</span><span>{`${user.phone}`}</span></p>

          <p><span className='serverInfoWrapper__serverInfo__key'>• {`Avatar: `}</span><span><img alt="userAvatar" src={user.avatar}></img></span></p>
        </div>
        <button onClick={() => { serverInfoModal.current.close() }}>X</button>
      </dialog>
      <div className="home__list">
        <h2 className='home__title'>LISTADO DE PRODUCTOS</h2>
        <div className="home__search">
          <label htmlFor='home__searchFilter'>Filtrar: </label>
          <select value={searchCat} id="home__searchFilter" onChange={(e) => {
            setSearchCat(e.target.value);
          }}>
            <option value="" disabled>Selecciona una categoría</option>
            <option value="todas">Todas</option>
            <option value="accion">Acción</option>
            <option value="aventura">Aventura</option>
            <option value="cienciaFiccion">Ciencia Ficción</option>
            <option value="comedia">Comedia</option>
            <option value="documental">Documental</option>
            <option value="drama">Drama</option>
            <option value="fantasia">Fantasía</option>
            <option value="musical">Musical</option>
            <option value="terror">Terror</option>
          </select>
        </div>
        <div className="home__grid">
          {loading ? <span className="loader"></span> :
            items?.map(item => {
              return <Producto item={item} key={item.id} />
            })
          }
        </div>
      </div>

    </>
  )
}
