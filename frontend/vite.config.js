import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import fs from 'node:fs'
import path from 'node:path'

// Delete removed demo banner files from public/ and src/assets/
const filesToRemove = [
  'public/hero-farmer.jpg',
  'public/produce-bag.jpg',
  'public/leaves-pattern.jpg',
  'public/leaves.jpg',
  'public/Bannar Big.png',
  'public/maingreen.jpg',
  'public/saleimg.jpg',
  'src/assets/hero-farmer.jpg',
  'src/assets/produce-bag.jpg',
  'src/assets/leaves-pattern.jpg'
]

try {
  filesToRemove.forEach((relPath) => {
    const fullPath = path.resolve(relPath)
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath)
    }
  })
} catch (e) {
  console.error('Error removing demo banner images:', e)
}

// Ensure brand Logo is synced for Header/Footer
const adminAssetsDir = path.resolve('../admin/src/assets')
try {
  const assetsDir = path.resolve('src/assets')
  const publicDir = path.resolve('public')
  if (!fs.existsSync(assetsDir)) fs.mkdirSync(assetsDir, { recursive: true })
  if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir, { recursive: true })

  const logoSrc = path.join(adminAssetsDir, 'Logo.png')
  if (fs.existsSync(logoSrc)) {
    fs.copyFileSync(logoSrc, path.join(publicDir, 'Logo.png'))
    fs.copyFileSync(logoSrc, path.join(assetsDir, 'Logo.png'))
  }
} catch (e) {
  console.error('Error syncing Logo.png:', e)
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5174
  }
})
