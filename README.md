# OPENTOPO

## Despliegue
Opentopo es simple HTML, CSS y vanilla JS. No necesita ningún tipo de backend, ya que toda la información se guarda en Local Storage del navegador.

Por lo tanto, lo único que necesitas para desplegarlo es hacer los ficheros accesibles. Mi preferencia personal es hacerlo con Nginx, pero puedes hacerlo como prefieras. Para pruebas locales puedes lanzar por ejemplo un pequeño servidor en python:

```
python3 -m http.server
```

Y acceder a Opentopo en `http://0.0.0.0:8000/`


## Personalización

### Personalizar aventuras
Una aventura consiste de dos cosas: Un mapa, y un conjunto de 11 localizaciones, con al menos una pregunta en cada una de ellas.

Para crear tu propia aventura, empieza creando una carpeta para ella dentro de `media/trips`. Por ejemplo, puedes crear `media/trips/madrid`.

Ahora elige una imagen jpg que representará tu aventura en el listado. Esta imagen debe ser de 400x300px. Dejala en esta carpeta. Por ejemplo podría ser `media/trips/madrid/madrid.jpg`.

#### Personalizar mapa
Un mapa es simplemente una imagen de un plano, con 11 lugares marcados en él, y una zona para pegar las pegatinas de los trofeos.

El plano puedes obtenerlo de cualquier fuente, por ejemplo de [Open Street Maps](https://www.openstreetmap.org).

Puedes crear la imagen con la herramienta que prefieras. En la carpeta `resources/map` tienes los componentes para los lugares, los marcadores en el mapa, y los trofeos. Y en `media/trips/barcavieja` tienes ejemplos de mapas ya hechos.

La herramienta que yo he utilizado para crear mis mapas es [Penpot](http://pentpot.app). El esa misma carpeta `resources/map` tienes un fichero `.penpot` que puedes usar como base.

Una vez que la tengas, crea un PDF con la imagen en tamaño A4, y dejala en la carpeta de tu aventura. Por ejemplo `media/trips/madrid/madrid_map.pdf`.

#### Personalizar preguntas
Las preguntas de todas las aventuras estan en el mismo fichero: `trips.js`.
Para cada aventura define lo siguiente:
* id: Identificador numérico único de la aventura
* name: Nombre de la aventura
* image: Imagen de cabecera de la aventura, que se verá en el listado de aventuras
* map: Ruta al fichero pdf del mapa de esta aventura
* places: Un array de 11 lugares, cada uno con sus preguntas que veremos más adelante

Siguiendo con nuestro ejemplo de la aventura por Madrid, habría que añadir lo siguiente:

```
{
    "id": 10,
    "name": "Madrid",
    "image": "media/trips/madrid/madrid.jpg",
    "map": "media/trips/madrid/madrid_map.pdf",
    "places": []
}
```

Los lugares tienen su propia información a rellenar.
* id: El número de lugar. Debe ser secuencial, empezando en 0. Es decir, que para el primer lugar será 0, para el segundo lugar 1, etc.
* name: El nombre del lugar
* image: Una imagen del lugar, de un tamaño 765x510px. Debe guardarse en la carpeta de multimedia de la aventura, o en una subcarpeta. Por ejemplo `media/trips/madrid/alcala/alcala.jpg`
* questions: Un array de 1 o más preguntas, que veremos más adelante


Siguiendo con nuestro ejemplo, un primer lugar podría ser:
```
{
    "id": 1,
    "name": "Puerta de Alcalá",
    "image": "media/trips/madrid/alcala/alcala.jpg",
    "questions": [...]
}
```

En un lugar se hará un mínimo de una pregunta, pero puede haber tantas como quieras. Para cada pregunta hay que añadir esta información:

* intro: Antes de hacer la pregunta, se mostrará una intruducción a la misma, para dar contexto o añadir información cultural.

  * text: El texto que se mostrará en la introducción. Si quieres diferentes párrafos, cada uno debe estar en su propia cadena.
  * image: Una imagen de 765x510px que se mostrará en la introducción
* question: El texto de la pregunta. Si quieres diferentes párrafos, cada uno debe estar en su propia cadena.
* answers: Siempre debe haber 4 respuestas, y sólo una correcta
  * image: Opcionalmente, la respuesta puede mostrar una imagen de 200x300px o de 300x200px. Si no quieres mostrar imagen, dejalo como null.
  * text: El texto de la respuesta
  * correct: `true` o `false`, indicando si la respuesta es correcta.

Siguiendo con nuestro ejemplo, si queremos solo una pregunta:

```
    {
        "intro": {
            "text": [
                "La puerta de Alcalá es una de las cinco antiguas puertas reales que daban acceso a la ciudad de Madrid.",
                "Cómo puedes ver, tiene cinco vanos."
            ],
            "image": "media/trips/madrid/alcala/vanos.jpg"
        },
        "question": [
            "¿Cuántos de sus vanos tienen arco de medio punto?"
        ],
        "answers": [
            {
                "image": null,
                "text": "1",
                "correct": false
            },
            {
                "image": null,
                "text": "2",
                "correct": false
            },
            {
                "image": null,
                "text": "3",
                "correct": true
            },
            {
                "image": null,
                "text": "4",
                "correct": false
            }
        ]
    }
```