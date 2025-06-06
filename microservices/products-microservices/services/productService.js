// services/productService.js
const Product = require('../models/Product');

class ProductService {
    static async getAllProducts() {
        return await Product.findAll();
    }

    static async getProductById(id) {
        return await Product.findByPk(id);
    }

    static async createProduct(productData) {
        return await Product.create(productData);
    }

    static async updateProduct(id, productData) {
        const product = await Product.findByPk(id);
        if (product) {
            return await product.update(productData);
        }
        return null;
    }

    static async deleteProduct(id) {
        const result = await Product.destroy({
            where: {
                id
            }
        });
        return result > 0; // Returns true if a row was deleted
    }
}

module.exports = ProductService;