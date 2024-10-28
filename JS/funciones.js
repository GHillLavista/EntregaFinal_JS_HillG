const guardarProductosLS = (productos) => {
    localStorage.setItem("productos", JSON.stringify(productos));
}

const cargarProductos = async () => {
    try {
        // Cambiamos la ruta para que sea relativa a la raíz del proyecto
        const response = await fetch('./Data/productos.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const productos = await response.json();
        console.log('Productos cargados:', productos); // Para debug
        return productos;
    } catch (error) {
        console.error("Error cargando productos:", error);
        return [];
    }
}

const guardarIdProducto = (id) => {
    localStorage.setItem("idProducto", JSON.stringify(id));
}

const cargarIdProducto = () => {
    return JSON.parse(localStorage.getItem("idProducto"));
}

const guardarCarritoLS = (productos) => {
    localStorage.setItem("carrito", JSON.stringify(productos));
}

const cargarCarritoLS = () => {
    return JSON.parse(localStorage.getItem("carrito")) || [];
}



const agregarProducto = (id) => {
    const productos = cargarProductosLS();
    const carrito = cargarCarritoLS();
    let producto;
    
    if (buscarProducto(id)) {      
        producto = carrito.find(item => item.id == id); 
        producto.cantidad += 1;
        console.log(producto);
    } else {
        producto = productos.find(item => item.id == id);
        producto.cantidad = 1;
        carrito.push(producto);
    }

    guardarCarritoLS(carrito);
    renderBotonCarrito();
    mostrarMensaje("El producto se agregó correctamente!");
}

const cantTotalProductosCarrito = () => {
    const carrito = cargarCarritoLS();

    return carrito.reduce((acum, item) => acum += item.cantidad, 0);
}

const sumaTotalProductosCarrito = () => {
    const carrito = cargarCarritoLS();

    return carrito.reduce((acum, item) => acum += item.cantidad * item.precio, 0);
}

const renderBotonCarrito = () => {
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    const botonCarrito = document.getElementById('botonCarrito');
    
    if (botonCarrito) {
        const cantidadTotal = carrito.reduce((total, item) => total + item.cantidad, 0);
        botonCarrito.innerHTML = `
            <i class="bi bi-cart"></i>
            <span class="badge bg-danger">${cantidadTotal}</span>
        `;
    }
}


const renderizarCarrito = () => {
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    const contenedor = document.getElementById('contenidoCarrito');
    const totalElement = document.getElementById('totalCarrito');
    
    if (carrito.length === 0) {
        contenedor.innerHTML = `
            <div class="col-12">
                <div class="alert alert-warning text-center" role="alert">
                    El carrito está vacío
                </div>
            </div>
        `;
        totalElement.innerHTML = 'Total: $0';
        return;
    }

    let total = 0;
    contenedor.innerHTML = '';
    
    carrito.forEach((producto, index) => {
        const subtotal = producto.precio * (producto.cantidad || 1);
        total += subtotal;
        contenedor.innerHTML += `
            <div class="col-12 mb-3">
                <div class="card animate__animated animate__fadeIn">
                    <div class="row g-0">
                        <div class="col-md-2">
                            <img src="${producto.imagen}" class="img-fluid rounded-start" alt="${producto.nombre}">
                        </div>
                        <div class="col-md-8">
                            <div class="card-body">
                                <h5 class="card-title">${producto.nombre}</h5>
                                <p class="card-text">Precio unitario: $${producto.precio}</p>
                                <p class="card-text">Cantidad: ${producto.cantidad || 1}</p>
                                <p class="card-text"><strong>Subtotal: $${subtotal}</strong></p>
                            </div>
                        </div>
                        <div class="col-md-2 d-flex align-items-center justify-content-center">
                            <button class="btn btn-danger" onclick="eliminarDelCarrito(${index})">
                                <i class="bi bi-trash"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    });

    totalElement.innerHTML = `Total: $${total}`;
}

const agregarAlCarrito = async (id) => {
    const productos = await cargarProductos();
    const producto = productos.find(p => p.id === id);
    
    if (producto) {
        const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
        const productoEnCarrito = carrito.find(item => item.id === id);
        
        if (productoEnCarrito) {
            productoEnCarrito.cantidad = (productoEnCarrito.cantidad || 1) + 1;
        } else {
            producto.cantidad = 1;
            carrito.push(producto);
        }
        
        localStorage.setItem('carrito', JSON.stringify(carrito));
        actualizarContadorCarrito();
        
    }
}

// Inicializar cuando se carga la página
document.addEventListener('DOMContentLoaded', () => {
    renderizarProductos();
    actualizarContadorCarrito();
});

const actualizarContadorCarrito = () => {
    const contador = document.getElementById('botonCarrito');
    if (!contador) return; // Agregamos esta verificación
    
    const carrito = cargarCarritoLS();
    const totalItems = carrito.reduce((sum, item) => sum + (item.cantidad || 1), 0);
    contador.innerHTML = `
        <i class="bi bi-cart3"></i>
        <span class="badge bg-danger">${totalItems}</span>
    `;
}

// ... existing code ...

// Modificar el event listener
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('contenedorProductos')) {
        renderizarProductos();
    }
    if (document.getElementById('botonCarrito')) {
        actualizarContadorCarrito();
    }
});



// Función para eliminar un producto del carrito
const eliminarDelCarrito = (index) => {
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    carrito.splice(index, 1);
    localStorage.setItem('carrito', JSON.stringify(carrito));
    renderizarCarrito();
    actualizarContadorCarrito();
}

// Función para vaciar el carrito
const vaciarCarrito = () => {
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    if (carrito.length === 0) {
        Swal.fire('Error', 'El carrito ya está vacío', 'error');
        return;
    }

    Swal.fire({
        title: '¿Estás seguro?',
        text: 'Esta acción vaciará todo tu carrito',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, vaciar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            localStorage.removeItem('carrito'); // Cambiamos setItem por removeItem
            
            renderizarCarrito();
            actualizarContadorCarrito();
            
            Swal.fire(
                '¡Carrito vaciado!',
                'Tu carrito ha sido vaciado exitosamente',
                'success'
            );
        }
    });
}


    

// Inicializar carrito cuando se carga la página
if (window.location.pathname.includes('carrito.html')) {
    document.addEventListener('DOMContentLoaded', () => {
        renderizarCarrito();
        
        // Agregar eventos a los botones
        document.getElementById('vaciarCarrito').addEventListener('click', vaciarCarrito);
        document.getElementById('finalizarCompra').addEventListener('click', finalizarCompra);
    });


}

const renderizarProductos = async () => {
    try {
        const productos = await cargarProductos();
        const contenedor = document.getElementById('contenedorProductos');
        
        if (!contenedor) return;

        contenedor.innerHTML = '';
        
        productos.forEach(producto => {
            contenedor.innerHTML += `
                <div class="col-md-3 mb-3">
                    <div class="card h-100" style="font-size: 0.9rem;">
                        <img src="${producto.imagen}" class="card-img-top" alt="${producto.nombre}" style="height: 180px; object-fit: cover;">
                        <div class="card-body">
                            <h5 class="card-title" style="font-size: 1.1rem;">${producto.nombre}</h5>
                            <p class="card-text text-muted small">${producto.descripcion}</p>
                            <p class="card-text">
                                <strong>Precio:</strong> $${producto.precio}<br>
                                <small class="text-muted">Stock disponible: ${producto.stock}</small>
                            </p>
                            <button class="btn btn-primary btn-sm" onclick="agregarAlCarrito(${producto.id})">
                                Agregar al carrito
                            </button>
                        </div>
                    </div>
                </div>
            `;
        });
    } catch (error) {
        console.error("Error al renderizar productos:", error);
    }
}



// Función para finalizar la compra
const finalizarCompra = () => {
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    if (carrito.length === 0) {
        Swal.fire('Error', 'El carrito está vacío', 'error');
        return;
    }
    Swal.fire({
        title: '¡Gracias por tu compra!',
        text: 'Tu pedido ha sido procesado correctamente',
        icon: 'success',
        confirmButtonText: 'Aceptar'
    }).then((result) => {
        if (result.isConfirmed) {
            localStorage.setItem('carrito', JSON.stringify([]));
            renderizarCarrito();
            actualizarContadorCarrito();
            window.location.href = 'index.html';
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    // Verificar si es la primera vez que se carga la página
    if (!localStorage.getItem('primeraVisita')) {
        // Limpiar el carrito
        localStorage.setItem('carrito', JSON.stringify([]));
        // Marcar que ya se visitó la página
        localStorage.setItem('primeraVisita', 'true');
    }

    // El resto de la inicialización
    if (document.getElementById('contenedorProductos')) {
        renderizarProductos();
    }
    if (document.getElementById('botonCarrito')) {
        actualizarContadorCarrito();
    }
});

// Función para obtener la hora de Uruguay
async function fetchCurrentTime() {
    try {
        const response = await fetch('https://worldtimeapi.org/api/timezone/America/Montevideo');
        const data = await response.json();
        const dateTime = new Date(data.datetime);
        
        // Formatear la hora
        const options = { timeZone: 'America/Montevideo', hour: '2-digit', minute: '2-digit', second: '2-digit' };
        const timeString = dateTime.toLocaleTimeString('es-UY', options);
        
        const clockElement = document.getElementById('clock');
        if (clockElement) {
            clockElement.innerText = `Hora de Uruguay: ${timeString}`; // Corregido el template literal
        }
    } catch (error) {
        console.error('Error al obtener la hora:', error);
        const clockElement = document.getElementById('clock');
        if (clockElement) {
            clockElement.innerText = 'Error al cargar la hora';
        }
    }
}

// Actualizar la hora cada minuto
setInterval(fetchCurrentTime, 60000);
fetchCurrentTime(); // Obtener la hora inmediatamente al cargar