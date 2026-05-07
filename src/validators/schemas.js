const { z } = require('zod');

const restaurantes = {
  crear: z.object({
    nombre: z.string().min(1),
    descripcion: z.string().optional(),
    direccion: z.string().optional(),
    telefono: z.string().optional(),
    correo: z.string().email().optional(),
    disponible: z.boolean().optional()
  }),
  actualizar: z.object({
    nombre: z.string().min(1).optional(),
    descripcion: z.string().optional(),
    direccion: z.string().optional(),
    telefono: z.string().optional(),
    correo: z.string().email().optional()
  }),
  disponibilidad: z.object({
    disponible: z.boolean()
  }),
  crearHorario: z.object({
    dia_semana: z.number().int().min(0).max(6),
    hora_apertura: z.string().regex(/^\d{2}:\d{2}:\d{2}$/),
    hora_cierre: z.string().regex(/^\d{2}:\d{2}:\d{2}$/)
  }),
  actualizarHorario: z.object({
    hora_apertura: z.string().regex(/^\d{2}:\d{2}:\d{2}$/).optional(),
    hora_cierre: z.string().regex(/^\d{2}:\d{2}:\d{2}$/).optional()
  }),
  crearProducto: z.object({
    tipo_producto_id: z.number().int().positive(),
    nombre: z.string().min(1),
    descripcion: z.string().optional(),
    precio: z.number().positive()
  }),
  actualizarProducto: z.object({
    nombre: z.string().min(1).optional(),
    descripcion: z.string().optional(),
    precio: z.number().positive().optional(),
    tipo_producto_id: z.number().int().positive().optional()
  }),
  actualizarPrecio: z.object({
    precio_nuevo: z.number().positive(),
    motivo: z.string().optional()
  }),
  crearCombo: z.object({
    tipo_combo_id: z.number().int().positive(),
    nombre: z.string().min(1),
    descripcion: z.string().optional(),
    precio: z.number().positive(),
    productos: z.array(z.object({
      producto_id: z.number().int().positive(),
      cantidad: z.number().int().positive()
    })).optional()
  }),
  agregarProductosCombo: z.object({
    productos: z.array(z.object({
      producto_id: z.number().int().positive(),
      cantidad: z.number().int().positive()
    })).min(1)
  }),
  crearPedido: z.object({
    cliente_id: z.number().int().positive(),
    direccion_entrega: z.string().min(1),
    items: z.array(z.object({
      producto_id: z.number().int().positive(),
      cantidad: z.number().int().positive(),
      descuento: z.number().min(0).optional()
    })).min(1)
  }),
  cambiarEstadoPedido: z.object({
    estado_id: z.number().int().positive(),
    motivo: z.string().optional()
  }),
  agregarItemPedido: z.object({
    producto_id: z.number().int().positive(),
    cantidad: z.number().int().positive(),
    descuento: z.number().min(0).optional()
  }),
  cancelarPedido: z.object({
    cancelado_por: z.enum(['cliente', 'restaurante', 'admin']),
    motivo: z.string().optional()
  })
};

const logistica = {
  crearEntrega: z.object({
    tipo_origen: z.enum(['pedido', 'cotizacion', 'manual']),
    origen_id: z.number().int().positive(),
    empresa_id: z.number().int().positive(),
    sucursal_id: z.number().int().positive().optional(),
    cliente_id: z.number().int().positive(),
    direccion_entrega: z.string().min(1),
    referencia_direccion: z.string().optional(),
    instrucciones_entrega: z.string().optional(),
    monto_cobrar: z.number().min(0).optional(),
    fecha_entrega_estimada: z.string().datetime({ offset: true }).optional()
  }),
  actualizarEntrega: z.object({
    direccion_entrega: z.string().optional(),
    referencia_direccion: z.string().optional(),
    instrucciones_entrega: z.string().optional(),
    monto_cobrar: z.number().min(0).optional(),
    fecha_entrega_estimada: z.string().datetime({ offset: true }).optional()
  }),
  cambiarEstadoEntrega: z.object({
    estado_nuevo: z.enum(['pendiente', 'asignada', 'en_ruta', 'entregada', 'fallida', 'cancelada']),
    comentario: z.string().optional()
  }),
  cancelarEntrega: z.object({
    comentario: z.string().optional()
  }),
  asignarRepartidor: z.object({
    entrega_id: z.number().int().positive(),
    repartidor_id: z.number().int().positive()
  }),
  reasignarRepartidor: z.object({
    repartidor_id: z.number().int().positive(),
    comentario: z.string().optional()
  }),
  desasignarRepartidor: z.object({
    comentario: z.string().optional()
  }),
  crearIncidencia: z.object({
    entrega_id: z.number().int().positive(),
    repartidor_id: z.number().int().positive().optional().nullable(),
    tipo_incidencia: z.enum(['direccion_incorrecta', 'cliente_ausente', 'paquete_danado', 'rechazo_cliente', 'accidente', 'otro']),
    descripcion: z.string().min(1)
  }),
  actualizarIncidencia: z.object({
    descripcion: z.string().optional(),
    tipo_incidencia: z.enum(['direccion_incorrecta', 'cliente_ausente', 'paquete_danado', 'rechazo_cliente', 'accidente', 'otro']).optional()
  })
};

const auth = {
  login: z.object({
    email: z.string().email(),
    password: z.string().min(6)
  }),
  register: z.object({
    nombre: z.string().min(1),
    email: z.string().email(),
    password: z.string().min(6)
  })
};

module.exports = { restaurantes, logistica, auth };