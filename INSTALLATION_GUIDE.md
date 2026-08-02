# MediPilot Nexus - Installation Guide

## System Requirements

### Minimum Requirements
- **Operating System**: Windows 10/11, macOS 10.15+, or Linux
- **Node.js**: Version 16.0 or higher
- **RAM**: 4GB minimum
- **Disk Space**: 500MB free space
- **Browser**: Chrome, Firefox, Safari, or Edge (latest versions)

### Recommended Requirements
- **Node.js**: Version 18.0 or higher
- **RAM**: 8GB or more
- **Internet**: Stable connection for package installation

## Pre-Installation Checklist

### 1. Check Node.js Installation
Open your terminal and run:
```bash
node --version
```
Expected output: `v16.0.0` or higher

If Node.js is not installed:
- **Windows/macOS**: Download from [nodejs.org](https://nodejs.org)
- **Linux**: Use your package manager (apt, yum, etc.)

### 2. Check npm Installation
```bash
npm --version
```
Expected output: `8.0.0` or higher

### 3. Verify Git (Optional)
```bash
git --version
```
Only needed if cloning from repository

## Installation Steps

### Step 1: Navigate to Project Directory
```bash
cd path/to/medipilot-nexus
```

### Step 2: Install Dependencies
```bash
npm install
```

**What this does:**
- Downloads all required packages
- Sets up node_modules folder
- Prepares the project for development

**Expected time:** 2-5 minutes (depending on internet speed)

**Expected output:**
```
added 234 packages, and audited 235 packages in 2m

45 packages are looking for funding
  run `npm fund` for details

found 0 vulnerabilities
```

### Step 3: Verify Installation
Check if node_modules folder was created:
```bash
# Windows
dir node_modules

# macOS/Linux
ls node_modules
```

### Step 4: Start Development Server
```bash
npm run dev
```

**Expected output:**
```
  VITE v5.0.8  ready in 523 ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: use --host to expose
  ➜  press h to show help
```

### Step 5: Open in Browser
The application should automatically open in your default browser at:
```
http://localhost:3000
```

If it doesn't open automatically, manually navigate to the URL above.

## Troubleshooting

### Issue 1: "npm: command not found"
**Problem**: Node.js/npm not installed or not in PATH

**Solution**:
1. Install Node.js from [nodejs.org](https://nodejs.org)
2. Restart your terminal
3. Verify installation: `node --version`

### Issue 2: "EACCES: permission denied"
**Problem**: Insufficient permissions

**Solution (macOS/Linux)**:
```bash
sudo npm install
```

**Solution (Windows)**:
Run terminal as Administrator

### Issue 3: "Port 3000 already in use"
**Problem**: Another application is using port 3000

**Solution 1**: Stop the other application

**Solution 2**: Use a different port
```bash
npm run dev -- --port 3001
```

### Issue 4: "Module not found" errors
**Problem**: Dependencies not properly installed

**Solution**:
```bash
# Clear cache and reinstall
rm -rf node_modules
rm package-lock.json
npm install
```

### Issue 5: Slow installation
**Problem**: Slow internet or npm registry issues

**Solution**:
```bash
# Use a faster registry
npm install --registry=https://registry.npmmirror.com
```

### Issue 6: "Cannot find module 'vite'"
**Problem**: Vite not installed

**Solution**:
```bash
npm install vite --save-dev
```

### Issue 7: Build errors
**Problem**: Outdated dependencies

**Solution**:
```bash
npm update
npm run dev
```

## Verification Checklist

After installation, verify everything works:

- [ ] Node.js installed (v16+)
- [ ] npm installed (v8+)
- [ ] Dependencies installed (node_modules exists)
- [ ] Development server starts without errors
- [ ] Browser opens to http://localhost:3000
- [ ] Login page displays correctly
- [ ] Can login with demo accounts
- [ ] Navigation works
- [ ] No console errors

## Post-Installation

### 1. Test Demo Accounts
Try logging in with each demo account:
- patient@demo.com / demo123
- hospital@demo.com / demo123
- insurance@demo.com / demo123

### 2. Explore Features
- Navigate through different interfaces
- Test creating records
- Verify animations work
- Check responsive design (resize browser)

### 3. Check Console
Open browser developer tools (F12) and check for errors:
- Should see no red errors
- Warnings are okay

## Development Workflow

### Starting Development
```bash
npm run dev
```

### Building for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

### Stopping Development Server
Press `Ctrl + C` in the terminal

## IDE Setup (Optional)

### VS Code Extensions (Recommended)
1. **ES7+ React/Redux/React-Native snippets**
2. **Tailwind CSS IntelliSense**
3. **Prettier - Code formatter**
4. **ESLint**

### VS Code Settings
Create `.vscode/settings.json`:
```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "tailwindCSS.experimental.classRegex": [
    ["clsx\\(([^)]*)\\)", "(?:'|\"|`)([^']*)(?:'|\"|`)"]
  ]
}
```

## Environment Setup (Optional)

### Create .env file
```bash
# Create .env file in project root
touch .env
```

### Add environment variables
```env
VITE_APP_NAME=MediPilot Nexus
VITE_API_URL=http://localhost:3001
```

## Package Scripts

Available npm scripts:

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code (if configured)
npm run lint

# Format code (if configured)
npm run format
```

## Updating Dependencies

### Check for updates
```bash
npm outdated
```

### Update all dependencies
```bash
npm update
```

### Update specific package
```bash
npm update package-name
```

## Clean Installation

If you need to start fresh:

```bash
# Remove node_modules and lock file
rm -rf node_modules package-lock.json

# Clear npm cache
npm cache clean --force

# Reinstall
npm install
```

## Platform-Specific Notes

### Windows
- Use PowerShell or Command Prompt
- May need to run as Administrator
- Use backslashes in paths: `cd C:\path\to\project`

### macOS
- Use Terminal
- May need sudo for global packages
- Use forward slashes in paths: `cd /path/to/project`

### Linux
- Use Terminal
- May need sudo for global packages
- Ensure Node.js is in PATH

## Getting Help

### Resources
1. Check QUICK_START.md for usage guide
2. Review README.md for project overview
3. Check browser console for errors
4. Review terminal output for error messages

### Common Commands Reference
```bash
# Check versions
node --version
npm --version

# Install dependencies
npm install

# Start development
npm run dev

# Build production
npm run build

# Clear cache
npm cache clean --force

# Update packages
npm update
```

## Success Indicators

You've successfully installed when:
✅ No errors during `npm install`
✅ Development server starts successfully
✅ Browser opens to login page
✅ Can login with demo accounts
✅ All features are accessible
✅ No console errors

## Next Steps

After successful installation:
1. Read QUICK_START.md for usage guide
2. Explore all three interfaces
3. Test all features
4. Review code structure
5. Start customizing!

## Support

If you encounter issues not covered here:
1. Check the error message carefully
2. Search for the error online
3. Review the documentation files
4. Check Node.js and npm versions
5. Try clean installation

---

**Installation Complete!** 🎉

You're now ready to use MediPilot Nexus. Run `npm run dev` and start exploring!
