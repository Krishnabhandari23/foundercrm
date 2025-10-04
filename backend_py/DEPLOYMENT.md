# Production Deployment Guide

This guide details the steps to deploy the FounderCRM backend in a production environment.

## Prerequisites

- Docker and Docker Compose installed on the host machine
- Domain name configured with DNS records
- SSL certificate (we'll use Let's Encrypt)
- Access to a PostgreSQL database (or use the provided Docker container)

## Configuration

1. Create a production environment file:
```bash
cp .env .env.prod
```

2. Edit `.env.prod` with production values:
```ini
# API and Server
NODE_ENV=production
FRONTEND_URL=https://app.foundercrm.com

# Security
JWT_SECRET=<generate-secure-random-string>
JWT_EXPIRE=7d
JWT_ALGORITHM=HS256

# Database
DATABASE_URL=postgresql://postgres:${DB_PASSWORD}@db:5432/foundercrm
DB_PASSWORD=<secure-database-password>

# CORS Origins
BACKEND_CORS_ORIGINS=["https://app.foundercrm.com"]

# AI Service
PERPLEXITY_API_KEY=<your-api-key>
PERPLEXITY_MODEL=sonar-medium-online

# Email (Optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=<your-email>
SMTP_PASSWORD=<your-password>
FROM_EMAIL=noreply@foundercrm.com

# Logging
LOG_LEVEL=INFO
```

## SSL Certificate Setup

1. Create directories for SSL certificates:
```bash
mkdir -p certbot/conf certbot/www
```

2. Initialize SSL certificates:
```bash
docker-compose -f docker-compose.prod.yml run --rm certbot certonly --webroot -w /var/www/certbot -d api.foundercrm.com --email admin@foundercrm.com --agree-tos --no-eff-email
```

## Deployment

1. Build and start the production stack:
```bash
docker-compose -f docker-compose.prod.yml up -d
```

2. Run database migrations:
```bash
docker-compose -f docker-compose.prod.yml exec api alembic upgrade head
```

3. Create an initial admin user:
```bash
docker-compose -f docker-compose.prod.yml exec api python scripts/create_admin.py
```

## Monitoring

The application includes:
- Prometheus metrics at `/metrics`
- Health check endpoint at `/health`
- Detailed API health at `/api/health`

## Backup

1. Database backup:
```bash
docker-compose -f docker-compose.prod.yml exec db pg_dump -U postgres foundercrm > backup.sql
```

2. Automated daily backups (add to crontab):
```bash
0 0 * * * /path/to/backup-script.sh
```

## Security Notes

1. SSL/TLS:
   - Only TLS 1.2 and 1.3 are enabled
   - Strong cipher suites configured
   - HSTS enabled

2. Headers:
   - Security headers configured in Nginx
   - CORS properly restricted
   - Rate limiting enabled

3. Database:
   - Regular security updates
   - Strong passwords required
   - Network access restricted

## Scaling

The application can be scaled horizontally:
1. Add more API containers:
```bash
docker-compose -f docker-compose.prod.yml up -d --scale api=3
```

2. Configure load balancing in Nginx

## Troubleshooting

1. Check logs:
```bash
docker-compose -f docker-compose.prod.yml logs -f api
```

2. Monitor resources:
```bash
docker stats
```

3. Common issues:
   - Database connection issues: Check DATABASE_URL and network
   - SSL certificate errors: Check certificate renewal
   - Performance issues: Monitor resource usage

## Maintenance

1. Regular updates:
```bash
docker-compose -f docker-compose.prod.yml pull
docker-compose -f docker-compose.prod.yml up -d
```

2. SSL certificate renewal:
   - Automatic with Certbot container
   - Monitor renewal logs

3. Database maintenance:
   - Regular VACUUM ANALYZE
   - Monitor disk space
   - Regular backups