const fs = require('fs')
const path = require('path')

function slugify(text) {
  return (text || '')
    .toString()
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
    .replace(/-/g, '_')
}

function generateBarrel(dir) {
  const files = fs.readdirSync(dir)

  const subdirs = files.filter(file => fs.statSync(path.join(dir, file)).isDirectory())

  const barrelContent = subdirs
    .map(subdir => {
      const subFiles = fs
        .readdirSync(path.join(dir, subdir))
        .filter(file => path.extname(file) === '.ts')
        .map(file => `export * as ${subdir}/${slugify(file.replace('.ts', ''))} from './${subdir}/${file.replace('.ts', '')}'`)
        .join('\n')
      return `${subFiles}\nexport * as ${slugify(subdir)} from './${subdir}';`
    })
    .join('\n')

  const pngFiles = files.filter(file => path.extname(file) === '.png')
  const pngExports = pngFiles
    .map(
      pngFile =>
        `export { default as ${slugify(
          (Number.isNaN(+path.basename(pngFile, '.png')[0]) ? '' : '_').concat(path.basename(pngFile, '.png')),
        )} } from './${pngFile}';`,
    )
    .join('\n')

  const barrelPath = path.join(dir, 'index.ts')
  fs.writeFileSync(barrelPath, `${barrelContent}\n${pngExports}`)

  subdirs.forEach(subdir => generateBarrel(path.join(dir, subdir)))
}

// Example usage
generateBarrel('.')
