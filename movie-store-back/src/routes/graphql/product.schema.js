import { buildSchema } from "graphql";

const productSchema = buildSchema(`
    input ProductInput {
        nombre: String,
        precio: Int,
        thumbnail: String,
        descripcion: String,
    }
    type Product {
        id: ID!,
        nombre: String,
        precio: Int,
        thumbnail: String,
        descripcion: String,
    }
    type Query {
        getProduct(id: ID!): Product,
        getProducts(campo: String, valor: String): [Product],
    }
    type Mutation {
        createProduct(datos: ProductInput): Product,
        updateProduct(id: ID!, datos: ProductInput): Product,
        deleteProduct(id: ID!): Product,
    }
`);

export default productSchema;