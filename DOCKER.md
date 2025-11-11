# Docker Setup for ECS Deployment

This guide explains how to build and run the Destinacioni Web application using Docker, optimized for AWS ECS deployment.

## Prerequisites

- Docker Engine 20.10+
- Node.js 22.11 (as specified in `.nvmrc`)

## Quick Start

### Build the Docker Image

```bash
docker build -t destinacioni-web .
```

### Run Locally

```bash
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_API_BASE_URL=http://destination-alb-1339224077.eu-central-1.elb.amazonaws.com/api \
  destinacioni-web
```

### Using Docker Compose

```bash
docker-compose up -d
```

The application will be available at `http://localhost:3000`

## Dockerfile Architecture

The Dockerfile uses a **multi-stage build** optimized for production:

1. **deps stage**: Installs dependencies
2. **builder stage**: Builds the Next.js application with standalone output
3. **runner stage**: Creates a minimal production image (~200MB)

### Key Features

- Uses Node.js 22.11 (Alpine) for smaller image size
- Standalone output mode for optimal performance
- Runs as non-root user (`nextjs`) for security
- Health check included for ECS
- Production optimizations enabled

## Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_API_BASE_URL=http://destination-alb-1339224077.eu-central-1.elb.amazonaws.com/api
NODE_ENV=production
```

## ECS Deployment

### Build and Push to ECR

```bash
# Authenticate to ECR
aws ecr get-login-password --region eu-central-1 | docker login --username AWS --password-stdin <account-id>.dkr.ecr.eu-central-1.amazonaws.com

# Build image
docker build -t destinacioni-web .

# Tag for ECR
docker tag destinacioni-web:latest <account-id>.dkr.ecr.eu-central-1.amazonaws.com/destinacioni-web:latest

# Push to ECR
docker push <account-id>.dkr.ecr.eu-central-1.amazonaws.com/destinacioni-web:latest
```

### ECS Task Definition

Key settings for ECS:

- **Container Port**: 3000
- **Memory**: 512 MB (minimum), 1024 MB recommended
- **CPU**: 256 (0.25 vCPU) minimum
- **Health Check**: HTTP GET on port 3000
- **Environment Variables**: Set `NEXT_PUBLIC_API_BASE_URL` in task definition

### CloudFront Integration

- Point CloudFront distribution to the ECS ALB
- Configure caching for static assets (`.next/static`)
- Set appropriate TTLs for HTML vs static assets

## Image Size

The production image is optimized and should be around **200-300MB**.

## Security

- Application runs as non-root user
- Only necessary files copied to final image
- Alpine Linux base for minimal attack surface
- Environment variables should be managed via ECS task definitions or AWS Secrets Manager

## Troubleshooting

### Build Issues

```bash
# Clear Docker cache
docker builder prune -a

# Rebuild without cache
docker build --no-cache -t destinacioni-web .
```

### Port Conflicts

Change the port mapping in `docker-compose.yml`:

```yaml
ports:
  - "3001:3000"  # Use port 3001 on host
```

### Health Check Failures

Ensure the application is responding on port 3000:

```bash
docker exec -it destinacioni-web wget -O- http://localhost:3000
```

