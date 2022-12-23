import { expect } from "chai";
import supertest from "supertest";

describe("Testing product routes", () => {
  let request;

  before(async () => {
    request = supertest("http://localhost:8080");

    /* login como admin para tener acceso a la api de productos */
    await request
      .post("/api/user/login")
      .set({ headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      credentials: 'include' })
      .send({ email: "testadmin@test.test", password: "testAdmin01" });
  });

  describe("- POST /api/product", () => {
    const productToCreate = {
      nombre: "test product",
      precio: 123,
      thumbnail: "https://heropy.blog/css/images/vendor_icons/mocha.png", descripcion: "test description"
    }

    let response;

    it("Should return 201", async () => {
      response = await request
        .post("/api/productos")
        .set({ headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        credentials: 'include' })
        .send(productToCreate);
        
      expect(response.status).to.eql(201);
    });

    it("Should return the created product", () => {
      expect(response.body.data.nombre).to.eql(productToCreate.nombre);
      expect(response.body.data.precio).to.eql(Number(productToCreate.precio));
      expect(response.body.data.thumbnail).to.eql(productToCreate.thumbnail);
      expect(response.body.data.descripcion).to.eql(productToCreate.descripcion)
    });

  });

});