# Yusve — Inmobiliaria de Lujo

Sitio web de inmobiliaria premium con estética editorial oscura-dorada, vitrina curada de propiedades y panel de administración privado.

**Demo en vivo**: https://inmobiliariayusve.vercel.app/

---

## Stack

| Capa | Tecnología |
|------|------------|
| Frontend | React 19 + TypeScript strict |
| Estilos | Tailwind CSS 4 |
| Backend | Supabase (DB, Auth, Storage) |
| Validación | Zod 4 |
| Estado global | Zustand 5 |
| Build | Vite 8 |

---

## Páginas

| Ruta | Descripción |
|------|-------------|
| `/` | Home — hero, grid de destacadas, stats, filosofía |
| `/propiedades` | Catálogo con filtros (tipo, precio, ambientes) |
| `/propiedades/:id` | Detalle con galería, lightbox y formulario de consulta |
| `/asesor` | Asesor virtual (Curador IA) |
| `/admin/login` | Login del panel de administración |
| `/admin` | Dashboard con métricas |
| `/admin/propiedades` | CRUD de propiedades |
| `/admin/consultas` | Gestión de consultas recibidas |
| `/admin/asesor` | Configuración del asesor virtual |

---

## Cómo correr el proyecto

### 1. Clonar el repositorio

```bash
git clone https://github.com/DiegoMhz/inmobiliaria.git
cd inmobiliaria
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

Crear un archivo `.env` en la raíz con las siguientes variables:

```env
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu-anon-key
```

> Sin estas variables el proyecto corre en modo mock/offline (datos de ejemplo).

### 4. Levantar el servidor de desarrollo

```bash
npm run dev
```

---

## Acceso al panel de administración

Para probar el panel de administración podés usar las siguientes credenciales de demo:

| Campo | Valor |
|-------|-------|
| Email | `dibzz456@gmail.com` |
| Contraseña | `dube3342537` |

Ingresar en `/admin/login`.

> Estas credenciales son solo para pruebas. En producción reemplazalas por credenciales seguras.

---

## Scripts disponibles

```bash
npm run dev       # servidor de desarrollo
npm run build     # build de producción
npm run preview   # preview del build
npm run lint      # linting con ESLint
```

---

## Estructura del proyecto

```
src/
├── app/            # router, providers
├── features/
│   ├── auth/       # login, RequireAuth
│   ├── home/       # HomePage y componentes
│   ├── properties/ # catálogo, detalle, filtros, consultas
│   ├── admin/      # dashboard, CRUD propiedades, consultas
│   └── curador/    # asesor virtual
└── shared/
    ├── layout/     # Navbar, Footer, AdminLayout, PublicLayout
    ├── ui/         # componentes base (Button, Input, Card, etc.)
    ├── hooks/      # hooks reutilizables
    ├── stores/     # Zustand stores (auth, ui)
    └── lib/        # supabase client, utils, types
```
