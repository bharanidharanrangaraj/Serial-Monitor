# Serial Monitor

A professional, web-based serial monitor for embedded systems development. Connect to serial ports, visualize data in real-time, decode protocols, and manage complex debugging workflows, all from your browser.

![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js&logoColor=white)
![Platform](https://img.shields.io/badge/Platform-Linux%20%7C%20macOS%20%7C%20Windows-lightgrey)
![License](https://img.shields.io/badge/License-MIT-blue)

## Features

- **Multi-Channel Connections** - Open multiple serial ports simultaneously in a tabbed interface
- **Real-Time Terminal** - High-performance terminal with auto-scroll, timestamps, and search (regex supported)
- **Live Data Plotter** - Visualize numeric data streams with auto-scaling charts
- **Protocol Decoders** - Built-in Modbus RTU and SLIP decoders, with a plugin system for custom protocols
- **Command Macros** - Save and replay sequences of commands with configurable delays and repeat counts
- **Connection Profiles** - Save and load port configurations for quick setup
- **Data Export** - Export logs in TXT, CSV, or JSON formats with optional filtering
- **Send Modes** - Transmit data in ASCII, HEX, or Binary with optional auto-repeat
- **Live Statistics** - Monitor RX/TX throughput, byte counts, line counts, errors, and uptime
- **Dark / Light Theme** - Toggle between themes to suit your preference
- **Optional Authentication** - Protect the interface with username/password via environment variables
- **TLS / HTTPS Support** - Secure connections with your own SSL certificates
- **Graceful Shutdown** - Clean port release on exit or via a UI shutdown button


## Prerequisites

- [Node.js](https://nodejs.org/) v18 or later
- A serial device (USB-to-UART adapter, Arduino, ESP32, etc.)

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/bharanidharanrangaraj/Serial-Monitor.git
cd Serial-Monitor
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment (Optional)

Copy the example environment file and edit as needed:

```bash
cp .env.example .env
```

Available environment variables:

| Variable       | Default     | Description                             |
| -------------- | ----------- | --------------------------------------- |
| `PORT`         | `3000`      | HTTP server port                        |
| `AUTH_ENABLED` | `false`     | Enable basic authentication             |
| `AUTH_USER`    | `admin`     | Username (when auth is enabled)         |
| `AUTH_PASS`    | `changeme`  | Password (when auth is enabled)         |
| `TLS_ENABLED`  | `false`     | Enable HTTPS                            |
| `TLS_CERT`     |             | Path to TLS certificate file            |
| `TLS_KEY`      |             | Path to TLS private key file            |

### 4. Start the Server

```bash
npm start
```

Open your browser and navigate to **http://localhost:3000**.

#### Demo Mode (No Hardware Required)

```bash
npm run dev
```

Launches the server with the `--demo` flag for UI-only testing without a physical serial device.

## Project Structure

```
Serial-Monitor/
├── server.js              # Entry point - Express + WebSocket server
├── src/
│   ├── serial-manager.js  # Multi-connection serial port manager
│   ├── ws-handler.js      # WebSocket message handler
│   ├── api-routes.js      # REST API endpoints
│   ├── auth-middleware.js  # Optional basic auth middleware
│   ├── export-engine.js   # Log export (TXT / CSV / JSON)
│   ├── macro-engine.js    # Command macro system
│   ├── profile-manager.js # Connection profile storage
│   └── plugin-loader.js   # Protocol decoder plugin loader
├── public/
│   ├── index.html         # Single-page application
│   ├── css/styles.css     # UI styles (dark/light themes)
│   └── js/                # Frontend modules
│       ├── app.js         # Main application logic
│       ├── terminal.js    # Terminal rendering
│       ├── plotter.js     # Live data plotter
│       ├── search.js      # Log search functionality
│       ├── stats.js       # Statistics panel
│       ├── macros.js      # Macro UI
│       ├── export.js      # Export UI
│       ├── profiles.js    # Profiles UI
│       ├── protocol-viewer.js # Protocol decoder UI
│       └── theme.js       # Theme toggle
├── plugins/               # Protocol decoder plugins
│   ├── modbus-decoder.js  # Modbus RTU decoder
│   ├── slip-decoder.js    # SLIP protocol decoder
│   └── example-decoder.js # Template for custom decoders
├── data/                  # Runtime data storage (profiles, etc.)
├── .env.example           # Environment variable template
└── package.json
```

## Protocol Decoder Plugins

Serial Monitor supports custom protocol decoders via a plugin system. Plugins are JavaScript modules placed in the `plugins/` directory.

### Built-in Decoders

| Decoder      | Description                                |
| ------------ | ------------------------------------------ |
| Modbus RTU   | Decodes Modbus RTU frames with CRC validation |
| SLIP         | Decodes RFC 1055 SLIP-encoded packets      |

### Writing a Custom Decoder

Create a new `.js` file in the `plugins/` directory:

```javascript
module.exports = {
    name: 'My Protocol',
    description: 'Decodes my custom protocol',

    decode(data) {
        // Return decoded frame object or null if data doesn't match
        if (!Buffer.isBuffer(data)) data = Buffer.from(data);
        if (data.length < 2) return null;

        return {
            protocol: 'My Protocol',
            fields: {
                // Parsed fields
            },
            display: '[MyProto] Summary text'
        };
    }
};
```


## API Reference

All REST endpoints are prefixed with `/api`.

| Method   | Endpoint              | Description                    |
| -------- | --------------------- | ------------------------------ |
| `GET`    | `/api/ports`          | List available serial ports    |
| `POST`   | `/api/connect`        | Connect to a serial port       |
| `POST`   | `/api/disconnect`     | Disconnect from a serial port  |
| `GET`    | `/api/status`         | Get connection status & stats  |
| `POST`   | `/api/clear`          | Clear the terminal buffer      |
| `POST`   | `/api/export`         | Export logs (TXT / CSV / JSON) |
| `GET`    | `/api/plugins`        | List loaded protocol decoders  |

A **WebSocket** endpoint is available at `/ws` for real-time serial data streaming.


## Tech Stack

- **Backend** - [Node.js](https://nodejs.org/), [Express](https://expressjs.com/), [ws](https://github.com/websockets/ws), [serialport](https://serialport.io/)
- **Frontend** - Vanilla HTML / CSS / JavaScript (no frameworks)
- **Fonts** - [Inter](https://rsms.me/inter/) & [JetBrains Mono](https://www.jetbrains.com/lp/mono/)


## License

This project is licensed under the **MIT License**.
