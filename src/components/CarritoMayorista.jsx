import { useState, useEffect } from 'react';

export default function CarritoMayorista({ productos }) {
  const [carrito, setCarrito] = useState([]);
  const [mostrarCarrito, setMostrarCarrito] = useState(false);

  // Cargar carrito del localStorage al iniciar
  useEffect(() => {
    const carritoGuardado = localStorage.getItem('carritoMayorista');
    if (carritoGuardado) {
      setCarrito(JSON.parse(carritoGuardado));
    }
  }, []);

  // Guardar carrito en localStorage cada vez que cambia
  useEffect(() => {
    localStorage.setItem('carritoMayorista', JSON.stringify(carrito));
  }, [carrito]);

  // Agregar producto al carrito
  const agregarAlCarrito = (producto, cantidad) => {
    if (cantidad <= 0) return;

    const itemExistente = carrito.find(item => item.id === producto.id);

    if (itemExistente) {
      // Si ya existe, sumar cantidad
      setCarrito(carrito.map(item =>
        item.id === producto.id
          ? { ...item, cantidad: item.cantidad + cantidad }
          : item
      ));
    } else {
      // Si no existe, agregar nuevo
      setCarrito([...carrito, {
        id: producto.id,
        nombre: producto.nombre,
        precio: producto.precioMinorista,
        cantidad: cantidad,
        imagen: producto.imagenes[0]
      }]);
    }
  };

  // Actualizar cantidad de un item
  const actualizarCantidad = (id, nuevaCantidad) => {
    if (nuevaCantidad <= 0) {
      eliminarItem(id);
      return;
    }

    setCarrito(carrito.map(item =>
      item.id === id ? { ...item, cantidad: nuevaCantidad } : item
    ));
  };

  // Eliminar item del carrito
  const eliminarItem = (id) => {
    setCarrito(carrito.filter(item => item.id !== id));
  };

  // Vaciar carrito completo
  const vaciarCarrito = () => {
    if (confirm('¿Seguro que querés vaciar el carrito?')) {
      setCarrito([]);
    }
  };

  // Calcular total
  const calcularTotal = () => {
    return carrito.reduce((total, item) => total + (item.precio * item.cantidad), 0);
  };

  // Generar mensaje de WhatsApp
  const enviarPedidoWhatsApp = () => {
    if (carrito.length === 0) {
      alert('El carrito está vacío');
      return;
    }

    let mensaje = '*PEDIDO MAYORISTA*\n\n';
    
    carrito.forEach((item, index) => {
      mensaje += `${index + 1}. ${item.nombre}\n`;
      mensaje += `   Cantidad: ${item.cantidad} unidades\n`;
      mensaje += `   Precio unitario: $${item.precio.toLocaleString('es-AR')}\n`;
      mensaje += `   Subtotal: $${(item.precio * item.cantidad).toLocaleString('es-AR')}\n\n`;
    });

    mensaje += `*TOTAL: $${calcularTotal().toLocaleString('es-AR')}*\n\n`;
    mensaje += 'Aguardo confirmación del pedido. Gracias!';

    const mensajeCodificado = encodeURIComponent(mensaje);
    const numeroWhatsApp = '5491140461603';
    
    window.open(`https://api.whatsapp.com/send?phone=${numeroWhatsApp}&text=${mensajeCodificado}`, '_blank');
  };

  const cantidadTotal = carrito.reduce((total, item) => total + item.cantidad, 0);

  return (
    <>
      {/* Barra flotante del carrito */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-blue-600 shadow-2xl z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setMostrarCarrito(!mostrarCarrito)}
                className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-700 transition"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                Carrito ({cantidadTotal})
              </button>

              {carrito.length > 0 && (
                <div className="hidden sm:block">
                  <p className="text-sm text-gray-600">Total</p>
                  <p className="text-2xl font-bold text-gray-900">
                    ${calcularTotal().toLocaleString('es-AR')}
                  </p>
                </div>
              )}
            </div>

            {carrito.length > 0 && (
              <button
                onClick={enviarPedidoWhatsApp}
                className="bg-green-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-green-700 transition flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
                <span className="hidden sm:inline">Enviar Pedido</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Modal del carrito */}
      {mostrarCarrito && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end sm:items-center justify-center">
          <div className="bg-white w-full sm:max-w-2xl sm:rounded-t-2xl max-h-[80vh] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-2xl font-bold">Tu Pedido</h2>
              <button
                onClick={() => setMostrarCarrito(false)}
                className="text-gray-500 hover:text-gray-700 text-3xl"
              >
                ×
              </button>
            </div>

            {/* Contenido */}
            <div className="flex-1 overflow-y-auto p-6">
              {carrito.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg">El carrito está vacío</p>
                  <p className="text-gray-400 text-sm mt-2">Agregá productos para hacer tu pedido</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {carrito.map((item) => (
                    <div key={item.id} className="flex gap-4 bg-gray-50 p-4 rounded-lg">
                      <img
                        src={item.imagen}
                        alt={item.nombre}
                        className="w-20 h-20 object-contain bg-white rounded p-1 flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 text-sm">{item.nombre}</h3>
                        <p className="text-xs text-gray-600">${item.precio.toLocaleString('es-AR')} x unidad</p>
                        
                        <div className="flex items-center gap-2 mt-2">
                          <button
                            onClick={() => actualizarCantidad(item.id, item.cantidad - 1)}
                            className="w-8 h-8 bg-gray-200 rounded hover:bg-gray-300 flex-shrink-0"
                          >
                            −
                          </button>
                          <input
                            type="number"
                            value={item.cantidad}
                            onChange={(e) => actualizarCantidad(item.id, parseInt(e.target.value) || 0)}
                            className="w-16 text-center border rounded py-1 text-sm"
                          />
                          <button
                            onClick={() => actualizarCantidad(item.id, item.cantidad + 1)}
                            className="w-8 h-8 bg-gray-200 rounded hover:bg-gray-300 flex-shrink-0"
                          >
                            +
                          </button>
                          <button
                            onClick={() => eliminarItem(item.id)}
                            className="ml-auto text-red-600 hover:text-red-800 p-2 hover:bg-red-50 rounded transition"
                            aria-label="Eliminar producto"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="font-bold text-sm break-all">
                          ${(item.precio * item.cantidad).toLocaleString('es-AR')}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {carrito.length > 0 && (
              <div className="border-t p-6 space-y-4">
                <div className="flex justify-between items-center text-xl font-bold">
                  <span>TOTAL:</span>
                  <span>${calcularTotal().toLocaleString('es-AR')}</span>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={vaciarCarrito}
                    className="flex-1 border-2 border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50"
                  >
                    Vaciar Carrito
                  </button>
                  <button
                    onClick={enviarPedidoWhatsApp}
                    className="flex-1 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 flex items-center justify-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                    </svg>
                    Enviar Pedido
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Exponer función para que otros componentes agreguen productos */}
      <div style={{ display: 'none' }} ref={(el) => {
        if (el) {
          window.agregarAlCarritoMayorista = agregarAlCarrito;
        }
      }} />
    </>
  );
}