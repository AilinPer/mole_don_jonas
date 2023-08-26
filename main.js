const cuerpo = document.getElementById("seccionMoles")
const iconoCarro = document.getElementById("verCarrito")
const contCarrito = document.getElementById("carritoEmerge")

let carrito = []
let productosData

document.addEventListener("DOMContentLoaded", () => {
    fetchData ()
})

const fetchData = async () => {
    try {
        const res = await fetch('elementos.json')
        const productos = await res.json()
        productosData = productos
        const carritoStorage = localStorage.getItem("carrito")
        if (carritoStorage) {
            carrito = JSON.parse(carritoStorage)
        }
        recorrer()
    } catch (error) {
        console.log("error")
    }
}

/* fetchData() */
// armado del html
const recorrer = () => {
    productosData.forEach((mole) => {
        let contenedor = document.createElement("div")
        contenedor.className = "divCursos"
        contenedor.innerHTML = `
            <img class = "mole" src= "${mole.img}">
            <h3> ${mole.nombre} </h3>
            <p>$${mole.precio} </p>
            <p class = "descripcion"> ${mole.descripcion} </p>
        `
            cuerpo.append(contenedor)

            let btnComprar = document.createElement("button")
            btnComprar.innerText = "Agregar al carrito"
            btnComprar.className = "boton"

            contenedor.append(btnComprar)

            //arreglo para los mole elegidos
            btnComprar.addEventListener("click", () => {
                const libroExistente = carrito.find((productos) => productos.id === mole.id)
                if (libroExistente) {
                    // El libro ya existe en el carrito, aumentar la cantidad en 1
                    libroExistente.cantidad += 1
                } else {
                    carrito.push({
                        id:mole.id,
                        img:mole.img,
                        nombre: mole.nombre,
                        precio:mole.precio,
                        cantidad:1
                    })
                }
                guardarCarritoEnLocalStorage()
            console.log(carrito)
            
                Swal.fire({
                    position: 'top-end',
                    icon: 'success',
                    title:"Agregaste al carrito"+ " " + mole.nombre,
                    timer: 1500
                })
            })
    })
}
//ventana carrito

iconoCarro.addEventListener("click", () =>{
    
    function mostrarCarrito() {
            contCarrito.style.display = "table"
    
        // Crear el contenedor principal del carrito
            let contenedorCarrito = document.createElement("table")
            contenedorCarrito.className = "contenedor-carrito"
            contCarrito.appendChild(contenedorCarrito)
    
        // Verificar si el carrito está vacío
            if (carrito.length === 0) { console.log(carrito)
                swal.fire({
                    position: 'center',
                    icon: 'info',
                    title:"No hay productos en el carrito",
                    timer: 1500
                })
                cuerpo.style.display = "grid"
            } else { 
                console.log(carrito)
                // Crear los elementos para cada producto en el carrito
                
                carrito.forEach((productos) => {
                    const { id, img, nombre, precio } = productos
                    cuerpo.style.display = "none"
    
                    // Crear el contenedor de cada producto en el carrito
                    const contenedorProducto = document.createElement("tr")
                    contenedorProducto.className = "contenedor-producto"
                    contenedorCarrito.appendChild(contenedorProducto)
    
                // Agregar la imagen del producto
                    const imagenProducto = document.createElement("img")
                    imagenProducto.className = "imagen-producto"
                    imagenProducto.src = img
                    contenedorProducto.appendChild(imagenProducto)
    
                // Agregar el nombre del producto
                    const nombreProducto = document.createElement("h3")
                    nombreProducto.textContent = nombre
                    contenedorProducto.appendChild(nombreProducto)
    
                // Agregar el precio del producto
                    const precioProducto = document.createElement("p")
                    precioProducto.textContent = `$${precio}`
                    contenedorProducto.appendChild(precioProducto)
    
                    // Agregar el botón de eliminar producto
                    const botonEliminar = document.createElement("button")
                    botonEliminar.textContent = "Eliminar"
                    botonEliminar.className = "boton"
                    contenedorProducto.appendChild(botonEliminar)
    
                    const cantidadProducto = document.createElement("p")
                    cantidadProducto.textContent = `Cantidad: ${productos.cantidad}`
                    contenedorProducto.appendChild(cantidadProducto)
                
                    // Agregar el evento de click al botón de eliminar
                    botonEliminar.addEventListener("click", () => {
                        eliminarProducto(id)
                        contenedorCarrito.remove()
                    })
                })
                const contenedorFinalizar = document.createElement("div")
                contenedorFinalizar.className = "contenedor-finalizar"
                contenedorCarrito.appendChild(contenedorFinalizar)
    
                // Mostrar el total a pagar
                const totalPagar = calcularTotalPagar()
                const totalPagarTexto = document.createElement("p")
                totalPagarTexto.textContent = `Total a pagar: $${totalPagar}`
                contenedorFinalizar.appendChild(totalPagarTexto)
            
                // Agregar el botón de finalizar compra
                const botonFinalizarCompra = document.createElement("button")
                botonFinalizarCompra.textContent = "Finalizar Compra"
                botonFinalizarCompra.className = "boton"
                contenedorFinalizar.appendChild(botonFinalizarCompra)
                
                // Agregar el evento de click al botón de finalizar compra
                botonFinalizarCompra.addEventListener("click", () => {
                    finalizarCompra()
                    contenedorCarrito.remove()
                })
            }
        }
            
        // Función para eliminar un producto del carrito
        function eliminarProducto(id) {
            carrito = carrito.filter((productosData) => productosData.id !== id)
            guardarCarritoEnLocalStorage()
            mostrarCarrito()
        }
            
        // Función para calcular el total a pagar
        function calcularTotalPagar() {
            let total = 0
            carrito.forEach((productos) => {
                const {precio, cantidad} = productos
                total += precio * cantidad
            })
        return total
        }
    
        // Función para finalizar la compra
        function finalizarCompra() {
            console.log(carrito)
            if (carrito.length > 0) {
                // Realizar acciones de finalización de compra (por ejemplo, enviar datos al servidor)
                Swal.fire({
                icon: "success",
                title: "¡Compra realizada!",
                text: "Gracias por tu compra",
                timer: 800
                })
                carrito = []
                cuerpo.style.display = "grid"
                contCarrito.style.display = "none"
                localStorage.removeItem('carrito') 
            } else {
                Swal.fire({
                icon: "error",
                title: "Carrito vacío",
                text: "Agrega productos al carrito antes de finalizar la compra",
                })
            }
        }
            
        // Llamar a la función mostrarCarrito para mostrar el carrito inicialmente
        mostrarCarrito()
    })
    
    function guardarCarritoEnLocalStorage() {
        localStorage.setItem('carrito', JSON.stringify(carrito));
    }
