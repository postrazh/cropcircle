"use strict";

// Class definition
var KTTypeahead = function () {

    // Private functions
    var validator;

    var initTypeahead = function () {
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

        $('#kt_typeahead_view').typeahead({
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
            validator.resetForm();

            // Submit on enter
            if (e.keyCode == 13) {
                $('#kt_typeahead_view').typeahead('close');
                search();
            }

        });
    }

    var _initValidation = function () {
        // Validation Rules
        validator = FormValidation.formValidation(
            document.getElementById('kt_form'),
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
    }

    var initSearch = function () {
        $('#btn_search').on('click', function () {
            search();
        })

    }

    var search = function () {
        validator.revalidateField('typeahead');

        var keyword = $('#kt_typeahead_view').val();
        console.log('search : ', keyword);

        // params: {
        //     query: $('#kt_typeahead_view').val()
        // }
        var datatable = $('#kt_datatable').KTDatatable();

        datatable.setDataSourceParam('query', $('#kt_typeahead_view').val());

        datatable.reload();

        // $('#kt_datatable').KTDatatable().sort('study_code_id', 'desc');
        // $('#kt_datatable').KTDatatable().search('', 'study_code_id');
    }

    return {
        // public functions
        init: function () {
            initTypeahead();
            _initValidation();
            initSearch();
        }
    };
}();

// Class definition
var KTDatatableJsonRemoteDemo = function () {
    // Private functions

    // basic demo
    var initDatatable = function () {
        var datatable = $('#kt_datatable').KTDatatable({
            // datasource definition
            data: {
                type: 'remote',
                // source: HOST_URL + '/api/?file=datatables/datasource/default.json',
                source: {
                    read: {
                        url: '../api/search',
                        method: 'GET',
                    },
                },
                pageSize: 10,
            },

            // search: {
            //     input: $('#kt_typeahead_view')
            // },

            // layout definition
            layout: {
                scroll: false, // enable/disable datatable scroll both horizontal and vertical when needed.
                footer: false // display/hide footer
            },

            // column sorting
            sortable: true,

            pagination: true,

            // search: {
            //     input: $('#kt_datatable_search_query'),
            //     key: 'generalSearch'
            // },

            // columns definition
            columns: [{
                field: 'field_testing_id',
                title: 'Field Testing Id',
                width: 100,
            }, {
                field: 'study_code_id',
                title: 'Study Code Id',
                width: 100,
            }, {
                field: 'category_code_id',
                title: 'Category Code Id',
                width: 100,
            }, {
                field: 'field_year',
                title: 'Field Year',
                width: 100,
            }, {
                field: 'tpt_id_key',
                title: 'Tpt Id Key',
            },]

        });

        $('#kt_datatable_search_status').on('change', function () {
            datatable.search($(this).val().toLowerCase(), 'Status');
        });

        $('#kt_datatable_search_type').on('change', function () {
            datatable.search($(this).val().toLowerCase(), 'Type');
        });

        $('#kt_datatable_search_status, #kt_datatable_search_type').selectpicker();
    };

    return {
        // public functions
        init: function () {
            initDatatable();
        }
    };
}();

jQuery(document).ready(function () {
    KTTypeahead.init();
    KTDatatableJsonRemoteDemo.init();
});
