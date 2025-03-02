self.onmessage = async function(event) {
    try {
        const {
            file,
            start,
            end
        } = event.data;
        const slice = file.slice(start, end);
        const blob = new Blob([slice], {
            type: file.type
        });

        self.postMessage(blob);
    } catch (error) {
        console.error('Worker error:', error);
        self.postMessage({
            error: true,
            message: error.message
        });
    }
};