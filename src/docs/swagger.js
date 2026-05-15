const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "Pedidos Now — API Gateway / Broker",
    version: "1.0.0",
    description:
      "Documentación centralizada del Broker de Pedidos Now. Aquí encontrarás todos los endpoints a los que cada microservicio debe apuntar para integrarse correctamente con el API Gateway.",
    contact: {
      name: "Equipo Pedidos Now",
    },
  },
  servers: [
    {
      url: "http://localhost:3000",
      description: "Servidor local de desarrollo",
    },
  ],
  tags: [
    { name: "🔵 Logística — Feed", description: "Feed de pedidos disponibles para repartidores" },
    { name: "🔵 Logística — Entregas", description: "Gestión de entregas y estados" },
    { name: "🔵 Logística — Asignaciones", description: "Asignación de repartidores a entregas" },
    { name: "🔵 Logística — Repartidores", description: "Perfil, ubicación y métricas del repartidor" },
    { name: "🔵 Logística — Incidencias", description: "Registro y resolución de incidencias" },
    { name: "🔵 Logística — Categorías", description: "Categorías de entregas" },
    { name: "🔵 Logística — Notificaciones", description: "Notificaciones del sistema logístico" },
    { name: "🔵 Logística — Estadísticas", description: "Métricas y estadísticas de operación" },
    { name: "🟢 Restaurantes — Restaurantes", description: "CRUD de restaurantes" },
    { name: "🟢 Restaurantes — Horarios", description: "Horarios de apertura/cierre" },
    { name: "🟢 Restaurantes — Productos", description: "Productos y precios del restaurante" },
    { name: "🟢 Restaurantes — Combos", description: "Combos y agrupaciones de productos" },
    { name: "🟢 Restaurantes — Pedidos", description: "Pedidos del restaurante" },
    { name: "🟢 Restaurantes — Inventario", description: "Control de inventario y proveedores" },
    { name: "🟢 Restaurantes — Estados", description: "Catálogo de estados de pedido" },
    { name: "🟠 Paquetería — Users", description: "Usuarios del servicio de paquetería" },
    { name: "🟠 Paquetería — Couriers", description: "Mensajeros/repartidores de paquetería" },
    { name: "🟠 Paquetería — Courier Status Types", description: "Tipos de estado para couriers" },
    { name: "🟠 Paquetería — Courier Statuses", description: "Estados actuales de couriers" },
    { name: "🟠 Paquetería — Addresses", description: "Direcciones de usuarios" },
    { name: "🟠 Paquetería — Prices", description: "Precios del servicio de paquetería" },
    { name: "🟠 Paquetería — Shipments", description: "Envíos y su ciclo de vida" },
    { name: "🟠 Paquetería — Packages", description: "Paquetes individuales dentro de un envío" },
  ],
  components: {
    schemas: {
      // ─── Logística ───
      EntregaBody: {
        type: "object",
        required: ["tipo_origen", "origen_id", "empresa_id", "sucursal_id", "cliente_id", "direccion_entrega"],
        properties: {
          tipo_origen: { type: "string", example: "pedido" },
          origen_id: { type: "integer", example: 1 },
          empresa_id: { type: "integer", example: 1 },
          sucursal_id: { type: "integer", example: 1 },
          cliente_id: { type: "integer", example: 1 },
          direccion_entrega: { type: "string", example: "Zona 1, 4 Calle" },
          referencia_direccion: { type: "string", example: "Frente al parque" },
          instrucciones_entrega: { type: "string", example: "Llamar al llegar" },
          monto_cobrar: { type: "number", example: 100.0 },
        },
      },
      EntregaEstadoBody: {
        type: "object",
        required: ["estado_entrega"],
        properties: {
          estado_entrega: { type: "string", enum: ["pendiente", "asignada", "en_ruta", "entregada", "cancelada"], example: "en_ruta" },
          comentario: { type: "string", example: "En camino al destino" },
        },
      },
      EntregaCancelarBody: {
        type: "object",
        required: ["motivo"],
        properties: { motivo: { type: "string", example: "Cliente no disponible" } },
      },
      EntregaUpdateBody: {
        type: "object",
        properties: {
          direccion_entrega: { type: "string", example: "Zona 3, 6a Av" },
          referencia_direccion: { type: "string", example: "Edificio azul" },
          instrucciones_entrega: { type: "string", example: "Dejar en portería" },
        },
      },
      AsignacionBody: {
        type: "object",
        required: ["entrega_id", "repartidor_id"],
        properties: {
          entrega_id: { type: "integer", example: 1 },
          repartidor_id: { type: "integer", example: 5 },
        },
      },
      ReasignacionBody: {
        type: "object",
        required: ["repartidor_id"],
        properties: {
          repartidor_id: { type: "integer", example: 7 },
          comentario: { type: "string", example: "Reasignación por demora" },
        },
      },
      RepartidorUbicacionBody: {
        type: "object",
        required: ["latitud", "longitud"],
        properties: {
          latitud: { type: "number", example: 14.6349 },
          longitud: { type: "number", example: -90.5069 },
        },
      },
      RepartidorEstadoBody: {
        type: "object",
        required: ["estado"],
        properties: {
          estado: { type: "string", enum: ["disponible", "ocupado", "inactivo"], example: "disponible" },
        },
      },
      IncidenciaBody: {
        type: "object",
        required: ["entrega_id", "repartidor_id", "tipo_incidencia", "descripcion"],
        properties: {
          entrega_id: { type: "integer", example: 1 },
          repartidor_id: { type: "integer", example: 5 },
          tipo_incidencia: { type: "string", example: "otro" },
          descripcion: { type: "string", example: "Descripción de la incidencia" },
        },
      },
      CategoriaBody: {
        type: "object",
        required: ["nombre"],
        properties: {
          nombre: { type: "string", example: "Comida rápida" },
          descripcion: { type: "string", example: "Categoría para restaurantes de comida rápida" },
        },
      },
      // ─── Restaurantes ───
      RestauranteBody: {
        type: "object",
        required: ["nombre", "direccion"],
        properties: {
          nombre: { type: "string", example: "Pizza Hut Centro" },
          descripcion: { type: "string", example: "Las mejores pizzas" },
          direccion: { type: "string", example: "Av. Principal 123" },
          telefono: { type: "string", example: "555-1234" },
          correo: { type: "string", example: "contacto@pizzahut.com" },
          disponible: { type: "boolean", example: true },
        },
      },
      HorarioBody: {
        type: "object",
        required: ["dia_semana", "hora_apertura", "hora_cierre"],
        properties: {
          dia_semana: { type: "integer", minimum: 0, maximum: 6, example: 0, description: "0=Domingo … 6=Sábado" },
          hora_apertura: { type: "string", example: "08:00:00" },
          hora_cierre: { type: "string", example: "22:00:00" },
        },
      },
      ProductoBody: {
        type: "object",
        required: ["tipo_producto_id", "nombre", "precio"],
        properties: {
          tipo_producto_id: { type: "integer", example: 1 },
          nombre: { type: "string", example: "Hamburguesa Clásica" },
          descripcion: { type: "string", example: "Deliciosa hamburguesa" },
          precio: { type: "number", example: 15000 },
        },
      },
      PrecioBody: {
        type: "object",
        required: ["precio_nuevo"],
        properties: {
          precio_nuevo: { type: "number", example: 20000 },
          motivo: { type: "string", example: "Ajuste de inflación" },
        },
      },
      ComboBody: {
        type: "object",
        required: ["tipo_combo_id", "nombre", "precio"],
        properties: {
          tipo_combo_id: { type: "integer", example: 1 },
          nombre: { type: "string", example: "Combo Familiar" },
          descripcion: { type: "string", example: "2 pizzas + refresco" },
          precio: { type: "number", example: 120000 },
          productos: {
            type: "array",
            items: {
              type: "object",
              properties: {
                producto_id: { type: "integer", example: 1 },
                cantidad: { type: "integer", example: 2 },
              },
            },
          },
        },
      },
      PedidoBody: {
        type: "object",
        required: ["cliente_id", "items"],
        properties: {
          cliente_id: { type: "integer", example: 100 },
          direccion_entrega: { type: "string", example: "Calle 123" },
          items: {
            type: "array",
            items: {
              type: "object",
              properties: {
                producto_id: { type: "integer", example: 1 },
                cantidad: { type: "integer", example: 2 },
                descuento: { type: "number", example: 0 },
              },
            },
          },
        },
      },
      PedidoEstadoBody: {
        type: "object",
        required: ["estado_id"],
        properties: {
          estado_id: { type: "integer", example: 2 },
          motivo: { type: "string", example: "Confirmado" },
        },
      },
      InventarioBody: {
        type: "object",
        required: ["producto_id", "cantidad_disponible"],
        properties: {
          producto_id: { type: "integer", example: 1 },
          cantidad_disponible: { type: "number", example: 25 },
          cantidad_minima: { type: "number", example: 5 },
          unidad_medida: { type: "string", example: "unidades" },
        },
      },
      // ─── Paquetería ───
      PaqueteriaUserBody: {
        type: "object",
        required: ["name"],
        properties: {
          name: { type: "string", example: "Roberto Méndez" },
          status: { type: "boolean", example: true },
        },
      },
      CourierBody: {
        type: "object",
        required: ["name"],
        properties: {
          name: { type: "string", example: "Repartidor Nuevo" },
          status: { type: "boolean", example: true },
          statusName: { type: "string", example: "Disponible" },
        },
      },
      AddressBody: {
        type: "object",
        required: ["idUser", "latitude", "longitude", "address"],
        properties: {
          idUser: { type: "integer", example: 2 },
          latitude: { type: "number", example: 14.8502 },
          longitude: { type: "number", example: -91.5306 },
          address: { type: "string", example: "Zona 1, Xela, casa amarilla" },
        },
      },
      PriceBody: {
        type: "object",
        required: ["price", "criteria"],
        properties: {
          price: { type: "number", example: 45.5 },
          criteria: { type: "string", example: "Paquete mediano express" },
          status: { type: "boolean", example: true },
        },
      },
      ShipmentBody: {
        type: "object",
        required: ["senderId", "receiverId"],
        properties: {
          senderId: { type: "integer", example: 1 },
          receiverId: { type: "integer", example: 2 },
          deliveryInstructions: { type: "string", example: "Dejar en el parqueo número 7" },
          chargeType: { type: "string", enum: ["CARD", "CASH"], example: "CARD" },
        },
      },
      PackageBody: {
        type: "object",
        required: ["idShipment", "description", "size", "weight"],
        properties: {
          idShipment: { type: "integer", example: 2 },
          description: { type: "string", example: "Caja con ropa" },
          size: { type: "string", example: "Mediano" },
          weight: { type: "number", example: 3.5 },
          subtotal: { type: "number", example: 40.0 },
          status: { type: "boolean", example: true },
        },
      },
      QuoteBody: {
        type: "object",
        required: ["senderId", "receiverId", "packageDetails", "originAddress", "destinationAddress"],
        properties: {
          senderId: { type: "integer", example: 1 },
          receiverId: { type: "integer", example: 2 },
          packageDetails: {
            type: "object",
            properties: {
              weight: { type: "number", example: 2.5 },
              dimensions: { type: "string", example: "30x20x10" },
            },
          },
          originAddress: {
            type: "object",
            properties: {
              street: { type: "string", example: "Zona 1" },
              city: { type: "string", example: "Quetzaltenango" },
            },
          },
          destinationAddress: {
            type: "object",
            properties: {
              street: { type: "string", example: "Zona 10" },
              city: { type: "string", example: "Guatemala" },
            },
          },
        },
      },
      Success200: {
        type: "object",
        properties: {
          success: { type: "boolean", example: true },
          data: { type: "object" },
        },
      },
      Error400: {
        type: "object",
        properties: {
          success: { type: "boolean", example: false },
          message: { type: "string", example: "Datos inválidos" },
        },
      },
      Error404: {
        type: "object",
        properties: {
          success: { type: "boolean", example: false },
          message: { type: "string", example: "Recurso no encontrado" },
        },
      },
    },
  },
  paths: {
    // ══════════════════════════════════════════════
    //  LOGÍSTICA
    // ══════════════════════════════════════════════

    // Feed
    "/api/logistica/feed/disponibles": {
      get: {
        tags: ["🔵 Logística — Feed"],
        summary: "Listar pedidos disponibles para repartidores",
        responses: { 200: { description: "Lista de pedidos disponibles" } },
      },
    },
    "/api/logistica/feed/{id}/preview": {
      get: {
        tags: ["🔵 Logística — Feed"],
        summary: "Vista previa de un pedido antes de aceptarlo",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: { 200: { description: "Detalle preview del pedido" } },
      },
    },
    "/api/logistica/feed/{id}/aceptar": {
      patch: {
        tags: ["🔵 Logística — Feed"],
        summary: "Aceptar un pedido del feed",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        requestBody: { required: false, content: { "application/json": { schema: { type: "object" } } } },
        responses: { 200: { description: "Pedido aceptado exitosamente" } },
      },
    },

    // Entregas
    "/api/logistica/entregas": {
      post: {
        tags: ["🔵 Logística — Entregas"],
        summary: "Crear una nueva entrega",
        requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/EntregaBody" } } } },
        responses: { 201: { description: "Entrega creada" }, 400: { $ref: "#/components/responses/Bad400" } },
      },
      get: {
        tags: ["🔵 Logística — Entregas"],
        summary: "Listar entregas (paginado)",
        parameters: [
          { name: "page", in: "query", schema: { type: "integer", default: 1 } },
          { name: "limit", in: "query", schema: { type: "integer", default: 50 } },
        ],
        responses: { 200: { description: "Lista paginada de entregas" } },
      },
    },
    "/api/logistica/entregas/restaurantes/{restaurante_id}/pedidos/{pedido_id}": {
      post: {
        tags: ["🔵 Logística — Entregas"],
        summary: "Crear entrega a partir de un pedido de restaurante",
        parameters: [
          { name: "restaurante_id", in: "path", required: true, schema: { type: "integer" } },
          { name: "pedido_id", in: "path", required: true, schema: { type: "integer" } },
        ],
        requestBody: { required: false, content: { "application/json": { schema: { type: "object" } } } },
        responses: { 201: { description: "Entrega creada desde pedido de restaurante" } },
      },
    },
    "/api/logistica/entregas/{id}": {
      get: {
        tags: ["🔵 Logística — Entregas"],
        summary: "Obtener entrega por ID",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: { 200: { description: "Datos de la entrega" }, 404: { $ref: "#/components/responses/Not404" } },
      },
      put: {
        tags: ["🔵 Logística — Entregas"],
        summary: "Actualizar dirección e instrucciones de entrega",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/EntregaUpdateBody" } } } },
        responses: { 200: { description: "Entrega actualizada" } },
      },
    },
    "/api/logistica/entregas/{id}/estado": {
      patch: {
        tags: ["🔵 Logística — Entregas"],
        summary: "Cambiar estado de una entrega",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/EntregaEstadoBody" } } } },
        responses: { 200: { description: "Estado actualizado" } },
      },
    },
    "/api/logistica/entregas/{id}/cancelar": {
      patch: {
        tags: ["🔵 Logística — Entregas"],
        summary: "Cancelar una entrega",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/EntregaCancelarBody" } } } },
        responses: { 200: { description: "Entrega cancelada" } },
      },
    },
    "/api/logistica/entregas/{id}/recogida": {
      patch: {
        tags: ["🔵 Logística — Entregas"],
        summary: "Marcar entrega como recogida por el repartidor",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        requestBody: { required: false, content: { "application/json": { schema: { type: "object" } } } },
        responses: { 200: { description: "Marcada como recogida" } },
      },
    },
    "/api/logistica/entregas/{id}/entregada": {
      patch: {
        tags: ["🔵 Logística — Entregas"],
        summary: "Confirmar entrega exitosa al cliente",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        requestBody: { required: false, content: { "application/json": { schema: { type: "object" } } } },
        responses: { 200: { description: "Entrega completada" } },
      },
    },
    "/api/logistica/entregas/{id}/historial": {
      get: {
        tags: ["🔵 Logística — Entregas"],
        summary: "Historial de cambios de estado de la entrega",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: { 200: { description: "Historial de estados" } },
      },
    },
    "/api/logistica/entregas/{id}/detalles": {
      get: {
        tags: ["🔵 Logística — Entregas"],
        summary: "Detalles completos de la entrega",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: { 200: { description: "Detalles de la entrega" } },
      },
    },

    // Asignaciones
    "/api/logistica/asignaciones": {
      post: {
        tags: ["🔵 Logística — Asignaciones"],
        summary: "Asignar repartidor a una entrega",
        requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/AsignacionBody" } } } },
        responses: { 201: { description: "Asignación creada" } },
      },
    },
    "/api/logistica/asignaciones/entrega/{id}": {
      get: {
        tags: ["🔵 Logística — Asignaciones"],
        summary: "Obtener asignación actual de una entrega",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: { 200: { description: "Asignación activa" } },
      },
      put: {
        tags: ["🔵 Logística — Asignaciones"],
        summary: "Reasignar repartidor a una entrega",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/ReasignacionBody" } } } },
        responses: { 200: { description: "Repartidor reasignado" } },
      },
      delete: {
        tags: ["🔵 Logística — Asignaciones"],
        summary: "Eliminar asignación de una entrega",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: { 200: { description: "Asignación eliminada" } },
      },
    },
    "/api/logistica/asignaciones/entrega/{id}/historial": {
      get: {
        tags: ["🔵 Logística — Asignaciones"],
        summary: "Historial de asignaciones de una entrega",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: { 200: { description: "Historial de asignaciones" } },
      },
    },
    "/api/logistica/asignaciones/repartidor/{repartidor_id}": {
      get: {
        tags: ["🔵 Logística — Asignaciones"],
        summary: "Entregas asignadas a un repartidor",
        parameters: [{ name: "repartidor_id", in: "path", required: true, schema: { type: "integer" } }],
        responses: { 200: { description: "Lista de entregas del repartidor" } },
      },
    },

    // Repartidores
    "/api/logistica/repartidores/disponibles": {
      get: {
        tags: ["🔵 Logística — Repartidores"],
        summary: "Listar repartidores disponibles",
        responses: { 200: { description: "Lista de repartidores disponibles" } },
      },
    },
    "/api/logistica/repartidores/me": {
      get: {
        tags: ["🔵 Logística — Repartidores"],
        summary: "Perfil del repartidor autenticado",
        responses: { 200: { description: "Datos del repartidor" } },
      },
    },
    "/api/logistica/repartidores/me/metricas": {
      get: {
        tags: ["🔵 Logística — Repartidores"],
        summary: "Métricas del repartidor autenticado",
        responses: { 200: { description: "Métricas de rendimiento" } },
      },
    },
    "/api/logistica/repartidores/me/ubicacion": {
      patch: {
        tags: ["🔵 Logística — Repartidores"],
        summary: "Actualizar ubicación GPS del repartidor",
        requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/RepartidorUbicacionBody" } } } },
        responses: { 200: { description: "Ubicación actualizada" } },
      },
    },
    "/api/logistica/repartidores/me/estado": {
      patch: {
        tags: ["🔵 Logística — Repartidores"],
        summary: "Actualizar estado de disponibilidad del repartidor",
        requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/RepartidorEstadoBody" } } } },
        responses: { 200: { description: "Estado actualizado" } },
      },
    },

    // Incidencias
    "/api/logistica/incidencias": {
      post: {
        tags: ["🔵 Logística — Incidencias"],
        summary: "Registrar una incidencia",
        requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/IncidenciaBody" } } } },
        responses: { 201: { description: "Incidencia registrada" } },
      },
      get: {
        tags: ["🔵 Logística — Incidencias"],
        summary: "Listar incidencias (paginado)",
        parameters: [
          { name: "page", in: "query", schema: { type: "integer", default: 1 } },
          { name: "limit", in: "query", schema: { type: "integer", default: 50 } },
        ],
        responses: { 200: { description: "Lista paginada de incidencias" } },
      },
    },
    "/api/logistica/incidencias/stats/estadisticas": {
      get: {
        tags: ["🔵 Logística — Incidencias"],
        summary: "Estadísticas generales de incidencias",
        responses: { 200: { description: "Estadísticas" } },
      },
    },
    "/api/logistica/incidencias/entrega/{id}": {
      get: {
        tags: ["🔵 Logística — Incidencias"],
        summary: "Incidencias de una entrega específica",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: { 200: { description: "Lista de incidencias" } },
      },
    },
    "/api/logistica/incidencias/repartidor/{repartidor_id}": {
      get: {
        tags: ["🔵 Logística — Incidencias"],
        summary: "Incidencias de un repartidor",
        parameters: [{ name: "repartidor_id", in: "path", required: true, schema: { type: "integer" } }],
        responses: { 200: { description: "Lista de incidencias del repartidor" } },
      },
    },
    "/api/logistica/incidencias/{id}": {
      get: {
        tags: ["🔵 Logística — Incidencias"],
        summary: "Obtener incidencia por ID",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: { 200: { description: "Datos de la incidencia" } },
      },
      put: {
        tags: ["🔵 Logística — Incidencias"],
        summary: "Actualizar incidencia",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/IncidenciaBody" } } } },
        responses: { 200: { description: "Incidencia actualizada" } },
      },
    },
    "/api/logistica/incidencias/{id}/resolver": {
      patch: {
        tags: ["🔵 Logística — Incidencias"],
        summary: "Resolver una incidencia",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: { comentario_resolucion: { type: "string", example: "Problema resuelto exitosamente" } },
              },
            },
          },
        },
        responses: { 200: { description: "Incidencia resuelta" } },
      },
    },
    "/api/logistica/incidencias/{id}/reabrir": {
      patch: {
        tags: ["🔵 Logística — Incidencias"],
        summary: "Reabrir una incidencia resuelta",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: { motivo: { type: "string", example: "El problema persiste" } },
              },
            },
          },
        },
        responses: { 200: { description: "Incidencia reabierta" } },
      },
    },

    // Estadísticas
    "/api/logistica/estadisticas/generales": {
      get: {
        tags: ["🔵 Logística — Estadísticas"],
        summary: "Estadísticas generales por empresa",
        parameters: [{ name: "empresa_id", in: "query", required: true, schema: { type: "integer" } }],
        responses: { 200: { description: "Estadísticas generales" } },
      },
    },
    "/api/logistica/estadisticas/periodo": {
      get: {
        tags: ["🔵 Logística — Estadísticas"],
        summary: "Estadísticas por período de fecha",
        parameters: [
          { name: "empresa_id", in: "query", required: true, schema: { type: "integer" } },
          { name: "fecha_inicio", in: "query", schema: { type: "string", example: "2026-01-01" } },
          { name: "fecha_fin", in: "query", schema: { type: "string", example: "2026-01-31" } },
        ],
        responses: { 200: { description: "Estadísticas del período" } },
      },
    },
    "/api/logistica/estadisticas/repartidores": {
      get: {
        tags: ["🔵 Logística — Estadísticas"],
        summary: "Rendimiento de repartidores por período",
        parameters: [
          { name: "empresa_id", in: "query", required: true, schema: { type: "integer" } },
          { name: "fecha_inicio", in: "query", schema: { type: "string", example: "2026-01-01" } },
          { name: "fecha_fin", in: "query", schema: { type: "string", example: "2026-01-31" } },
        ],
        responses: { 200: { description: "Métricas de repartidores" } },
      },
    },

    // Categorías
    "/api/logistica/categorias": {
      get: {
        tags: ["🔵 Logística — Categorías"],
        summary: "Listar categorías",
        responses: { 200: { description: "Lista de categorías" } },
      },
      post: {
        tags: ["🔵 Logística — Categorías"],
        summary: "Crear categoría",
        requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/CategoriaBody" } } } },
        responses: { 201: { description: "Categoría creada" } },
      },
    },
    "/api/logistica/categorias/{id}": {
      get: {
        tags: ["🔵 Logística — Categorías"],
        summary: "Obtener categoría por ID",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: { 200: { description: "Datos de la categoría" } },
      },
      put: {
        tags: ["🔵 Logística — Categorías"],
        summary: "Actualizar categoría",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/CategoriaBody" } } } },
        responses: { 200: { description: "Categoría actualizada" } },
      },
    },
    "/api/logistica/categorias/{id}/toggle": {
      patch: {
        tags: ["🔵 Logística — Categorías"],
        summary: "Activar/desactivar categoría",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        requestBody: { required: false, content: { "application/json": { schema: { type: "object" } } } },
        responses: { 200: { description: "Estado alternado" } },
      },
    },

    // Notificaciones
    "/api/logistica/notificaciones": {
      get: {
        tags: ["🔵 Logística — Notificaciones"],
        summary: "Listar notificaciones del sistema",
        responses: { 200: { description: "Lista de notificaciones" } },
      },
    },
    "/api/logistica/notificaciones/{id}": {
      get: {
        tags: ["🔵 Logística — Notificaciones"],
        summary: "Obtener notificación por ID",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: { 200: { description: "Datos de la notificación" } },
      },
    },
    "/api/logistica/notificaciones/{id}/reintentar": {
      patch: {
        tags: ["🔵 Logística — Notificaciones"],
        summary: "Reintentar envío de notificación",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        requestBody: { required: false, content: { "application/json": { schema: { type: "object" } } } },
        responses: { 200: { description: "Notificación reenviada" } },
      },
    },

    // ══════════════════════════════════════════════
    //  RESTAURANTES
    // ══════════════════════════════════════════════

    "/health": {
      get: {
        tags: ["🟢 Restaurantes — Restaurantes"],
        summary: "Health check del servicio de restaurantes",
        responses: { 200: { description: "Servicio activo" } },
      },
    },
    "/api/restaurantes": {
      post: {
        tags: ["🟢 Restaurantes — Restaurantes"],
        summary: "Crear restaurante",
        requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/RestauranteBody" } } } },
        responses: { 201: { description: "Restaurante creado" } },
      },
      get: {
        tags: ["🟢 Restaurantes — Restaurantes"],
        summary: "Listar restaurantes",
        parameters: [{ name: "activo", in: "query", schema: { type: "boolean" } }],
        responses: { 200: { description: "Lista de restaurantes" } },
      },
    },
    "/api/restaurantes/{restaurante_id}": {
      get: {
        tags: ["🟢 Restaurantes — Restaurantes"],
        summary: "Obtener restaurante por ID",
        parameters: [{ name: "restaurante_id", in: "path", required: true, schema: { type: "integer" } }],
        responses: { 200: { description: "Datos del restaurante" } },
      },
      put: {
        tags: ["🟢 Restaurantes — Restaurantes"],
        summary: "Actualizar restaurante",
        parameters: [{ name: "restaurante_id", in: "path", required: true, schema: { type: "integer" } }],
        requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/RestauranteBody" } } } },
        responses: { 200: { description: "Restaurante actualizado" } },
      },
    },
    "/api/restaurantes/{restaurante_id}/disponibilidad": {
      patch: {
        tags: ["🟢 Restaurantes — Restaurantes"],
        summary: "Cambiar disponibilidad del restaurante",
        parameters: [{ name: "restaurante_id", in: "path", required: true, schema: { type: "integer" } }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { type: "object", properties: { disponible: { type: "boolean", example: false } } },
            },
          },
        },
        responses: { 200: { description: "Disponibilidad actualizada" } },
      },
    },

    // Horarios
    "/api/restaurantes/{restaurante_id}/horarios": {
      post: {
        tags: ["🟢 Restaurantes — Horarios"],
        summary: "Crear horario de restaurante",
        parameters: [{ name: "restaurante_id", in: "path", required: true, schema: { type: "integer" } }],
        requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/HorarioBody" } } } },
        responses: { 201: { description: "Horario creado" } },
      },
      get: {
        tags: ["🟢 Restaurantes — Horarios"],
        summary: "Listar horarios del restaurante",
        parameters: [{ name: "restaurante_id", in: "path", required: true, schema: { type: "integer" } }],
        responses: { 200: { description: "Lista de horarios" } },
      },
    },
    "/api/restaurantes/{restaurante_id}/horarios/{horario_id}": {
      put: {
        tags: ["🟢 Restaurantes — Horarios"],
        summary: "Actualizar horario",
        parameters: [
          { name: "restaurante_id", in: "path", required: true, schema: { type: "integer" } },
          { name: "horario_id", in: "path", required: true, schema: { type: "integer" } },
        ],
        requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/HorarioBody" } } } },
        responses: { 200: { description: "Horario actualizado" } },
      },
    },

    // Productos
    "/api/restaurantes/{restaurante_id}/productos": {
      post: {
        tags: ["🟢 Restaurantes — Productos"],
        summary: "Crear producto",
        parameters: [{ name: "restaurante_id", in: "path", required: true, schema: { type: "integer" } }],
        requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/ProductoBody" } } } },
        responses: { 201: { description: "Producto creado" } },
      },
      get: {
        tags: ["🟢 Restaurantes — Productos"],
        summary: "Listar productos del restaurante",
        parameters: [{ name: "restaurante_id", in: "path", required: true, schema: { type: "integer" } }],
        responses: { 200: { description: "Lista de productos" } },
      },
    },
    "/api/restaurantes/{restaurante_id}/productos/{producto_id}": {
      get: {
        tags: ["🟢 Restaurantes — Productos"],
        summary: "Obtener producto por ID",
        parameters: [
          { name: "restaurante_id", in: "path", required: true, schema: { type: "integer" } },
          { name: "producto_id", in: "path", required: true, schema: { type: "integer" } },
        ],
        responses: { 200: { description: "Datos del producto" } },
      },
      put: {
        tags: ["🟢 Restaurantes — Productos"],
        summary: "Actualizar producto",
        parameters: [
          { name: "restaurante_id", in: "path", required: true, schema: { type: "integer" } },
          { name: "producto_id", in: "path", required: true, schema: { type: "integer" } },
        ],
        requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/ProductoBody" } } } },
        responses: { 200: { description: "Producto actualizado" } },
      },
    },
    "/api/restaurantes/{restaurante_id}/productos/{producto_id}/precio": {
      put: {
        tags: ["🟢 Restaurantes — Productos"],
        summary: "Actualizar precio del producto",
        parameters: [
          { name: "restaurante_id", in: "path", required: true, schema: { type: "integer" } },
          { name: "producto_id", in: "path", required: true, schema: { type: "integer" } },
        ],
        requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/PrecioBody" } } } },
        responses: { 200: { description: "Precio actualizado" } },
      },
    },
    "/api/restaurantes/{restaurante_id}/productos/{producto_id}/precio/actual": {
      get: {
        tags: ["🟢 Restaurantes — Productos"],
        summary: "Obtener precio actual del producto",
        parameters: [
          { name: "restaurante_id", in: "path", required: true, schema: { type: "integer" } },
          { name: "producto_id", in: "path", required: true, schema: { type: "integer" } },
        ],
        responses: { 200: { description: "Precio vigente" } },
      },
    },

    // Combos
    "/api/restaurantes/{restaurante_id}/combos": {
      post: {
        tags: ["🟢 Restaurantes — Combos"],
        summary: "Crear combo",
        parameters: [{ name: "restaurante_id", in: "path", required: true, schema: { type: "integer" } }],
        requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/ComboBody" } } } },
        responses: { 201: { description: "Combo creado" } },
      },
      get: {
        tags: ["🟢 Restaurantes — Combos"],
        summary: "Listar combos del restaurante",
        parameters: [{ name: "restaurante_id", in: "path", required: true, schema: { type: "integer" } }],
        responses: { 200: { description: "Lista de combos" } },
      },
    },
    "/api/restaurantes/{restaurante_id}/combos/{combo_id}/productos": {
      post: {
        tags: ["🟢 Restaurantes — Combos"],
        summary: "Agregar productos a un combo",
        parameters: [
          { name: "restaurante_id", in: "path", required: true, schema: { type: "integer" } },
          { name: "combo_id", in: "path", required: true, schema: { type: "integer" } },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  productos: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        producto_id: { type: "integer", example: 5 },
                        cantidad: { type: "integer", example: 1 },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        responses: { 200: { description: "Productos agregados al combo" } },
      },
    },

    // Pedidos de restaurante
    "/api/restaurantes/{restaurante_id}/pedidos": {
      post: {
        tags: ["🟢 Restaurantes — Pedidos"],
        summary: "Crear pedido en restaurante",
        parameters: [{ name: "restaurante_id", in: "path", required: true, schema: { type: "integer" } }],
        requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/PedidoBody" } } } },
        responses: { 201: { description: "Pedido creado" } },
      },
      get: {
        tags: ["🟢 Restaurantes — Pedidos"],
        summary: "Listar pedidos del restaurante",
        parameters: [{ name: "restaurante_id", in: "path", required: true, schema: { type: "integer" } }],
        responses: { 200: { description: "Lista de pedidos" } },
      },
    },
    "/api/restaurantes/{restaurante_id}/pedidos/{pedido_id}": {
      get: {
        tags: ["🟢 Restaurantes — Pedidos"],
        summary: "Obtener pedido por ID",
        parameters: [
          { name: "restaurante_id", in: "path", required: true, schema: { type: "integer" } },
          { name: "pedido_id", in: "path", required: true, schema: { type: "integer" } },
        ],
        responses: { 200: { description: "Datos del pedido" } },
      },
    },
    "/api/restaurantes/{restaurante_id}/pedidos/{pedido_id}/estado": {
      put: {
        tags: ["🟢 Restaurantes — Pedidos"],
        summary: "Cambiar estado del pedido",
        parameters: [
          { name: "restaurante_id", in: "path", required: true, schema: { type: "integer" } },
          { name: "pedido_id", in: "path", required: true, schema: { type: "integer" } },
        ],
        requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/PedidoEstadoBody" } } } },
        responses: { 200: { description: "Estado actualizado" } },
      },
    },
    "/api/restaurantes/{restaurante_id}/pedidos/{pedido_id}/detalles": {
      post: {
        tags: ["🟢 Restaurantes — Pedidos"],
        summary: "Agregar ítem al pedido",
        parameters: [
          { name: "restaurante_id", in: "path", required: true, schema: { type: "integer" } },
          { name: "pedido_id", in: "path", required: true, schema: { type: "integer" } },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  producto_id: { type: "integer", example: 2 },
                  cantidad: { type: "integer", example: 1 },
                  descuento: { type: "number", example: 0 },
                },
              },
            },
          },
        },
        responses: { 200: { description: "Ítem agregado" } },
      },
    },
    "/api/restaurantes/{restaurante_id}/pedidos/{pedido_id}/historial": {
      get: {
        tags: ["🟢 Restaurantes — Pedidos"],
        summary: "Ver historial de estados del pedido",
        parameters: [
          { name: "restaurante_id", in: "path", required: true, schema: { type: "integer" } },
          { name: "pedido_id", in: "path", required: true, schema: { type: "integer" } },
        ],
        responses: { 200: { description: "Historial de estados" } },
      },
    },
    "/api/restaurantes/{restaurante_id}/pedidos/{pedido_id}/cancelacion/cancelar": {
      post: {
        tags: ["🟢 Restaurantes — Pedidos"],
        summary: "Cancelar pedido",
        parameters: [
          { name: "restaurante_id", in: "path", required: true, schema: { type: "integer" } },
          { name: "pedido_id", in: "path", required: true, schema: { type: "integer" } },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  cancelado_por: { type: "string", example: "cliente" },
                  motivo: { type: "string", example: "Cambio de planes" },
                },
              },
            },
          },
        },
        responses: { 200: { description: "Pedido cancelado" } },
      },
    },

    // Inventario
    "/api/restaurantes/{restaurante_id}/inventario": {
      post: {
        tags: ["🟢 Restaurantes — Inventario"],
        summary: "Crear registro de inventario",
        parameters: [{ name: "restaurante_id", in: "path", required: true, schema: { type: "integer" } }],
        requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/InventarioBody" } } } },
        responses: { 201: { description: "Inventario creado" } },
      },
      get: {
        tags: ["🟢 Restaurantes — Inventario"],
        summary: "Listar inventario del restaurante",
        parameters: [{ name: "restaurante_id", in: "path", required: true, schema: { type: "integer" } }],
        responses: { 200: { description: "Lista de inventario" } },
      },
    },
    "/api/restaurantes/{restaurante_id}/inventario/{inventario_id}/movimientos": {
      post: {
        tags: ["🟢 Restaurantes — Inventario"],
        summary: "Registrar movimiento de inventario",
        parameters: [
          { name: "restaurante_id", in: "path", required: true, schema: { type: "integer" } },
          { name: "inventario_id", in: "path", required: true, schema: { type: "integer" } },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  tipo_movimiento: { type: "string", example: "ajuste" },
                  cantidad: { type: "number", example: 10 },
                  usuario_responsable: { type: "string", example: "admin" },
                },
              },
            },
          },
        },
        responses: { 201: { description: "Movimiento registrado" } },
      },
    },
    "/api/restaurantes/{restaurante_id}/inventario/{inventario_id}/historial": {
      get: {
        tags: ["🟢 Restaurantes — Inventario"],
        summary: "Historial de movimientos de inventario",
        parameters: [
          { name: "restaurante_id", in: "path", required: true, schema: { type: "integer" } },
          { name: "inventario_id", in: "path", required: true, schema: { type: "integer" } },
        ],
        responses: { 200: { description: "Historial de movimientos" } },
      },
    },
    "/api/restaurantes/{restaurante_id}/inventario/proveedores": {
      post: {
        tags: ["🟢 Restaurantes — Inventario"],
        summary: "Crear proveedor",
        parameters: [{ name: "restaurante_id", in: "path", required: true, schema: { type: "integer" } }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  nombre: { type: "string", example: "Proveedor Central" },
                  telefono: { type: "string", example: "555-1000" },
                },
              },
            },
          },
        },
        responses: { 201: { description: "Proveedor creado" } },
      },
    },

    // Estados de pedido
    "/api/estados-pedido": {
      get: {
        tags: ["🟢 Restaurantes — Estados"],
        summary: "Listar todos los estados de pedido disponibles",
        responses: { 200: { description: "Catálogo de estados" } },
      },
    },

    // ══════════════════════════════════════════════
    //  PAQUETERÍA  (rutas actualizadas a /api/paqueteria/...)
    // ══════════════════════════════════════════════

    "/api/paqueteria/users": {
      get: {
        tags: ["🟠 Paquetería — Users"],
        summary: "Listar usuarios de paquetería",
        responses: { 200: { description: "Lista de usuarios" } },
      },
      post: {
        tags: ["🟠 Paquetería — Users"],
        summary: "Crear usuario",
        requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/PaqueteriaUserBody" } } } },
        responses: { 201: { description: "Usuario creado" } },
      },
    },
    "/api/paqueteria/users/{id}": {
      get: {
        tags: ["🟠 Paquetería — Users"],
        summary: "Obtener usuario por ID",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: { 200: { description: "Datos del usuario" } },
      },
      put: {
        tags: ["🟠 Paquetería — Users"],
        summary: "Actualizar usuario",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/PaqueteriaUserBody" } } } },
        responses: { 200: { description: "Usuario actualizado" } },
      },
      delete: {
        tags: ["🟠 Paquetería — Users"],
        summary: "Eliminar usuario",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: { 200: { description: "Usuario eliminado" } },
      },
    },

    // Couriers
    "/api/paqueteria/couriers": {
      get: {
        tags: ["🟠 Paquetería — Couriers"],
        summary: "Listar couriers",
        responses: { 200: { description: "Lista de couriers" } },
      },
      post: {
        tags: ["🟠 Paquetería — Couriers"],
        summary: "Crear courier",
        requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/CourierBody" } } } },
        responses: { 201: { description: "Courier creado" } },
      },
    },
    "/api/paqueteria/couriers/available": {
      get: {
        tags: ["🟠 Paquetería — Couriers"],
        summary: "Listar couriers disponibles",
        responses: { 200: { description: "Couriers con status disponible" } },
      },
    },
    "/api/paqueteria/couriers/{id}": {
      get: {
        tags: ["🟠 Paquetería — Couriers"],
        summary: "Obtener courier por ID",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: { 200: { description: "Datos del courier" } },
      },
      put: {
        tags: ["🟠 Paquetería — Couriers"],
        summary: "Actualizar courier",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/CourierBody" } } } },
        responses: { 200: { description: "Courier actualizado" } },
      },
      delete: {
        tags: ["🟠 Paquetería — Couriers"],
        summary: "Eliminar courier",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: { 200: { description: "Courier eliminado" } },
      },
    },
    "/api/paqueteria/couriers/{id}/status": {
      put: {
        tags: ["🟠 Paquetería — Couriers"],
        summary: "Actualizar estado del courier",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { type: "object", properties: { statusName: { type: "string", example: "Ocupado" } } },
            },
          },
        },
        responses: { 200: { description: "Estado actualizado" } },
      },
    },

    // Courier Status Types
    "/api/paqueteria/courier-status-types": {
      get: {
        tags: ["🟠 Paquetería — Courier Status Types"],
        summary: "Listar tipos de estado de courier",
        responses: { 200: { description: "Lista de tipos" } },
      },
      post: {
        tags: ["🟠 Paquetería — Courier Status Types"],
        summary: "Crear tipo de estado",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  name: { type: "string", example: "En descanso" },
                  description: { type: "string", example: "Repartidor en pausa temporal" },
                },
              },
            },
          },
        },
        responses: { 201: { description: "Tipo creado" } },
      },
    },
    "/api/paqueteria/courier-status-types/{id}": {
      get: {
        tags: ["🟠 Paquetería — Courier Status Types"],
        summary: "Obtener tipo de estado por ID",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: { 200: { description: "Tipo de estado" } },
      },
      put: {
        tags: ["🟠 Paquetería — Courier Status Types"],
        summary: "Actualizar tipo de estado",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  name: { type: "string", example: "Disponible" },
                  description: { type: "string", example: "Listo para recibir pedidos" },
                },
              },
            },
          },
        },
        responses: { 200: { description: "Tipo actualizado" } },
      },
      delete: {
        tags: ["🟠 Paquetería — Courier Status Types"],
        summary: "Eliminar tipo de estado",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: { 200: { description: "Tipo eliminado" } },
      },
    },

    // Courier Statuses
    "/api/paqueteria/courier-statuses": {
      get: {
        tags: ["🟠 Paquetería — Courier Statuses"],
        summary: "Listar estados actuales de couriers",
        responses: { 200: { description: "Lista de estados" } },
      },
    },
    "/api/paqueteria/courier-statuses/{id}": {
      get: {
        tags: ["🟠 Paquetería — Courier Statuses"],
        summary: "Obtener estado de courier por ID",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: { 200: { description: "Estado del courier" } },
      },
    },

    // Addresses
    "/api/paqueteria/addresses": {
      get: {
        tags: ["🟠 Paquetería — Addresses"],
        summary: "Listar direcciones",
        responses: { 200: { description: "Lista de direcciones" } },
      },
      post: {
        tags: ["🟠 Paquetería — Addresses"],
        summary: "Crear dirección",
        requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/AddressBody" } } } },
        responses: { 201: { description: "Dirección creada" } },
      },
    },
    "/api/paqueteria/addresses/{id}": {
      get: {
        tags: ["🟠 Paquetería — Addresses"],
        summary: "Obtener dirección por ID",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: { 200: { description: "Datos de la dirección" } },
      },
      put: {
        tags: ["🟠 Paquetería — Addresses"],
        summary: "Actualizar dirección",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/AddressBody" } } } },
        responses: { 200: { description: "Dirección actualizada" } },
      },
      delete: {
        tags: ["🟠 Paquetería — Addresses"],
        summary: "Eliminar dirección",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: { 200: { description: "Dirección eliminada" } },
      },
    },

    // Prices
    "/api/paqueteria/prices": {
      get: {
        tags: ["🟠 Paquetería — Prices"],
        summary: "Listar precios del servicio",
        responses: { 200: { description: "Lista de precios" } },
      },
      post: {
        tags: ["🟠 Paquetería — Prices"],
        summary: "Crear precio",
        requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/PriceBody" } } } },
        responses: { 201: { description: "Precio creado" } },
      },
    },
    "/api/paqueteria/prices/{id}": {
      get: {
        tags: ["🟠 Paquetería — Prices"],
        summary: "Obtener precio por ID",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: { 200: { description: "Datos del precio" } },
      },
      put: {
        tags: ["🟠 Paquetería — Prices"],
        summary: "Actualizar precio",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/PriceBody" } } } },
        responses: { 200: { description: "Precio actualizado" } },
      },
      delete: {
        tags: ["🟠 Paquetería — Prices"],
        summary: "Eliminar precio",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: { 200: { description: "Precio eliminado" } },
      },
    },

    // Shipments
    "/api/paqueteria/shipments": {
      get: {
        tags: ["🟠 Paquetería — Shipments"],
        summary: "Listar envíos",
        responses: { 200: { description: "Lista de envíos" } },
      },
      post: {
        tags: ["🟠 Paquetería — Shipments"],
        summary: "Crear envío",
        requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/ShipmentBody" } } } },
        responses: { 201: { description: "Envío creado" } },
      },
    },
    "/api/paqueteria/shipments/{id}": {
      get: {
        tags: ["🟠 Paquetería — Shipments"],
        summary: "Obtener envío por ID",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: { 200: { description: "Datos del envío" } },
      },
      put: {
        tags: ["🟠 Paquetería — Shipments"],
        summary: "Actualizar envío",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  deliveryInstructions: { type: "string" },
                  total: { type: "number" },
                  shipmentStatus: { type: "string" },
                  chargeType: { type: "string" },
                  estimatedDeliveryTime: { type: "string", example: "2026-03-20 16:00:00" },
                  courierId: { type: "integer" },
                  invoiceSeries: { type: "string" },
                  status: { type: "boolean" },
                },
              },
            },
          },
        },
        responses: { 200: { description: "Envío actualizado" } },
      },
      delete: {
        tags: ["🟠 Paquetería — Shipments"],
        summary: "Eliminar envío",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: { 200: { description: "Envío eliminado" } },
      },
    },
    "/api/paqueteria/shipments/{id}/accept": {
      patch: {
        tags: ["🟠 Paquetería — Shipments"],
        summary: "Courier acepta un envío",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { type: "object", properties: { courierId: { type: "integer", example: 1 } } },
            },
          },
        },
        responses: { 200: { description: "Envío aceptado por courier" } },
      },
    },
    "/api/paqueteria/shipments/{id}/status": {
      patch: {
        tags: ["🟠 Paquetería — Shipments"],
        summary: "Actualizar estado del envío",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: { status: { type: "string", enum: ["pending", "assigned", "in_transit", "delivered", "cancelled"], example: "delivered" } },
              },
            },
          },
        },
        responses: { 200: { description: "Estado del envío actualizado" } },
      },
    },
    "/api/paqueteria/shipments/{id}/confirm": {
      patch: {
        tags: ["🟠 Paquetería — Shipments"],
        summary: "Confirmación de recepción por el receptor",
        description: "Requiere header `x-customer-token` con el ID del cliente receptor.",
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "integer" } },
          { name: "x-customer-token", in: "header", required: true, schema: { type: "integer" }, description: "ID del cliente receptor" },
        ],
        responses: { 200: { description: "Recepción confirmada" } },
      },
    },

    // Packages
    "/api/paqueteria/packages": {
      get: {
        tags: ["🟠 Paquetería — Packages"],
        summary: "Listar paquetes",
        responses: { 200: { description: "Lista de paquetes" } },
      },
      post: {
        tags: ["🟠 Paquetería — Packages"],
        summary: "Crear paquete",
        requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/PackageBody" } } } },
        responses: { 201: { description: "Paquete creado" } },
      },
    },
    "/api/paqueteria/packages/quote": {
      post: {
        tags: ["🟠 Paquetería — Packages"],
        summary: "Calcular cotización de envío",
        requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/QuoteBody" } } } },
        responses: { 200: { description: "Cotización calculada" } },
      },
    },
    "/api/paqueteria/packages/customers/me": {
      get: {
        tags: ["🟠 Paquetería — Packages"],
        summary: "Ver paquetes del cliente autenticado",
        description: "Requiere header `x-customer-token` con el ID del cliente.",
        parameters: [
          { name: "x-customer-token", in: "header", required: true, schema: { type: "integer" }, description: "ID del cliente" },
        ],
        responses: { 200: { description: "Paquetes del cliente" } },
      },
    },
    "/api/paqueteria/packages/{id}": {
      get: {
        tags: ["🟠 Paquetería — Packages"],
        summary: "Obtener paquete por ID",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: { 200: { description: "Datos del paquete" } },
      },
      put: {
        tags: ["🟠 Paquetería — Packages"],
        summary: "Actualizar paquete",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/PackageBody" } } } },
        responses: { 200: { description: "Paquete actualizado" } },
      },
      delete: {
        tags: ["🟠 Paquetería — Packages"],
        summary: "Eliminar paquete",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: { 200: { description: "Paquete eliminado" } },
      },
    },
    "/api/paqueteria/packages/{id}/tracking": {
      get: {
        tags: ["🟠 Paquetería — Packages"],
        summary: "Historial de tracking del paquete",
        description: "Requiere header `x-customer-token`.",
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "integer" } },
          { name: "x-customer-token", in: "header", required: true, schema: { type: "integer" } },
        ],
        responses: { 200: { description: "Historial de tracking" } },
      },
    },
    "/api/paqueteria/packages/{id}/cancel": {
      post: {
        tags: ["🟠 Paquetería — Packages"],
        summary: "Cancelar paquete",
        description: "Requiere header `x-customer-token`.",
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "integer" } },
          { name: "x-customer-token", in: "header", required: true, schema: { type: "integer" } },
        ],
        responses: { 200: { description: "Paquete cancelado" } },
      },
    },
  },
};

// Reutilizamos respuestas comunes
swaggerDefinition.components.responses = {
  Bad400: {
    description: "Datos inválidos",
    content: { "application/json": { schema: { $ref: "#/components/schemas/Error400" } } },
  },
  Not404: {
    description: "Recurso no encontrado",
    content: { "application/json": { schema: { $ref: "#/components/schemas/Error404" } } },
  },
};

const options = {
  swaggerDefinition,
  apis: [], // Toda la definición está inline
};

const swaggerSpec = swaggerJSDoc(options);

/**
 * Registra la documentación Swagger en la app Express.
 * Accesible en GET /docs
 *
 * @param {import('express').Application} app
 */
const setupSwagger = (app) => {
  app.use(
    "/docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec, {
      customSiteTitle: "Pedidos Now — API Docs",
      customCss: `
        .topbar { background-color: #01696f !important; }
        .swagger-ui .topbar .download-url-wrapper { display: none; }
        .swagger-ui .info .title { color: #01696f; }
      `,
      swaggerOptions: {
        docExpansion: "none",
        filter: true,
        persistAuthorization: true,
      },
    })
  );

  // Endpoint JSON para clientes que necesiten el spec
  app.get("/docs.json", (_req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.send(swaggerSpec);
  });

  console.log("Swagger docs available at /docs");
};

module.exports = { setupSwagger, swaggerSpec };