#!/bin/sh

echo "⏳ Attente de MySQL à $DB_HOST:$DB_PORT..."

while ! nc -z $DB_HOST $DB_PORT; do
  sleep 1
done

echo "✅ MySQL est prêt, lancement de l'application."
exec "$@"
