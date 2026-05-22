// models/RegistroPlanta.js

import { DataTypes } from "sequelize";
import db from "../config/database.js";

/**
 * RegistroPlanta:
 * Almacena producción diaria y movimientos
 * operativos registrados en planta.
 */
const RegistroPlanta = db.define(
    "RegistroPlanta",
    {
        id_registro: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },

        prendas_entregadas: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },

        // Adelantos operativos entregados en jornada
        adelanto_dinero: {
            type: DataTypes.DECIMAL(10, 2),
            defaultValue: 0.00
        },

        // Registro únicamente por fecha
        fecha: {
            type: DataTypes.DATEONLY,
            allowNull: false
        }
    },
    {
        tableName: "registro_diario_planta"
    }
);

export default RegistroPlanta;