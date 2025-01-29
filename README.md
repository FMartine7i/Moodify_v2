<img src="https://i.imgur.com/xOniTxy.png" alt="moodify" width="65%">

# moodify v2.0 🎵
## Spotify API call

| <img src="https://i.imgur.com/pRU3Ch0.png" height="80%"> | 
| - |
| <img src="https://i.imgur.com/anyXEGH.png"> |
        

### Index

* [Descripción](#descripción)
* [Requerimientos previos](#requerimientos-previos)
* [Instalación](#instalación)
* [Inicialización](#inicialización)
* [Endpoints](#endpoints)
* [Base de datos](#base-de-datos)
* [Paquetes instalados](#paquetes-instalados)
* [Manejo de errores](#manejo-de-errores)
* [Estructura carpetas](#estructura-carpetas)

## Descripción
Este es un proyecto de API para la app **moodify** desarollado con ``Node.js`` que integra la API de ``Spotify`` para extraer y gestionar datos. Se conecta a una base de datos en MongoDB para almacenar y y organizar información sobrne canciones, álbumes y playlists. Mientras que su función principal es interactuar con la API de ``Spotify``, el proyecto también presenta un frontend limpio y estético desarrollado con ``vite`` y ``sass``.
- **Backend**: Construida con Node.js, Express y MongoDB, la API permite buscar y obtener datos de canciones, álbumes y playlists de Spotify.
- **Frontend**: Diseñado con Vite para un desarrollo rápido y fluido y con Sass para estilos escalables.
- **Spotify API**: 
- **Base de datos**: utiliza MongoDB para un almacenamiento eficiente y escalable de datos.
- **Tech Stack***: Node.js, Express, MongoDB, Vite, Sass, Spotify API, TypeScript.

## Requerimientos previos
> [!IMPORTANT]
> Tener Node.js instalado en el dispositivo
## Instalación
- Clonar repositorio y luego ir a la terminal y buscar la carpeta ``moodify_api``. Una vez dentro la carpeta, usar el siguiente comando: ``npm install`` o ``npm i``.
## Inicialización
> [!IMPORTANT]
> Antes de inicializar la API, deberá conectar crear un archivo .env en la carpeta principal y anotar las siguientes líneas:

<table>
  <tr>
    <td><b>PORT</b></td>
    <td>3000</td>
    <td>Puerto en el que se ejecutará la API.</td>
  </tr>
  <tr>
    <td><b>SPOTIFY_CLIENT_SECRET</b></td>
    <td>secret_key</td>
    <td>Secret key para autenticación dado por Spotify.</td>
  </tr>
  <tr>
    <td><b>SPOTIFY_CLIENT_ID</b></td>
    <td>client_id</td>
    <td>Client ID para autenticación dado por Spotify.</td>
  </tr>
  <tr>
    <td><b>MONGODB_URI</b></td>
    <td>mongodb_uri</td>
    <td>URI de conexión a la base de datos de tu cuenta de MongoDB.</td>
  </tr>
  <tr>
    <td><b>PLAYLIST_ID</b></td>
    <td>ID de la playlist a elección</td>
    <td>Se encuentra en el enlace de la playlist.</td>
  </tr>
</table>

- En la consola dentro de la ruta ``\moodify`` escribir el comando: ``node run dev`` para ejecutar sin compilar (permite ver el ``frontend`` junto al ``backend``).
- Sino, escribir el comando: ``npm run build`` para compilar y ejecutar la API con ``npm run start``.

> [!IMPORTANT]
> En el port 3000 se encuentra el backend y en el port 5173 el frontend.
> Si la API fue ejecutada con el comando ``npm run dev``, se puede acceder a la API en el puerto 5173 para ver el proyecto completo.

> [!NOTE]
> Más abajo dejo un cuadro con la lista de scripts disponibles.

## Endpoints
* Canciones
    | Método | Endpoint | Descripción |
    |-|-|-|
    | **GET** | ``api\v1\songs`` | Busca todas las canciones
    | **GET** | ``api\v1\songs\id\:id`` | Busca una canción por su ID (numeros del 1 al 50)
    | **GET** | ``api\v1\songs?mood=<mood>`` | Busca canciones por estado de ánimo. |

* Playlists
    > [!WARNING]
    > Actualmente fuera de servicio.

    | Método | Endpoint | Descripción |
    |-|-|-|
    | **GET** | ``api\v1\playlists`` | Devuelve 50 playlists |
    | **GET** | ``api\v1\playlists\id\:id`` | Devuelve una playlist por id [1 - 50] |

* Álbumes
    | Método | Endpoint | Descripción |
    |-|-|-|
    | **GET** | ``api\v1\albums`` | Devuelve 50 álbumes |
    | **GET** | ``api\v1\albums\id\:id`` | Devuelve un álbum por id [1 - 50] |
    | **GET** | ``api\v1\albums?mood=<mood>`` | Devuelve los álbumes por el estado de ánimo elegido. |

> [!NOTE]
> Estados de ánimo a elegir: [dark, sad, happy, angry, romantic, emotional, relaxed]

## Paquetes instalados
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
    

## Manejo de errores
1. Paquetes de manejos de errores: ``husky`` y ``standard``
2. Manejo de errores:
    * ``node app``: inicializa la API
    * ``npx standard``: muestra los errores en el código
    * ``npx standard --fix``: corrige estos errores mostrados

## Estructura carpetas
* ``/moodify`` → carpeta principal
* ``/moodify/routes`` → acá se encuentran las configuraciones de las rutas de los controladores para cada entidad (canciones, playlists, albumes, artistas)
* ``/moodify/controllers`` → esta es la carpeta de los controladores para cada entidad.
* ``/moodify/models`` → esta carpeta guarda el archivo ``server.js`` que permite la conexión entre Moodify API y la API de Spotify.
* ``/moodify/public/`` → acá se encuentra la página pública que se muestra por defecto
> [!IMPORTANT]
> La pagina pública puede realizar algunas funciones, como buscar todas las canciones, puede buscar por ``id`` la canción elegida de la **lista** desplegada y puede buscar por ``mood`` eligiendo el estado de ánimo en el ``<select>`` desplegable. Todas estas búsquedas se mostrarán de forma gráfica en la página.


> ## mi_api_moodify
> - ├── controllers/
> - │   ├── albums.ts
> - │   ├── playlists.ts
> - │   ├── songs.ts
> - ├── database/
> - │   ├── conex.ts
> - │   ├── fetch_items.ts
> - │   ├── init_database.ts
> - ├── models/
> - │   ├── albums_scheme.ts
> - │   ├── counter.ts
> - │   ├── playlists_scheme.ts
> - │   ├── server.ts
> - │   ├── songs_scheme.ts
> - ├── public/
> - │   ├── index.html
> - │   ├── main.css
> - │   ├── main.ts
> - ├─ service/
> - │   ├── spotify_service.ts
> - ├── app.ts
> - ├── tsconfig.json
