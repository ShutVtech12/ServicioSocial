const Alumno = require('../models/Alumno')
const Maestra = require('../models/Maestra')
const Tarea = require('../models/Tarea')
const Archivo = require('../models/Archivo')
const Grupo = require('../models/Grupo')
const Racha = require('../models/Racha')
const Testing = require('../models/Testing')
const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')
require('dotenv').config({ path: 'variables.env' })

//Crea y firma un jsonwebtoken
const crearToken = (alumno, secreta, expiresIn) => {
    const { id, boleta, nombre, grupo } = alumno

    return jwt.sign({ id, boleta, nombre, grupo }, secreta, { expiresIn })
}

const crearTokenMaestra = (maestra, secreta, expiresIn) => {
    const { id, correo, nombre } = maestra

    return jwt.sign({ id, correo, nombre }, secreta, { expiresIn })
}

const resolvers = {
    Query: {
        //Todo lo que es obtener datos en Query
        obtenerGrupos: async (_, { }, ctx) => {
            const grupos = await Grupo.find({ profesora: ctx.usuario.id })
            return grupos
        },
        obtenerTodosGrupos: async (_, { }, ctx) => {
            const grupos = await Grupo.find()
            return grupos
        },
        obtenerTareas: async (_, { input }, ctx) => {
            const tareas = await Tarea.find({ creador: ctx.usuario.id }).where('grupoPertenece').equals(input.grupoPertenece)
            return tareas
        },
        obtenerTodasTareas: async (_, { }, ctx) => {
            const tareas = await Tarea.find({ creador: ctx.usuario.id })
            return tareas
        },
        obtenerTareaArchivo: async (_, { input }, ctx) => {
            const tarea = await Tarea.findOne({ _id: input.tareaAsignada })
            return tarea
        },
        obtenerAlumnosGrupo: async (_, { input }, ctx) => {
            const alumnos = await Alumno.where('grupo').equals(input.grupoPertenece)
            return alumnos
        },
        obtenerAlumnos: async (_, { input }, ctx) => {
            const alumnos = await Alumno.where('grupo').equals(input.grupoPertenece)
            return alumnos
        },
        obtenerTareasAlumno: async (_, { }, ctx) => {
            const tareas = await Tarea.where('grupoPertenece').equals(ctx.usuario.grupo)
            return tareas
        },
        obtenerInfoAlumno: async (_, { }, ctx) => {
            const alumno = await Alumno.where('grupo').equals(ctx.usuario.grupo)
            console.log(alumno)
            return alumno
        },
        obtenerInfoSoloAlumno: async (_, { }, ctx) => {
            const alumno = await Alumno.findOne({ _id: ctx.usuario.id });
            return alumno
        },
        obtenerArchivo: async (_, { }, ctx) => {
            const archivo = await Archivo.find({ autor: ctx.usuario.id }).where('estado').equals(true)
            return archivo
        },
        obtenerArchivoAlumnos: async (_, { input }, ctx) => {
            const archivo = await Archivo.where('tareaAsignada').equals(input.tareaAsignada)
            return archivo
        },
        obtenerArchivosAlumno: async (_, { input }, ctx) => {
            const archivos = await Archivo.find({
                autor: input.autor,
                tareaAsignada: input.tareaAsignada
            });
            return archivos;
        },
        obtenerRacha: async (_, { }, ctx) => {
            const racha = await Racha.findOne({ autor: ctx.usuario.id });
            return racha; // Devuelve null si no hay racha, o el objeto si sí hay
        },
        obtenerTesting: async () => {
            const doc = await Testing.findOne();
            if (!doc) return null; // Si no hay documento, regresa null
            return { id: doc._id, version: doc.version }; // Asegura que regresa el campo version
        }
    },
    Mutation: {
        //El primero es el root.
        //El segundo son los argumentos que se le pasan al valor
        //El tercero es el context
        //El cuarto es información adicional        
        crearMaestra: async (_, { input }) => {
            const { correo, password } = input
            const existeMaestra = await Maestra.findOne({ correo })
            console.log(existeMaestra)
            if (existeMaestra) {
                throw new Error('Esos datos ya estan registrados')
            }
            try {
                //Hashear password
                const salt = await bcryptjs.genSalt(10)
                input.password = await bcryptjs.hash(password, salt)
                console.log(input)
                //Registra nuevo maestra
                const nuevaMaestra = new Maestra(input)
                //Ya se guarda el maestra
                nuevaMaestra.save()
                return "Maestra creada correctamente"
            } catch (error) {
                console.log(error)
            }
        },
        autenticarMaestra: async (_, { input }) => {
            const { correo, password } = input
            //Si la maestra existe
            const existeMaestra = await Maestra.findOne({ correo })
            if (!existeMaestra) {
                throw new Error('El usuario no existe')
            }
            //Si el password es correcto
            const passwordCorrecto = await bcryptjs.compare(password, existeMaestra.password)
            console.log('Password correcto')
            if (!passwordCorrecto) {
                throw new Error('Password incorrecto')
            }
            //Dar acceso a la app
            return {
                token: crearTokenMaestra(existeMaestra, process.env.SECRETA, '2hr')
            }
        },
        nuevoGrupo: async (_, { input }, ctx) => {
            const { grupo, nombre } = input
            const existeGrupo = await Grupo.findOne({ grupo })
            if (existeGrupo) {
                throw new Error('Ese grupo ya existe')
            } else {
                try {
                    const nuevogrupo = new Grupo(input)
                    //Asociamos con el creador
                    nuevogrupo.profesora = ctx.usuario.id
                    //Almacenamos en la BD
                    const resultado = await nuevogrupo.save()
                    return resultado
                } catch (error) {
                    console.log(error)
                }
            }

        },
        actualizarGrupo: async (_, { id, input }, ctx) => {
            //Revisar si el grupo existe
            let grupo = await Grupo.findById(id);
            if (!grupo) {
                throw new Error("Grupo no encontrado");
            }
            //Revisar que si la persona lo edita es el creador
            if (grupo.profesora.toString() !== ctx.usuario.id) {
                throw new Error("No tienes las credenciales");

            }
            //Guardar Grupo
            grupo = await Grupo.findOneAndUpdate({ _id: id }, input, { new: true })
            return grupo
        },
        eliminarGrupo: async (_, { id }, ctx) => {
            //Revisar si el grupo existe
            let grupo = await Grupo.findById(id);
            if (!grupo) {
                throw new Error("Grupo no encontrado");
            }
            //Revisar que si la persona lo edita es el creador
            if (grupo.profesora.toString() !== ctx.usuario.id) {
                throw new Error("No tienes las credenciales");

            }
            //Eliminar
            await Grupo.findOneAndDelete({ _id: id })
            return "Grupo Eliminado"
        },
        nuevaTarea: async (_, { input }, ctx) => {
            try {
                const tarea = new Tarea(input)
                tarea.creador = ctx.usuario.id
                //Almacenamos en la BD
                const resultado = await tarea.save()
                return resultado
            } catch (error) {
                console.log(error)
            }
        },
        actualizarTarea: async (_, { id, input }, ctx) => {
            //Si la tarea existe o no
            let tarea = await Tarea.findById(id)
            if (!tarea) {
                throw new Error("Tarea no encontrada");
            }
            //Si la maestra es quien lo edita
            //Revisar que si la persona lo edita es el creador
            if (tarea.creador.toString() !== ctx.usuario.id) {
                throw new Error("No tienes las credenciales");
            }
            //Guardar y retornar la tarea
            tarea = await Tarea.findOneAndUpdate({ _id: id }, input, { new: true })
            return tarea
        },
        eliminarTarea: async (_, { id }, ctx) => {
            //Revisar si el grupo existe
            let tarea = await Tarea.findById(id);
            if (!tarea) {
                throw new Error("Tarea no encontrada");
            }
            //Revisar que si la persona lo edita es el creador
            if (tarea.creador.toString() !== ctx.usuario.id) {
                throw new Error("No tienes las credenciales");
            }
            //Eliminar
            await Tarea.findOneAndDelete({ _id: id })
            return "Tarea Eliminada"
        },
        eliminarGrupoTarea: async (_, { input }, ctx) => {
            try {
                // 1. Busca todos los alumnos del grupo (antes de eliminarlos)
                const alumnos = await Alumno.find({ grupo: input.grupoPertenece });
                const alumnosIds = alumnos.map(a => a._id);

                // 2. Elimina todas las rachas de esos alumnos
                await Racha.deleteMany({ autor: { $in: alumnosIds } });
                // 3. Elimina todos los alumnos del grupo
                const alumno = await Alumno.deleteMany({ grupo: input.grupoPertenece })
                // 4. Busca todas las tareas del grupo
                const tareas = await Tarea.find({ grupoPertenece: input.grupoPertenece });
                const tareasIds = tareas.map(t => t._id);

                // 5. Elimina todos los archivos relacionados con esas tareas
                await Archivo.deleteMany({ tareaAsignada: { $in: tareasIds } });

                // 6. Elimina todas las tareas del grupo
                const result = await Tarea.deleteMany({ grupoPertenece: input.grupoPertenece });

                return `Se eliminaron ${result.deletedCount} tareas y sus archivos del grupo`;
            } catch (error) {
                throw new Error("Error al eliminar las tareas y archivos del grupo");
            }
        },
        crearAlumno: async (_, { input }) => {
            const { boleta, password } = input
            const existeAlumno = await Alumno.findOne({ boleta })
            console.log(existeAlumno)
            if (existeAlumno) {
                throw new Error('Alumno ya registrado')
            }
            try {
                //Hashear password
                const salt = await bcryptjs.genSalt(10)
                input.password = await bcryptjs.hash(password, salt)
                console.log(input)
                //Registra nuevo alumno
                const nuevaAlumno = new Alumno(input)
                //Ya se guarda el maestra
                nuevaAlumno.save()
                return "Alumno creado correctamente"
            } catch (error) {
                console.log(error)
            }
        },
        autenticarAlumno: async (_, { input }) => {
            const { boleta, password } = input
            //Si la maestra existe
            const existeAlumno = await Alumno.findOne({ boleta })
            if (!existeAlumno) {
                throw new Error('El alumno no existe')
            }
            //Si el password es correcto
            const passwordCorrecto = await bcryptjs.compare(password, existeAlumno.password)
            console.log('Password correcto')
            if (!passwordCorrecto) {
                throw new Error('Password incorrecto')
            }
            //Dar acceso a la app
            return {
                token: crearToken(existeAlumno, process.env.SECRETA, '2hr')
            }
        },
        nuevoArchivo: async (_, { input, estado }, ctx) => {
            try {
                const archivo = new Archivo(input)
                archivo.autor = ctx.usuario.id
                archivo.estado = estado
                //Almacenamos
                const resultado = await archivo.save()
                return resultado
            } catch (error) {
                console.log(error)
            }
        },
        actualizarArchivo: async (_, { id, input }, ctx) => {
            //Si la tarea existe o no
            let archivo = await Archivo.findById(id)
            if (!archivo) {
                throw new Error("Archivo no encontrado");
            }
            //Si el alumno es quien lo edita
            //Revisar que si la persona lo edita es el creador
            if (archivo.autor.toString() !== ctx.usuario.id) {
                throw new Error("No tienes las credenciales");
            }
            //Guardar y retornar la tarea
            archivo = await Archivo.findOneAndUpdate({ _id: id }, input)
            return archivo
        },
        eliminarArchivo: async (_, { id }, ctx) => {
            //Revisar si el grupo existe
            let archivo = await Archivo.findById(id);
            if (!archivo) {
                throw new Error("Archivo no encontrado");
            }
            //Revisar que si la persona lo edita es el creador
            if (archivo.creador.toString() !== ctx.usuario.id) {
                throw new Error("No tienes las credenciales");
            }
            //Eliminar
            await Archivo.findOneAndDelete({ _id: id })
            return "Archivo Eliminado"
        },
        eliminarTareaArchivo: async (_, { input }, ctx) => {
            // input debe tener el campo tareaAsignada
            // Opcional: puedes validar que el usuario sea la maestra del grupo si lo deseas
            try {
                const result = await Archivo.deleteMany({ tareaAsignada: input.tareaAsignada });
                return `Se eliminaron ${result.deletedCount} tareas del grupo`;
            } catch (error) {
                throw new Error("Error al eliminar las tareas del grupo");
            }
        },
        nuevaRacha: async (_, { input }, ctx) => {
            try {
                const racha = new Racha(input)
                racha.autor = ctx.usuario.id
                //Almacenamos
                const resultado = await racha.save()
                return resultado
            } catch (error) {
                console.log(error)
            }
        },
        actualizarRacha: async (_, { id, input }, ctx) => {
            //Si la tarea existe o no
            let racha = await Racha.findById(id)
            if (!racha) {
                throw new Error("Racha no encontrado");
            }
            //Si el alumno es quien lo edita
            //Revisar que si la persona lo edita es el creador
            if (racha.autor.toString() !== ctx.usuario.id) {
                throw new Error("No tienes las credenciales");
            }
            //Guardar y retornar la tarea
            //git branch -M main
            racha = await Racha.findOneAndUpdate({ _id: id }, input)
            return racha
        },
        eliminarRacha: async (_, { id }, ctx) => {
            //Revisar si el grupo existe
            let racha = await Racha.findById(id);
            if (!racha) {
                throw new Error("Racha no encontrado");
            }
            //Revisar que si la persona lo edita es el creador
            if (racha.autor.toString() !== ctx.usuario.id) {
                throw new Error("No tienes las credenciales");
            }
            //Eliminar
            await Racha.findOneAndDelete({ _id: id })
            return "Racha Eliminado"
        },
    }
}

module.exports = resolvers