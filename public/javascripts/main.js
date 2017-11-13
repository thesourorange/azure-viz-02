$(document).ready(function() {

    var dropzone = $('#droparea');
     
    dropzone.on('dragover', function() {
        //add hover class when drag over
        dropzone.addClass('hover');
        return false;
    });
     
    dropzone.on('dragleave', function() {
        //remove hover class when drag out
        dropzone.removeClass('hover');
        return false;
    });
     
    dropzone.on('drop', function(e) {
        //prevent browser from open the file when drop off
        e.stopPropagation();
        e.preventDefault();
        dropzone.removeClass('hover');
     
        //retrieve uploaded files data
        var files = e.originalEvent.dataTransfer.files;
        processFiles(files);
     
        return false;
    });

    var uploadBtn = $('#uploadbtn');
    var defaultUploadBtn = $('#upload');
     
    uploadBtn.on('click', function(e) {
        e.stopPropagation();
        e.preventDefault();
        //trigger default file upload button
        defaultUploadBtn.click();
    });
     
    defaultUploadBtn.on('change', function() {
        //retrieve selected uploaded files data

        var files = $(this)[0].files;
        processFiles(files);    
        return false;
    });

	var processFiles = function(files) {
 
		if(files && typeof FileReader !== "undefined") {
			//process each files only if browser is supported
			for(var iFile = 0; iFile<files.length; iFile++) {
				readFile(files[iFile]);
			}
		} else {
			
		}
    }
    
    var readFile = function(file) {
		if( (/image/i).test(file.type) ) {           
			var reader = new FileReader();

			//init reader onload event handlers
			reader.onload = function(e) {	
 
                $('#receiptImage').attr('src', reader.result);
                $('#receiptImage').css('width', '280px');
                $('#receiptImage').css('height', '380px');

                $('#ReceiptText').css('top', '-35px');
                $('#TessOCRText').css('top', '-35px');
  
                $('#tessLoader').css('display', 'block');

                setTimeout(callTessaract, 0, file);
                
           //     uploadToServer(reader.result, data2Blob(reader.result));
                
			};
			
			//begin reader read operation
			reader.readAsDataURL(file);
			            
		} else {
            alert(file.type);
            
			//some message for wrong file format
			$('#err').text('*Selected file format not supported!');
        }
        
    }
    
    function callTessaract(file) {
        
        try {
            Tesseract.recognize(file)
            .progress(function  (p) { 
             })
            .then(function (result) { 
                $('#tessLoader').css('display', 'none');             
                $('#tessResult').html(result.html);     
                $('#tessResult').css('overflow', 'auto');     
                $('#tessResult').css('height', '380px');     
            })
        } catch (e) {
            alert(e);
        }

    }

    /**
     * Convert Data to a Blob (base64 encoded)
     * 
     * @param {*} data 
     */
    function data2Blob(data) {       
        // convert base64 to raw binary data held in a string
        // doesn't handle URLEncoded DataURIs

        alert (data);

        var byteString;

        if (data.split(',')[0].indexOf('base64') >= 0) {
            byteString = atob(data.split(',')[1]);
        } else {
            byteString = unescape(data.split(',')[1]);
        }
        
        // separate out the mime component
        var mimeString = data.split(',')[0].split(':')[1].split(';')[0]
        
        // write the bytes of the string to an ArrayBuffer
        var ab = new ArrayBuffer(byteString.length);
        var ia = new Uint8Array(ab);
        
        for (var i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }
        
        //Passing an ArrayBuffer to the Blob constructor appears to be deprecated, 
        //so convert ArrayBuffer to DataView
        var dataView = new DataView(ab);
        var blob = new Blob([dataView], {type: mimeString});
     
        alert (blob);        

        return blob;
    
    }

	var uploadToServer = function(file, blob) {
		// prepare FormData
		var formData = new FormData();  
		//since new file doesn't contains original file data
		formData.append('filename', file.name);
		formData.append('filetype', file.type);
		formData.append('file', blob); 
					
		//submit formData using $.ajax			
		$.ajax({
			url: 'upload',
			type: 'POST',
			data: formData,
			processData: false,
			contentType: false,
			success: function(data) {
				console.log(data);
            }
            
        });	
        
	}

});