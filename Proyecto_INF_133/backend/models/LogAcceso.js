// models/LogAcceso.js

import { DataTypes, Sequelize } from "sequelize";
import db from "../config/database.js";

/**
 * LogAcceso:
 * Registra eventos de ingreso y salida
 * de usuarios dentro del sistema.
 */
const LogAcceso = db.define(
    "LogAcceso",
    {
        id_log: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },

        evento: {
            type: DataTypes.ENUM(
                "Ingreso",
                "Salida"
            ),
            allowNull: false
        },

        fecha_hora: {
            type: DataTypes.DATE,
            defaultValue: Sequelize.NOW
        },

        direccion_ip: {
            type: DataTypes.STRING,
            defaultValue: "127.0.0.1"
        }
    },
    {
        tableName: "log_accesos"
    }
);

export default LogAcceso;