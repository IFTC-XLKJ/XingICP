const fileInput = document.getElementById('fileInput');
const progressBar = document.getElementById('progressBar');
const status = document.getElementById('status');

let workers = [];
let blobList = [];
let totalChunks = 0;
let completedChunks = 0;

fileInput.addEventListener('change', async(event) => {
    const file = event.target.files[0];
    if (!file) return;

    const chunkSize = 1 * 1024; // 每个块1KB
    const numWorkers = 20;
    const fileSize = file.size;

    // Reset state for new file
    resetState();

    // Initialize and start workers
    for (let i = 0; i < numWorkers; i++) {
        workers[i] = new Worker("worker.js");
        workers[i].addEventListener('message', handleWorkerMessage);
    }

    // Distribute chunks to workers
    distributeTasks(file, chunkSize);

    function resetState() {
        workers.forEach(worker => worker.terminate());
        workers = [];
        blobList = [];
        totalChunks = Math.ceil(fileSize / chunkSize);
        completedChunks = 0;
        progressBar.value = 0;
        status.textContent = '';
    }

    function distributeTasks(file, chunkSize) {
        let start = 0;
        while (start < fileSize) {
            const end = Math.min(start + chunkSize, fileSize);
            const workerIndex = completedChunks % numWorkers;
            workers[workerIndex].postMessage({
                file,
                start,
                end
            });
            start = end;
        }
    }

    async function handleWorkerMessage(event) {
        const blob = event.data;
        blobList.push(blob);

        completedChunks++;
        updateProgress();

        if (completedChunks === totalChunks) {
            console.log('所有切片已收集:', blobList);
            status.textContent = '文件切片完成！';
            await new Promise(resolve => setTimeout(resolve, 1000))
            console.log("开始合并")
                // 假设blobList是一个包含了所有切片的Blob对象数组
            mergeBlobsWithWorkers(blobList, 4, 50).catch(error => {
                console.error('无法合并文件:', error);
            });
        }
    }

    function updateProgress() {
        const progress = (completedChunks / totalChunks) * 100;
        progressBar.value = progress;
    }
});

// 主线程代码 (main.js)
async function mergeBlobsWithWorkers(blobList, numWorkers = 4, batchSize = 50) {
    let workers = [];
    let batchPromises = Array(Math.ceil(blobList.length / batchSize)).fill(null);
    let batches = [];

    // 初始化Workers
    for (let i = 0; i < numWorkers; i++) {
        workers[i] = new Worker('./worker1.js');
        workers[i].addEventListener('message', handleWorkerMessage);
    }

    // 分配任务给Workers
    function distributeTasks() {
        for (let i = 0; i < blobList.length; i += batchSize) {
            const batchIndex = Math.floor(i / batchSize);
            const batch = blobList.slice(i, i + batchSize);
            batches[batchIndex] = batch;

            const workerIndex = i % numWorkers;
            workers[workerIndex].postMessage({ chunks: batch, startIndex: batchIndex });
        }
    }

    // 处理Worker消息
    function handleWorkerMessage(event) {
        if (event.data.error) {
            console.error('Worker encountered an error:', event.data.message);
            return;
        }

        const { index, mergedChunk } = event.data;
        batchPromises[index] = new Blob([mergedChunk], { type: 'application/octet-stream' });

        // 检查是否所有批次都已经完成
        if (!batchPromises.includes(null)) {
            // 所有批次已完成，合并最终结果
            finalMerge();
        }
    }

    // 最终合并所有批次的结果
    async function finalMerge() {
        // 序列化合并以避免一次性加载过多数据到内存中
        let finalBlob = await mergeBlobsSequentially(batchPromises);

        console.log('文件已成功合并:', finalBlob);

        // 清理Workers
        workers.forEach(worker => worker.terminate());
        workers = null;

        // 如果你想下载合并后的文件，可以这样做：
        const url = URL.createObjectURL(finalBlob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = 'merged-file.ext'; // 替换为实际的文件扩展名
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
    }

    // 序列化合并以避免一次性加载过多数据到内存中
    async function mergeBlobsSequentially(blobs) {
        let mergedBlob = blobs[0];
        for (let i = 1; i < blobs.length; i++) {
            const chunk = await blobs[i].arrayBuffer();
            const mergedArray = new Uint8Array(mergedBlob.size + chunk.byteLength);
            const mergedBlobArray = await mergedBlob.arrayBuffer();
            mergedArray.set(new Uint8Array(mergedBlobArray));
            mergedArray.set(new Uint8Array(chunk), mergedBlob.size);
            mergedBlob = new Blob([mergedArray.buffer], { type: 'application/octet-stream' });
        }
        return mergedBlob;
    }

    // 开始任务分配
    distributeTasks();
}