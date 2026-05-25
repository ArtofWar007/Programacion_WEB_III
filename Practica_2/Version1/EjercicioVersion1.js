import express from 'express';
import { Sequelize, DataTypes } from 'sequelize';

const sequelize = new Sequelize('133base', "root", '', {
    host: 'localhost',
    logging: false,
    dialect: 'mysql'
});

const conectaDB = async () => {
    try {
        await sequelize.authenticate();
        console.log('Conectado a MySQL.');
        await sequelize.sync();
        console.log('Modelos sincronizados.');
    } catch (error) {
        console.error('Error de conexión:', error);
        process.exit(1);
    }
};

const app = express();
app.use(express.json());
conectaDB();

const Categoria = sequelize.define('Categoria', {
    id: { 
        type: DataTypes.INTEGER, 
        primaryKey: true, 
        autoIncrement: true 
    },
    nombre: { 
        type: DataTypes.STRING(100), 
        allowNull: false 
    },
    descripcion: { 
        type: DataTypes.STRING(255) 
    }
}, { 
    tableName: 'categorias2', 
    timestamps: true 
});

const Producto = sequelize.define('Producto', {
    id: { 
        type: DataTypes.INTEGER, 
        primaryKey: true, 
        autoIncrement: true 
    },
    nombre: { 
        type: DataTypes.STRING(100), 
        allowNull: false 
    },
    precio: { 
        type: DataTypes.DECIMAL(10, 2), 
        allowNull: false 
    },
    categoria: { 
        type: DataTypes.INTEGER, 
        allowNull: false 
    }
}, { 
    tableName: 'productos2',
});

// 1. Crea un endpoint POST /categorias que permita registrar una nueva categoría enviando nombre y descripcion en el body de la petición.
app.post('/categoria', async (req, res) => {
    try {
        const { nombre, descripcion } = req.body;
        
        // Validación básica antes de operar
        if (!nombre) {
            return res.status(400).json({ mensaje: "El nombre es obligatorio" });
        }

        const resultado = await Categoria.create({ nombre, descripcion });
        res.status(201).json(resultado);
    } catch (error) {
        console.error("Error al crear categoría:", error);
        res.status(500).json({ mensaje: "Error al guardar la categoría" });
    }
});

// 2. Crea un endpoint GET /categorias que devuelva todas las categorías registradas en la base de datos.
app.get('/categoria', async (req, res) => {
    try {
        const resultado = await Categoria.findAll();
        res.status(200).json(resultado);
    } catch (error) {
        console.error("Error al obtener categorías:", error);
        res.status(500).json({ mensaje: "Error interno del servidor" });
    }
});


// 3. Crea un endpoint GET /categorias/:id que devuelva la categoría con el ID especificado y además, incluya todos los productos que pertenecen a esa categoría.
app.get('/categoria/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const categoria = await Categoria.findByPk(id);

        if (!categoria) {
            return res.status(404).json({ mensaje: "Categoría no encontrada" });
        }

        const productos = await Producto.findAll({ where: { categoria: id } });
        res.status(200).json({ categoria, productos });
    } catch (error) {
        console.error("Error al obtener categoría por ID:", error);
        res.status(500).json({ mensaje: "Error al buscar los datos" });
    }
});

// 4. Crea un endpoint PATCH /categorias/:id que permita actualizar todos los datos de la categoría con el ID especificado.
app.patch('/categoria/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
        // Ejecuta la actualización
        const [filasActualizadas] = await Categoria.update(req.body, { where: { id } });
        res.status(200).json({ mensaje: "Categoría actualizada con éxito" });
    } catch (error) {
        console.error("Error al actualizar categoría:", error);
        res.status(500).json({ mensaje: "Error al actualizar la categoría" });
    }
});

// 5. Crea un endpoint DELETE /categorias/:id que elimine la categoría indicada y, al mismo tiempo, elimine automáticamente todos los productos que pertenecen a esa categoría.
app.delete('/categoria/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
        // Elimina primero los productos vinculados para evitar conflictos de llave foránea
        await Producto.destroy({ where: { categoria: id } });
        const resultado = await Categoria.destroy({ where: { id } });

        if (resultado === 0) {
            return res.status(404).json({ mensaje: "Categoría no encontrada" });
        }

        res.status(200).json({ mensaje: "Categoría y sus productos eliminados" });
    } catch (error) {
        console.error("Error al eliminar categoría:", error);
        res.status(500).json({ mensaje: "Error al eliminar la categoría" });
    }
});

// Crear producto
app.post('/producto', async (req, res) => {
    try {
        const { nombre, precio, categoria } = req.body;

        if (!nombre || !precio || !categoria) {
            return res.status(400).json({ mensaje: "Faltan campos obligatorios" });
        }

        const resultado = await Producto.create({ nombre, precio, categoria });
        res.status(201).json(resultado);
    } catch (error) {
        console.error("Error al crear producto:", error);
        res.status(500).json({ mensaje: "Error al guardar el producto" });
    }
});

const PUERTO = 3001;
app.listen(PUERTO, () => {
    console.log(`Servidor en http://localhost:${PUERTO}`);
});
