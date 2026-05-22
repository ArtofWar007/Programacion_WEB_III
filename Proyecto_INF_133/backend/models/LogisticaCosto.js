// models/LogisticaCosto.js

import { DataTypes } from "sequelize";
import db from "../config/database.js";

/**
 * LogisticaCosto:
 * Registra gastos operativos asociados
 * a logística, insumos y producción.
 */
const LogisticaCosto = db.define(
    "LogisticaCosto",
    {
        id_gasto: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },

        tipo_gasto: {
            type: DataTypes.ENUM(
                "Insumos Mayor",
                "Insumos Unidad",
                "Lavanderia Externa",
                "Maquinaria"
            ),
            allowNull: false
        },

        descripcion: {
            type: DataTypes.STRING,
            allowNull: false
        },

        monto_bob: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false
        },

        fecha: {
            type: DataTypes.DATEONLY,
            allowNull: false
        }
    },
    {
        tableName: "logistica_y_costos"
    }
);

export default LogisticaCosto;