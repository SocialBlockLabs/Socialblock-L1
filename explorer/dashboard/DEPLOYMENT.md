# SocialBlock Explorer Dashboard - Deployment Guide

This guide covers deploying the SocialBlock Explorer Dashboard to integrate with the official SocialBlock L1 repository.

## Deployment Options

### Option 1: Integrate into Official Repository

**Recommended**: Add the explorer as a service in the official repo's docker-compose setup.

#### Step 1: Add to Official Repository

1. Clone the official repository:
```bash
git clone https://github.com/SocialBlockLabs/Socialblock-L1.git
cd Socialblock-L1
```

2. Create an `explorer-ui/` directory in the root:
```bash
mkdir explorer-ui
```

3. Copy the entire explorer dashboard code to `explorer-ui/`:
```bash
# Copy all files from this dashboard to explorer-ui/
cp -r /path/to/socialblock-explorer-dashboard/* explorer-ui/
```

#### Step 2: Create Dockerfile

Create `explorer-ui/Dockerfile`:

```dockerfile
# Multi-stage build for production optimization
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built assets
COPY --from=builder /app/build /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Expose port
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
```

#### Step 3: Create Nginx Configuration

Create `explorer-ui/nginx.conf`:

```nginx
events {
    worker_connections 1024;
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;

    server {
        listen 80;
        server_name localhost;

        root /usr/share/nginx/html;
        index index.html index.htm;

        # Handle client-side routing
        location / {
            try_files $uri $uri/ /index.html;
        }

        # API proxy to backend services
        location /api/ {
            proxy_pass http://node:1317/;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        location /rpc/ {
            proxy_pass http://node:26657/;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        location /arp/ {
            proxy_pass http://arp-agent:8080/;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        location /indexer/ {
            proxy_pass http://indexer:3001/;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        # WebSocket proxy for real-time updates
        location /ws {
            proxy_pass http://node:26657;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection "upgrade";
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        # Static assets caching
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }
}
```

#### Step 4: Update docker-compose.yaml

Add the explorer service to the official repo's `docker-compose.yaml`:

```yaml
services:
  # ... existing services (node, arp-agent, indexer, etc.) ...

  explorer-ui:
    build: ./explorer-ui
    container_name: socialblock-explorer-ui
    ports:
      - "3000:80"
    environment:
      - NODE_ENV=production
    depends_on:
      - node
      - arp-agent
      - indexer
    networks:
      - socialblock-network
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost"]
      interval: 30s
      timeout: 10s
      retries: 3

networks:
  socialblock-network:
    driver: bridge
```

#### Step 5: Update Environment Configuration

Update `explorer-ui/env.example` for Docker environment:

```env
# Docker environment configuration
VITE_NETWORK=development
VITE_RPC_HTTP=http://localhost:3000/rpc
VITE_RPC_WS=ws://localhost:3000/ws/websocket
VITE_REST_API=http://localhost:3000/api
VITE_GRPC=http://localhost:3000/grpc
VITE_ARP_AGENT=http://localhost:3000/arp
VITE_INDEXER_API=http://localhost:3000/indexer
VITE_EXPLORER_API=http://localhost:3000
```

### Option 2: Standalone Deployment

If deploying the explorer separately from the official repository:

#### Docker Compose for Standalone

Create a `docker-compose.standalone.yaml`:

```yaml
version: '3.8'

services:
  explorer-ui:
    build: .
    ports:
      - "3000:80"
    environment:
      - VITE_NETWORK=${VITE_NETWORK:-testnet}
      - VITE_RPC_HTTP=${VITE_RPC_HTTP:-https://rpc.testnet.socialblock.io}
      - VITE_REST_API=${VITE_REST_API:-https://api.testnet.socialblock.io}
      - VITE_ARP_AGENT=${VITE_ARP_AGENT:-https://arp.testnet.socialblock.io}
      - VITE_INDEXER_API=${VITE_INDEXER_API:-https://indexer.testnet.socialblock.io}
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost"]
      interval: 30s
      timeout: 10s
      retries: 3
```

## Production Deployment

### 1. Environment-Specific Builds

#### Testnet Deployment

```bash
# Set testnet environment
export VITE_NETWORK=testnet
export VITE_RPC_HTTP=https://rpc.testnet.socialblock.io
export VITE_REST_API=https://api.testnet.socialblock.io
export VITE_ARP_AGENT=https://arp.testnet.socialblock.io
export VITE_INDEXER_API=https://indexer.testnet.socialblock.io

# Build for testnet
npm run build
```

#### Mainnet Deployment

```bash
# Set mainnet environment
export VITE_NETWORK=mainnet
export VITE_RPC_HTTP=https://rpc.socialblock.io
export VITE_REST_API=https://api.socialblock.io
export VITE_ARP_AGENT=https://arp.socialblock.io
export VITE_INDEXER_API=https://indexer.socialblock.io

# Build for mainnet
npm run build
```

### 2. SSL/TLS Configuration

For production, add SSL configuration to nginx:

```nginx
server {
    listen 443 ssl http2;
    server_name explorer.socialblock.io;

    ssl_certificate /etc/ssl/certs/socialblock.crt;
    ssl_certificate_key /etc/ssl/private/socialblock.key;
    
    # SSL configuration
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-SHA384;
    ssl_prefer_server_ciphers off;
    
    # ... rest of configuration
}

# Redirect HTTP to HTTPS
server {
    listen 80;
    server_name explorer.socialblock.io;
    return 301 https://$server_name$request_uri;
}
```

### 3. CDN and Caching

For optimal performance, consider:

1. **CDN**: Use CloudFlare or similar for static asset delivery
2. **Asset Optimization**: Pre-compress assets with gzip/brotli
3. **Service Worker**: Implement caching for offline functionality

## Monitoring and Health Checks

### Health Check Endpoint

The explorer includes health checks for all backend services. Add monitoring:

```yaml
# Add to docker-compose.yaml
healthcheck:
  test: ["CMD", "curl", "-f", "http://localhost/health"]
  interval: 30s
  timeout: 10s
  retries: 3
  start_period: 40s
```

### Logging Configuration

Configure structured logging:

```nginx
# Add to nginx.conf
log_format json_combined escape=json
  '{'
    '"time_local":"$time_local",'
    '"remote_addr":"$remote_addr",'
    '"remote_user":"$remote_user",'
    '"request":"$request",'
    '"status": "$status",'
    '"body_bytes_sent":"$body_bytes_sent",'
    '"request_time":"$request_time",'
    '"http_referrer":"$http_referer",'
    '"http_user_agent":"$http_user_agent"'
  '}';

access_log /var/log/nginx/access.log json_combined;
error_log /var/log/nginx/error.log warn;
```

## Scaling and Performance

### Horizontal Scaling

For high-traffic deployments:

```yaml
services:
  explorer-ui:
    deploy:
      replicas: 3
      update_config:
        parallelism: 1
        delay: 10s
      restart_policy:
        condition: on-failure
    # ... rest of configuration
```

### Performance Optimizations

1. **Code Splitting**: The build process automatically splits code
2. **Image Optimization**: Optimize images in `src/assets/`
3. **Bundle Analysis**: Use `npm run build` and analyze bundle size
4. **Lazy Loading**: Components are lazy-loaded where appropriate

## Security Considerations

### Content Security Policy

Add CSP headers in nginx:

```nginx
add_header Content-Security-Policy "
    default-src 'self';
    script-src 'self' 'unsafe-inline' 'unsafe-eval';
    style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
    font-src 'self' https://fonts.gstatic.com;
    img-src 'self' data: https:;
    connect-src 'self' ws: wss: https:;
" always;
```

### Rate Limiting

Implement rate limiting for API calls:

```nginx
http {
    limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
    
    server {
        location /api/ {
            limit_req zone=api burst=20 nodelay;
            # ... proxy configuration
        }
    }
}
```

## Backup and Recovery

### Configuration Backup

Backup essential files:
- `docker-compose.yaml`
- `nginx.conf`
- Environment files
- SSL certificates

### Automated Deployment

Create deployment scripts:

```bash
#!/bin/bash
# deploy.sh

set -e

echo "Starting SocialBlock Explorer deployment..."

# Pull latest images
docker compose pull

# Build explorer
docker compose build explorer-ui

# Deploy with zero downtime
docker compose up -d --no-deps explorer-ui

echo "Deployment completed successfully!"
```

## Troubleshooting

### Common Deployment Issues

1. **Build Failures**: Check Node.js version compatibility
2. **CORS Issues**: Verify nginx proxy configuration
3. **WebSocket Connection**: Ensure WebSocket proxy is properly configured
4. **Environment Variables**: Check that all required variables are set

### Debugging Commands

```bash
# Check container status
docker compose ps

# View logs
docker compose logs explorer-ui

# Check nginx configuration
docker compose exec explorer-ui nginx -t

# Test connectivity
docker compose exec explorer-ui curl -f http://localhost
```

## Maintenance

### Regular Updates

1. **Dependencies**: Regularly update npm packages
2. **Base Images**: Update Docker base images
3. **SSL Certificates**: Monitor certificate expiration
4. **Security Patches**: Apply security updates promptly

### Monitoring

Set up monitoring for:
- Container health
- Response times
- Error rates
- Resource usage
- SSL certificate expiration

## Support

For deployment issues:

1. Check the [official repository](https://github.com/SocialBlockLabs/Socialblock-L1) for backend service status
2. Verify all environment variables are correctly configured
3. Check container logs for specific error messages
4. Test connectivity between services using docker network tools
