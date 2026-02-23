/**
 * SLIP Decoder Plugin (RFC 1055) (Browser version)
 * Decodes SLIP-encoded frames from serial data (Uint8Array)
 */
const SLIP = {
    END: 0xC0,
    ESC: 0xDB,
    ESC_END: 0xDC,
    ESC_ESC: 0xDD
};

window.Plugins = window.Plugins || {};

window.Plugins['SLIP'] = {
    name: 'SLIP',
    description: 'Decodes SLIP (Serial Line Internet Protocol, RFC 1055) frames',

    processRx(data) {
        const decoded = this.decode(data);
        return decoded ? [decoded] : [];
    },

    /**
     * Decode SLIP frame
     * @param {Uint8Array} data - Raw data
     * @returns {Object|null}
     */
    decode(data) {
        // Look for SLIP END markers
        const startIdx = data.indexOf(SLIP.END);
        if (startIdx === -1) return null;

        // Find second END marker (or use end of buffer)
        let endIdx = data.indexOf(SLIP.END, startIdx + 1);
        if (endIdx === -1) endIdx = data.length;

        const encoded = data.slice(startIdx + 1, endIdx);
        if (encoded.length === 0) return null;

        // Decode SLIP escapes
        const decoded = [];
        let i = 0;
        while (i < encoded.length) {
            if (encoded[i] === SLIP.ESC) {
                i++;
                if (i >= encoded.length) break;
                if (encoded[i] === SLIP.ESC_END) {
                    decoded.push(SLIP.END);
                } else if (encoded[i] === SLIP.ESC_ESC) {
                    decoded.push(SLIP.ESC);
                } else {
                    decoded.push(encoded[i]);
                }
            } else {
                decoded.push(encoded[i]);
            }
            i++;
        }

        const decodedArr = new Uint8Array(decoded);
        const textDecoder = new TextDecoder('ascii');

        return {
            protocol: 'SLIP',
            fields: {
                encodedLength: encoded.length,
                decodedLength: decodedArr.length,
                decodedHex: Array.from(decodedArr).map(b => b.toString(16).padStart(2, '0')).join(''),
                decodedAscii: textDecoder.decode(decodedArr).replace(/[^\x20-\x7E]/g, '.'),
                escapedBytes: encoded.length - decoded.length
            },
            display: `[SLIP] ${decodedArr.length} bytes decoded (${encoded.length} encoded)`
        };
    }
};
