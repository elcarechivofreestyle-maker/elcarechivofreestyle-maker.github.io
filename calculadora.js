function calcular() {
  let totalA = 0;
  let totalB = 0;

  document.querySelectorAll('.a').forEach(input => {
    totalA += Number(input.value) || 0;
  });

  document.querySelectorAll('.b').forEach(input => {
    totalB += Number(input.value) || 0;
  });

  document.getElementById('totalA').textContent = totalA;
  document.getElementById('totalB').textContent = totalB;
}

function limpiar() {
  document.querySelectorAll('input').forEach(input => input.value = '');
  document.getElementById('totalA').textContent = '0';
  document.getElementById('totalB').textContent = '0';
}
