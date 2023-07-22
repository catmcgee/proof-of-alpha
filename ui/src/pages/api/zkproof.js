// pages/api/zkproof.js
const { createCanvas, loadImage } = require('canvas');
const QRCode = require('qrcode');

export default async function handler(req, res) {
    try {
      // Get txHash from request and create dummy zkProof
      const txHash = req.query.txHash;
      const zkProof = { hash: txHash, proof: 'dummy', isValid: true };
  
      // Generate QR code with zkProof data
      const qrCodeDataURL = await QRCode.toDataURL(JSON.stringify(zkProof));
  
      // Load base image and QR code image
      const baseImage = await loadImage('https://i.ibb.co/WcdTVGb/thing.png');
      const qrImage = await loadImage(qrCodeDataURL);
  
      // Create a canvas, draw the base image and QR code on it
      const canvas = createCanvas(baseImage.width, baseImage.height);
      const context = canvas.getContext('2d');
      context.drawImage(baseImage, 0, 0);
      // Variables for QR Code position
const qrImageWidth = qrImage.width;
const qrImageHeight = qrImage.height;
const qrImagePosX = (canvas.width - qrImageWidth) / 2;  // center horizontally
const qrImagePosY = (canvas.height - qrImageHeight) / 2; // place it lower vertically 

context.drawImage(qrImage, qrImagePosX, qrImagePosY);

  
     // Add text onto the image
const text = txHash;
const maxWidth = 400; // Or set this to whatever maximum width you want
context.font = '20px Helvetica';
context.fillStyle = 'white';  // white color
context.textAlign = 'center'; // align text at center horizontally
context.textBaseline = 'middle'; // align text at middle vertically

// Add shadow 
context.shadowColor = 'black';
context.shadowBlur = 2;
context.shadowOffsetX = 4;
context.shadowOffsetY = 4;

// Draw the text
context.fillText(text, baseImage.width / 2, baseImage.height / 3.8, maxWidth);

  
      const imageDataURL = canvas.toDataURL();
  
      res.setHeader('Content-Type', 'image/png');
      res.send(imageDataURL.substring(imageDataURL.indexOf(',') + 1));
  
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.toString() });
    }
  }
  
