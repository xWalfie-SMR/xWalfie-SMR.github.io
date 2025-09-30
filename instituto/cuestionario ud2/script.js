const preguntas = [
    { q: "¿Cuántas capas tiene el modelo OSI?", opts: ["5", "6", "7", "4"], ans: 2, explain: "OSI = 7 capas." },
    { q: "¿Qué capa se encarga del direccionamiento IP?", opts: ["Enlace", "Red", "Transporte", "Aplicación"], ans: 1, explain: "La capa de red gestiona direcciones IP y encaminamiento." },
    { q: "¿Qué protocolo garantiza entrega fiable y orientada a conexión?", opts: ["UDP", "ICMP", "TCP", "ARP"], ans: 2, explain: "TCP es orientado a conexión y fiable." },
    { q: "La PDU de la capa de enlace se llama:", opts: ["Trama", "Paquete", "Segmento", "Bit"], ans: 0, explain: "Enlace -> trama." },
    { q: "La PDU de la capa de transporte se llama:", opts: ["Trama", "Datagrama", "Segmento", "Frame"], ans: 2, explain: "Transporte -> segmento." },
    { q: "En el modelo TCP/IP, cuántas capas hay (modelo clásico simplificado)?", opts: ["4", "5", "6", "7"], ans: 0, explain: "TCP/IP clásico: acceso a red, internet, transporte, aplicación = 4." },
    { q: "¿Qué hace la capa de presentación?", opts: ["Encaminar paquetes", "Comprimir y cifrar datos", "Control de enlace", "Acceso físico"], ans: 1, explain: "Presentación formatea, cifra y comprime datos." },
    { q: "¿Qué subcapa gestiona direccionamiento MAC y acceso al medio?", opts: ["LLC", "IP", "MAC (enlace)", "Transporte"], ans: 2, explain: "MAC = Media Access Control en capa enlace." },
    { q: "Protocolo que resuelve nombres de dominio a direcciones IP:", opts: ["DHCP", "DNS", "FTP", "SMTP"], ans: 1, explain: "DNS traduce nombres a IP." },
    { q: "Protocolo usado para enviar correo (envío):", opts: ["POP3", "IMAP", "SMTP", "HTTP"], ans: 2, explain: "SMTP envía correo." },
    { q: "¿Qué hace ARP?", opts: ["Encapsula datos", "Obtiene dirección MAC desde IP", "Rutea paquetes", "Encripta conexión"], ans: 1, explain: "ARP resuelve IP -> dirección MAC en la misma red." },
    { q: "¿En qué capa trabaja un router principalmente?", opts: ["Capa de aplicación", "Capa física", "Capa de red", "Capa de enlace"], ans: 2, explain: "Router opera en capa de red para encaminar paquetes." },
    { q: "¿En qué capa trabaja un switch (capa 2) principalmente?", opts: ["Red", "Física", "Enlace", "Aplicación"], ans: 2, explain: "Switch opera en enlace (MAC) para conmutación de tramas." },
    { q: "¿Qué protocolo es no orientado a conexión y rápido?", opts: ["TCP", "UDP", "FTP", "HTTP"], ans: 1, explain: "UDP no garantiza entrega pero es rápido." },
    { q: "¿Qué capa añade puertos (puntos de servicio) para dirigir a aplicaciones?", opts: ["Aplicación", "Transporte", "Red", "Enlace"], ans: 1, explain: "Transporte usa puertos (ej: 80 para HTTP sobre TCP)." },
    { q: "¿Qué estándar normaliza las capas física y enlace para LANs (ej: Ethernet)?", opts: ["IEEE 802", "ISO 9001", "RFC 791", "IEEE 1394"], ans: 0, explain: "IEEE 802 incluye Ethernet y WiFi." },
    { q: "¿Qué hace la encapsulación?", opts: ["Abrir sobres", "Añadir información de control a datos", "Borrar datos", "Enviar bits por cable"], ans: 1, explain: "Cada capa añade su control al bajar." },
    { q: "¿Qué es SDU en el contexto de PDU?", opts: ["Servicio de datos del nivel superior", "Segmento de datos único", "Protocolo de transporte", "Dirección física"], ans: 0, explain: "SDU = Service Data Unit = datos del nivel superior." },
    { q: "¿Qué es PCI en PDU?", opts: ["Payload de aplicación", "Información de control del protocolo", "MAC address", "IP address"], ans: 1, explain: "PCI = Protocol Control Information." },
    { q: "¿Qué protocolo informa sobre errores e información de red (ping usa esto)?", opts: ["ICMP", "ARP", "DNS", "FTP"], ans: 0, explain: "ICMP se usa para mensajes de control (Echo Request/Reply)." },
    { q: "¿Cuál es la principal diferencia entre OSI y TCP/IP?", opts: ["OSI es práctico y TCP/IP teórico", "OSI es modelo de referencia, TCP/IP es implementación práctica", "No hay diferencia", "TCP/IP tiene 7 capas"], ans: 1, explain: "OSI = modelo, TCP/IP = pila de protocolos implementada." },
    { q: "¿Qué hace la capa de sesión?", opts: ["Control de diálogos y puntos de sincronización", "Encriptación de bits", "Enrutamiento global", "Asignar IP"], ans: 0, explain: "Sesión controla diálogos y sincronización entre apps." },
    { q: "¿Qué hace la capa de transporte cuando divide datos en trozos?", opts: ["Encapsulación", "Segmentación", "Enrutamiento", "Compresión"], ans: 1, explain: "Segmentación divide mensajes grandes en segmentos." },
    { q: "¿Qué es DHCP?", opts: ["Protocolo para gestionar direcciones dinámicas", "Protocolo de enrutamiento", "Capa física", "Servicio de correo"], ans: 0, explain: "DHCP asigna IP dinámicamente en una red." },
    { q: "¿Qué es una LAN?", opts: ["Red local que conecta equipos en área limitada", "Red global", "Tipo de protocolo", "Servicio de aplicación"], ans: 0, explain: "LAN = red local (oficina, casa, campus)." },
    { q: "¿Qué subcapa provee interfaz con niveles superiores en enlace?", opts: ["MAC", "LLC", "ARP", "IP"], ans: 1, explain: "LLC = Logical Link Control." },
    { q: "¿Qué mecanismo evita que muchas estaciones colisionen en un medio compartido?", opts: ["Control de acceso al medio", "DNS", "ICMP", "SMTP"], ans: 0, explain: "Control de acceso al medio (ej: CSMA/CD)." },
    { q: "¿Qué tarea realiza un router que no hace un switch básico?", opts: ["Transmitir bits", "Encaminar entre redes distintas", "Conmutar tramas dentro de la misma red", "Añadir padding"], ans: 1, explain: "Router conecta distintas redes y decide rutas." },
    { q: "¿Cuál de estos es ejemplo de protocolo de aplicación?", opts: ["IP", "TCP", "HTTP", "Ethernet"], ans: 2, explain: "HTTP es protocolo de aplicación." }
];

function mkQuiz() {
    const root = document.getElementById('quiz-area');
    root.innerHTML = '';
    preguntas.forEach((p, i) => {
        const card = document.createElement('div');
        card.className = 'card';
        const qtitle = document.createElement('div');
        qtitle.className = 'qtitle';
        qtitle.innerHTML = `<div class="qnum">Pregunta ${i + 1}</div>`;
        const qtext = document.createElement('div');
        qtext.className = 'question-text';
        qtext.textContent = p.q;
        card.appendChild(qtitle);
        card.appendChild(qtext);
        const opts = document.createElement('div');
        opts.className = 'options';
        p.opts.forEach((opt, j) => {
            const id = `q${i}_opt${j}`;
            const label = document.createElement('label');
            label.className = 'option';
            label.htmlFor = id;
            label.innerHTML = `<input type="radio" name="q${i}" id="${id}" value="${j}"> ${opt}`;
            opts.appendChild(label);
        });
        card.appendChild(opts);
        const feed = document.createElement('div');
        feed.className = 'per-question-feedback';
        feed.id = `fb${i}`;
        card.appendChild(feed);
        root.appendChild(card);
    });
}

function checkAnswers() {
    let correct = 0;
    preguntas.forEach((p, i) => {
        const els = document.getElementsByName(`q${i}`);
        let picked = -1;
        for (const e of els) if (e.checked) picked = parseInt(e.value);
        const fb = document.getElementById('fb' + i);
        if (picked === p.ans) {
            correct++;
            fb.innerHTML = `<span class="correct">Correcto</span> — ${p.explain}`;
        } else if (picked === -1) {
            fb.innerHTML = `<span class="wrong">Sin responder</span> — Respuesta: <strong>${p.opts[p.ans]}</strong>. ${p.explain}`;
        } else {
            fb.innerHTML = `<span class="wrong">Incorrecto</span> — Correcta: <strong>${p.opts[p.ans]}</strong>. ${p.explain}`;
        }
    });
    const summary = document.getElementById('summary');
    summary.style.display = 'block';
    const pct = Math.round((correct / preguntas.length) * 100);
    let grade = '';
    if (pct >= 90) grade = 'Excelente';
    else if (pct >= 75) grade = 'Bueno';
    else if (pct >= 50) grade = 'Suficiente';
    else grade = 'Insuficiente';
    summary.innerHTML = `<div><strong>Resultado:</strong> ${correct} / ${preguntas.length} (${pct}%). Nivel: <span class="${pct >= 50 ? 'correct' : 'wrong'}">${grade}</span></div>`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

document.getElementById('checkBtn').addEventListener('click', checkAnswers);
document.getElementById('resetBtn').addEventListener('click', () => {
    mkQuiz();
    document.getElementById('summary').style.display = 'none';
});
document.getElementById('showAnswers').addEventListener('click', () => {
    preguntas.forEach((p, i) => {
        document.getElementById('fb' + i).innerHTML = `respuesta: <strong>${p.opts[p.ans]}</strong>. ${p.explain}`;
    });
    document.getElementById('summary').style.display = 'block';
    document.getElementById('summary').innerHTML = '<strong>respuestas mostradas</strong>';
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

mkQuiz();