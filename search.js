// Lista de páginas y secciones de tu sitio
const pages = [
  { title: "Juego trivia Wars freestyle", url: "juego.html" },
  { title: "Trivia", url: "juego.html" },
  { title: "Juego de preguntas", url: "juego.html" }
  { title: "Galería de videos y Fotos", url: "galerias-videos.html" },
  { title: "Calculadora de Rimas", url: "calculadora.html" },
  { title: "Juego Dinochivo", url: "juegodino.html" },
  { title: "Blog sobre rap urbano", url: "seccion.voces.html" },
  { title: "Cookies", url: "cookies.html" },
  { title: "privacidad", url: "privacidad.html" },
  { title: "Carechivofreestyle", url: "proyecto.html" },
  { title: "Terminos", url: "terminos.html" }
];

function searchSite() {
  let input = document.getElementById("searchInput").value.toLowerCase();
  let results = pages.filter(p => p.title.toLowerCase().includes(input));

  if(results.length > 0) {
    let output = results.map(r => `<li><a href="${r.url}">${r.title}</a></li>`).join("");
    document.getElementById("results").innerHTML = `<ul>${output}</ul>`;
  } else {
    document.getElementById("results").innerHTML = "<p>No se encontraron resultados.</p>";
  }
}
