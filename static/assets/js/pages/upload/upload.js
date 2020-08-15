"use strict";

<!--begin:File Upload-->
// Class definition
var KTDropzoneDemo = function () {
    // Private functions
    var initDropzone = function () {
        // multiple file upload
        $('#kt_dropzone_2').dropzone({
            url: "https://ennpzz6e0mxll.x.pipedream.net", // Set the url for your upload script location
            paramName: "file", // The name that will be used to transfer the file
            maxFiles: 10,
            maxFilesize: 100, // MB
            // addRemoveLinks: true,
            acceptedFiles: ".csv",
            autoProcessQueue: false,

            init: function () {
                this.on("addedfile", addCardItem);
                this.on("sending", function (file, xhr, formData) {
                    // console.log(file.name);
                    // Find keyword rows by filltering with file name
                    var $keywords = $(`.keyword-item[file-name="${file.name}"]`);

                    var trial = $keywords.find('.typeahead-trial.tt-input').map(function () {
                        return $(this).val();
                    }).get();
                    // console.log(trial);
                    formData.append('trial', trial);

                    var lat1 = $keywords.find('.input-lat-1').map(function () {
                        return $(this).val();
                    }).get();
                    formData.append('lat1', lat1);

                    var lng1 = $keywords.find('.input-lng-1').map(function () {
                        return $(this).val();
                    }).get();
                    formData.append('lng1', lng1);

                    var lat2 = $keywords.find('.input-lat-2').map(function () {
                        return $(this).val();
                    }).get();
                    formData.append('lat2', lat2);

                    var lng2 = $keywords.find('.input-lng-2').map(function () {
                        return $(this).val();
                    }).get();
                    formData.append('lng2', lng2);

                    var lat3 = $keywords.find('.input-lat-3').map(function () {
                        return $(this).val();
                    }).get();
                    formData.append('lat3', lat3);

                    var lng3 = $keywords.find('.input-lng-3').map(function () {
                        return $(this).val();
                    }).get();
                    formData.append('lng3', lng3);

                    var lat4 = $keywords.find('.input-lat-4').map(function () {
                        return $(this).val();
                    }).get();
                    formData.append('lat4', lat4);

                    var lng4 = $keywords.find('.input-lng-4').map(function () {
                        return $(this).val();
                    }).get();
                    formData.append('lng4', lng4);
                });

                var dropZone = this;

                $('#btn-submit').on('click', function () {
                    dropZone.processQueue();
                });
            }
        });


    }

    const addCardItem = function (file) {
        // Check file extension
        if (file.name.slice(-3).toLowerCase() != "csv") {
            this.removeFile(file);
            return;
        }

        // Prevent duplicated file uploading
        if (this.files.length) {
            let _i, _len;
            for (_i = 0, _len = this.files.length; _i < _len - 1; _i++) // -1 to exclude current file
            {
                if (this.files[_i].name === file.name && this.files[_i].size === file.size && this.files[_i].lastModifiedDate.toString() === file.lastModifiedDate.toString()) {
                    this.removeFile(file);
                    return;
                }
            }
        }

        // console.log('file: ', file);

        var $cardsWrapper = $('.cards-wrapper');
        var $cardItem = $cardsWrapper.find('.card-item#card-item-first').clone().attr('id', '').css('display', '');

        var $fileName = $cardItem.find('.file-name');
        $fileName.text(file.name);

        var $fileStatus = $cardItem.find('.file-status');
        $fileStatus.html('<span class="label label-lg label-light-dark label-inline">Not Uploaded</span>');

        var $addBtn = $cardItem.find('.btn-add');

        var fileName = file.name;

        $addBtn.on('click', () => addKeywordItem($cardItem, fileName));

        // Append item
        $cardsWrapper.append($cardItem);

        addKeywordItem($cardItem, fileName);
    };

    const addKeywordItem = function ($cardItem, fileName) {
        console.log('Add keyword row');

        var $keywordsWrapper = $cardItem.find('.keywords-wrapper');
        var $keywordItem = $keywordsWrapper.find('.keyword-item#keyword-item-first').clone().attr('id', '').css('display', '');

        // Save file name
        $keywordItem.attr('file-name', fileName);

        var $btnRemove = $keywordItem.find('.btn-remove');
        $btnRemove.on('click', function () {
            $keywordItem.remove();
        });

        // Append item
        $keywordsWrapper.append($keywordItem);

        // Init typeahead
        var $typeheadItem = $keywordItem.find('.typeahead-trial');
        KTTypeahead.init($typeheadItem);
    }


    return {
        // public functions
        init: function () {
            initDropzone();

            // Test
            // addCardItem({name: 'testfile.docx'});
        }
    };
}();
<!--end:File Upload-->

// Class definition
var KTTypeahead = function () {

    var initTypeahead = function ($typeheadItem) {
        var validator;

        // constructs the suggestion engine
        var bloodhound = new Bloodhound({
            datumTokenizer: Bloodhound.tokenizers.whitespace,
            queryTokenizer: Bloodhound.tokenizers.whitespace,
            // `states` is an array of state names defined in \"The Basics\"
            remote: {
                url: '../api/keywords?input=%QUERY',
                wildcard: '%QUERY'
            }
        });

        $typeheadItem.typeahead({
            hint: true,
            highlight: true,
            minLength: 0,
        }, {
            name: 'value',
            limit: Infinity,
            // source: function (query, syncResults, asyncResults) {
            //     $.get('../api/search?input=' + query, function (data) {
            //         asyncResults(data);
            //     });
            // },

            source: bloodhound
        }).on('keyup', function (e) {
            // Clear validation error
            if (validator)
                validator.resetForm();
        }).blur(function () {
            if (validator)
                validator.revalidateField('typeahead');
        });

        // Init validation
        validator = _initValidation($typeheadItem);
    }

    var _initValidation = function ($typeheadItem) {
        var $form = $typeheadItem.closest('form');
        // Validation Rules
        var validator = FormValidation.formValidation(
            $form.get(0),
            {
                fields: {
                    typeahead: {
                        validators: {
                            remote: {
                                message: 'Please enter a valid Trial Id',
                                method: 'GET',
                                url: '../api/validate'
                            }
                        }
                    },
                },

                plugins: {
                    // trigger: new FormValidation.plugins.Trigger(),

                    // Validate fields when clicking the Submit button
                    submitButton: new FormValidation.plugins.SubmitButton(),
                    // Submit the form when all fields are valid
                    defaultSubmit: new FormValidation.plugins.DefaultSubmit(),
                    // Bootstrap Framework Integration
                    bootstrap: new FormValidation.plugins.Bootstrap({
                        eleInvalidClass: '',
                        eleValidClass: '',
                    })
                }
            }
        );

        return validator;
    }

    return {
        // public functions
        init: function ($typeheadItem) {
            initTypeahead($typeheadItem);
        }
    };
}();


KTUtil.ready(function () {
    KTDropzoneDemo.init();
});