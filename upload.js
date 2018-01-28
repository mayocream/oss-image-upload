var button = document.querySelector('#button');
button.addEventListener('click', function() {
	var x = document.querySelector('#file').files[0];
	var msg = document.querySelector('#msg');
	if (typeof x == 'undefined') {
		msg.innerHTML = 'Please select a image.';
	} else if(!/image\/png|image\/gif|image\/jpeg/.test(x.type)) {
		msg.innerHTML = 'Please select a valid iamge.';
	} else {
		msg.innerHTML = null;
		console.log(x.name, x.size, x.type);
		// send request to our server
		xhr('GET', 'upload.php?name=' + encodeURIComponent(x.name) + '&size=' + x.size + '&type=' + encodeURIComponent(x.type)).then(function(response) {
			console.log(response);
			// send request to oss server
			ossUpload(response, x).then(function() {
				console.log('uploaded.');
				msg.innerHTML = 'Uploaded.';
			});
		});
	}
});

function xhr(type, url, formData = null) {
	return new Promise(function(resolve, reject) {
		var request = new XMLHttpRequest();
		request.open(type, url);
		request.responseType = 'json';
		request.onload = function() {
			if (request.status == 200 || request.status == 204) {
				resolve(request.response);
			} else {
				reject(Error('Failed.'));
			}
		};
		request.onerror = function() {
			reject(Error('Network error.'));
		};
		request.send(formData);
	});
}

function ossUpload(token, x) {
	var formData = new FormData();
	formData.append('OSSAccessKeyId', token.OSSAccessKeyId);
	formData.append('policy', token.policy);
	formData.append('Signature', token.signature);
	formData.append('key', x.name);
	formData.append('file', x);
	return xhr('POST', token.Bucket, formData);
}