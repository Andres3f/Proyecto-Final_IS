# Proyecto Final IS

Monorepo con backend en FastAPI y frontend en React + Vite.

## Estructura

- `backend/`: API en Python con FastAPI, SQLAlchemy, Alembic, JWT y autenticación con bcrypt.
- `frontend/`: App React en TypeScript con Vite, TailwindCSS, React Router, axios y protección de rutas.
- `docker-compose.yml`: Orquesta servicios `backend`, `frontend` y `postgres`.

Estructura del proyecto:

```text
Proyecto-Final_IS/
├── README.md
├── docker-compose.yml
├── backend/
│   ├── Dockerfile
│   ├── alembic.ini
│   ├── requirements.txt
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py
│   │   ├── database.py
│   │   ├── api/
│   │   │   ├── __init__.py
│   │   │   ├── deps.py
│   │   │   ├── api_v1/
│   │   │   │   ├── __init__.py
│   │   │   │   ├── api.py
│   │   │   │   ├── endpoints/
│   │   │   │   │   ├── auth.py
│   │   │   │   │   ├── users.py
│   │   │   │   │   ├── projects.py
│   │   │   │   │   ├── tasks.py
│   │   ├── core/
│   │   │   ├── config.py
│   │   │   ├── security.py
│   │   ├── crud/
│   │   │   ├── user.py
│   │   │   ├── project.py
│   │   │   ├── task.py
│   │   │   ├── project_member.py
│   │   ├── models/
│   │   │   ├── user.py
│   │   │   ├── project.py
│   │   │   ├── task.py
│   │   │   ├── project_member.py
│   │   ├── schemas/
│   │   │   ├── user.py
│   │   │   ├── token.py
│   │   │   ├── project.py
│   │   │   ├── task.py
│   │   │   ├── project_member.py
│   │   ├── utils/
│   │   │   ├── http.py
│   ├── alembic/
│   │   ├── env.py
│   │   ├── script.py.mako
│   │   ├── versions/
│   │   │   ├── 001_add_project_members.py
├── frontend/
│   ├── Dockerfile
│   ├── package.json
│   ├── tsconfig.json
│   ├── tsconfig.node.json
│   ├── vite.config.ts
│   ├── src/
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   ├── index.css
│   │   ├── components/
│   │   │   ├── InviteUserModal.tsx
│   │   │   ├── SectionWrapper.tsx
│   │   │   ├── TaskActionModal.tsx
│   │   ├── hooks/
│   │   │   ├── useAuth.ts
│   │   ├── lib/
│   │   │   ├── storage.ts
│   │   ├── pages/
│   │   │   ├── Home.tsx
│   │   │   ├── Login.tsx
│   │   │   ├── Register.tsx
│   │   │   ├── Dashboard.tsx
│   │   ├── services/
│   │   │   ├── api.ts
│   │   │   ├── auth.ts
│   │   │   ├── project.ts
│   │   ├── types/
│   │   │   ├── auth.ts
│   │   │   ├── task.ts
```

## Backend

### Instalación

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

### Variables de entorno

Copia `.env.example` a `.env` y ajusta los valores según tu entorno:

```bash
cp .env.example .env
```

### Ejecutar localmente

```bash
cd backend
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### Migraciones

```bash
cd backend
alembic revision --autogenerate -m "crear tablas iniciales"
alembic upgrade head
```

### Funcionalidades del backend

- Registro de usuario con validación de email único y contraseña mínima de 8 caracteres.
- Hash de contraseñas con bcrypt (`passlib[bcrypt]`).
- Autenticación JWT con `python-jose`.
- Modelo `User` con relación one-to-many a `Project`.
- Dependencias `get_current_user` y `get_current_active_user` para proteger rutas.

## Frontend

### Instalación

```bash
cd frontend
pnpm install
```

### Ejecutar localmente

```bash
cd frontend
pnpm dev -- --host 0.0.0.0
```

### Funcionalidades del frontend

- Página `/register` con validación de contraseña y redirección a `/login`.
- Página `/dashboard` protegida con token JWT.
- Formulario de creación de proyectos y listado de proyectos del usuario autenticado.
- Interceptor de axios para adjuntar JWT automáticamente en peticiones y manejar 401.

## Docker

### Levantar con Docker Compose

```bash
docker compose up --build
```

### Detener

```bash
docker compose down
```

## Render

El frontend debe desplegarse con `pnpm`, no con `npm`.

Configuración del servicio frontend si se crea manualmente en Render:

```bash
Root Directory: frontend
Build Command: corepack enable && pnpm install --frozen-lockfile && pnpm build
Publish Directory: dist
```

El archivo `render.yaml` define el backend, frontend y base de datos para crear los servicios como Blueprint en Render.

## Endpoints principales

- `POST /api/v1/auth/register` - Registro de usuario.
- `POST /api/v1/auth/login` - Login y obtención de token JWT.
- `GET /api/v1/users/me` - Información del usuario autenticado.
- `POST /api/v1/projects` - Crear proyecto (requiere JWT).
- `GET /api/v1/projects` - Listar proyectos del usuario autenticado.
- `PUT /api/v1/projects/{project_id}` - Editar proyecto propio (requiere JWT).

## Notas

- El frontend consume la API configurada en `VITE_API_URL`.
- El token JWT se guarda en `localStorage`.
- La base de datos PostgreSQL se monta en el volumen `db_data`.
