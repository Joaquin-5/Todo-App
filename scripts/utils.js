/* ---------------------------------- texto --------------------------------- */

const letters = /^[A-Za-z]+$/;
const emailValidation =
  /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

function validarTexto(texto) {
  let correcto = null;

  if (
    texto.nombre.length !== 0 &&
    texto.nombre !== null &&
    letters.test(texto.nombre) &&
    texto.nombre.length > 3
  ) {
    correcto = true;
  } else {
    Swal.fire({
      icon: "error",
      title:
        "El nombre no puede estar vacío, no puede contener números y debe ser mayor a 3 caracteres",
      showConfirmButton: false,
      timer: 1500,
    });
    correcto = false;
  }

  if (
    texto.apellido.length !== 0 &&
    texto.apellido !== null &&
    letters.test(texto.apellido) &&
    texto.apellido.length > 3
  ) {
    correcto = true;
  } else {
    Swal.fire({
      icon: "error",
      title:
        "El apellido no puede estar vacío, no puede contener números y debe ser mayor a 3 caracteres",
      showConfirmButton: false,
      timer: 1500,
    });
    correcto = false;
  }

  return correcto;
}

function normalizarTexto(texto) {}

/* ---------------------------------- email --------------------------------- */
function validarEmail(email) {
  let correcto = null;

  if (emailValidation.test(email) && email.length !== 0 && email !== null) {
    correcto = true;
  } else {
    Swal.fire({
      icon: "error",
      title:
        "El email no puede estar vacío y debe ser un mail válido Ej: @gmail.com",
      showConfirmButton: false,
      timer: 1500,
    });
    correcto = false;
  }

  return correcto;
}

function normalizarEmail(email) {}

/* -------------------------------- password -------------------------------- */
function validarContrasenia(contrasenia) {
  let correcto = null;

  if (
    contrasenia.length !== 0 &&
    contrasenia !== null &&
    contrasenia.length > 3
  ) {
    correcto = true;
  } else {
    Swal.fire({
      icon: "error",
      title:
        "La contraseña no puede estar vacía y debe ser mayor a 3 caracteres",
      showConfirmButton: false,
      timer: 1500,
    });
    correcto = false;
  }

  return correcto;
}

function compararContrasenias(contrasenia_1, contrasenia_2) {
  let correcto = null;

  if (contrasenia_1 === contrasenia_2) {
    correcto = true;
  } else {
    Swal.fire({
      icon: "error",
      title: "Las contraseñas no coinciden",
      showConfirmButton: false,
      timer: 1500,
    });
    correcto = false;
  }

  return correcto;
}
