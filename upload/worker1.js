// Worker脚本 (worker.js)
self.onmessage = async function(event) {
    const { chunks, startIndex } = event.data;
    try {
        // 使用Transferable Objects来提高效率
        const arrayBuffers = await Promise.all(chunks.map(blob => blob.arrayBuffer()));
        let totalLength = arrayBuffers.reduce((acc, buffer) => acc + buffer.byteLength, 0);
        let result = new Uint8Array(totalLength);
        let position = 0;

        arrayBuffers.forEach(buffer => {
            result.set(new Uint8Array(buffer), position);
            position += buffer.byteLength;
        });

        // 使用Transferable Objects发送结果
        self.postMessage({ index: startIndex, mergedChunk: result.buffer }, [result.buffer]);
    } catch (error) {
        console.error('Worker error:', error);
        self.postMessage({ error: true, message: error.message });
    }
};