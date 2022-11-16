export default class PedidoDto{
    constructor(pedido, id){
        this.id = id,
        this.user = pedido.user,
        this.orden = pedido.orden
    }
}