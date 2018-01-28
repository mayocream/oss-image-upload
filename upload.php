<?php

header('Content-type:application/json;charset=utf-8');

$OSSAccessKeyId = 'your-keyid';
$OSSAccessKeySecret = 'your-keysecert';
$Bucket = 'https://your-bucket.aliyuncs.com';
// $callbackUrl = "http://oss-demo.aliyuncs.com:23450";

// $callback_param = [
//     'callbackUrl' => $callbackUrl,
//     'callbackBody' => 'filename=${object}&size=${size}&mimeType=${mimeType}&height=${imageInfo.height}&width=${imageInfo.width}',
//     'callbackBodyType' => 'application/x-www-form-urlencoded'
// ];

$policy = [
    'expiration' => substr(gmdate('c', strtotime('+10 minute')), 0, 19).'.000Z',
    'conditions' => [
        ['content-length-range', 1, 1048576],
        ['eq', '$key', $_GET['name']]
    ]
];

$signature = base64_encode(hash_hmac('sha1', base64_encode(json_encode($policy)), $OSSAccessKeySecret, true));

$response = [
    'OSSAccessKeyId' => $OSSAccessKeyId,
    'Bucket' => $Bucket,
    'policy' => base64_encode(json_encode($policy)),
    'signature' => $signature
];

echo json_encode($response);