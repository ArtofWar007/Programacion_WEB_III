// models/LotePrenda.js

import { DataTypes } from "sequelize";
import db from "../config/database.js";

/**
 * LotePrenda:
 * Representa órdenes de producción
 * y controla su ciclo operativo.
 */
const LotePrenda = db.define(
    "LotePrenda",
    {
        id_lote: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },

        descripcion: {
            type: DataTypes.STRING,
            allowNull: false
        },

        cantidad_solicitada: {
            type: DataTypes.INTEGER,
            allowNull: false
        },

        // Pago unitario interno por producción
        precio_destajo: {
            type: DataTypes.DECIMAL(10, 2),
            defaultValue: 0.00
        },

        // Estados operativos del lote
        estado: {
            type: DataTypes.STRING,
            defaultValue: "Abierto"
        },

        // Control de archivado lógico
        activo: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true
        }
    },
    {
        tableName: "lotes_prendas"
    }
);

export default LotePrenda;