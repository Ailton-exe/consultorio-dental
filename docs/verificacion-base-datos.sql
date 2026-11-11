-- ==========================================
-- VERIFICACION FINAL DE BASE DE DATOS
-- CONSULTORIO DENTAL - SQLITE
-- ==========================================

-- 1. Comprobar las tablas existentes
SELECT name
FROM sqlite_master
WHERE type = 'table'
ORDER BY name;

-- 2. Revisar estructura de usuarios
PRAGMA table_info(users);

-- 3. Revisar estructura de horarios
PRAGMA table_info(schedules);

-- 4. Revisar estructura de citas
PRAGMA table_info(appointments);

-- 5. Revisar estructura de recordatorios
PRAGMA table_info(appointment_reminders);

-- 6. Revisar los roles de usuarios
SELECT id, name, email, role
FROM users;

-- 7. Consultar citas y pacientes asociados
SELECT
    appointments.id,
    users.name AS paciente,
    users.email,
    appointments.appointment_date,
    appointments.start_time,
    appointments.end_time,
    appointments.status
FROM appointments
LEFT JOIN users
    ON appointments.user_id = users.id;

-- 8. Consultar recordatorios y sus citas
SELECT
    appointment_reminders.id,
    appointment_reminders.appointment_id,
    appointment_reminders.remind_at,
    appointment_reminders.sent_at,
    appointment_reminders.status
FROM appointment_reminders;

-- 9. Revisar índices de citas
PRAGMA index_list('appointments');

-- 10. Revisar índices de recordatorios
PRAGMA index_list('appointment_reminders');

-- 11. Comprobar integridad de las relaciones
PRAGMA foreign_key_check;