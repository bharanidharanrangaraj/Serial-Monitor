# Serial Monitor

A professional, 100% client-side web-based serial monitor for embedded systems development. Connect to serial ports directly from your browser using the **Web Serial API**. Visualize data in real-time, decode protocols, and manage complex debugging workflows without any backend server.

![Version](https://img.shields.io/badge/version-v1.0.0-orange?style=flat)
![HTML5](https://img.shields.io/badge/html5-%23E34F26.svg?style=flat&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/css3-%231572B6.svg?style=flat&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=flat&logo=javascript&logoColor=%23F7DF1E)
![Web Serial API](https://img.shields.io/badge/Web_Serial_API-Browser-4285F4?style=flat&logo=googlechrome&logoColor=white)
![Zero Dependencies](https://img.shields.io/badge/dependencies-0-success?style=flat)
![License](https://img.shields.io/badge/license-MIT-blue.svg?style=flat)

<p align="center">
  <img src="public/assets/Screenshot from 2026-02-23 23-09-40.png" alt="Serial Monitor Interface" width="100%">
</p>

## Features

- **Multi-Channel Connections** - Open multiple serial ports simultaneously in a tabbed interface.
- **Real-Time Terminal** - High-performance terminal with auto-scroll, timestamps, and regex search.
- **Live Data Plotter** - Visualize numeric data streams with auto-scaling charts.
- **Protocol Decoders** - Built-in Modbus RTU and SLIP decoders, with easily extensible frontend plugins.
- **Data Export** - Export logs in TXT, CSV, or JSON formats with optional filtering.
- **Send Modes** - Transmit data in ASCII, HEX, or Binary with optional auto-repeat.
- **Live Statistics** - Monitor RX/TX throughput, byte counts, line counts, errors, and uptime.
- **Dark Theme** - Elegant, professional dark mode UI.

## Prerequisites

- **A supported browser**: Google Chrome, Microsoft Edge, or Opera (Firefox/Safari do not support Web Serial API yet).
- **A serial device**: USB-to-UART adapter, Arduino, ESP32, Raspberry Pi Pico, etc.

## Getting Started

Since this is a fully static client-side application, you do not need Node.js, Python, or any other backend.

### Option 1: Live Demo 

1. Plug your device into your computer.
2. Open the webpage.
3. Click "Connect New Port" to authorize the browser to access your USB port.

### Option 2: Run Locally
You can run this locally using any simple HTTP server (browsers require `http://` or `https://` for Web Serial, not `file://`).

Using Python:
```bash
cd public
python3 -m http.server 8000
# Open http://localhost:8000 in Chrome
```

Using Node.js:
```bash
npx serve public
# Open http://localhost:3000 in Chrome
```

## Project Structure

```
Serial-Monitor/
├── README.md              # Project documentation
└── public/
    ├── index.html         # Main interface
    ├── css/               # Styling
    └── js/
        ├── serial-manager.js # Web Serial API wrapper
        ├── app.js            # Main frontend logic
        ├── terminal.js       # Advanced text rendering
        ├── plotter.js        # Canvas-based charting
        └── plugins/          # Protocol decoders
            ├── modbus-rtu.js
            └── slip-decoder.js
```

## Protocol Decoder Plugins

Serial Monitor supports custom protocol decoders explicitly built for the browser. 

To create a new decoder, create a `.js` file in `public/js/plugins/` and add the `<script>` tag to `index.html`.

**Plugin Format (`my-decoder.js`):**
```javascript
window.Plugins = window.Plugins || {};

window.Plugins['My Custom Decoder'] = {
    name: 'My Custom Decoder',
    description: 'Decodes custom protocol frames',
    
    // Process arriving raw data stream (Uint8Array)
    processRx(uint8ArrayData) {
        // ... logic ...
        return [{
            protocol: 'Custom',
            fields: { payloadHex: '...' },
            display: `[Custom] Message received`
        }];
    }
};
```

## Tech Stack

- **Frontend** - Vanilla HTML / CSS / JavaScript (No frameworks)
- **Hardware Comms** - standard [Web Serial API (`navigator.serial`)](https://developer.mozilla.org/en-US/docs/Web/API/Web_Serial_API)
- **Fonts** - [Inter](https://rsms.me/inter/) & [JetBrains Mono](https://www.jetbrains.com/lp/mono/)

## License

This project is licensed under the **MIT License**.
