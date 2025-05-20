# --- CHRPPC --- #
FROM buildpack-deps:stable AS chrppc-builder

RUN apt-get update -y && apt-get install -y --no-install-recommends cmake && apt-get clean && rm -rf /var/lib/apt/lists/*

RUN mkdir -p /build
WORKDIR /build
RUN git clone 'https://gitlab.com/vynce/chrpp.git' chrpp

WORKDIR /build/chrpp
RUN cmake -DENABLE_TRACE=on -DEXAMPLES=off . && make -j$(nproc) && make install

# --- CHR IDE builder --- #
FROM node:22 AS chr-ide-builder

RUN mkdir -p /app
WORKDIR /app

# Build the apps
COPY tsconfig.json tsconfig.base.json package.json ./
COPY packages ./packages
RUN npm install && npm run build

# Reinstall only the runtime dependencies
RUN rm -rf node_modules && npm install --install-strategy=nested --omit=dev --workspace=@chr-ide/backend

# --- Final image --- #
FROM node:22

COPY --from=chrppc-builder /usr/local/bin/chrppc /usr/local/bin/chrppc
COPY --from=chrppc-builder /usr/local/include/chrpp /usr/local/include/chrpp

RUN mkdir -p /app
WORKDIR /app
COPY --from=chr-ide-builder /app/node_modules ./node_modules
COPY --from=chr-ide-builder /app/packages/backend/dist ./dist
COPY --from=chr-ide-builder /app/packages/backend/skeleton.cpp ./skeleton.cpp
COPY --from=chr-ide-builder /app/packages/backend/Dockerfile ./Dockerfile
COPY --from=chr-ide-builder /app/packages/frontend/.output/public ./web

RUN touch /app/.empty
RUN mkdir /build

ENV NODE_ENV='production'
ENV CHR_IDE_COMPILE_DIRECTORY='/build'
ENV CHR_IDE_BUILD_VOLUME_NAME='chr-ide-build'

CMD [ "node", "dist/main.js" ]