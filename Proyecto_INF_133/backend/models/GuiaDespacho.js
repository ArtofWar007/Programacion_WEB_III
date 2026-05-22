// models/GuiaDespacho.js

import { DataTypes } from "sequelize";
import db from "../config/database.js";

/**
 * GuiaDespacho:
 * Registra envíos realizados desde talleres externos
 * hacia planta y controla su estado de recepción.
 */
const GuiaDespacho = db.define(
    "GuiaDespacho",
    {
        id_despacho: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },

        cantidad_enviada: {
            type: DataTypes.INTEGER,
            allowNull: false
        },

        fecha_envio: {
            type: DataTypes.DATEONLY,
            allowNull: false
        },

        estado_recepcion: {
            type: DataTypes.ENUM(
                "En Camino",
                "Recibido en Planta"
            ),
            defaultValue: "En Camino"
        }
    },
    {
        tableName: "guias_despacho_externo"
    }
);

export default GuiaDespacho;