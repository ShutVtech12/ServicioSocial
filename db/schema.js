const {gql} = require('apollo-server');

const typeDefs = gql`

    type Token {
        token: String
    }

    type Grupo {
        grupo: String
        nombre: String
        id: ID
    }

    type Alumno{
        nombre: String
    }

    type AlumnoFin{
        id: ID
        nombre: String
        boleta: String
    }

    type Tarea{
        id: ID
        titulo: String
        descripcion: String
        fechaCreado: String
        fechaFinal: String
        repetible: String
        diasRepetible: String
        grupoPertenece: String
    }

    type Archivo{
        id: ID
        texto: String
        fechaEntregado: String
        estado: Boolean
        autor: String
        tareaAsignada: String
    }

    type Racha{
        id: ID
        fechaInicio: String
        lastUpdate: String
        autor: String
    }

    type Query{
        obtenerGrupos: [Grupo]
        obtenerTodosGrupos: [Grupo]
        obtenerTareas(input: GrupoIDInput): [Tarea]
        obtenerTodasTareas: [Tarea]
        obtenerAlumnosGrupo(input: GrupoIDInput): [Alumno]
        obtenerAlumnos(input: GrupoIDInput): [AlumnoFin]
        obtenerTareasAlumno: [Tarea]
        obtenerInfoAlumno: [AlumnoFin]
        obtenerArchivo: [Archivo]
        obtenerArchivoAlumnos(input: TareaIDInput): [Archivo]
    }

    input TareaIDInput{
        tareaAsignada: String!
    }

    input GrupoIDInput{
        grupoPertenece: String!
    }

    input MaestraInput {
        nombre: String!
        correo: String!
        password: String!
    }
        
    input AutenticarMaInput{
        correo: String!
        password: String!
    }

    input GrupoInput{
        grupo: String!
        nombre: String! 
    }

    input TareaInput{
        titulo: String!
        descripcion: String!
        fechaFinal: String!
        repetible: String!
        diasRepetible: String!
        grupoPertenece: String!
    }

    input AlumnoInput{
        nombre: String!
        boleta: String!
        password: String!
        grupo: String!
    }

    input AutenticarAlumnoInput{
        boleta: String!
        password: String!
    }

    input ArchivoInput{
        texto: String!
        tareaAsignada: String!
    }

    input RachaInput{
        diasConse: String!
        lastUpdate: String!
    }

    type Mutation {
        #Maestra
        crearMaestra(input: MaestraInput): String
        autenticarMaestra(input: AutenticarMaInput): Token

        #Grupo
        nuevoGrupo(input: GrupoInput): Grupo
        actualizarGrupo(id: ID!, input: GrupoInput): Grupo
        eliminarGrupo(id: ID!): String

        #Tarea
        nuevaTarea(input: TareaInput): Tarea
        actualizarTarea(id: ID!, input: TareaInput): Tarea
        eliminarTarea(id: ID!): String

        #Alumno
        crearAlumno(input: AlumnoInput): String
        autenticarAlumno(input: AutenticarAlumnoInput): Token

        #Archivo
        nuevoArchivo(input: ArchivoInput, estado: Boolean): Archivo
        actualizarArchivo(id: ID!, input: ArchivoInput): Archivo
        eliminarArchivo(id: ID!): String

        #Racha
        nuevaRacha(input: RachaInput): Racha
        actualizarRacha(input: RachaInput): Racha
    }

`

module.exports = typeDefs