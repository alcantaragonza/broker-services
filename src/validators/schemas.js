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
  // ── Entregas ────────────────────────────────────────────────────────────────
  crearEntrega: z.object({
    tipo_origen: z.string().min(1),
    origen_id: z.number().int().positive(),
    empresa_id: z.number().int().positive(),
    sucursal_id: z.number().int().positive(),
    cliente_id: z.number().int().positive(),
    direccion_entrega: z.string().min(1),
    referencia_direccion: z.string().optional(),
    instrucciones_entrega: z.string().optional(),
    monto_cobrar: z.number().positive()
  }),
  actualizarEntrega: z.object({
    direccion_entrega: z.string().min(1).optional(),
    referencia_direccion: z.string().optional(),
    instrucciones_entrega: z.string().optional()
  }),
  cambiarEstadoEntrega: z.object({
    estado_entrega: z.enum([
      "pendiente",
      "asignada",
      "en_ruta",
      "recogida",
      "entregada",
      "cancelada"
    ]),
    comentario: z.string().optional()
  }),
  cancelarEntrega: z.object({
    motivo: z.string().min(1)
  }),
  recogidaEntrega: z.object({}).optional(),
  entregadaEntrega: z.object({}).optional(),
  // ── Asignaciones ────────────────────────────────────────────────────────────
  asignarRepartidor: z.object({
    entrega_id: z.number().int().positive(),
    repartidor_id: z.number().int().positive()
  }),
  reasignarRepartidor: z.object({
    repartidor_id: z.number().int().positive(),
    comentario: z.string().optional()
  }),
  desasignarRepartidor: z.object({}).optional(),
  // ── Incidencias ─────────────────────────────────────────────────────────────
  crearIncidencia: z.object({
    entrega_id: z.number().int().positive(),
    repartidor_id: z.number().int().positive(),
    tipo_incidencia: z.enum([
      "accidente",
      "robo",
      "paquete_daniado",
      "cliente_ausente",
      "direccion_incorrecta",
      "otro"
    ]),
    descripcion: z.string().min(1)
  }),
  actualizarIncidencia: z.object({
    tipo_incidencia: z.enum([
      "accidente",
      "robo",
      "paquete_daniado",
      "cliente_ausente",
      "direccion_incorrecta",
      "otro"
    ]).optional(),
    descripcion: z.string().min(1).optional()
  }),
  resolverIncidencia: z.object({
    comentario_resolucion: z.string().min(1)
  }),
  reabrirIncidencia: z.object({
    motivo: z.string().min(1)
  }),
  // ── Repartidores (self) ──────────────────────────────────────────────────────
  actualizarUbicacion: z.object({
    latitud: z.number().min(-90).max(90),
    longitud: z.number().min(-180).max(180)
  }),
  actualizarEstadoRepartidor: z.object({
    estado: z.enum(["disponible", "ocupado", "inactivo"])
  }),
  // ── Categorias ───────────────────────────────────────────────────────────────
  crearCategoria: z.object({
    nombre: z.string().min(1),
    descripcion: z.string().optional()
  }),
  actualizarCategoria: z.object({
    nombre: z.string().min(1).optional(),
    descripcion: z.string().optional()
  }),
  toggleCategoria: z.object({}).optional(),
  // ── Feed ─────────────────────────────────────────────────────────────────────
  aceptarPedidoFeed: z.object({}).optional(),
};

const shipmentStatusEnum = z.enum(['pending', 'assigned', 'in_transit', 'delivered', 'cancelled']);
const chargeTypeEnum = z.enum(['cash', 'card']);
const courierStatusEnum = z.enum(['Disponible', 'Ocupado', 'En descanso']);
const packageSizeEnum = z.enum(['Pequeño', 'Mediano', 'Grande']);

const paqueteria = {

  //USERS
  crearUsuario: z.object({
    name: z.string().min(1),
    status: z.boolean().optional()
  }),

  actualizarUsuario: z.object({
    name: z.string().min(1).optional(),
    status: z.boolean().optional()
  }),

  //COURIERS
  crearCourier: z.object({
    name: z.string().min(1),
    status: z.boolean().optional(),
    statusName: courierStatusEnum.optional()
  }),

  actualizarCourier: z.object({
    name: z.string().min(1).optional(),
    status: z.boolean().optional(),
    statusName: courierStatusEnum.optional()
  }),

  cambiarEstadoCourier: z.object({
    statusName: courierStatusEnum
  }),

  // ADDRESSE
  crearDireccion: z.object({
    idUser: z.number().int().positive(),
    latitude: z.number(),
    longitude: z.number(),
    address: z.string().min(1)
  }),

  actualizarDireccion: z.object({
    idUser: z.number().int().positive().optional(),
    latitude: z.number().optional(),
    longitude: z.number().optional(),
    address: z.string().min(1).optional()
  }),

  //PRICES
  crearPrecio: z.object({
    price: z.number().positive(),
    criteria: z.string().min(1),
    status: z.boolean().optional()
  }),

  actualizarPrecio: z.object({
    price: z.number().positive().optional(),
    criteria: z.string().min(1).optional(),
    status: z.boolean().optional()
  }),

  //SHIPMENTS
  crearEnvio: z.object({
    deliveryInstructions: z.string().optional(),
    total: z.number().positive(),
    shipmentStatus: shipmentStatusEnum,
    chargeType: chargeTypeEnum,
    estimatedDeliveryTime: z.string().min(1),
    senderId: z.number().int().positive(),
    receiverId: z.number().int().positive(),
    courierId: z.number().int().positive(),
    invoiceSeries: z.string().min(1),
    status: z.boolean().optional()
  }),

  actualizarEnvio: z.object({
    deliveryInstructions: z.string().optional(),
    total: z.number().positive().optional(),
    shipmentStatus: shipmentStatusEnum.optional(),
    chargeType: chargeTypeEnum.optional(),
    estimatedDeliveryTime: z.string().optional(),
    senderId: z.number().int().positive().optional(),
    receiverId: z.number().int().positive().optional(),
    courierId: z.number().int().positive().optional(),
    invoiceSeries: z.string().optional(),
    status: z.boolean().optional()
  }),

  // PACKAGES
  crearPaquete: z.object({
    idShipment: z.number().int().positive(),
    description: z.string().min(1),
    size: packageSizeEnum,
    weight: z.number().positive(),
    subtotal: z.number().min(0),
    status: z.boolean().optional()
  }),

  actualizarPaquete: z.object({
    idShipment: z.number().int().positive().optional(),
    description: z.string().min(1).optional(),
    size: packageSizeEnum.optional(),
    weight: z.number().positive().optional(),
    subtotal: z.number().min(0).optional(),
    status: z.boolean().optional()
  }),

  //COURIER STATUS TYPES
  crearTipoEstado: z.object({
    name: z.string().min(1),
    description: z.string().min(1)
  }),

  actualizarTipoEstado: z.object({
    name: z.string().min(1).optional(),
    description: z.string().optional()
  }),

  //COURIER STATUSES
  crearRegistroEstado: z.object({
    idCourier: z.number().int().positive(),
    idStatus: z.number().int().positive()
  }),

  actualizarRegistroEstado: z.object({
    idCourier: z.number().int().positive(),
    idStatus: z.number().int().positive()
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

// Cobros
/** Item de cálculo (sin campos de creación de pago) */
const calcItemSchema = z.object({
  product_id: z.string().uuid(),
  product_name: z.string().min(1),
  quantity: z.number().int().positive(),
  unit_price: z.number().positive(),
  item_discount: z.number().min(0).optional().default(0),
  is_combo: z.boolean().optional().default(false),
});

/** Item completo al crear un pago */
const paymentItemSchema = z.object({
  product_id: z.string().uuid(),
  external_product_id: z.string().optional(),
  product_name: z.string().min(1),
  quantity: z.number().int().positive(),
  unit_price: z.number().positive(),
  item_discount: z.number().min(0).optional().default(0),
  is_combo: z.boolean().optional().default(false),
});

// ─────────────────────────────────────────────
//  Schemas de Cobros  (cSchemas)
// ─────────────────────────────────────────────

const cobros = {

  /**
   * POST /api/payments/calculate
   * Calcula el total de un pedido antes de crear el pago.
   */
  calcularTotal: z.object({
    items: z.array(calcItemSchema).min(1),
    product_discounts: z.number().min(0).optional().default(0),
    coupon_discount: z.number().min(0).optional().default(0),
    service_fee: z.number().min(0).optional().default(0),
    tip_amount: z.number().min(0).optional().default(0),
  }),

  /**
   * POST /api/payments
   * Crea un pago nuevo (CARD_CREDIT, CASH, u otros métodos).
   */
  crearPago: z.object({
    customer_id: z.string().uuid(),
    courier_id: z.string().uuid(),
    business_id: z.string().uuid(),
    delivery_address_id: z.string().uuid(),
    reservation_id: z.string().min(1),
    currency_code: z.string().length(3),                  // ISO-4217 e.g. "GTQ"
    payment_method_code: z.enum(["CARD_CREDIT", "CARD_DEBIT", "CASH"]),
    product_discounts: z.number().min(0).optional().default(0),
    coupon_discount: z.number().min(0).optional().default(0),
    service_fee: z.number().min(0).optional().default(0),
    courier_earned_fee: z.number().min(0).optional().default(0),
    approved_extra_fee: z.number().min(0).optional().default(0),
    tip_amount: z.number().min(0).optional().default(0),
    items: z.array(paymentItemSchema).min(1),
    idempotency_key: z.string().min(1),
  }),

  /**
   * POST /api/wallet/pay-pending
   * Salda una deuda pendiente en efectivo.
   * Acepta identificar la transacción por transactionId O por orderId
   * (al menos uno de los dos debe estar presente).
   */
  pagarPendiente: z
    .object({
      courierId: z.string().uuid(),
      transactionId: z.string().uuid().optional(),
      orderId: z.string().uuid().optional(),
    })
    .refine(
      (data) => data.transactionId !== undefined || data.orderId !== undefined,
      { message: "Debes proporcionar transactionId o orderId" }
    ),
};

const chats = {
  // Horarios de atencion
  crearHorario: z.object({
    day_of_week: z.number().int().min(0).max(6),
    start_time: z.string().regex(/^\d{2}:\d{2}:\d{2}$/),
    end_time: z.string().regex(/^\d{2}:\d{2}:\d{2}$/),
    enabled: z.boolean().optional(),
    timezone: z.string().optional()
  }),
  actualizarHorario: z.object({
    start_time: z.string().regex(/^\d{2}:\d{2}:\d{2}$/).optional(),
    end_time: z.string().regex(/^\d{2}:\d{2}:\d{2}$/).optional(),
    enabled: z.boolean().optional(),
    timezone: z.string().optional()
  }),
  // Conversaciones
  crearConversacion: z.object({
    requester_type: z.string().min(1),
    requester_ext_id: z.string().min(1),
    requester_display_name: z.string().optional(),
    case_type: z.string().min(1),
    case_reference: z.string().optional(),
    subject: z.string().optional(),
    inactivity_minutes: z.number().int().positive().optional()
  }),
  // Mensajes (mismo endpoint para USER y AGENT)
  enviarMensaje: z.object({
    sender_role: z.enum(['USER', 'AGENT']),
    sender_ext_id: z.string().min(1),
    content: z.string().min(1),
    client_message_id: z.string().optional()
  }),
  // Asignacion de agente
  asignarAgente: z.object({
    agent_ext_id: z.string().min(1),
    agent_display_name: z.string().optional()
  }),
  // Cambio de estado / cierre
  cambiarEstado: z.object({
    new_status: z.enum([
      'RESOLVED_NO_SOLUTION',
      'RESOLVED_COUPON',
      'RESOLVED_REFUND',
      'CLOSED_MANUAL'
    ]),
    changed_by_ext_id: z.string().min(1),
    reason: z.string().optional()
  }),
  // Jobs internos
  cerrarPorInactividad: z.object({
    limit: z.number().int().positive().optional()
  })
};



const categoryTypeEnum = z.enum([
  'cliente',
  'repartidor',
  'restaurante',
  'farmacia',
  'supermercado',
  'paqueteria',
]);

const faqStatusEnum = z.enum(['active', 'inactive', 'archive']);

const chatAutomatizado = {

  // POST /soporte/session
  iniciarSesion: z.object({
    id_usuario: z.number().int().positive(),
    user_type: z.enum(['cliente', 'repartidor', 'negocio']),
  }),

  // POST /soporte/session/message
  enviarMensaje: z.object({
    id_session: z.number().int().positive(),
    input: z.union([z.string().min(1), z.number()]),
    input_type: z.string().optional().nullable(),
  }),

  // POST /soporte/faqs
  crearFaq: z.object({
    category_type: categoryTypeEnum,
    question: z.string().min(1),
    answer: z.string().min(1),
    faq_status: faqStatusEnum.optional(),
  }),

  // PATCH /soporte/faqs/:id
  actualizarFaq: z.object({
    category_type: categoryTypeEnum.optional(),
    question: z.string().min(1).optional(),
    answer: z.string().min(1).optional(),
    faq_status: faqStatusEnum.optional(),
  }).refine(
    (data) => Object.keys(data).length > 0,
    { message: 'Se requiere al menos un campo para actualizar' }
  ),

  // PATCH /soporte/support/:id/status
  actualizarSolicitud: z.object({
    request_status: z.enum(['pendiente', 'en_proceso', 'resuelto', 'cancelado']),
  }),

  // PATCH /soporte/escalation/:id/status
  actualizarEscalacion: z.object({
    handoff_status: z.enum(['pendiente', 'recibido', 'en_atencion', 'cerrado']),
  }),
};

module.exports = { restaurantes, logistica, paqueteria, auth, cobros, chats, chatAutomatizado };