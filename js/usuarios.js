let usuarioActual = null;

// Función para crear un usuario
function crearUsuario() {
    const username = document.getElementById("username").value.trim();
    if (username && username !== "") {
        usuarioActual = { username };
        localStorage.setItem('usuario', JSON.stringify(usuarioActual));

        // Ocultar formulario de usuario y mostrar mensaje de bienvenida y formulario de gastos
        document.getElementById("formulario-usuario").style.display = "none";
        document.getElementById("bienvenida-container").style.display = "block";
        document.getElementById("mensaje-bienvenida").textContent = `Hola, ${usuarioActual.username}!`;
        document.getElementById("contenedor-gastos").style.display = "block";
    } else {
        mostrarMensaje("Por favor, ingrese un nombre de usuario válido.");
    }
}
// Eventos botón de crear usuario
document.getElementById('crear-usuario').addEventListener('click', function() {
    crearUsuario();
});

// Función para cargar el usuario desde el localStorage
function cargarUsuario() {
    const usuarioGuardado = localStorage.getItem('usuario');
    if (usuarioGuardado) {
        usuarioActual = JSON.parse(usuarioGuardado);
        // Ocultar formulario de usuario y mostrar formulario de gastos y mensaje de bienvenida
        document.getElementById("formulario-usuario").style.display = "none";
        document.getElementById("bienvenida-container").style.display = "block";
        document.getElementById("mensaje-bienvenida").textContent = `Hola, ${usuarioActual.username}!`;
        document.getElementById("contenedor-gastos").style.display = "block";
    }
}

// Llama a la función para cargar el usuario al cargar la página
cargarUsuario();

// Asocia eventos al botón de cambiar usuario
document.getElementById('cambiar-usuario').addEventListener('click', function() {
    localStorage.removeItem('usuario');
    usuarioActual = null;

    // Ocultar mensaje de bienvenida y mostrar formulario de usuario
    document.getElementById("bienvenida-container").style.display = "none";
    document.getElementById("formulario-usuario").style.display = "block";
});