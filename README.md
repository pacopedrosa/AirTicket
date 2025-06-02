# 🛩️ AirTicket

## 📝 Descripción
Sistema de gestión y reserva de vuelos desarrollado con React y Symfony.

## 🔗 Enlaces
- **Repositorio GitHub**: [AirTicket](https://github.com/pacopedrosa/AirTicket)
- **URL de Producción**: [http://34.238.3.3/](http://34.238.3.3/)

> ⚠️ **Nota Importante**: El servidor está alojado en AWS y los laboratorios de estudiantes se cierran automáticamente después de 4 horas. Si el sitio no está accesible, contacta para reactivarlo.

## 🔐 Credenciales de Acceso
**Usuario Administrador**
- **Email**: pacopedrosa2018@gmail.com
- **Contraseña**: asd123

> Este usuario tiene rol de administrador con acceso completo al sistema.

## 🚀 Configuración del Entorno
### Puertos
- **Backend**: 8000
- **Frontend**: 3000

### Instalación
1. Ejecuta el siguiente comando para iniciar el proyecto:
   ```bash
   docker compose up --build
   ```
2. Espera a que se instalen todas las dependencias
3. La base de datos está incluida en un volumen Docker, por lo que estará disponible inmediatamente con datos pre-cargados

## 💳 Información de Pago
Para realizar compras de prueba, utiliza los siguientes datos de tarjeta:
- **Número**: 4242 4242 4242 4242
- **Fecha**: 12/34
- **CVV**: 154

## 🛠️ Comandos Útiles
Dentro del contenedor del backend, puedes ejecutar los siguientes comandos:

### Crear Vuelos Aleatorios
```bash
php bin/console app:create-random-flights --count [número]
```

### Actualizar Fechas de Vuelos
```bash
php bin/console app:update-flight-dates
```

---
Desarrollado con ❤️ por Paco Pedrosa
