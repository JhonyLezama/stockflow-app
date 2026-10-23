# StockFlow 📦🍗
> **Sistema Inteligente de Gestión de Inventario y Control de Stock para Restaurantes y Negocios Gastronómicos.**

[![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.4-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![pnpm](https://img.shields.io/badge/pnpm-v12-F69220?logo=pnpm&logoColor=white)](https://pnpm.io/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## 📋 Descripción

**StockFlow** es una aplicación web moderna diseñada específicamente para optimizar el control de existencias, mermas, insumos y compras en restaurantes (pollerías, locales de comida rápida y gastronomía en general). Desarrollada con un diseño responsivo para su uso ágil tanto en computadoras de oficina como en tablets y smartphones dentro de cocina y almacén.

---

## ✨ Características Principales

### 📊 1. Dashboard en Tiempo Real
- Métricas instantáneas de valorización total de inventario.
- Indicadores de insumos críticos con stock bajo el mínimo.
- Gráficos interactivos de movimientos, consumo y compras del mes mediante **Recharts**.

### 📦 2. Control de Stock y Catálogo Multidimensional
- Clasificación de insumos por tipo: *Proteínas, Verduras, Abarrotes/Insumos, Bebidas, Descartables, Gas y Condimentos*.
- Soporte para **múltiples unidades de medida y factores de conversión** (ej. bolsas, cajas, kg, gramos, unidades).
- Marcado de productos perecibles y favoritos de alta rotación.

### 📝 3. Registro Rápido de Movimientos
- Registro de consumos diarios de cocina.
- Control detallado de **mermas y desperdicios** con motivos tipificados.
- Ajustes manuales inmediatos con trazabilidad de usuario.

### 📋 4. Conteos Físicos de Inventario (Auditorías)
- Proceso de toma de conteo físico ciego o asistido.
- Cálculo automático de variaciones entre el stock teórico y el físico.
- Flujo de aprobación/rechazo de ajustes de inventario.

### 🛒 5. Planificación de Necesidades y Compras
- Generación automática de lista de necesidades basada en stock mínimo y consumo promedio.
- Gestión de órdenes de compra con proveedores.
- Registro de costos históricos para análisis de variación de precios.

### 🚚 6. Recepción de Mercadería
- Verificación ítem por ítem al momento de la entrega por el proveedor.
- Ingreso directo al stock disponible con validación de cantidades y precios acordados.

### 🔔 7. Sistema de Alertas Proactivas
- Alertas de ruptura de stock inminente.
- Notificaciones de insumos críticos que requieren reposición urgente.
- Alertas de mermas anómalas.

---

## 👥 Roles de Usuario y Permisos

| Módulo | Dueño / Admin | Almacén | Cocina | Salón / Servicio |
|:---|:---:|:---:|:---:|:---:|
| **Dashboard y Métricas** | ✅ Total | 👁️ Parcial | ❌ | ❌ |
| **Control de Stock** | ✅ Total | ✅ Total | 👁️ Lectura | 👁️ Lectura |
| **Registrar Consumo / Merma** | ✅ | ✅ | ✅ | ✅ |
| **Conteos y Auditorías** | ✅ Aprobación | ✅ Registro | ✅ Registro | ❌ |
| **Órdenes de Compra** | ✅ Total | ✅ Solicitud | ❌ | ❌ |
| **Recepción de Insumos** | ✅ | ✅ | ❌ | ❌ |
| **Catálogo y Configuración**| ✅ Total | 👁️ Lectura | ❌ | ❌ |

---

## 🛠️ Stack Tecnológico

- **Frontend:** [React 18](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Empaquetador y Servidor:** [Vite](https://vitejs.dev/)
- **Estilos:** [Tailwind CSS v4](https://tailwindcss.com/)
- **Iconografía:** [Lucide React](https://lucide.dev/)
- **Animaciones:** [Framer Motion](https://www.framer.com/motion/)
- **Gráficos:** [Recharts](https://recharts.org/)
- **Drag & Drop:** [@dnd-kit](https://dndkit.com/)
- **Manejo de Fechas:** [date-fns](https://date-fns.org/)
- **Gestor de Paquetes:** [pnpm](https://pnpm.io/)

---

## 🚀 Instalación y Puesta en Marcha

### Prerrequisitos
- [Node.js](https://nodejs.org/) `>= 18`
- [pnpm](https://pnpm.io/) `>= 9` (recomendado v12)

```bash
# Si aún no tienes pnpm instalado globalmente
npm install -g pnpm
```

### Pasos

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/JhonyLezama/stockflow-app.git
   cd stockflow-app
   ```

2. **Instalar dependencias:**
   ```bash
   pnpm install
   ```

3. **Iniciar el servidor de desarrollo:**
   ```bash
   pnpm dev
   ```
   Abre [http://localhost:5173](http://localhost:5173) en tu navegador.

---

## 📜 Scripts Disponibles

| Script | Descripción |
|---|---|
| `pnpm dev` | Inicia el entorno local de desarrollo con Hot Module Replacement (HMR). |
| `pnpm build` | Compila la aplicación optimizada para producción en `/dist`. |
| `pnpm typecheck` | Ejecuta la verificación de tipos con el compilador de TypeScript (`tsc --noEmit`). |

---

## 📁 Estructura del Proyecto

```text
stockflow-app/
├── public/                 # Archivos estáticos
├── src/
│   ├── components/         # Componentes UI reutilizables y Layout principal
│   ├── mock/               # Datos simulados y catálogo inicial de demostración
│   ├── pages/              # Páginas de la aplicación
│   │   ├── Alerts.tsx      # Gestión de alertas
│   │   ├── Catalog.tsx     # Catálogo de insumos y proveedores
│   │   ├── Count.tsx       # Conteos físicos y auditorías
│   │   ├── Dashboard.tsx   # Panel principal e indicadores
│   │   ├── History.tsx     # Historial de movimientos y auditoría
│   │   ├── Login.tsx       # Inicio de sesión por roles
│   │   ├── Needs.tsx       # Planificador de compras necesarias
│   │   ├── Purchases.tsx   # Órdenes de compra
│   │   ├── Receive.tsx     # Recepción de mercadería
│   │   ├── Register.tsx    # Registro de consumos y mermas
│   │   └── Stock.tsx       # Tabla de existencias y balance
│   ├── store/              # Estado global y contexto (AppContext)
│   ├── types/              # Definiciones de TypeScript y modelos del dominio
│   ├── App.tsx             # Enrutador y estructura base
│   ├── main.tsx            # Punto de entrada de la aplicación React
│   └── index.css           # Estilos globales y directivas de Tailwind
├── package.json            # Metadatos del proyecto y dependencias
├── pnpm-lock.yaml          # Árbol de dependencias bloqueadas
├── pnpm-workspace.yaml     # Configuración de compilación para pnpm
├── tsconfig.json           # Configuración de TypeScript
└── vite.config.js          # Configuración de Vite
```

---

## 📄 Licencia

Este proyecto está bajo la Licencia **MIT**. Consulta el archivo `LICENSE` para más información.
