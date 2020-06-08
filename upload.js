const { Consumer } = require('sqs-consumer');
const AWS = require('aws-sdk');
const stream = require('stream');
const http = require('http')
const s3 = new AWS.S3();
const s3bucket = process.env.S3 || '';
const sqs_incoming = process.env.SQSINCOMING || '';
const sqs_outgoing = process.env.SQSOUTGOING || '';
const { Producer } = require('sqs-producer');
const crypto = require('crypto')

const uuidv4 = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

const sendMessage = (key, contentLength, currentTime, startTime, srcEtag, destEtag, integrity, msg, producer, percentage, txSpeed) => {
    var message = {
        key: key,
        currentTime: currentTime,
        percentage: percentage,
        startTime: startTime,
        srcEtag: srcEtag.replace(/"/g, ''),
        destEtag: destEtag.replace(/"/g, ''),
        contentLength: contentLength,
        integrity: integrity,
        msg: msg,
        txSpeed: txSpeed
    }
    producer.send([{
        id: uuidv4(),
        body: JSON.stringify(message),
    }]);
}

const uploadStream = ({ Bucket, Key }) => {
    const pass = new stream.PassThrough();
    return {
        writeStream: pass,
        promise: s3.upload({ Bucket, Key, Body: pass }).promise(),
    };
}

const processDownlod = (bucket, key, Url) => {
    let downloaded, update, estimatedTime, txSpeed, contentLength;
    downloaded = update = estimatedTime = txSpeed = contentLength =0;
    let currentTime = Math.round(new Date().getTime() / 1000);
    let destEtag, srcEtag ;
    let integrity = false;
    return new Promise(function (resolve, reject) {
        http.get(Url, function (response) {
            srcEtag = response.headers['etag'] || "";
            destEtag = "";
            contentLength = Number(response.headers['content-length']) || 0;
            var startTime = Math.round(new Date().getTime() / 1000);
            if (response.statusCode < 299) {
                contentLength = Number(response.headers['content-length']) || 0;
                const { writeStream, promise } = uploadStream({ Bucket: bucket, Key: key });
                response.pipe(writeStream);
                response.on('data', function (chunk) {
                    downloaded += chunk.length;
                    if (Math.floor(Math.floor((downloaded / contentLength) * 10) * 10) != update) {
                        currentTime = Math.round(new Date().getTime() / 1000);
                        update = (Math.floor((downloaded / contentLength) * 10) * 10)
                        estimatedTime = Math.floor((currentTime - startTime) / (update / 100))
                        txSpeed = Math.floor((downloaded * 8) / ((currentTime - startTime) * 1024 * 1024))
                        sendMessage(key, contentLength, currentTime, startTime, srcEtag, destEtag, integrity, "STATUS", producer, update, txSpeed)
                        console.log(`upload percentage: ${update}% , elapsedTime: ${currentTime - startTime}s, EstimatedTime: ${estimatedTime}, txSpeed:${txSpeed}Mbps`);
                    }
                })
                promise.then(done => {
                    s3.headObject({ Bucket: bucket, Key: key }, function (err, data) {
                        destEtag = data.ETag;
                        integrity = (destEtag == srcEtag)
                        console.log(`integrity test: ${(destEtag == srcEtag) ? "passed" : "falied"}`)
                        sendMessage(key, contentLength, currentTime, startTime, srcEtag, destEtag, integrity, "COMPLETED", producer, update, txSpeed)
                    })
                    resolve("COMPLETED")
                })
                    .catch(err => { reject("ERROR_UPLOAD_FAILED") })
            } else {
                reject("ERROR_FILE_NOT_FOUND")
            }
        });
    })
}

const producer = Producer.create({
    queueUrl: sqs_outgoing
});

const app = Consumer.create({
    queueUrl: sqs_incoming,
    batchSize: 1,
    handleMessage: async (message) => {
        try {
            const msg = JSON.parse(message.Body);
            console.log(`Incoming Job ${msg.key}`)
            var msg1 = await processDownlod(s3bucket, `${msg.key}`, msg.url)
        } catch (err) {
            sendMessage(key, contentLength, currentTime, startTime, srcEtag, destEtag, integrity, err, producer, update, txSpeed)
        }
    }
});

app.on('error', (err) => {
    console.error(err.message);
});

app.on('processing_error', (err) => {
    console.error(err.message);
});

app.start();


