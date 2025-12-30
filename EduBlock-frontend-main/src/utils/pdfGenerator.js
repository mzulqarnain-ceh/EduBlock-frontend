import jsPDF from 'jspdf';

/**
 * Generate PDF Certificate
 * Flexible template that can be easily customized in the future
 * 
 * @param {Object} certificateData - Certificate details
 * @returns {void} - Triggers PDF download
 */
export const generateCertificatePDF = (certificateData) => {
    const {
        studentName,
        courseName,
        institution,
        grade,
        issueDate,
        hash,
        txHash,
        status,
    } = certificateData;

    // Create new PDF document (A4 size)
    const doc = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4'
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    // === HEADER SECTION ===
    // Background gradient effect (simulated with rectangles)
    doc.setFillColor(59, 130, 246); // Blue
    doc.rect(0, 0, pageWidth, 40, 'F');

    // Institution name
    doc.setFontSize(24);
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.text(institution || 'Educational Institution', pageWidth / 2, 20, { align: 'center' });

    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text('Blockchain Verified Certificate', pageWidth / 2, 30, { align: 'center' });

    // === CERTIFICATE TITLE ===
    doc.setFontSize(32);
    doc.setTextColor(59, 130, 246);
    doc.setFont('helvetica', 'bold');
    doc.text('CERTIFICATE', pageWidth / 2, 60, { align: 'center' });

    doc.setFontSize(16);
    doc.setTextColor(100, 100, 100);
    doc.setFont('helvetica', 'normal');
    doc.text('OF COMPLETION', pageWidth / 2, 70, { align: 'center' });

    // === DECORATIVE LINE ===
    doc.setDrawColor(59, 130, 246);
    doc.setLineWidth(0.5);
    doc.line(60, 75, pageWidth - 60, 75);

    // === CERTIFICATE BODY ===
    doc.setFontSize(14);
    doc.setTextColor(50, 50, 50);
    doc.setFont('helvetica', 'normal');
    doc.text('This is to certify that', pageWidth / 2, 90, { align: 'center' });

    // Student name (highlighted)
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 0, 0);
    doc.text(studentName || 'Student Name', pageWidth / 2, 105, { align: 'center' });

    // Achievement text
    doc.setFontSize(14);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(50, 50, 50);
    doc.text('has successfully completed', pageWidth / 2, 118, { align: 'center' });

    // Course/Degree name
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(59, 130, 246);
    doc.text(courseName || 'Course Name', pageWidth / 2, 130, { align: 'center' });

    // === DETAILS BOX ===
    const detailsY = 145;
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(70, 70, 70);

    // Grade
    doc.text(`Grade: ${grade || 'N/A'}`, 80, detailsY);

    // Issue date
    doc.text(`Issue Date: ${new Date(issueDate).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    })}`, 180, detailsY);

    // Status badge
    doc.setFillColor(status === 'Issued' ? 34 : 234, status === 'Issued' ? 197 : 179, status === 'Issued' ? 94 : 8);
    doc.roundedRect(pageWidth - 65, detailsY - 5, 30, 8, 2, 2, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.text(status || 'Issued', pageWidth - 50, detailsY, { align: 'center' });

    // === BLOCKCHAIN VERIFICATION SECTION ===
    const verificationY = 165;

    // Section title
    doc.setFontSize(12);
    doc.setTextColor(59, 130, 246);
    doc.setFont('helvetica', 'bold');
    doc.text('Blockchain Verification', pageWidth / 2, verificationY, { align: 'center' });

    // Certificate hash
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.setFont('courier', 'normal');
    const shortHash = `${hash.slice(0, 20)}...${hash.slice(-15)}`;
    doc.text(`Certificate Hash: ${shortHash}`, pageWidth / 2, verificationY + 7, { align: 'center' });

    // Transaction hash
    if (txHash) {
        const shortTxHash = `${txHash.slice(0, 20)}...${txHash.slice(-15)}`;
        doc.text(`Transaction Hash: ${shortTxHash}`, pageWidth / 2, verificationY + 13, { align: 'center' });
    }

    // Verification URL
    doc.setFontSize(9);
    doc.setTextColor(59, 130, 246);
    doc.setFont('helvetica', 'normal');
    doc.text(`Verify at: ${window.location.origin}/verify?hash=${hash}`, pageWidth / 2, verificationY + 20, { align: 'center' });

    // === QR CODE PLACEHOLDER ===
    // Note: For actual QR code, you'd need to generate it as base64 image
    // For now, adding a placeholder box
    const qrSize = 30;
    const qrX = pageWidth / 2 - qrSize / 2;
    const qrY = 30;

    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.3);
    doc.rect(qrX, qrY, qrSize, qrSize);
    doc.setFontSize(7);
    doc.setTextColor(150, 150, 150);
    doc.text('QR CODE', qrX + qrSize / 2, qrY + qrSize / 2, { align: 'center' });

    // === FOOTER ===
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.setFont('helvetica', 'italic');
    doc.text('This certificate is secured on the blockchain and can be verified using the hash above.',
        pageWidth / 2, pageHeight - 15, { align: 'center' });

    doc.setFontSize(7);
    doc.text('© EduBlock - Blockchain Based Degree Verification System',
        pageWidth / 2, pageHeight - 10, { align: 'center' });

    // === DOWNLOAD PDF ===
    const fileName = `${studentName.replace(/\s+/g, '_')}_${courseName.replace(/\s+/g, '_')}_Certificate.pdf`;
    doc.save(fileName);
};

/**
 * Future: Add QR code to PDF
 * This function can be extended to embed actual QR code images
 */
export const addQRCodeToPDF = (doc, qrCodeDataURL, x, y, size) => {
    if (qrCodeDataURL) {
        doc.addImage(qrCodeDataURL, 'PNG', x, y, size, size);
    }
};
