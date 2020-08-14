"use strict";

<!--begin:File Upload-->
// Class definition
var KTDropzoneDemo = function () {
    // Private functions
    const initDropzone = function () {
        // multiple file upload
        $('#kt_dropzone_2').dropzone({
            url: "https://keenthemes.com/scripts/void.php", // Set the url for your upload script location
            paramName: "file", // The name that will be used to transfer the file
            maxFiles: 10,
            maxFilesize: 10, // MB
            // addRemoveLinks: true,
            autoQueue: false,
            init: function () {
                this.on("addedfile", onAddedfile);
            }
        });

    }

    const onAddedfile = function (file) {
        // console.log('file: ', file);

        var $filesWrapper = $('.files-wrapper');
        var $fileItem = $('.files-wrapper .file-item#file-item-first').clone().attr('id', '').css('display', '');
        var $selectItem = $fileItem.find('.form-control.select2');
        var $fileName = $fileItem.find('.file-name');
        var $progressBar = $fileItem.find('.progress-bar');
        $progressBar.removeClass('d-none');
        $progressBar.addClass('bg-success');

        $progressBar.removeClass('d-none');
        $progressBar.addClass('bg-danger');

        $fileName.text(file.name);

        $filesWrapper.append($fileItem);
        KTSelect2.init($selectItem);
    };


    return {
        // public functions
        init: function () {
            initDropzone();
        }
    };
}();
<!--end:File Upload-->


<!--begin:Multi Select-->
// Class definition
var KTSelect2 = function () {
    // Private functions
    var demos = function ($selectItem) {
        // multi select

        // loading data from array
        var data = [{
            id: 0,
            text: 'Enhancement'
        }, {
            id: 1,
            text: 'Bug'
        }, {
            id: 2,
            text: 'Duplicate'
        }, {
            id: 3,
            text: 'Invalid'
        }, {
            id: 4,
            text: 'Wontfix'
        }];

        $selectItem.select2({
            placeholder: "Select a value",
            data: data
        });

    }


    // Public functions
    return {
        init: function ($selectItem) {
            demos($selectItem);
        }
    };
}();
<!--end:Multi Select-->

KTUtil.ready(function () {
    KTDropzoneDemo.init();
});