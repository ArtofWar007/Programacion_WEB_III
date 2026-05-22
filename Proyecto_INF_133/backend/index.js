// index.js

import express from "express";
import cors from "cors";

import db from "./config/database.js";

// Modelos
import Usuario from "./models/Usuario.js";
import LogAcceso from "./models/LogAcceso.js";
import LotePrenda from "./models/LotePrenda.js";
import RegistroPlanta from "./models/RegistroPlanta.js";
import ContratoExterno from "./models/ContratoExterno.js";
import GuiaDespacho from "./models/GuiaDespacho.js";
import LogisticaCosto from "./models/LogisticaCosto.js";

// Rutas
import authRoutes from "./routes/auth.routes.js";
import supervisorRoutes from "./routes/supervisor.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import externoRoutes from "./routes/externo.routes.js";
import operarioRoutes from "./routes/operario.routes.js";

const app = express();

// Middleware base
app.use(express.json());
app.use(cors());

// RELACIONES ENTRE MODELOS

// Usuario → Logs de acceso
Usuario.hasMany(LogAcceso, {
    foreignKey: "id_usuario"
});

LogAcceso.belongsTo(Usuario, {
    foreignKey: "id_usuario"
});

// Usuario → Registro de Planta (Operario)
Usuario.hasMany(RegistroPlanta, {
    foreignKey: "id_operario",
    as: "Operario"
});

RegistroPlanta.belongsTo(Usuario, {
    foreignKey: "id_operario",
    as: "Operario"
});

// Usuario → Registro de Planta (Supervisor)
Usuario.hasMany(RegistroPlanta, {
    foreignKey: "id_supervisor",
    as: "Supervisor"
});

RegistroPlanta.belongsTo(Usuario, {
    foreignKey: "id_supervisor",
    as: "Supervisor"
});

// Lote → Producción Planta
LotePrenda.hasMany(RegistroPlanta, {
    foreignKey: "id_lote"
});

RegistroPlanta.belongsTo(LotePrenda, {
    foreignKey: "id_lote"
});

// Usuario → Contratos Externos
Usuario.hasMany(ContratoExterno, {
    foreignKey: "id_taller_externo"
});

ContratoExterno.belongsTo(Usuario, {
    foreignKey: "id_taller_externo"
});

// Lote → Contratos Externos
LotePrenda.hasMany(ContratoExterno, {
    foreignKey: "id_lote"
});

ContratoExterno.belongsTo(LotePrenda, {
    foreignKey: "id_lote"
});

// Contrato → Guías de despacho
ContratoExterno.hasMany(GuiaDespacho, {
    foreignKey: "id_contrato"
});

GuiaDespacho.belongsTo(ContratoExterno, {
    foreignKey: "id_contrato"
});

// Lote → Costos y logística
LotePrenda.hasMany(LogisticaCosto, {
    foreignKey: "id_lote"
});

LogisticaCosto.belongsTo(LotePrenda, {
    foreignKey: "id_lote"
});

//  REGISTRO DE RUTAS

app.use("/api/auth", authRoutes);
app.use("/api/supervisor", supervisorRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/externo", externoRoutes);
app.use("/api/operario", operarioRoutes);
 
//  INICIALIZACIÓN DEL SERVIDOR

const inicializarServidor = async () => {
    try {
        await db.authenticate();
        console.log('Conexión exitosa con MySQL');

        await db.sync({ force: false }); 
        console.log('Las 7 tablas reales y sus relaciones han sido sincronizadas');

        const PUERTO = 5000;
        app.listen(PUERTO, () => {
            console.log(`Servidor en http://localhost:${PUERTO}`);
        });
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

inicializarServidor();