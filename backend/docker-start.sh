#!/bin/sh
set -e

# Render asigna el puerto en la variable PORT (80 si se corre en local)
PORT="${PORT:-80}"
sed -i "s/Listen 80/Listen ${PORT}/" /etc/apache2/ports.conf
sed -i "s/<VirtualHost \*:80>/<VirtualHost *:${PORT}>/" /etc/apache2/sites-available/000-default.conf

php artisan config:cache
php artisan route:cache

# Crear/actualizar las tablas en cada arranque
php artisan migrate --force

exec apache2-foreground