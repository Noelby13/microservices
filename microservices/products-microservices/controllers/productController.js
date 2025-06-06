// controllers/productController.js
const ProductService = require('../services/productService');
const { sequelize } = require('../config/db');
const { Product } = require('../models'); // Ajusta la ruta si es diferente


class ProductController {
    static async getAllProducts(req, res) {
        try {
            const products = await ProductService.getAllProducts();
            res.status(200).json(products);
        } catch (error) {
            console.error('Error getting all products:', error);
            res.status(500).json({
                message: 'Error fetching products',
                error: error.message
            });
        }
    }

    static async getProductById(req, res) {
        try {
            const {
                id
            } = req.params;
            const product = await ProductService.getProductById(id);
            if (product) {
                res.status(200).json(product);
            } else {
                res.status(404).json({
                    message: 'Product not found'
                });
            }
        } catch (error) {
            console.error('Error getting product by ID:', error);
            res.status(500).json({
                message: 'Error fetching product',
                error: error.message
            });
        }
    }

    static async createProduct(req, res) {
        try {
            const productData = req.body;
            const newProduct = await ProductService.createProduct(productData);
            res.status(201).json(newProduct);
        } catch (error) {
            console.error('Error creating product:', error);
            res.status(500).json({
                message: 'Error creating product',
                error: error.message
            });
        }
    }

    static async updateProduct(req, res) {
        try {
            const {
                id
            } = req.params;
            const productData = req.body;
            const updated = await ProductService.updateProduct(id, productData);
            if (updated) {
                res.status(200).json({
                    message: 'Product updated successfully'
                });
            } else {
                res.status(404).json({
                    message: 'Product not found or no changes made'
                });
            }
        } catch (error) {
            console.error('Error updating product:', error);
            res.status(500).json({
                message: 'Error updating product',
                error: error.message
            });
        }
    }

    static async deleteProduct(req, res) {
        try {
            const {
                id
            } = req.params;
            const deleted = await ProductService.deleteProduct(id);
            if (deleted) {
                res.status(204).send(); // No content for successful deletion
            } else {
                res.status(404).json({
                    message: 'Product not found'
                });
            }
        } catch (error) {
            console.error('Error deleting product:', error);
            res.status(500).json({
                message: 'Error deleting product',
                error: error.message
            });
        }
    }

static async updateStock(req, res) {
    try {
        const { id } = req.params;
        const { cantidad } = req.body;

        const product = await Product.findByPk(id);

        if (!product) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }

        if (product.stock < cantidad) {
            return res.status(400).json({ message: 'Stock insuficiente' });
        }

        product.stock -= cantidad;
        await product.save();

        return res.status(200).json({ message: 'Stock actualizado correctamente' });
    } catch (error) {
        console.error('Error actualizando stock:', error);
        return res.status(500).json({
            message: 'Error actualizando stock',
            error: error.message
        });
    }
}



}



module.exports = ProductController;