import { ProductoDao } from "../daos/index.dao.js";
import { ProductDto } from "../dtos/index.dto.js";
import WSResponse from "../libs/WSResponse.js";
import logger from "../logs/logger.js";


const getAllProducts = async (req, res) => {
    try {
        const data = await ProductoDao.getAll()

        const productDtos = [];
        data.forEach(product => {
            productDtos.push(new ProductDto(product))
        })

        res.json(new WSResponse(productDtos, "success retrieving products"));
    } catch {
        logger.error("error retrieving products")
        res.status(500).json(new WSResponse(null, "internal server error", true, 500))
    }
}

const getProductById = async (req, res) => {
    if (req.params.id) {
        try {
            const data = await ProductoDao.getById(req.params.id);

            const productDto = new ProductDto(data);

            res.json(new WSResponse(productDto, "success retrieving product"));
        } catch {
            logger.error("error retrieving product")
            res.status(500).json(new WSResponse(null, "internal server error", true, 500))
        }
    } else {
        getAllProducts(req, res);
    }

}

const postProduct = async (req, res) => {
    try {
        const data = await ProductoDao.save(req.body)

        const productDto = new ProductDto(data)

        res.status(201).json(new WSResponse(productDto, "success posting product"))
    } catch {
        logger.error("error posting product")
        res.status(500).json(new WSResponse(null, "internal server error", true, 500))
    }
}

const putProduct = async (req, res) => {
    try {
        const data = await ProductoDao.saveById(req.params.id, req.body)

        res.json(new WSResponse(data, "success updating product"));
    } catch {
        logger.error("error updating product")
        res.status(500).json(new WSResponse(null, "internal server error", true, 500))
    }
}

const deleteProductById = async (req, res) => {
    try {
        const data = await ProductoDao.deleteById(req.params.id)
        res.json(new WSResponse(data, "success deleting product"));
    } catch {
        logger.error("error deleting product")
        res.status(500).json(new WSResponse(null, "internal server error", true, 500))
    }
}

const getProductsByCategory = async (req, res) =>{
    try{
        const data = req.params.category === "todas" ? await ProductoDao.getAll() : await ProductoDao.getAllByCategory(req.params.category)

        const productDtos = [];
        data.forEach(product => {
            productDtos.push(new ProductDto(product))
        })

        res.json(new WSResponse(productDtos, "success retrieving products"));
    } catch{
        logger.error("error retrieving products by category")
        res.status(500).json(new WSResponse(null, "internal server error", true, 500))
    }
}


export default { getAllProducts, getProductById, postProduct, putProduct, deleteProductById, getProductsByCategory }