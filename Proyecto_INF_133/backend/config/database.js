// config/database.js

import { Sequelize } from "sequelize";

/**
 * Conexión principal a MySQL.
 * Configuración base utilizada por todos los modelos.
 */
const db = new Sequelize("basededatos_textil", "root","",
    {
        host: "localhost",
        dialect: "mysql",
        logging: false,
        define: {
            timestamps: false
        }
    }
);

export default db;