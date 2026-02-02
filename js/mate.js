// ================= SESIÓN DEL ESTUDIANTE =================
const nombreEstudiante = localStorage.getItem("estudiante");

// Si no hay nombre, vuelve al inicio
if (!nombreEstudiante) {
  alert("Debes ingresar tu nombre para acceder al curso");
  location.href = "index.html";
}

// Mostrar bienvenida
window.onload = () => {
  document.getElementById("bienvenida").innerText =
    `Bienvenido/a, ${nombreEstudiante}`;
};

// ================= FUNCIONES ÚTILES =================
function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function mezclar(arr) {
  return arr.sort(() => Math.random() - 0.5);
}

// ================= QUIZZES POR CLASE =================
const sesiones = {
  quiz1: [
    { q: "¿Cuál es un número entero?", o: ["5", "0.5"], a: "5" },
    { q: "−3 es un número:", o: ["Entero", "Natural"], a: "Entero" }
  ],
  quiz2: [
    { q: "¿Cuál es un número natural?", o: ["7", "-4"], a: "7" },
    { q: "Los naturales incluyen:", o: ["1", "-1"], a: "1" }
  ],
  quiz3: [
    { q: "4 × (−2) =", o: ["−8", "8"], a: "−8" },
    { q: "(−3) × (−3) =", o: ["9", "−9"], a: "9" }
  ],
  quiz4: [
    { q: "6 × 4 =", o: ["24", "20"], a: "24" },
    { q: "12 ÷ 3 =", o: ["4", "6"], a: "4" }
  ]
};

// ================= CREAR QUIZ =================
function crearQuiz(id) {
  let contenido = "";

  for (let i = 0; i < sesiones[id].length; i++) {
    let pregunta = sesiones[id][i];

    contenido += `<p>${pregunta.q}</p>`;

    for (let j = 0; j < pregunta.o.length; j++) {
      let opcion = pregunta.o[j];

      contenido += `
        <label>
          <input type="radio" name="${id}${i}" value="${opcion}">
          ${opcion}
        </label><br>`;
    }
  }

  document.getElementById(id).innerHTML = contenido;
}

// Crear quizzes
crearQuiz("quiz1");
crearQuiz("quiz2");
crearQuiz("quiz3");
crearQuiz("quiz4");

// ================= REVISAR CLASE =================
function revisarClase(quizId, resId) {
  let totalCorrectas = 0;

  sesiones[quizId].forEach((pregunta, indice) => {

    let respuestaMarcada = document.querySelector(
      `input[name="${quizId}${indice}"]:checked`
    );

    if (respuestaMarcada && respuestaMarcada.value === pregunta.a) {
      totalCorrectas++;
    }
  });

  document.getElementById(resId).innerText =
    `Correctas: ${totalCorrectas} / ${sesiones[quizId].length}`;
}


// ================= PREGUNTAS RANDOM =================
function generarPreguntaRandom() {
  let tipoOperacion = rand(1, 4);
  let numero1, numero2;
  let respuestaCorrecta;
  let textoPregunta;

  // 👉 SUMA
  if (tipoOperacion === 1) {
    numero1 = rand(1, 10);
    numero2 = rand(1, 10);
    respuestaCorrecta = numero1 + numero2;
    textoPregunta = `¿Cuánto es ${numero1} + ${numero2}?`;
  }

  // 👉 RESTA
  if (tipoOperacion === 2) {
    numero1 = rand(5, 20);
    numero2 = rand(1, 10);
    respuestaCorrecta = numero1 - numero2;
    textoPregunta = `¿Cuánto es ${numero1} − ${numero2}?`;
  }

  // 👉 MULTIPLICACIÓN
  if (tipoOperacion === 3) {
    numero1 = rand(1, 10);
    numero2 = rand(1, 10);
    respuestaCorrecta = numero1 * numero2;
    textoPregunta = `¿Cuánto es ${numero1} × ${numero2}?`;
  }

  // 👉 DIVISIÓN EXACTA
  if (tipoOperacion === 4) {
    numero2 = rand(1, 10);
    respuestaCorrecta = rand(1, 10);
    numero1 = respuestaCorrecta * numero2;
    textoPregunta = `¿Cuánto es ${numero1} ÷ ${numero2}?`;
  }

  return {
    q: textoPregunta,
    o: mezclar([
      respuestaCorrecta,
      respuestaCorrecta + 1,
      respuestaCorrecta - 1
    ]),
    a: respuestaCorrecta
  };
}

// ================= BANCO FINAL =================
let bancoFinal = [];
for (let i = 0; i < 10; i++) {
  bancoFinal.push(generarPreguntaRandom());
}
// ================= MOSTRAR EVALUACIÓN FINAL =================
function crearEvaluacionFinal() {
  let contenidoEvaluacion = "";
  bancoFinal.forEach((pregunta, indice) => {
    contenidoEvaluacion += `<p>${pregunta.q}</p>`;
    pregunta.o.forEach(opcion => {
      contenidoEvaluacion += `
        <label>
          <input type="radio" name="f${indice}" value="${opcion}">
          ${opcion}
        </label><br>`;
    });
  });
  document.getElementById("finalQuiz").innerHTML = contenidoEvaluacion;
}
crearEvaluacionFinal();

// ================= CALCULAR NOTA =================
function calcularFinal() {
  let puntajeTotal = 0;
  bancoFinal.forEach((pregunta, indice) => {
    let respuestaSeleccionada = document.querySelector(
      `input[name="f${indice}"]:checked`
    );
    if (
      respuestaSeleccionada &&
      Number(respuestaSeleccionada.value) === pregunta.a
    ) {
      puntajeTotal += 2;
    }
  });
  document.getElementById("notaFinal").innerText =
    `Nota final: ${puntajeTotal} / 20`;
}
// ================= PDF =================
function descargarEvaluacion() {
  const { jsPDF } = window.jspdf;
  const pdf = new jsPDF();

  let nota = 0;
  let texto = [];

  texto.push("EVALUACIÓN");
  texto.push(`Nombre: ${nombreEstudiante}`);
  texto.push("");

  bancoFinal.forEach((p, i) => {
    const r = document.querySelector(`input[name="f${i}"]:checked`);
    const respuesta = r ? r.value : "No respondió";

    if (respuesta == p.a) nota += 2;

    texto.push(`${i + 1}. ${p.q}`);
    texto.push(`Respuesta: ${respuesta}`);
    texto.push("");
  });

  texto.push(`Nota final: ${nota}`);

  pdf.text(texto.join("\n"), 10, 10);
  pdf.save(`evaluacion_${nombreEstudiante}.pdf`);
}
// ================= NAVEGACIÓN =================
document.querySelectorAll(".session-btn").forEach(boton => {
  boton.onclick = () => {

    document.querySelectorAll(".session").forEach(seccion => {
      seccion.style.display = "none";
    });

    let idSesion = boton.dataset.s;
    document.getElementById(idSesion).style.display = "block";
  };
});

// Mostrar primera sesión
document.getElementById("s1").style.display = "block";

