export default class ProductDto{
    constructor({_id, nombre, precio, thumbnail, descripcion}){
        this.id = _id,
        this.nombre = nombre,
        this.precio = precio,
        this.thumbnail = thumbnail,
        this.descripcion = descripcion
    }
}