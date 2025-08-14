# 🚀 StreamVerse Demo Deployment Guide

This guide will help you deploy the StreamVerse demo so users can test your package before installing it.

## 🎯 Deployment Options

### Option 1: Vercel (Recommended - Free & Easy)

Vercel provides the easiest way to deploy your demo with automatic HTTPS, CDN, and global distribution.

#### Prerequisites

- [Vercel Account](https://vercel.com/signup) (free)
- [Node.js 18+](https://nodejs.org/)
- [Git](https://git-scm.com/)

#### Steps

1. **Install Vercel CLI:**

   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel:**

   ```bash
   vercel login
   ```

3. **Deploy the Demo:**

   ```bash
   cd examples/basic-demo
   npm run deploy
   ```

4. **Follow the prompts:**

   - Link to existing project or create new
   - Choose your team/account
   - Confirm deployment settings

5. **Your demo will be live at:** `https://your-project.vercel.app`

#### Automatic Deployments

- Connect your GitHub repository to Vercel
- Every push to main branch triggers automatic deployment
- Preview deployments for pull requests

### Option 2: Netlify (Alternative - Free)

Netlify is another excellent option for static site hosting.

#### Steps

1. **Install Netlify CLI:**

   ```bash
   npm install -g netlify-cli
   ```

2. **Build the demo:**

   ```bash
   cd examples/basic-demo
   npm run build
   ```

3. **Deploy:**

   ```bash
   netlify deploy --prod --dir=dist
   ```

4. **Your demo will be live at:** `https://your-site.netlify.app`

### Option 3: GitHub Pages (Free)

GitHub Pages is perfect if your code is already on GitHub.

#### Steps

1. **Build the demo:**

   ```bash
   cd examples/basic-demo
   npm run build
   ```

2. **Push to GitHub:**

   ```bash
   git add .
   git commit -m "Build demo for deployment"
   git push origin main
   ```

3. **Enable GitHub Pages:**

   - Go to repository Settings > Pages
   - Source: Deploy from branch
   - Branch: main, folder: /examples/basic-demo/dist
   - Save

4. **Your demo will be live at:** `https://username.github.io/repository-name`

## 🌐 Signaling Server Deployment

**Important:** The demo requires a signaling server for WebRTC connections. Here are your options:

### Option A: Use Your Hosted Service (Recommended)

If you have a hosted signaling service, update the demo to use it:

```javascript
// In examples/basic-demo/main.js, change:
client = createStreamShareClient({
  userId,
  signalingUrl: "wss://your-signaling-server.com", // Your hosted service
});
```

### Option B: Deploy Signaling Server

#### Deploy to Railway (Recommended for WebSocket)

1. **Create Railway account:** [railway.app](https://railway.app)
2. **Connect your GitHub repository**
3. **Deploy the signal server:**
   ```bash
   cd examples/signal-server
   # Railway will auto-detect and deploy
   ```

#### Deploy to Render

1. **Create Render account:** [render.com](https://render.com)
2. **Create new Web Service**
3. **Connect your repository**
4. **Set build command:** `npm install`
5. **Set start command:** `npm start`

#### Deploy to Heroku

1. **Create Heroku account:** [heroku.com](https://heroku.com)
2. **Install Heroku CLI:**

   ```bash
   npm install -g heroku
   heroku login
   ```

3. **Deploy:**
   ```bash
   cd examples/signal-server
   heroku create your-signal-server
   git push heroku main
   ```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in your demo directory:

```env
# For production signaling server
VITE_SIGNALING_URL=wss://your-signaling-server.com

# For local development
VITE_SIGNALING_URL=ws://localhost:8787
```

### Update Demo Configuration

Modify `examples/basic-demo/main.js` to use environment variables:

```javascript
const signalingUrl =
  import.meta.env.VITE_SIGNALING_URL || "ws://localhost:8787";

client = createStreamShareClient({
  userId,
  signalingUrl,
});
```

## 📱 Custom Domain (Optional)

### Vercel

1. Go to your project settings
2. Add custom domain
3. Update DNS records as instructed

### Netlify

1. Go to Domain management
2. Add custom domain
3. Update DNS records

## 🧪 Testing Your Deployment

1. **Test locally first:**

   ```bash
   cd examples/basic-demo
   npm run dev
   ```

2. **Test production build:**

   ```bash
   npm run build
   npm run preview
   ```

3. **Test deployed version:**
   - Open your live demo URL
   - Test with multiple browser tabs
   - Verify video/audio functionality
   - Test screen sharing

## 🚨 Common Issues & Solutions

### WebSocket Connection Failed

- Ensure signaling server is running
- Check firewall/network settings
- Verify WebSocket URL format (ws:// or wss://)

### Media Access Denied

- Test on HTTPS (required for camera/microphone)
- Check browser permissions
- Ensure user interaction before media access

### Build Errors

- Clear node_modules and reinstall
- Check Node.js version (18+ required)
- Verify all dependencies are installed

## 📊 Monitoring & Analytics

### Vercel Analytics

- Built-in performance monitoring
- Real-time user analytics
- Error tracking

### Custom Analytics

Add Google Analytics or other tracking:

```html
<!-- In index.html -->
<script
  async
  src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"
></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag() {
    dataLayer.push(arguments);
  }
  gtag("js", new Date());
  gtag("config", "GA_MEASUREMENT_ID");
</script>
```

## 🔄 Continuous Deployment

### GitHub Actions Workflow

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy Demo
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: "18"
      - run: npm ci
      - run: npm run build
      - uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          vercel-args: "--prod"
```

## 📈 Performance Optimization

### Build Optimization

- Enable Vite's build optimization
- Use modern JavaScript features
- Optimize images and assets

### CDN Configuration

- Enable Vercel's edge caching
- Configure cache headers
- Use image optimization

## 🎉 Success!

Once deployed, your users can:

1. **Visit your demo URL**
2. **Test all StreamVerse features**
3. **Experience the package before installing**
4. **Understand the API and capabilities**

## 🔗 Next Steps

1. **Update your README.md** with the demo link
2. **Share the demo** on social media and developer communities
3. **Collect feedback** from users testing the demo
4. **Iterate and improve** based on user experience

## 📞 Support

If you encounter issues:

1. Check the [StreamVerse documentation](packages/streamverse/README.md)
2. Review [Vercel deployment docs](https://vercel.com/docs)
3. Open an issue on GitHub
4. Join our community Discord

---

**Happy Deploying! 🚀**

Your StreamVerse demo will help users understand the power and simplicity of your package before they commit to using it.
