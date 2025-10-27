import { useState } from 'react';

export default function PriceCalculator({ precioMinorista, preciosMayorista, productoNombre }) {
  const [cantidad, setCantidad] = useState(1);
  const [colorSeleccionado, setColorSeleccionado] = useState('');

  // Calcular precio según cantidad
  const calcularPrecio = () => {
    // Buscar si aplica precio mayorista
    const precioMayorista = preciosMayorista
      .sort((a, b) => b.cantidad - a.cantidad) // Ordenar de mayor a menor
      .find(pm => cantidad >= pm.cantidad);

    if (precioMayorista) {
      return {
        precioUnitario: precioMayorista.precio,
        precioTotal: precioMayorista.precio * cantidad,
        descuento: precioMayorista.descuento,
        esMayorista: true
      };
    }

    return {
      precioUnitario: precioMinorista,
      precioTotal: precioMinorista * cantidad,
      descuento: null,
      esMayorista: false
    };
  };

  const precio = calcularPrecio();

  // Generar mensaje de WhatsApp
  const generarMensajeWhatsApp = () => {
    const mensaje = `Hola! Consulta sobre: ${productoNombre}\n` +
      `Cantidad: ${cantidad} unidad${cantidad > 1 ? 'es' : ''}\n` +
      `Precio: $${precio.precioTotal.toLocaleString('es-AR')}`;

    // Codificar para URL
    const mensajeCodificado = encodeURIComponent(mensaje);
    
    const numeroWhatsApp = '5491140461603';
    
    return `https://api.whatsapp.com/send?phone=${numeroWhatsApp}&text=${mensajeCodificado}`;
  };

  return (
    <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
      {/* Selector de cantidad */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Cantidad
        </label>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setCantidad(Math.max(1, cantidad - 1))}
            className="w-10 h-10 rounded-lg bg-gray-100 hover:bg-gray-200 font-bold text-xl"
            disabled={cantidad <= 1}
          >
            −
          </button>
          <input
            type="number"
            value={cantidad}
            onChange={(e) => setCantidad(Math.max(1, parseInt(e.target.value) || 1))}
            className="w-20 text-center text-xl font-bold border-2 border-gray-300 rounded-lg py-2"
            min="1"
          />
          <button
            onClick={() => setCantidad(cantidad + 1)}
            className="w-10 h-10 rounded-lg bg-gray-100 hover:bg-gray-200 font-bold text-xl"
          >
            +
          </button>
        </div>
        
        {/* Botones rápidos de cantidad */}
        <div className="flex flex-wrap gap-2 mt-3">
          {[6, 12, 24].map((cant) => (
            <button
              key={cant}
              onClick={() => setCantidad(cant)}
              className="px-3 py-1 text-sm bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition"
            >
              {cant} unidades
            </button>
          ))}
        </div>
      </div>

      {/* Mostrar precios */}
      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-gray-600">Precio por unidad:</span>
          <span className="text-xl font-bold text-gray-900">
            ${precio.precioUnitario.toLocaleString('es-AR')}
          </span>
        </div>
        
        {precio.descuento && (
          <div className="flex justify-between items-center mb-2">
            <span className="text-green-600 text-sm font-medium">
              Descuento mayorista:
            </span>
            <span className="text-green-600 font-bold">
              {precio.descuento}
            </span>
          </div>
        )}

        <hr className="my-3" />

        <div className="flex justify-between items-center">
          <span className="text-lg font-semibold text-gray-700">Total:</span>
          <span className="text-2xl font-bold text-blue-600">
            ${precio.precioTotal.toLocaleString('es-AR')}
          </span>
        </div>
      </div>

      {/* Tabla de precios mayoristas */}
      {preciosMayorista.length > 0 && (
        <div className="mb-6">
          <h4 className="text-sm font-semibold text-gray-700 mb-3">
            💰 Precios mayoristas
          </h4>
          <div className="bg-blue-50 rounded-lg p-4 space-y-2">
            {preciosMayorista.map((pm, idx) => (
              <div 
                key={idx}
                className={`flex justify-between text-sm ${
                  cantidad >= pm.cantidad ? 'font-bold text-blue-700' : 'text-gray-600'
                }`}
              >
                <span>Desde {pm.cantidad} unidades:</span>
                <span>${pm.precio.toLocaleString('es-AR')} c/u ({pm.descuento})</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Botón de WhatsApp */}
      <a
        href={generarMensajeWhatsApp()}
        target="_blank"
        rel="noopener noreferrer"
        className="block w-full bg-green-600 hover:bg-green-700 text-white text-center font-bold py-4 rounded-lg transition shadow-lg hover:shadow-xl"
      >
        <span className="flex items-center justify-center gap-2">
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
          </svg>
          Consultar por WhatsApp
        </span>
      </a>

      <p className="text-xs text-gray-500 text-center mt-3">
        Te responderemos a la brevedad
      </p>
    </div>
  );
}