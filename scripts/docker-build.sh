docker buildx build \
    --platform linux/amd64,linux/arm64 \
    --push \
    -t rapidrabbit76/hoplog:latest \
    -t rapidrabbit76/hoplog:v2026.03.12 \
    .
