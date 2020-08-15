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
                this.on("addedfile", addCardItem);
            }
        });

    }

    const addCardItem = function (file) {
        // console.log('file: ', file);

        var $cardsWrapper = $('.cards-wrapper');
        var $cardItem = $cardsWrapper.find('.card-item#card-item-first').clone().attr('id', '').css('display', '');

        var $fileName = $cardItem.find('.file-name');
        $fileName.text(file.name);

        var $fileStatus = $cardItem.find('.file-status');
        $fileStatus.html('<span class="label label-lg label-light-dark label-inline">Not Uploaded</span>');

        var $addBtn = $cardItem.find('.btn-add');

        $addBtn.on('click', () => addKeywordItem($cardItem));

        // Append item
        $cardsWrapper.append($cardItem);

        addKeywordItem($cardItem);
    };

    const addKeywordItem = function ($cardItem) {
            console.log('Add keyword row');

            var $keywordsWrapper = $cardItem.find('.keywords-wrapper');
            var $keywordItem = $keywordsWrapper.find('.keyword-item#keyword-item-first').clone().attr('id', '').css('display', '');

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