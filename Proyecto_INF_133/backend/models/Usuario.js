// models/Usuario.js

import { DataTypes } from "sequelize";
import db from "../config/database.js";

/**
 * Usuario:
 * Gestiona cuentas del sistema
 * y control de acceso por roles.
 */
const Usuario = db.define(
    "Usuario",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },

        nombre: {
            type: DataTypes.STRING,
            allowNull: false
        },

        correo: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false
        },

        password: {
            type: DataTypes.STRING,
            allowNull: false
        },

        rol: {
            type: DataTypes.ENUM(
                "Administrador",
                "Supervisor",
                "Taller Externo",
                "Operario"
            ),
            allowNull: false
        },

        // Control de baja lógica
        activo: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true
        }
    },
    {
        tableName: "usuarios"
    }
);

export default Usuario;