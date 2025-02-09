<img src="https://i.imgur.com/xOniTxy.png" alt="moodify" width="65%">

# moodify v2.0 🎵
## Spotify API call

<table>
  <tr>
    <td><img src="https://i.imgur.com/n762U9V.png"></td>
    <td><img src="https://i.imgur.com/anyXEGH.png" width="1000px"></td>
  </tr>
</table>
        

### Index

* [Descripción](#descripción)
* [Requerimientos previos](#requerimientos-previos)
* [Instalación](#instalación)
* [Inicialización](#inicialización)
* [Endpoints](#endpoints)
* [Base de datos](#base-de-datos)
* [Paquetes instalados](#paquetes-instalados)
* [Scripts](#scripts)
* [Estructura carpetas](#estructura-carpetas)

## Descripción
Este es un proyecto de API para la app **moodify** desarollado con ``Node.js`` que integra la API de ``Spotify`` para extraer y gestionar datos. Se conecta a una base de datos en MongoDB para almacenar y y organizar información sobrne canciones, álbumes y playlists. Mientras que su función principal es interactuar con la API de ``Spotify``, el proyecto también presenta un frontend limpio y estético desarrollado con ``vite`` y ``sass``.
- **Backend**: Construida con Node.js, Express y MongoDB, la API permite buscar y obtener datos de canciones, álbumes y playlists de Spotify.
- **Frontend**: Diseñado con Vite para un desarrollo rápido y fluido y con Sass para estilos escalables.
- **Spotify API**: 
- **Base de datos**: utiliza MongoDB para un almacenamiento eficiente y escalable de datos.
- **Tech Stack**: Node.js, Express, MongoDB, Vite, Sass, Spotify API, TypeScript.

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

> [!IMPORTANT]
> En el port 3000 se encuentra el backend y en el port 5173 el frontend (en este último se ejecutan ambos).
> Si la API fue ejecutada con el comando ``npm run dev``, se puede acceder a la API en el puerto 5173 para ver el proyecto completo.


## Endpoints
* Canciones
  | Método | Endpoint | Descripción |
  |-|-|-|
  | **GET** | ``api\v2\songs`` | Busca todas las canciones. |
  | **GET** | ``api\v2\songs\id\:id`` | Busca una canción por su ID. |
  | **GET** | ``api\v2\songs?mood=<mood>`` | Busca canciones por estado de ánimo. |
  | **POST** | ``api\v2\songs`` | Crea una canción |

* Playlists
  > [!WARNING]
  > Actualmente fuera de servicio.

  | Método | Endpoint | Descripción |
  |-|-|-|
  | **GET** | ``api\v2\playlists`` | Devuelve 50 playlists |
  | **GET** | ``api\v2\playlists\id\:id`` | Devuelve una playlist por ID. |

* Álbumes
  | Método | Endpoint | Descripción |
  |-|-|-|
  | **GET** | ``api\v2\albums`` | Devuelve 50 álbumes |
  | **GET** | ``api\v2\albums\id\:id`` | Devuelve un álbum por ID. |
  | **GET** | ``api\v2\albums?mood=<mood>`` | Devuelve los álbumes por el estado de ánimo elegido. |

* Usuarios
  | Método | Endpoint | Descripción |
  |-|-|-|
  | **GET** | ``api\v2\users`` | Devuelve todos los usuarios |
  | **GET** | ``api\v2\users\id\:id`` | Devuelve un usuario por id |
  | **POST** | ``api\v2\users`` | Crea un usuario |
  | **PUT** | ``api\v2\users\id\:id`` | Actualiza un usuario por id |
  | **DELETE** | ``api\v2\users\id\:id`` | Elimina un usuario por id |

> [!NOTE]
> Estados de ánimo a elegir: [dark, sad, happy, angry, romantic, relaxed, badass, epic]

## Base de datos
Para almacenar los datos en la base de datos, fueron utilizados los métodos ``fetch`` de los controllers de cada una de las entidades. Estos métodos se inicializan en el archivo de inicialización de base de datos y son los encargados de obtener los datos de la API de Spotify y de guardarlos en MongoDB. El script del archivo ``init_database.ts`` se encuentra "separado" del resto del código, para poder ser ejecutado de forma independiente y única.

> [!NOTE]
> ``npm run initialize-db``

## Paquetes instalados
| Paquete | Descripción |
|---|---|
| ``bcrypt`` | Permite encriptar contraseñas y verificar contraseñas encriptadas. |
| ``concurrently`` | Ejecuta múltiples comandos de forma simultánea. |
| ``cors`` | Middleware de **Express** que habilita solicitudes HTTP desde orígenes distintos, necesario para comunicar la **API Moodify** con la **API** de **Spotify**. |
| ``dotenv`` | Permite cargar variables de entorno desde un archivo ``.env``. |
| ``eslint`` |  Un **linter** y formateador que aplica reglas de estilo de código JS sin configuraciones adicionales, asegurando consistencia. |
| ``express`` | Un framework minimalista y flexible de **Node.js** que facilita la creación de **APIs**. |
| ``husky`` | Herramienta para definir hooks de Git que permiten ejecutar scripts como formateo o pruebas antes de hacer commits, mejorando la calidad del código. |
| ``mongoose`` | Una biblioteca de **MongoDB** que facilita la interacción con la base de datos, permitiendo definir esquemas, modelos y consultas. |
| ``sass`` | Una biblioteca de **CSS** que permite escribir **CSS** de forma más eficiente y estructurada, permitiendo la creación de estilos complejos y reutilizables. |
| ``standard`` | Un **linter** y formateador que aplica reglas de estilo de código JS sin configuraciones adicionales, asegurando consistencia en el código. |
| ``spotify-api-call`` | Un paquete para hacer **llamadas HTTP** más simples a la **API** de **Spotify**, proporcionando un método estructurado para interactuar con sus **endpoints**. |	
| ``spotify-web-api-node`` | Cliente oficial para **Node.js** que simplifica la autenticación y las solicitudes a la **API** de **Spotify**, permitiendo acceso a datos como canciones, artistas y playlists. |
| ``tsnode`` | Un compilador que permite ejecutar **TypeScript** en **Node.js** sin la necesidad de compilar previamente el código. |
| ``vite`` | Un **bundler** y servidor de desarrollo que permite crear aplicaciones web más eficientes. |
    

## Scripts
1. Paquetes de manejos de errores: ``husky`` y ``standard``
2. Scripts:
    * ``npm run initialize-db``: inicializa el código de la base de datos. (Solo se ejecuta una vez).
    * ``npm run dev``: ejecuta la API en modo desarrollo.
    * ``npm run build``: transpila y compila la API.
    * ``node app``: inicializa la API.
    * ``npx standard``: muestra los errores en el código.
    * ``npx standard --fix``: corrige estos errores mostrados.

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
> - │   ├── users.ts
> - ├── DAO/
> - │   ├── albums_dao.ts
> - │   ├── playlists_dao.ts
> - │   ├── songs_dao.ts
> - │   ├── users_dao.ts
> - ├── database/
> - │   ├── conex.ts
> - │   ├── init_database.ts
> - ├── entities/
> - │   ├── album.ts
> - │   ├── playlist.ts
> - │   ├── song.ts
> - │   ├── user.ts
> - ├── models/
> - │   ├── album_model.ts
> - │   ├── counter.ts
> - │   ├── playlist_model.ts
> - │   ├── server.ts
> - │   ├── song_model.ts
> - ├── public/
> - │   ├── imgs/
> - │   ├── main.scss
> - │   ├── main.ts
> - │   ├── index.html
> - │   ├── songs.html
> - ├─ service/
> - │   ├── spotify_service.ts
> - ├── app.ts
> - ├── package.json
> - ├── tsconfig.json
> - ├── vite.config.ts