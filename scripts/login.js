window.addEventListener("load", function () {
  const token = localStorage.getItem("jwt");

  if (token) {
    location.replace("./mis-tareas.html");
  } else {
    /* ---------------------- obtenemos variables globales ---------------------- */
    const form = document.forms[0];
    const email = document.querySelector("#inputEmail");
    const password = document.querySelector("#inputPassword");
    const url = "http://todo-api.ctd.academy:3000/v1";

    /* -------------------------------------------------------------------------- */
    /*            FUNCIÓN 1: Escuchamos el submit y preparamos el envío           */
    /* -------------------------------------------------------------------------- */
    form.addEventListener("submit", function (event) {
      event.preventDefault();

      if (validarEmail(email.value) && validarContrasenia(password.value)) {
        let payload = {
          email: email.value,
          password: password.value,
        };

        let settings = {
          method: "POST",
          body: JSON.stringify(payload),
          headers: {
            "Content-Type": "application/json",
            accept: "application/json",
          },
        };

        realizarLogin(settings)
          .then((data) => {
            console.log(data);
            localStorage.setItem("jwt", data.jwt);
            location.replace("mis-tareas.html");
          })
          .catch();
      }

      //limpio los campos del formulario
      form.reset((error) => console.log(error));
    });

    /* -------------------------------------------------------------------------- */
    /*                     FUNCIÓN 2: Realizar el login [POST]                    */
    /* -------------------------------------------------------------------------- */
    async function realizarLogin(settings) {
      try {
        const response = await fetch(`${url}/users/login`, settings);

        if (!response.ok) {
          Swal.fire({
            icon: "error",
            title: "Mail o contraseña incorrectos",
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
