import { Router } from "express";
import { getProductos,saveProducto,updateProducto,deleteProducto } from "../Controllers/ProductosController.js";
import { subirImagen } from "../Middleware/Storage.js";

const rutas = Router()

rutas.get('/api/productos',getProductos)
rutas.get('/api/productos/:id',getProductos)
rutas.post('/api/productos',subirImagen.single('imagen'),saveProducto)
rutas.put('/api/productos/:id',subirImagen.single('imagen'),updateProducto)
rutas.delete('/api/productos/:id',deleteProducto)

export default rutas