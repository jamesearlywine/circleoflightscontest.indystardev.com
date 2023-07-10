var W3CDOM = (document.createElement && document.getElementsByTagName);

function initFileUploads() {
	if (!W3CDOM) return;
	var fakeFileUpload = document.createElement('div');
	fakeFileUpload.className = 'fakefile';
	var input = document.createElement('input');
	input.className = 'input-textbox input-upload';
	fakeFileUpload.appendChild(input);
	var button = document.createElement('button');
    button.className = "button button-gray upload-browse";
    button.innerHTML = 'Browse...';
	fakeFileUpload.appendChild(button);
	var x = document.getElementsByTagName('input');
	for (var i=0;i<x.length;i++) {
		if (x[i].type != 'file') continue;
		if (x[i].parentNode.className.indexOf('fileinputs') === -1) continue;
		x[i].className = 'file hidden';
		var clone = fakeFileUpload.cloneNode(true);
		x[i].parentNode.appendChild(clone);
		x[i].relatedElement = clone.getElementsByTagName('input')[0];
		x[i].onchange = x[i].onmouseout = function () {
		    this.relatedElement.value = this.value.replace('C:\\fakepath\\', '');
		}
	}
}