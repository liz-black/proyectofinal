// ================= SESIÓN DEL ESTUDIANTE =================
const nombreEstudiante = localStorage.getItem("estudiante");
if (!nombreEstudiante) {
  alert("Debes ingresar tu nombre para acceder al curso");
  window.location.href = "index.html";
}
const titulo = document.querySelector(".container h1");
if (titulo) {
  titulo.innerText = `Bienvenido/a, ${nombreEstudiante}`;
}
// ================= FUNCIONES ÚTILES =================
function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
function mezclar(arr) {
  return arr.sort(() => Math.random() - 0.5);
}
// ================= DATOS BASE =================
const hardware = ["Teclado", "Mouse", "Monitor", "CPU", "Impresora"];
const software = ["Windows", "Word", "Excel", "Chrome", "PowerPoint"];
const entrada = ["Teclado", "Mouse", "Escáner", "Micrófono"];
const salida = ["Monitor", "Impresora", "Parlantes", "Proyector"];
const programas = ["Word", "Excel", "PowerPoint", "Paint", "Chrome"];

// ================= GENERADORES DE PREGUNTAS =================
function preguntaHardwareSoftware() {
  const esHardware = Math.random() > 0.5;
  const elemento = esHardware
    ? hardware[rand(0, hardware.length - 1)]
    : software[rand(0, software.length - 1)];
  return {
    q: `${elemento} es:`,
    o: mezclar(["Hardware", "Software"]),
    a: esHardware ? "Hardware" : "Software"
  };
}
function preguntaEntradaSalida() {
  const esEntrada = Math.random() > 0.5;
  const dispositivo = esEntrada
    ? entrada[rand(0, entrada.length - 1)]
    : salida[rand(0, salida.length - 1)];
  return {
    q: `${dispositivo} es un dispositivo de:`,
    o: mezclar(["Entrada", "Salida"]),
    a: esEntrada ? "Entrada" : "Salida"
  };
}
function preguntaPrograma() {
  const programa = programas[rand(0, programas.length - 1)];
  return {
    q: `${programa} es un programa de computadora:`,
    o: ["Verdadero", "Falso"],
    a: "Verdadero"
  };
}

// ================= QUIZZES POR CLASE =================
const sesiones = {
  quiz1: [ preguntaHardwareSoftware(),
    preguntaHardwareSoftware()
  ],
  quiz2: [ preguntaEntradaSalida(),
    preguntaEntradaSalida()
  ],
  quiz3: [ preguntaPrograma(),
    preguntaPrograma()
  ],
  quiz4: [ preguntaPrograma(),
    preguntaHardwareSoftware()
  ]
};

// ================= CREAR QUIZ =================
function crearQuiz(id) {
  let html = "";
  sesiones[id].forEach((pregunta, i) => {
    html += `<div class="quiz">
      <p>${pregunta.q}</p>`;
    pregunta.o.forEach(op => {
      html += `
        <label>
          <input type="radio" name="${id}${i}" value="${op}">
          ${op}
        </label><br>`;
    });
    html += `</div>`;
  });
  document.getElementById(id).innerHTML = html;
}

// Crear todos los quizzes
["quiz1", "quiz2", "quiz3", "quiz4"].forEach(crearQuiz);

// ================= REVISAR CLASE =================
function revisarClase(quizId, resultadoId) {
  let correctas = 0;

  sesiones[quizId].forEach((pregunta, i) => {
    const r = document.querySelector(
      `input[name="${quizId}${i}"]:checked`
    );

    if (r && r.value === pregunta.a) {
      correctas++;
    }
  });

  document.getElementById(resultadoId).innerText =
    `Correctas: ${correctas} / ${sesiones[quizId].length}`;
}

// ================= EVALUACIÓN FINAL =================
let bancoFinal = [];
for (let i = 0; i < 10; i++) {
  const tipo = rand(1, 3);
  if (tipo === 1) bancoFinal.push(preguntaHardwareSoftware());
  if (tipo === 2) bancoFinal.push(preguntaEntradaSalida());
  if (tipo === 3) bancoFinal.push(preguntaPrograma());
}
function crearEvaluacionFinal() {
  let html = "";
  bancoFinal.forEach((p, i) => {
    html += `<div class="quiz">
      <p>${p.q}</p>`;
    p.o.forEach(op => {
      html += `
        <label>
          <input type="radio" name="f${i}" value="${op}">
          ${op}
        </label><br>`;
    });
    html += `</div>`;
  });
  document.getElementById("finalQuiz").innerHTML = html;
}
crearEvaluacionFinal();

// ================= CALCULAR NOTA FINAL =================
function calcularFinal() {
  let nota = 0;

  bancoFinal.forEach((p, i) => {
    const r = document.querySelector(`input[name="f${i}"]:checked`);
    if (r && r.value === p.a) nota += 2;
  });

  document.getElementById("notaFinal").innerText =
    `Nota final: ${nota} / 20`;
}

// ================= PDF =================
function descargarEvaluacion() {
  const { jsPDF } = window.jspdf;
  const pdf = new jsPDF();

  let nota = 0;
  let texto = [];

  texto.push("EVALUACIÓN FINAL");
  texto.push(`Nombre: ${nombreEstudiante}`);
  texto.push("");

  bancoFinal.forEach((p, i) => {
    const r = document.querySelector(`input[name="f${i}"]:checked`);
    const resp = r ? r.value : "No respondió";

    if (resp === p.a) nota += 2;

    texto.push(`${i + 1}. ${p.q}`);
    texto.push(`Respuesta: ${resp}`);
    texto.push("");
  });

  texto.push(`Nota final: ${nota} / 20`);

  pdf.text(texto.join("\n"), 10, 10);
  pdf.save(`evaluacion_${nombreEstudiante}.pdf`);
}

// ================= NAVEGACIÓN ENTRE SESIONES =================
document.querySelectorAll(".session-btn").forEach(btn => {
  btn.onclick = () => {
    document.querySelectorAll(".session").forEach(
      s => s.style.display = "none"
    );
    document.getElementById(btn.dataset.s).style.display = "block";
  };
});

// Mostrar primera clase
document.getElementById("s1").style.display = "block";
