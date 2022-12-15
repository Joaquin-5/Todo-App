window.addEventListener("load", function () {
  const token = localStorage.getItem("jwt");

  if (token) {
    location.replace("./mis-tareas.html");
  } else {
    /* ---------------------- obtenemos variables globales ---------------------- */
    const form = document.forms[0];
    const nombre = document.querySelector("#inputNombre");
    const apellido = document.querySelector("#inputApellido");
    const email = document.querySelector("#inputEmail");
    const password = document.querySelector("#inputPassword");
    const repeatPassword = document.querySelector("#inputPasswordRepetida");
    const url = "http://todo-api.ctd.academy:3000/v1";

    /* -------------------------------------------------------------------------- */
    /*            FUNCIÓN 1: Escuchamos el submit y preparamos el envío           */
    /* -------------------------------------------------------------------------- */
    form.addEventListener("submit", function (event) {
      event.preventDefault();

      if (
        validarTexto({ nombre: nombre.value, apellido: apellido.value }) &&
        validarEmail(email.value) &&
        validarContrasenia(password.value) &&
        compararContrasenias(password.value, repeatPassword.value)
      ) {
        let payload = {
          firstName: nombre.value,
          lastName: apellido.value,
          email: email.value,
          password: password.value,
        };

        console.log(JSON.stringify(payload));

        let settings = {
          method: "POST",
          body: JSON.stringify(payload),
          headers: {
            "Content-Type": "application/json",
            accept: "application/json",
          },
        };

        realizarRegister(settings)
          .then((data) => {
            console.log(data);
            location.replace("index.html");
          })
          .catch((error) => console.log(error));
      }

      //limpio los campos del formulario
      form.reset();
    });

    /* -------------------------------------------------------------------------- */
    /*                    FUNCIÓN 2: Realizar el signup [POST]                    */
    /* -------------------------------------------------------------------------- */
    async function realizarRegister(settings) {
      try {
        const response = await fetch(`${url}/users`, settings);

        if (!response.ok) {
          Swal.fire({
            icon: "error",
            title: "El mail ya existe",
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
  }
});
