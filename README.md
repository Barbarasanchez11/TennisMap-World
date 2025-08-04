# 🎾 TennisMap-World

Una API backend moderna para **TennisMap World**, un mapa interactivo que muestra en tiempo real todo lo que ocurre en el mundo del tenis.

## 🌟 ¿Qué es TennisMap World?

Un mapa interactivo que muestra en tiempo real todo lo que ocurre en el mundo del tenis:

- **Torneos en curso** - Visualización geográfica de competiciones activas
- **Jugadores activos** - Ubicación y estado de tenistas profesionales
- **Tweets o noticias relevantes** - Eventos sociales localizados geográficamente
- **Estadísticas en tiempo real** - Clima, tipo de cancha, asistencia, etc.

### 🎯 Propuesta de valor

- Ofrece una visión global y visual del tenis como nunca se ha visto
- Aporta contexto en tiempo real: "¿Dónde se está jugando tenis ahora mismo?"
- Ideal para periodistas, fans globales, o buscadores de talento

## 🌟 Características

- **API RESTful** para gestión de datos de tenis
- **Base de datos MongoDB** con Mongoose ODM
- **Tiempo real** para actualizaciones de eventos
- **Visualización geográfica** con mapas interactivos
- **Datos meteorológicos** con OpenWeather API
- **Integración con redes sociales** (X, Instagram)
- **CORS habilitado** para desarrollo frontend
- **Validación de datos** robusta
- **ESLint** configurado para código limpio

## 🚀 Tecnologías

### Backend
- **Node.js** - Runtime de JavaScript
- **Express.js** - Framework web
- **MongoDB** - Base de datos NoSQL
- **Mongoose** - ODM para MongoDB
- **CORS** - Cross-Origin Resource Sharing
- **Dotenv** - Variables de entorno
- **Nodemon** - Reinicio automático en desarrollo

### Frontend (Próximamente)
- **React** - Biblioteca de interfaz de usuario
- **APIs de tenis** - ITF/WTA/ATP o simuladas
- **Integración social** - X, Instagram o similar

## 📋 Prerrequisitos

- Node.js (versión 16 o superior)
- MongoDB (local o Atlas)
- npm o yarn

## 🔧 Instalación

1. **Clona el repositorio**
   ```bash
   git clone https://github.com/tu-usuario/tennismap-world.git
   cd tennismap-world
   ```

2. **Instala las dependencias**
   ```bash
   npm install
   ```

3. **Configura las variables de entorno**
   ```bash
   cp .env.example .env
   ```
   
   Edita el archivo `.env` con tus configuraciones:
   ```env
   PORT=4000
   MONGODB_URI=mongodb://localhost:27017/tennismap
   NODE_ENV=development
   ```

4. **Inicia el servidor de desarrollo**
   ```bash
   npm run dev
   ```

## 📖 Uso

### Endpoints disponibles

- `GET /` - Estado de la API
- `GET /api/players` - Lista de jugadores
- `GET /api/tournaments` - Lista de torneos
- `GET /api/events` - Lista de eventos

### Ejemplo de uso

```bash
# Verificar que la API está funcionando
curl http://localhost:4000/

# Respuesta esperada:
# "TennisMap World API está en funcionamiento"
```

## 📁 Estructura del Proyecto

```
tennismap-world/
├── app.js                 # Punto de entrada de la aplicación
├── config/               # Configuraciones
│   ├── db.js            # Configuración de MongoDB
│   └── firebase.js      # Configuración de Firebase
├── controllers/          # Controladores de la API
├── middlewares/          # Middlewares personalizados
├── models/              # Modelos de Mongoose
├── routes/              # Rutas de la API
├── package.json         # Dependencias y scripts
└── README.md           # Este archivo
```

## 🛠️ Scripts Disponibles

- `npm run dev` - Inicia el servidor en modo desarrollo con nodemon
- `npm run lint` - Ejecuta ESLint para verificar el código
- `npm test` - Ejecuta las pruebas (pendiente de implementar)

## 🔮 Próximas Funcionalidades

### Backend
- [ ] Autenticación JWT
- [ ] Endpoints para jugadores
- [ ] Endpoints para torneos
- [ ] Integración con OpenWeather API
- [ ] WebSockets para tiempo real
- [ ] Tests unitarios y de integración
- [ ] Documentación con Swagger
- [ ] Docker para containerización

### Frontend
- [ ] Interfaz React con mapas interactivos
- [ ] Integración con APIs de tenis (ITF/WTA/ATP)
- [ ] Capa de eventos sociales (X, Instagram)
- [ ] Visualización en tiempo real de torneos
- [ ] Sistema de notificaciones geográficas

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia ISC. Ver el archivo `LICENSE` para más detalles.

## 👨‍💻 Autor

**Bárbara Sánchez** - [GitHub](https://github.com/tu-usuario)

## 🙏 Agradecimientos

- Comunidad de Node.js
- Documentación de Express.js
- MongoDB Atlas por la base de datos en la nube

---

⭐ Si este proyecto te gusta, ¡dale una estrella en GitHub!