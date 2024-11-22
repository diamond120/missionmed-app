// const express = require('express')
// const path = require('path')
// const app = express()

// app.use(express.static(path.join(__dirname, 'dist')))

// app.get('/*', function (req, res) {
//   res.sendFile(path.join(__dirname, 'dist', 'index.html'))
// })

// app.listen(8080)

// import fs from 'fs'
import express from 'express'
import path from 'path'
import os from 'os' // To get the network IP address
import chalk from 'chalk' // For colored output
const app = express()

import { fileURLToPath } from 'url'
const __filename = fileURLToPath(import.meta.url) // get the resolved path to the file
const __dirname = path.dirname(__filename) // get the name of the directory

// try {
//   const sourcePath = path.join(__dirname, 'google5f2b2bf91c3f04a8.html')
//   const destPath = path.join(__dirname, 'dist', 'google5f2b2bf91c3f04a8.html')

//   fs.copyFile(sourcePath, destPath, (err) => {
//     if (err) {
//       console.error('Error copying file:', err)
//     } else {
//       console.log('custom.html copied successfully.')
//     }
//   })
// } catch (e) {
//   console.error(e.message)
// }

// Serve static files from the "dist" directory
app.use(express.static(path.join(__dirname, 'dist')))

// Handle all routes and serve the main "index.html" file
app.get('/*', function (req, res) {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'))
})

// Listen on port 8080
const port = 3001

// Get network IP address
function getNetworkAddress() {
  const interfaces = os.networkInterfaces()
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address
      }
    }
  }
  return 'localhost'
}

// Start the server
app.listen(port, () => {
  console.clear()
  const localUrl = `http://localhost:${port}/`
  const networkUrl = `http://${getNetworkAddress()}:${port}/`

  // Output similar to Vite's dev server output
  console.log(chalk.green.bold(`\n  Production server ready.\n`))
  console.log(`  ➜  Local:   ${chalk.cyan(localUrl)}`)
  console.log(`  ➜  Network: ${chalk.cyan(networkUrl)}`)
  console.log(`  ➜  press ${chalk.bold('CTRL+C')} to stop the server\n`)
})
