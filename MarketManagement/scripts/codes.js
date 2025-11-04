// ============================================
// BIBLIOTECAS EXTERNAS (CDN)
// ============================================
// QRCode.js - https://github.com/davidshimjs/qrcodejs
// JsBarcode - https://github.com/lindell/JsBarcode
// html5-qrcode - https://github.com/mebjas/html5-qrcode

// ============================================
// GERAÇÃO DE QR CODE
// ============================================

function generateQRCode(text, containerId) {
    const container = document.getElementById(containerId);
    container.innerHTML = ''; // Limpar conteúdo anterior

    if (!text || text.trim() === '') {
        container.innerHTML = '<p style="color: #64748b;">Digite um valor para gerar o QR Code</p>';
        return null;
    }

    try {
        // Criar um canvas para o QR Code
        const canvas = document.createElement('canvas');
        container.appendChild(canvas);

        // Gerar QR Code usando uma biblioteca simples
        const size = 200;
        const ctx = canvas.getContext('2d');
        canvas.width = size;
        canvas.height = size;

        // Por ora, vamos usar uma API externa para gerar o QR Code
        const qrImage = document.createElement('img');
        qrImage.src = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(text)}`;
        qrImage.style.maxWidth = '100%';
        qrImage.style.height = 'auto';
        
        container.innerHTML = '';
        container.appendChild(qrImage);

        return text;
    } catch (error) {
        console.error('Erro ao gerar QR Code:', error);
        container.innerHTML = '<p style="color: #ef4444;">Erro ao gerar QR Code</p>';
        return null;
    }
}

// ============================================
// GERAÇÃO DE CÓDIGO DE BARRAS
// ============================================

function generateBarcode(text, containerId) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.error('Container não encontrado:', containerId);
        return null;
    }
    
    container.innerHTML = ''; // Limpar conteúdo anterior

    try {
        // Validar formato EAN-13 (13 dígitos)
        let barcodeText = '';
        
        if (!text || text.trim() === '') {
            // Se não houver valor, gerar um código EAN-13 automaticamente
            barcodeText = generateEAN13();
            console.log('Código gerado automaticamente:', barcodeText);
        } else {
            // Remover não-dígitos
            barcodeText = text.replace(/\D/g, '');
            
            // Se não tiver 13 dígitos, gerar um número aleatório
            if (barcodeText.length !== 13) {
                barcodeText = generateEAN13();
                console.log('Código gerado (formato inválido):', barcodeText);
            }
        }

        // Criar SVG do código de barras melhorado
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('width', '100%');
        svg.setAttribute('height', '100');
        svg.setAttribute('viewBox', '0 0 400 100');
        svg.style.maxWidth = '300px';

        // Padrão de barras mais realista
        let bars = '';
        let x = 20;
        
        // Barras iniciais (guard pattern)
        bars += `<rect x="${x}" y="15" width="2" height="60" fill="black"/>`;
        x += 4;
        bars += `<rect x="${x}" y="15" width="2" height="60" fill="black"/>`;
        x += 6;
        
        // Barras para cada dígito
        for (let i = 0; i < barcodeText.length; i++) {
            const digit = parseInt(barcodeText[i]);
            const width = (digit % 3) + 2;
            bars += `<rect x="${x}" y="15" width="${width}" height="60" fill="black"/>`;
            x += width + 3;
            
            if (i === 5) { // Barra central
                x += 4;
                bars += `<rect x="${x}" y="15" width="2" height="60" fill="black"/>`;
                x += 4;
            }
        }
        
        // Barras finais
        bars += `<rect x="${x}" y="15" width="2" height="60" fill="black"/>`;
        x += 4;
        bars += `<rect x="${x}" y="15" width="2" height="60" fill="black"/>`;

        svg.innerHTML = `
            <rect width="400" height="100" fill="white"/>
            ${bars}
            <text x="200" y="90" text-anchor="middle" font-size="14" font-family="monospace" fill="black">${barcodeText}</text>
        `;

        container.appendChild(svg);
        console.log('Código de barras gerado com sucesso:', barcodeText);

        return barcodeText;
    } catch (error) {
        console.error('Erro ao gerar código de barras:', error);
        container.innerHTML = '<p style="color: #ef4444;">Erro ao gerar código de barras</p>';
        return null;
    }
}

// Gerar número EAN-13 válido
function generateEAN13() {
    let code = '';
    
    // Gerar 12 dígitos aleatórios
    for (let i = 0; i < 12; i++) {
        code += Math.floor(Math.random() * 10);
    }
    
    // Calcular dígito verificador
    let sum = 0;
    for (let i = 0; i < 12; i++) {
        const digit = parseInt(code[i]);
        sum += (i % 2 === 0) ? digit : digit * 3;
    }
    
    const checkDigit = (10 - (sum % 10)) % 10;
    code += checkDigit;
    
    return code;
}

// ============================================
// SCANNER DE CÓDIGOS
// ============================================

let currentScanner = null;
let currentScannerCallback = null;

async function startScanner(type, callback) {
    currentScannerCallback = callback;
    
    const modal = document.getElementById('scannerModal');
    const title = document.getElementById('scannerTitle');
    const video = document.getElementById('scannerVideo');
    
    title.textContent = type === 'barcode' ? 'Escanear Código de Barras' : 'Escanear QR Code';
    
    try {
        // Solicitar acesso à câmera
        const stream = await navigator.mediaDevices.getUserMedia({ 
            video: { facingMode: 'environment' } // Câmera traseira em dispositivos móveis
        });
        
        video.srcObject = stream;
        currentScanner = stream;
        
        // Abrir modal
        modal.classList.add('active');
        
        // Iniciar detecção
        startCodeDetection(video, type);
        
    } catch (error) {
        console.error('Erro ao acessar câmera:', error);
        alert('Não foi possível acessar a câmera. Verifique as permissões do navegador.');
    }
}

function startCodeDetection(video, type) {
    const canvas = document.getElementById('scannerCanvas');
    const ctx = canvas.getContext('2d');
    
    const detectInterval = setInterval(() => {
        if (!currentScanner) {
            clearInterval(detectInterval);
            return;
        }
        
        // Capturar frame do vídeo
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        ctx.drawImage(video, 0, 0);
        
        // Aqui seria necessária uma biblioteca de detecção como ZXing ou QuaggaJS
        // Por simplicidade, vamos simular a detecção manual
        
    }, 500);
}

function stopScanner() {
    if (currentScanner) {
        currentScanner.getTracks().forEach(track => track.stop());
        currentScanner = null;
    }
    
    const modal = document.getElementById('scannerModal');
    modal.classList.remove('active');
    
    const video = document.getElementById('scannerVideo');
    video.srcObject = null;
    
    currentScannerCallback = null;
}

// Simular detecção de código (para testes)
function simulateCodeDetection(code) {
    if (currentScannerCallback) {
        currentScannerCallback(code);
        stopScanner();
    }
}

// ============================================
// HELPER: FORMATAR CÓDIGO DE BARRAS
// ============================================

function formatBarcode(code) {
    // Remover não-dígitos
    code = code.replace(/\D/g, '');
    
    // Formatar como EAN-13: 123-4567890123
    if (code.length === 13) {
        return code.replace(/(\d{3})(\d{7})(\d{3})/, '$1-$2-$3');
    }
    
    return code;
}
