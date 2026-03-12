docker buildx build \
    --platform linux/amd64,linux/arm64 \
    --push \
    -t rapidrabbit76/hoplog:latest \
    .

docker buildx build \
    --platform linux/amd64,linux/arm64 \
    --push \
    -t rapidrabbit76/hoplog-search-sync:latest \
    ./sidecar/search-sync
