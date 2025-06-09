# Stage 1: Build tippecanoe
FROM ubuntu:22.04 AS tippecanoe-builder

RUN apt-get update && apt-get install -y \
    make gcc g++ libsqlite3-dev zlib1g-dev git

RUN git clone https://github.com/mapbox/tippecanoe.git /tippecanoe-src
WORKDIR /tippecanoe-src
RUN make

# Stage 2: Final runtime with tippecanoe + pmtiles
FROM ubuntu:22.04

ARG PMTILES_VERSION=1.28.0
ARG PMTILES_URL=https://github.com/protomaps/go-pmtiles/releases/download/v${PMTILES_VERSION}/go-pmtiles_${PMTILES_VERSION}_Linux_x86_64.tar.gz

RUN apt-get update && apt-get install -y \
    libsqlite3-0 curl jq ca-certificates tar gzip \
    && rm -rf /var/lib/apt/lists/*

# Copy tippecanoe binaries
COPY --from=tippecanoe-builder /tippecanoe-src/tippecanoe* /usr/local/bin/
COPY --from=tippecanoe-builder /tippecanoe-src/tile-join /usr/local/bin/

# Download and extract pmtiles CLI
RUN curl -L "${PMTILES_URL}" | tar xz && \
    mv pmtiles /usr/local/bin/pmtiles && \
    chmod +x /usr/local/bin/pmtiles

WORKDIR /data
