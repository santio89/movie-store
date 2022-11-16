import {normalize} from 'normalizr'
import {schema} from 'normalizr'

function normalizeMensajes(mensajes) {
  const author = new schema.Entity("author");

  const mensaje = new schema.Entity(
    "mensaje",
    { author: author },
    { idAttribute: "_id" }
  );

  const schemaMensajes = new schema.Entity(
    "mensajes",
    {
      mensajes: [mensaje],
    }
  );

  const normalizedPost = normalize(
    { id: "mensajes", mensajes },
    schemaMensajes
  );


  return normalizedPost;
}

export default normalizeMensajes;