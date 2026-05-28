# Proyecto Final IS

Monorepo con backend en FastAPI y frontend en React + Vite.

## Estructura

- `backend/`: API en Python con FastAPI, SQLAlchemy, Alembic y JWT.
- `frontend/`: App React en TypeScript con Vite, TailwindCSS y React Router.
- `docker-compose.yml`: Orquesta servicios `backend`, `frontend` y `postgres`.

## Backend

### Instalar dependencias

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

## Frontend

### Instalar dependencias

```bash
cd frontend
npm install
```

### Ejecutar localmente

```bash
cd frontend
npm run dev -- --host 0.0.0.0
```

## Docker

### Levantar con Docker Compose

```bash
docker compose up --build
```

### Detener

```bash
docker compose down
```

## Endpoints principales

- `GET /health`
- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`
- `GET /api/v1/users/me`

## Notas

- El frontend consume la API configurada en `VITE_API_URL`.
- La base de datos PostgreSQL se monta en el volumen `db_data`.
