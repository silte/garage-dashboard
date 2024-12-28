FROM node:20.5.0-alpine AS builder

ENV NODE_ENV production
RUN apk add --update --no-cache g++ make python3 && ln -sf python3 /usr/bin/python

COPY . /app
WORKDIR /app

ENV NEXT_PUBLIC_BASE_PATH=/base-path-placeholder
RUN npm ci --quiet --include=dev && \
    npm run build && \
    npm ci --omit=dev -w backend --ignore-scripts && \
    ls -al /app/build


FROM node:20.5.0-alpine

ENV NODE_ENV production

WORKDIR /app
COPY --from=builder /app/build /app
COPY --from=builder /app/node_modules /app/node_modules

# Add a script to replace the placeholder with the BASE_PATH value
RUN echo '#!/bin/sh' > /app/start.sh && \
    echo 'BASE_PATH=${BASE_PATH:-/}' >> /app/start.sh && \
    echo 'sed -i "s|/base-path-placeholder|$BASE_PATH|g" $(grep -rl "/base-path-placeholder" /app)' >> /app/start.sh && \
    echo 'node /app/server/main.js' >> /app/start.sh && \
    chmod +x /app/start.sh

CMD [ "/app/start.sh" ]

EXPOSE 4000