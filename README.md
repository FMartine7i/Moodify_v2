<img src="https://i.imgur.com/xOniTxy.png" alt="moodify" width="65%">

# moodify v2.0 🎵
## Spotify API call

### Index

* [Descripción](#descripcion)
* [Requerimientos previos](#requerimientos-previos)
* [Instalación](#instalación)
* [Inicialización](#inicialización)
* [Autenticación](#autenticación)
* [Endpoints](#endpoints)
* [Base de datos](#base-de-datos)
* [Paquetes instalados](#paquetes-instalados)
* [Manejo de errores](#manejo-de-errores)
* [Estructura carpetas](#estructura-carpetas)

## Descripción
**Moodify** es una app que permite a los usuarios encontrar playlists, canciones, artistas y álbums basados en su **estado de ánimo** actual, el **momento del día** o el **género**.

## Documentación
### Requerimientos previos
> [!NOTE]
> Node.js
### Instalación
> Clonar repositorio y luego ir a la terminal y buscar la carpeta ``moodify_api``. Una vez dentro la carpeta, usar el siguiente comando: ``npm install`` o ``npm i``.
### Inicialización
> En la consola dentro de la ruta ``\moodify`` escribir el comando: ``node app``
### Autenticación
> Crear un archivo ``.env`` en la carpeta principal ``/moodify`` y escribir la siguiente línea: ``TOKEN = <codigo_token>`` con el token enviado.
### Rutas principales y Query Params
* Canciones
    | Método | Endpoint | Descripción |
    |---|---|---|
    | **GET** | ``api\v1\songs`` | Busca todas las canciones
    | **GET** | ``api\v1\songs\id\:id`` | Busca una canción por su ID (numeros del 1 al 50)
    | **GET** | ``api\v1\songs?mood=<mood>`` | Busca canciones por estado de ánimo. Se puede elegir: [dark, sad, happy, angry, romantic, emotional, relaxed]

* Playlists
    | Método | Endpoint | Descripción |
    |---|---|---|
    | **GET** | ``api\v1\playlists`` | Devuelve 50 playlists |
    | **GET** | ``api\v1\playlists\id\:id`` | Devuelve una playlist por id [1 - 50] |
    | **GET** | ``api\v1\playlists?TimeOfDay`` | Devuelve 50 playlists para el momento del dia elegido: [mañana, tarde, noche, madrugada] |

* Álbumes
    | Método | Endpoint | Descripción |
    |---|---|---|
    | **GET** | ``api\v1\albums`` | Devuelve 50 álbumes |
    | **GET** | ``api\v1\albums\id\:id`` | Devuelve un álbum por id [1 - 50] |
    | **GET** | ``api\v1\albums?year=<year>`` | Devuelve álbumes del año solicitado |

### Paquetes instalados
| Paquete | Descripción |
|---|---|
| ``dotenv`` | Permite cargar variables de entorno desde un archivo ``.env``. |
| ``express`` | Un framework minimalista y flexible de **Node.js** que facilita la creación de **APIs**. |
| ``nodemon`` | Permite la actualización automática de la **API**. |
| ``husky`` | Herramienta para definir hooks de Git que permiten ejecutar scripts como formateo o pruebas antes de hacer commits, mejorando la calidad del código. |
| ``standard`` | Un **linter** y formateador que aplica reglas de estilo de código JS sin configuraciones adicionales, asegurando consistencia en el código. |
| ``cors`` | Middleware de **Express** que habilita solicitudes HTTP desde orígenes distintos, necesario para comunicar la **API Moodify** con la **API** de **Spotify**. |
| ``spotify-api-call`` | Un paquete para hacer **llamadas HTTP** más simples a la **API** de **Spotify**, proporcionando un método estructurado para interactuar con sus **endpoints**. |	
| ``spotify-web-api-node`` | Cliente oficial para **Node.js** que simplifica la autenticación y las solicitudes a la **API** de **Spotify**, permitiendo acceso a datos como canciones, artistas y playlists. |
    

### Manejo de errores
1. Paquetes de manejos de errores: ``husky`` y ``standard``
2. Manejo de errores:
    * ``node app``: inicializa la API
    * ``npx standard``: muestra los errores en el código
    * ``npx standard --fix``: corrige estos errores mostrados

### Estructura carpetas
* ``/moodify`` → carpeta principal
* ``/moodify/routes`` → acá se encuentran las configuraciones de las rutas de los controladores para cada entidad (canciones, playlists, albumes, artistas)
* ``/moodify/controllers`` → esta es la carpeta de los controladores para cada entidad.
* ``/moodify/models`` → esta carpeta guarda el archivo ``server.js`` que permite la conexión entre Moodify API y la API de Spotify.
* ``/moodify/public/`` → acá se encuentra la página pública que se muestra por defecto
> [!IMPORTANT]
> La pagina pública puede realizar algunas funciones, como buscar todas las canciones, puede buscar por ``id`` la canción elegida de la **lista** desplegada y puede buscar por ``mood`` eligiendo el estado de ánimo en el ``<select>`` desplegable. Todas estas búsquedas se mostrarán de forma gráfica en la página.


> ### mi_api_moodify
>  ├── controllers/
>  │   ├── albums.ts
>  │   ├── playlists.ts
>  │   ├── songs.ts
>  ├── database/
>  │   ├── conex.ts
>  │   ├── fetch_items.ts
>  │   ├── init_database.ts
>  ├── models/
>  │   ├── albums_scheme.ts
>  │   ├── counter.ts
>  │   ├── playlists_scheme.ts
>  │   ├── server.ts
>  │   ├── songs_scheme.ts
>  ├── public/
>  │   ├── index.html
>  │   ├── main.css
>  │   ├── main.ts
>  ├─ service/
>  │   ├── spotify_service.ts
>  ├── app.ts
>  ├── tsconfig.json
