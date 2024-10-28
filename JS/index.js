renderizarProductos();
renderBotonCarrito();

fetch('Data/productos.json')
    .then(response => response.json())
    .then(data => {
        // Aquí puedes trabajar con los datos del JSON
        console.log(data);
    })
    .catch(error => console.error('Error:', error));
