/* ------ comienzan las funcionalidades una vez que carga el documento ------ */
window.addEventListener("load", function () {
  const token = localStorage.getItem("jwt");

  if (token) {
    const urlTareas = "http://todo-api.ctd.academy:3000/v1/tasks";
    const urlUsuario = "http://todo-api.ctd.academy:3000/v1/users/getMe";

    const formCrearTarea = document.querySelector(".nueva-tarea");
    const nuevaTarea = document.querySelector("#nuevaTarea");
    const btnCerrarSesion = document.querySelector("#closeApp");

    obtenerNombreUsuario();
    consultarTareas()
      .then((data) => {
        renderizarTareas(data);
        tareasFinalizadas(data);
      })
      .catch((error) => console.log(error));

    /* -------------------------------------------------------------------------- */
    /*                          FUNCIÓN 1 - Cerrar sesión                         */
    /* -------------------------------------------------------------------------- */

    btnCerrarSesion.addEventListener("click", function () {
      Swal.fire({
        icon: "warning",
        title: "¿Estás seguro que deseas cerrar sesión?",
        showCancelButton: true,
        confirmButtonText: "Aceptar",
      }).then((result) => {
        if (result.isConfirmed) {
          localStorage.removeItem("jwt");
          location.replace("index.html");
        }
      });
    });

    /* -------------------------------------------------------------------------- */
    /*                 FUNCIÓN 2 - Obtener nombre de usuario [GET]                */
    /* -------------------------------------------------------------------------- */

    function obtenerNombreUsuario() {
      const nombreDeUsuario = document.getElementById("username");

      const settings = {
        headers: {
          accept: "application/json",
          authorization: token,
        },
      };

      fetch(urlUsuario, settings)
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          nombreDeUsuario.textContent = data.firstName;
        });
    }

    /* -------------------------------------------------------------------------- */
    /*                 FUNCIÓN 3 - Obtener listado de tareas [GET]                */
    /* -------------------------------------------------------------------------- */

    async function consultarTareas() {
      const settings = {
        headers: {
          accept: "application/json",
          authorization: token,
        },
      };

      try {
        const response = await fetch(urlTareas, settings);

        if (!response.ok) {
          throw new Error(`Error! status: ${response.status}`);
        }

        const result = await response.json();
        return result;
      } catch (error) {
        console.log(error);
      }
    }

    /* -------------------------------------------------------------------------- */
    /*                    FUNCIÓN 4 - Crear nueva tarea [POST]                    */
    /* -------------------------------------------------------------------------- */

    async function crearPost(event) {
      const payload = {
        description: nuevaTarea.value,
        completed: false,
      };

      const settings = {
        method: "POST",
        body: JSON.stringify(payload),
        headers: {
          accept: "application/json",
          authorization: token,
          "Content-Type": "application/json",
        },
      };

      try {
        const response = await fetch(urlTareas, settings);

        if (!response.ok) {
          Swal.fire({
            icon: "error",
            title: "Error al crear la tarea",
            showConfirmButton: false,
            timer: 1500,
          });
          throw new Error(`Error! status: ${response.status}`);
        }

        const result = await response.json();
        return result;
      } catch (error) {
        console.log(error);
      }
    }

    formCrearTarea.addEventListener("submit", function (event) {
      event.preventDefault();

      crearPost(event).then((response) => {
        Swal.fire({
          icon: "success",
          title: "Tarea creada correctamente",
          showConfirmButton: false,
          timer: 1500,
        });
        setTimeout(() => {
          location.reload();
        }, 1500);
      });

      //limpiamos el form
      formCrearTarea.reset();
    });

    /* -------------------------------------------------------------------------- */
    /*                  FUNCIÓN 5 - Renderizar tareas en pantalla                 */
    /* -------------------------------------------------------------------------- */
    function renderizarTareas(listado) {
      // obtengo listados y limpio cualquier contenido interno
      const tareasPendientes = document.querySelector(".tareas-pendientes");
      const tareasTerminadas = document.querySelector(".tareas-terminadas");
      tareasPendientes.innerHTML = "";
      tareasTerminadas.innerHTML = "";

      // buscamos el numero de finalizadas

      listado.forEach((tarea) => {
        //variable intermedia para manipular la fecha
        let fecha = new Date(tarea.createdAt);

        if (tarea.completed) {
          //lo mandamos al listado de tareas completas
          tareasTerminadas.innerHTML += `
          <li class="tarea" >
            <div class="hecha">
              <i class="fa-regular fa-circle-check"></i>
            </div>
            <div class="descripcion">
              <p class="nombre">${tarea.description}</p>
              <div class="cambios-estados">
                <button class="change incompleta" id="${tarea.id}" ><i class="fa-solid fa-rotate-left"></i></button>
                <button class="borrar" id="${tarea.id}"><i class="fa-regular fa-trash-can"></i></button>
              </div>
            </div>
          </li>
                        `;
        } else {
          //lo mandamos al listado de tareas sin terminar
          tareasPendientes.innerHTML += `
          <li class="tarea" >
            <button class="change" id="${
              tarea.id
            }"><i class="fa-regular fa-circle"></i></button>
            <div class="descripcion">
              <p class="nombre">${tarea.description}</p>
              <p class="timestamp">${fecha.toLocaleDateString()}</p>
            </div>
          </li>
                        `;
        }
        // actualizamos el contador en la pantalla
      });
      botonesCambioEstado();
      botonBorrarTarea();
    }

    /* -------------------------------------------------------------------------- */
    /*                  FUNCIÓN 6 - Cambiar estado de tarea [PUT]                 */
    /* -------------------------------------------------------------------------- */
    function botonesCambioEstado() {
      const btnCambioEstado = document.querySelectorAll(".change");

      btnCambioEstado.forEach((boton) => {
        //a cada boton le asignamos una funcionalidad
        boton.addEventListener("click", function (event) {
          console.log(event.target.className);
          const id = event.target.id;

          console.log(id);

          let payload = {
            completed: null,
          };

          if (event.target.className === "change incompleta") {
            payload.completed = false;
          } else {
            payload.completed = true;
          }

          console.log(payload);

          const settings = {
            method: "PUT",
            body: JSON.stringify(payload),
            headers: {
              accept: "aplication/json",
              authorization: token,
              "Content-Type": "application/json",
            },
          };

          fetch(`${urlTareas}/${id}`, settings)
            .then((res) => res.json())
            .then((data) => {
              console.log(data);
              location.reload();
            })
            .catch((err) => console.log(err));
        });
      });
    }

    /* -------------------------------------------------------------------------- */
    /*                     FUNCIÓN 7 - Eliminar tarea [DELETE]                    */
    /* -------------------------------------------------------------------------- */

    async function borrarTarea(settings, id) {
      try {
        const response = fetch(`${urlTareas}/${id}`, settings);

        if (!response.ok) {
          Swal.fire({
            icon: "error",
            title: "Error al eliminar la tarea",
            showConfirmButton: false,
            timer: 1500,
          });
          throw new Error(`Error! status: ${response.status}`);
        }

        const result = await response.json();
        return result;
      } catch (error) {
        console.log(error);
      }
    }

    function botonBorrarTarea() {
      //obtenemos los botones de borrado
      const btnBorrarTarea = document.querySelectorAll(".borrar");

      btnBorrarTarea.forEach((boton) => {
        //a cada boton de borrado le asignamos la funcionalidad
        boton.addEventListener("click", function (event) {
          Swal.fire({
            icon: "warning",
            title: "¿Estás seguro que deseas eliminar esta tarea?",
            showCancelButton: true,
            confirmButtonText: "Aceptar",
          }).then((result) => {
            if (result.isConfirmed) {
              const id = event.target.id;

              const settings = {
                method: "DELETE",
                headers: {
                  "Content-Type": "application/json",
                  authorization: token,
                },
              };

              borrarTarea(settings, id).then((res) => {
                Swal.fire({
                  icon: "success",
                  title: "Tarea eliminada correctamente",
                  showConfirmButton: false,
                  timer: 1500,
                });
                setTimeout(() => {
                  location.reload();
                }, 1500);
              });
            }
          });
        });
      });
    }

    /* -------------------------------------------------------------------------- */
    /*                          FUNCIÓN 8 - Tareas Finalizadas                    */
    /* -------------------------------------------------------------------------- */

    function tareasFinalizadas(listado) {
      const tareasFinalizadas = document.getElementById("cantidad-finalizadas");
      let contador = 0;

      listado.forEach((item) => {
        if (item.completed) {
          contador++;
        }
      });

      return (tareasFinalizadas.textContent = contador);
    }
  } else {
    location.replace("./index.html");
  }
});
