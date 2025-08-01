document.addEventListener('DOMContentLoaded', () => {
    const form =  document.getElementById('loginForm');
    const spinner = document.getElementById('spinner');
    const errorMessage = document.getElementById("errorMessage");

    form.addEventListener('submit', async (e) => {
        document.getElementById("spinner").classList.add("d-none");
        e.preventDefault();
        spinner.classList.remove('d-none');
        errorMessage.classList.add("d-none");
        try {
            // Obtener los valores de los campos de entrada
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            // Url de la api de login
            const apiURL = 'http://34.176.30.132:3000/api/auth/login';
            // Validar que los campos no estén vacíos
            if (!username || !password) {
                alert('Por favor, complete todos los campos.');
                return;
            }
            // Realizar la solicitud POST a la API de login
            const res = await fetch(apiURL , {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            });

            if (res.ok) {
                const data = await res.json();
                // Guardar el token en localStorage
                localStorage.setItem('token', data.token);
                // Redirigir al usuario a la página de administración
                const rol = data.rol;
                console.log(data);

                if (rol === 'admin') {
                    window.location.href = 'views/postulantes.html';
                } else if (rol == 'TICS'){
                    window.location.href = 'views/postulantes.html';
                } else if (rol == 'JAF') {
                    console.log('admin')
                } else if (rol == 'asesoriaLegal'){
                    console.log('admin')
                } else{

                }
            }

        } catch (e) {
            console.error('Error during login:', e);
            errorMessage.classList.remove("d-none");
            alert('Error during login. Please try again.');
        } finally {
            spinner.classList.add("d-none");
        }
    });
});