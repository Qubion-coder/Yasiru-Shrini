const sharp = require('sharp');
const path = require('path');

const input = path.join(__dirname, 'public', 'og-image-raw.png');
const output = path.join(__dirname, 'public', 'og-image.jpg');

sharp(input)
  .jpeg({ quality: 80 })
  .toFile(output)
  .then(info => {
    console.log('Image compressed successfully:', info);
  })
  .catch(err => {
    console.error('Error compressing image:', err);
  });
