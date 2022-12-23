import dotenv from "dotenv";
dotenv.config();

let ProductoDao;
let CartDao;
let PedidoDao;
let UserDao;
let ChatDao

switch (process.env.DATABASE.toUpperCase()) {
  case "MONGO":
    ProductoDao = await import(
      "./product.dao.js"
    );
    CartDao = await import(
      "./cart.dao.js"
    );
    PedidoDao = await import(
      "./pedido.dao.js"
    );
    UserDao = await import(
      "./user.dao.js"
    );
    ChatDao = await import(
      "./chat.dao.js"
    )

    break;
}

export { ProductoDao, CartDao, PedidoDao, UserDao, ChatDao };