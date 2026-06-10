const PDFDocument = require('pdfkit');

const generateInvoicePdf = (order, writableStream) => {
  const doc = new PDFDocument({ margin: 50 });

  doc.pipe(writableStream);
  doc.fontSize(22).text(process.env.HOMA_NAME || 'HOMA Beauty Pvt. Ltd.');
  doc.moveDown();
  doc.fontSize(14).text(`Invoice: ${order.invoiceNumber || order._id}`);
  doc.text(`Order: ${order._id}`);
  doc.text(`Grand Total: NPR ${order.grandTotal}`);
  doc.moveDown();
  doc.text('This is a starter invoice template. Customize layout and tax details for production.');
  doc.end();

  return doc;
};

module.exports = { generateInvoicePdf };
