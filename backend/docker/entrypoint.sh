#!/bin/sh
set -e

cd /var/www/html

# Ensure Composer and Laravel can write to writable directories in the bind-mounted app tree.
mkdir -p \
    /var/www/html/vendor \
    /var/www/html/bootstrap/cache \
    /var/www/html/storage/logs \
    /var/www/html/storage/framework/cache \
    /var/www/html/storage/framework/sessions \
    /var/www/html/storage/framework/testing \
    /var/www/html/storage/framework/views \
    /var/www/.composer \
    /var/www/.composer/cache

export HOME=/var/www/html
export COMPOSER_HOME=/var/www/.composer

# Give the runtime user write access when the project directory is mounted from the host.
chown -R www-data:www-data /var/www/html /var/www/.composer 2>/dev/null || true
chmod -R u+rwX,g+rwX /var/www/html /var/www/.composer 2>/dev/null || true

# Ensure Git writes its global config to a writable location (the working directory) and mark the directory as safe
 git config --global --add safe.directory /var/www/html

# --- Development only: bind-mounted volume may be missing dependencies -------
if [ "$APP_ENV" != "production" ]; then
    if [ ! -f vendor/autoload.php ] || [ ! -x vendor/bin/phpunit ]; then
        echo "[entrypoint] Installing composer dependencies..."
        composer config --global cache-dir "$COMPOSER_HOME/cache"
        composer install --no-interaction --prefer-dist --no-progress
    fi

    # Generate an app key into the (bind-mounted) .env if it has none.
    if [ -f .env ] && ! grep -q '^APP_KEY=base64:' .env; then
        echo "[entrypoint] Generating APP_KEY..."
        php artisan key:generate --force || true
    fi

    if [ -f .env ] && grep -q '^APP_KEY=base64:' .env; then
        APP_KEY="$(grep '^APP_KEY=' .env | tail -n 1 | cut -d= -f2-)"
        export APP_KEY
    fi
fi

# --- Database migrations (db is already healthy via depends_on) -------------
echo "[entrypoint] Running migrations..."
php artisan migrate --force || true

# --- Optimize for production / keep fresh for dev ---------------------------
if [ "$APP_ENV" = "production" ]; then
    echo "[entrypoint] Caching config, routes and views..."
    php artisan config:cache
    php artisan route:cache
    php artisan view:cache
else
    php artisan optimize:clear || true
fi

if [ ! -e public/storage ]; then
    php artisan storage:link || true
fi

echo "[entrypoint] Starting: $*"
exec "$@"
