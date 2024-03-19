import mongoose from "mongoose";
import * as fs from 'fs'

const esquema = new mongoose.Schema({
    nombre:String,marca:String,descripcion:String,cantidad:Number,imagen:String,
},{versionKey:false})

const ProductoModel = new mongoose.model('productos',esquema)

export const getProductos = async(req,res)=>{
    try {
        const {id}=req.params
        const rows = (id===undefined) ? await ProductoModel.find() : await ProductoModel.findById(id)
        return res.status(200).json({status:true,data:rows})
    } catch (error) {
        return res.status(500).json({status:false,errors:[error]})
    }
}

export const saveProducto =  async(req,res)=>{
    try {
        const {nombre,marca,descripcion,cantidad} = req.body
        const validacion = validar (nombre,marca,descripcion,cantidad,req.file,'Y') 
        if (validacion=='') {
            const nuevoProducto = new ProductoModel({
                nombre:nombre,marca:marca,descripcion:descripcion,
                imagen:'/uploads/'+req.file.filename,
                cantidad:cantidad
            })
            return await nuevoProducto.save().then(
                () => {res.status(200).json({status:true,message:'Producto guardado'})}
            )
            
        }else{
            return res.status(400).json({status:false,errors:validacion})
        }
    } catch (error) {
        return res.status(500).json({status:false,errors:[error.message]})
    }
}

export const updateProducto =  async(req,res)=>{
    try {
        const {id} = req.params
        const {nombre,marca,descripcion,cantidad} = req.body
        let imagen = ''
        let valores ={ nombre:nombre,marca:marca,descripcion:descripcion, cantidad:cantidad}
        
        if (req.file !=null) {
            imagen='/uploads/'+req.file.filename
            valores = { nombre:nombre,marca:marca,descripcion:descripcion, cantidad:cantidad, imagen:imagen}
           
        }
    
        const validacion = validar (nombre,marca,descripcion,cantidad) 
        
        if (validacion=='') {
            await ProductoModel.updateOne({_id:id},{$set:valores})
            return res.status(200).json({status:true,message:'Producto actualizado'})
            
        }else{
            return res.status(400).json({status:false,errors:validacion})
        }
    } catch (error) {
        return res.status(500).json({status:false,errors:[error.message]})
    }
}

export const deleteProducto = async (req,res)=>{
    try {
        const {id} = req.params
        await ProductoModel.deleteOne({_id:id})
        return res.status(200).json({status:true,message:'Producto eliminado'})
    } catch (error) {
        return res.status(500).json({status:false,errors:[error.message]})
    }
}

const validar = (nombre,marca,descripcion,cantidad,imagen,sevalida) => {
    var errors =[]
    if (nombre === undefined || nombre.trim() === '') {
        errors.push('El nombre no debe estar vacío')
    }
    if (marca === undefined || nombre.trim() === '') {
        errors.push('La marca no debe estar vacía')
    }
    if (descripcion === undefined || nombre.trim() === '') {
        errors.push('La descripcion no debe estar vacía')
    }
    if (cantidad === undefined || nombre.trim() === '' || isNaN(cantidad)) {
        errors.push('La cantidad no debe estar vacía y ser numérico')
    }
    if(sevalida ==='Y' && imagen ===undefined){
        errors.push('Selecciona una imagen en formato jpg, jpeg o png')
    }else{
        if (errors!='') {
            fs.unlinkSync('./public/uploads/'+imagen.filename)
        }
    }
    return errors
}