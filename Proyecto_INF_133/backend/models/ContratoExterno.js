// models/ContratoExterno.js

import { DataTypes } from "sequelize";
import db from "../config/database.js";

/**
 * ContratoExterno:
 * Registra contratos de producción asignados
 * a talleres externos por lote.
 */
const ContratoExterno = db.define(
    "ContratoExterno",
    {
        id_contrato: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },

        // Relaciones principales
        id_taller_externo: {
            type: DataTypes.INTEGER,
            allowNull: false
        },

        id_lote: {
            type: DataTypes.INTEGER,
            allowNull: false
        },

        // Datos operativos
        cantidad_encargada: {
            type: DataTypes.INTEGER,
            allowNull: false
        },

        pago_pactado_total: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false
        },

        adelanto_otorgado: {
            type: DataTypes.DECIMAL(10, 2),
            defaultValue: 0.00
        },

        estado_contrato: {
            type: DataTypes.ENUM(
                "Activo",
                "Liquidado",
                "En Deuda"
            ),
            defaultValue: "Activo"
        }
    },
    {
        tableName: "contratos_externos"
    }
);

export default ContratoExterno;