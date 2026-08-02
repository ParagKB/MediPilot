# MediPilot Nexus - Deployment Guide

## Local Development

### Prerequisites
- Node.js v16 or higher
- npm or yarn package manager

### Setup
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Production Deployment

### Option 1: Vercel (Recommended)

Vercel is perfect for React applications and offers free hosting.

#### Steps:
1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "Import Project"
4. Select your GitHub repository
5. Configure build settings:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
6. Click "Deploy"

#### Environment Variables (if needed):
```
VITE_API_URL=your_api_url
VITE_API_KEY=your_api_key
```

### Option 2: Netlify

Another excellent option for static sites.

#### Steps:
1. Push code to GitHub
2. Go to [netlify.com](https://netlify.com)
3. Click "New site from Git"
4. Select your repository
5. Configure:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
6. Click "Deploy site"

#### netlify.toml Configuration:
```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### Option 3: GitHub Pages

Free hosting directly from your GitHub repository.

#### Steps:
1. Install gh-pages:
```bash
npm install --save-dev gh-pages
```

2. Add to package.json:
```json
{
  "homepage": "https://yourusername.github.io/medipilot-nexus",
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  }
}
```

3. Update vite.config.js:
```javascript
export default defineConfig({
  plugins: [react()],
  base: '/medipilot-nexus/',
  server: {
    port: 3000,
    open: true
  }
})
```

4. Deploy:
```bash
npm run deploy
```

### Option 4: AWS S3 + CloudFront

For enterprise-grade hosting with CDN.

#### Steps:
1. Build the project:
```bash
npm run build
```

2. Create S3 bucket:
```bash
aws s3 mb s3://medipilot-nexus
```

3. Configure bucket for static hosting:
```bash
aws s3 website s3://medipilot-nexus --index-document index.html --error-document index.html
```

4. Upload files:
```bash
aws s3 sync dist/ s3://medipilot-nexus --acl public-read
```

5. Create CloudFront distribution for HTTPS and CDN

### Option 5: Docker

Containerize the application for any platform.

#### Dockerfile:
```dockerfile
# Build stage
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

#### nginx.conf:
```nginx
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

#### Build and run:
```bash
# Build image
docker build -t medipilot-nexus .

# Run container
docker run -p 80:80 medipilot-nexus
```

#### Docker Compose:
```yaml
version: '3.8'
services:
  web:
    build: .
    ports:
      - "80:80"
    restart: unless-stopped
```

### Option 6: Traditional Web Server

Deploy to Apache or Nginx server.

#### Apache (.htaccess):
```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

#### Nginx:
```nginx
server {
    listen 80;
    server_name yourdomain.com;
    root /var/www/medipilot-nexus;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

## Environment Configuration

### Development (.env.development):
```env
VITE_API_URL=http://localhost:3001/api
VITE_ENV=development
```

### Production (.env.production):
```env
VITE_API_URL=https://api.medipilot.com
VITE_ENV=production
```

## Build Optimization

### 1. Code Splitting
Already configured in Vite, but you can optimize further:

```javascript
// vite.config.js
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor': ['framer-motion', 'lucide-react'],
        }
      }
    }
  }
})
```

### 2. Image Optimization
```bash
npm install --save-dev vite-plugin-imagemin
```

### 3. Compression
```bash
npm install --save-dev vite-plugin-compression
```

```javascript
import viteCompression from 'vite-plugin-compression'

export default defineConfig({
  plugins: [
    react(),
    viteCompression()
  ]
})
```

## Performance Checklist

- [ ] Enable gzip/brotli compression
- [ ] Set up CDN for static assets
- [ ] Configure caching headers
- [ ] Optimize images
- [ ] Minify CSS and JavaScript
- [ ] Enable HTTP/2
- [ ] Set up SSL certificate
- [ ] Configure CSP headers
- [ ] Enable CORS properly
- [ ] Set up monitoring (Google Analytics, etc.)

## Security Checklist

- [ ] Use HTTPS only
- [ ] Set security headers
- [ ] Implement CSP
- [ ] Enable HSTS
- [ ] Configure CORS
- [ ] Sanitize user inputs
- [ ] Implement rate limiting
- [ ] Use environment variables for secrets
- [ ] Regular dependency updates
- [ ] Security audits

## Monitoring & Analytics

### Google Analytics
```html
<!-- Add to index.html -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

### Sentry Error Tracking
```bash
npm install @sentry/react
```

```javascript
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "YOUR_SENTRY_DSN",
  environment: import.meta.env.MODE,
});
```

## CI/CD Pipeline

### GitHub Actions (.github/workflows/deploy.yml):
```yaml
name: Deploy

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v2
    
    - name: Setup Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '18'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Build
      run: npm run build
    
    - name: Deploy to Vercel
      uses: amondnet/vercel-action@v20
      with:
        vercel-token: ${{ secrets.VERCEL_TOKEN }}
        vercel-org-id: ${{ secrets.ORG_ID }}
        vercel-project-id: ${{ secrets.PROJECT_ID }}
```

## Database Migration (When Moving to Production)

### 1. Choose Database
- PostgreSQL (recommended)
- MongoDB
- MySQL
- Firebase

### 2. Set up Database
```bash
# PostgreSQL example
createdb medipilot_nexus
```

### 3. Run Migrations
```bash
# Using Prisma
npx prisma migrate deploy
```

### 4. Update Environment Variables
```env
DATABASE_URL=postgresql://user:password@localhost:5432/medipilot_nexus
```

## Backend API Setup

### 1. Create API Server
```bash
mkdir api
cd api
npm init -y
npm install express cors dotenv
```

### 2. Basic Server (api/server.js):
```javascript
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

### 3. Deploy API
- Heroku
- Railway
- Render
- AWS Lambda
- Google Cloud Functions

## Domain Setup

### 1. Purchase Domain
- Namecheap
- GoDaddy
- Google Domains

### 2. Configure DNS
```
A Record: @ -> Your_Server_IP
CNAME: www -> yourdomain.com
```

### 3. SSL Certificate
- Let's Encrypt (free)
- Cloudflare (free)
- AWS Certificate Manager (free)

## Backup Strategy

### 1. Database Backups
```bash
# PostgreSQL
pg_dump medipilot_nexus > backup.sql

# Automated daily backups
0 2 * * * pg_dump medipilot_nexus > /backups/db_$(date +\%Y\%m\%d).sql
```

### 2. File Backups
```bash
# AWS S3
aws s3 sync /var/www/medipilot-nexus s3://backups/medipilot-nexus
```

## Scaling Considerations

### Horizontal Scaling
- Load balancer (Nginx, AWS ALB)
- Multiple server instances
- Database replication
- Redis for caching

### Vertical Scaling
- Increase server resources
- Optimize database queries
- Implement caching
- Use CDN

## Cost Estimation

### Free Tier Options
- **Vercel**: Free for personal projects
- **Netlify**: Free for personal projects
- **GitHub Pages**: Free
- **Railway**: $5/month free credit

### Paid Options
- **AWS**: ~$20-50/month (small scale)
- **DigitalOcean**: $5-20/month
- **Heroku**: $7-25/month
- **Custom VPS**: $5-50/month

## Post-Deployment Checklist

- [ ] Test all features in production
- [ ] Verify SSL certificate
- [ ] Check mobile responsiveness
- [ ] Test all user flows
- [ ] Verify analytics tracking
- [ ] Test error handling
- [ ] Check performance metrics
- [ ] Verify SEO meta tags
- [ ] Test on different browsers
- [ ] Set up monitoring alerts
- [ ] Document deployment process
- [ ] Create rollback plan

## Support & Maintenance

### Regular Tasks
- Monitor error logs
- Check performance metrics
- Update dependencies monthly
- Review security advisories
- Backup verification
- User feedback review
- Feature updates

### Emergency Procedures
1. Identify issue
2. Check error logs
3. Rollback if necessary
4. Fix and test
5. Deploy fix
6. Verify resolution
7. Post-mortem analysis

## Resources

- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)
- [React Deployment](https://create-react-app.dev/docs/deployment/)
- [Vercel Documentation](https://vercel.com/docs)
- [Netlify Documentation](https://docs.netlify.com/)
- [Docker Documentation](https://docs.docker.com/)

---

**Ready to Deploy!** 🚀

Choose the deployment option that best fits your needs and follow the steps above. For a quick start, Vercel or Netlify are recommended for their simplicity and free tier offerings.
