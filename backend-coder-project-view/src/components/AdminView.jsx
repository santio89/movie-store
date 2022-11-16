import React from 'react'
import { useEffect, useState, useRef } from 'react';
import Producto from './Producto';

export default function AdminView() {
  const [items, setItems] = useState([])
  const [formNombre, setFormNombre] = useState("")
  const [formPrecio, setFormPrecio] = useState("")
  const [formThumbnail, setFormThumbnail] = useState("")
  const [formDescripcion, setFormDescripcion] = useState("")
  const [formCategoria, setFormCategoria] = useState("")
  const [serverInfo, setServerInfo] = useState({})
  const [loading, setLoading] = useState(false)
  const [sentLoading, setSentLoading] = useState(false)
  const [searchCat, setSearchCat] = useState("")

  const serverInfoModal = useRef();
  const fetchServerInfo = async () => {
    const data = await fetch("/api/serverinfo")
    const dataFinal = await data.json();
    setServerInfo(dataFinal.data)
  }

  const modalCloseClick = (e) => { if (e.target === serverInfoModal.current) { window.removeEventListener("click", modalCloseClick); serverInfoModal.current.close() } };

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

  const handleSubmit = (e) => {
    e.preventDefault();
    setSentLoading(true);
    fetch("/api/productos", {
      method: "POST",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ nombre: formNombre, precio: formPrecio, thumbnail: formThumbnail, descripcion: formDescripcion, categoria: formCategoria }),
      credentials: 'include'
    }).then(res => res.json()).then(res => {
      setSentLoading(false);
      if (res.error === false) {
        setFormNombre("")
        setFormPrecio("")
        setFormThumbnail("")
        setFormDescripcion("")
        setFormCategoria("")
        fetchProductsData();
      } else {
        console.log("error uploading product: ", res)
      }
    }).catch(e => console.log("error uploading product: ", e))
  }

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchProductsData();
    fetchServerInfo();
  }, []);

  useEffect(() => {
    searchCat !== "" && fetchProductsCat();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchCat])

  return (
    <>
      <button className="serverInfoBtn" onClick={() => { serverInfoModal.current.showModal(); window.addEventListener("click", modalCloseClick); serverInfoModal.current.scrollTop = 0; }}>Server Info</button>
      <dialog className='producto__imgModal serverInfoWrapper' ref={serverInfoModal}>
        <div className="serverInfoWrapper__serverInfo">
          {Object.entries(serverInfo).map((entry, i) =>
            <React.Fragment key={i}><p><span className='serverInfoWrapper__serverInfo__key'>• {`${entry[0]}:`}</span><span>{`${entry[1]}`}</span></p></React.Fragment>
          )}
        </div>
        <button onClick={() => { serverInfoModal.current.close() }}>X</button>
      </dialog>

     

      <div className="home__upload">
        <h2>CARGAR PRODUCTO</h2>
        <form className="home__form" onSubmit={handleSubmit}>
          <label htmlFor="uploadProd__title">Nombre: </label>
          <input type="text" name="nombre" id="uploadProd__title" required maxLength={50}
            title="Ingresar título" value={formNombre} onChange={e => { setFormNombre(e.target.value) }} />

          <label htmlFor="uploadProd__price">Precio (USD): </label>
          <input type="text" name="precio" id="uploadProd__price" required pattern="[0-9]{1,10}"
            maxLength={10} title="Ingresar precio" value={formPrecio} onChange={e => { setFormPrecio(e.target.value) }} />

          <label htmlFor="uploadProd__img">Imagen - URL: </label>
          <input required type="text" name="thumbnail" id="uploadProd__img" title="Ingresar url de imagen" value={formThumbnail} onChange={e => { setFormThumbnail(e.target.value) }} />

          <label htmlFor="uploadProd__categories">Categoría:</label>
          <select value={formCategoria} required id="uploadProd__categories" onChange={(e) => {
            const selectCategoria = e.target.value;
            setFormCategoria(selectCategoria);
          }}>
            <option value="" disabled>Selecciona una categoría</option>
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

          <label htmlFor="uploadProd__desc">Descripcion: </label>
          <textarea rows="4" type="text" name="descripcion" id="uploadProd__desc" required
            maxLength={100} title="Ingresar descripcion" value={formDescripcion} onChange={e => { setFormDescripcion(e.target.value) }} />
          <button disabled={sentLoading}>{sentLoading ? <span className="loader"></span> : <>Enviar</>}</button>
        </form>
      </div>

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
