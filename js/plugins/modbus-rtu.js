/**
 * Modbus RTU Decoder Plugin (Browser version)
 * Decodes Modbus RTU frames from raw serial data (Uint8Array)
 */
window.Plugins = window.Plugins || {};

window.Plugins['Modbus RTU'] = {
    name: 'Modbus RTU',
    description: 'Decodes Modbus RTU protocol frames (function codes, addresses, CRC)',

    /**
     * Process incoming raw data stream.
     * Unlike the backend, we get fragments. For Modbus, we usually need an RTU framing
     * mechanism (delay based), but for simple decoding we try to parse the current buffer.
     * @param {Uint8Array} data - Raw data buffer
     * @returns {Array} Array of decoded frame objects
     */
    processRx(data) {
        const decoded = this.decode(data);
        return decoded ? [decoded] : [];
    },

    /**
     * Attempt to decode a Modbus RTU frame
     * @param {Uint8Array} data
     * @returns {Object|null} Decoded frame or null
     */
    decode(data) {
        if (data.length < 4) return null;

        const slaveAddr = data[0];
        const funcCode = data[1];

        // DataView is safer for parsing multi-byte in browser
        const view = new DataView(data.buffer, data.byteOffset, data.byteLength);
        const crcReceived = view.getUint16(data.length - 2, true); // true = little-endian
        const crcCalculated = this._crc16(data.slice(0, data.length - 2));
        const crcValid = crcReceived === crcCalculated;

        const functionNames = {
            0x01: 'Read Coils',
            0x02: 'Read Discrete Inputs',
            0x03: 'Read Holding Registers',
            0x04: 'Read Input Registers',
            0x05: 'Write Single Coil',
            0x06: 'Write Single Register',
            0x0F: 'Write Multiple Coils',
            0x10: 'Write Multiple Registers',
            0x17: 'Read/Write Multiple Registers'
        };

        const isException = (funcCode & 0x80) !== 0;
        const baseFuncCode = isException ? (funcCode & 0x7F) : funcCode;

        if (!functionNames[baseFuncCode] && !isException) return null;

        const payload = data.slice(2, data.length - 2);

        return {
            protocol: 'Modbus RTU',
            fields: {
                slaveAddress: slaveAddr,
                functionCode: `0x${funcCode.toString(16).padStart(2, '0')}`,
                functionName: isException ? `Exception (${functionNames[baseFuncCode] || 'Unknown'})` : (functionNames[funcCode] || 'Unknown'),
                isException,
                payload: this._toHex(payload),
                payloadLength: payload.length,
                crcReceived: `0x${crcReceived.toString(16).padStart(4, '0')}`,
                crcValid
            },
            display: `[Modbus] Slave:${slaveAddr} Func:${functionNames[baseFuncCode] || '0x' + baseFuncCode.toString(16)} ${isException ? 'EXCEPTION' : ''} CRC:${crcValid ? 'OK' : 'FAIL'}`
        };
    },

    _toHex(uint8arr) {
        return Array.from(uint8arr).map(b => b.toString(16).padStart(2, '0')).join('');
    },

    /**
     * CRC-16/Modbus
     */
    _crc16(buffer) {
        let crc = 0xFFFF;
        for (let i = 0; i < buffer.length; i++) {
            crc ^= buffer[i];
            for (let j = 0; j < 8; j++) {
                if (crc & 1) {
                    crc = (crc >> 1) ^ 0xA001;
                } else {
                    crc >>= 1;
                }
            }
        }
        return crc;
    }
};
