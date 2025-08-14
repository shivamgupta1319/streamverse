# 📦 Publishing StreamVerse to NPM

This guide walks you through publishing the StreamVerse package to NPM.

## 🚀 Pre-Publishing Checklist

### ✅ Package Ready

- [x] Package renamed to `streamverse`
- [x] All references updated (imports, README, etc.)
- [x] Version set to `1.0.0`
- [x] MIT License added
- [x] `.npmignore` configured
- [x] Build system working
- [x] Demo tested and working

### ✅ Required Files

```
packages/streamverse/
├── package.json       ✅ Complete with all metadata
├── README.md          ✅ Comprehensive documentation
├── LICENSE            ✅ MIT License
├── .npmignore         ✅ Excludes source files
├── dist/              ✅ Built files (ESM + CJS + types)
│   ├── index.js
│   ├── index.cjs
│   ├── index.d.ts
│   └── index.d.cts
└── src/               ❌ Excluded from package
```

## 🔧 Publishing Steps

### 1. Final Testing

```bash
# Test the build
npm run build

# Test the demo
npm run server  # Terminal 1
npm run demo    # Terminal 2
# Verify multi-user functionality works

# Test package contents
cd packages/streamverse
npm pack --dry-run
```

### 2. NPM Account Setup

```bash
# Create NPM account at https://www.npmjs.com/signup
# Or login if you have one
npm login
```

### 3. Check Package Name Availability

```bash
# Check if 'streamverse' is available
npm view streamverse
# Should return 404 if available
```

### 4. Publish to NPM

```bash
cd packages/streamverse

# Final build
npm run build

# Publish to NPM
npm publish

# If this is your first publish, you might need:
# npm publish --access public
```

## 🎯 Post-Publishing

### Verify Publication

```bash
# Check your package on NPM
npm view streamverse

# Test installation
mkdir test-install
cd test-install
npm init -y
npm install streamverse

# Test import
node -e "console.log(require('streamverse'))"
```

### Update Version for Future Releases

```bash
# For bug fixes
npm version patch  # 1.0.0 -> 1.0.1

# For new features
npm version minor  # 1.0.0 -> 1.1.0

# For breaking changes
npm version major  # 1.0.0 -> 2.0.0

# Then publish
npm publish
```

## 📋 Package Information

**Package Name:** `streamverse`
**Version:** `1.0.0`
**Description:** Zero-config real-time video calls and streaming
**Size:** ~8KB (minified)
**Dependencies:** `mediasoup-client` only

## 🔍 What Gets Published

**Included:**

- `dist/` - Built JavaScript and TypeScript definitions
- `README.md` - Documentation
- `package.json` - Package metadata
- `LICENSE` - MIT license

**Excluded (via .npmignore):**

- `src/` - Source TypeScript files
- `tsconfig.json` - TypeScript config
- `tsup.config.ts` - Build config
- Development and test files

## 🎉 Usage After Publishing

Once published, users can install and use StreamVerse:

```bash
npm install streamverse
```

```javascript
import { createStreamShareClient } from "streamverse";

const client = createStreamShareClient({ userId: "alice" });
await client.subscribe("alice");
await client.startSession("my-room");

const stream = await navigator.mediaDevices.getUserMedia({ video: true });
await client.publishStream(stream);
```

## 🚨 Important Notes

1. **Package Name**: Make sure `streamverse` is available on NPM
2. **Scope**: Consider using a scoped package like `@yourusername/streamverse` if the name is taken
3. **Hosted Service**: Update the default signaling URL to your actual hosted service
4. **Documentation**: Ensure all URLs in README point to correct repositories
5. **Testing**: Thoroughly test the published package before announcing

## 🔗 Next Steps After Publishing

1. **Create GitHub Repository**: `https://github.com/shivamgupta1319/streamverse`
2. **Set up Documentation Site**: `https://streamverse.dev`
3. **Deploy Hosted Signaling Service**: For zero-config experience
4. **Add CI/CD**: Automate testing and publishing
5. **Community**: Set up Discord, issues template, contributing guidelines

---

**Ready to publish?** Run the commands above to make StreamVerse available to developers worldwide! 🚀
