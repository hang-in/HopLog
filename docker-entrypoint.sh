#!/bin/sh
set -e

if [ ! -d "/app/content" ] || [ -z "$(ls -A /app/content 2>/dev/null)" ]; then
  cp -r /app/content-seed/. /app/content/
fi

# profile.yml fallback: copy from example if missing
if [ ! -f "/app/content/profile.yml" ] && [ -f "/app/content/profile.example.yml" ]; then
  cp /app/content/profile.example.yml /app/content/profile.yml
fi

chown -R nextjs:nodejs /app/content

exec su-exec nextjs "$@"
