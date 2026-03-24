let data = {};
let currentMonth = null;

const months = [
    "Enero","Febrero","Marzo","Abril","Mayo","Junio",
    "Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"
];

// Cargar datos
function loadData() {
    const saved = localStorage.getItem("cursos");
    if (saved) {
        data = JSON.parse(saved);
    } else {
        fetch("data.json")
        .then(res => res.json())
        .then(json => {
            data = json;
            saveData();
            renderMonths();
        });
        return;
    }
    renderMonths();
}

// Guardar
function saveData() {
    localStorage.setItem("cursos", JSON.stringify(data));
}

// Render meses
function renderMonths() {
    const calendar = document.getElementById("calendar");
    calendar.innerHTML = "";

    months.forEach(month => {
        const div = document.createElement("div");
        div.className = "month";
        div.innerText = month;
        div.onclick = () => selectMonth(month);
        calendar.appendChild(div);
    });
}

// Seleccionar mes
function selectMonth(month) {
    currentMonth = month;
    document.getElementById("monthTitle").innerText = month;

    renderCourses();
}

// Mostrar cursos
function renderCourses() {
    const container = document.getElementById("courses");
    container.innerHTML = "";

    const courses = data[currentMonth] || [];

    if (courses.length === 0) {
        container.innerHTML = "<p>Sin cursos</p>";
        return;
    }

    courses.forEach((c, index) => {
        const div = document.createElement("div");
        div.className = "course";

        div.innerHTML = `
            <b>${c.titulo}</b><br>
            ${c.inicio} al ${c.fin}<br>
            <button onclick="editCourse(${index})">Editar</button>
            <button onclick="deleteCourse(${index})">Eliminar</button>
        `;

        container.appendChild(div);
    });
}

// Agregar curso
function addCourse() {
    const title = document.getElementById("title").value;
    const start = document.getElementById("start").value;
    const end = document.getElementById("end").value;

    if (!currentMonth) return alert("Selecciona un mes");

    if (!data[currentMonth]) data[currentMonth] = [];

    data[currentMonth].push({
        titulo: title,
        inicio: parseInt(start),
        fin: parseInt(end)
    });

    saveData();
    renderCourses();
}

// Eliminar
function deleteCourse(index) {
    data[currentMonth].splice(index, 1);
    saveData();
    renderCourses();
}

// Editar
function editCourse(index) {
    const course = data[currentMonth][index];

    const title = prompt("Nombre", course.titulo);
    const start = prompt("Inicio", course.inicio);
    const end = prompt("Fin", course.fin);

    if (!title) return;

    data[currentMonth][index] = {
        titulo: title,
        inicio: parseInt(start),
        fin: parseInt(end)
    };

    saveData();
    renderCourses();
}

// INIT
loadData();