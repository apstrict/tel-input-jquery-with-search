'use strict'

// Wait until the document is ready
$( document ).ready(function() {

    // Define used variables
    let input = document.querySelector("#phone"),
        inputNode = document.createElement("input"),
        keyPresses = '',
        resetInputValue = false;

    function Init() {
        // init plugin
        let iti = window.intlTelInput(input, {
            separateDialCode: true,
            // Encapsulate dropdown list along with search input in a parent div
            utilsScript: "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.19/js/utils.js" // just for formatting/placeholders etc
        });
    }

    function CreateNodes() {
        // Create search input field
        inputNode.className = 'form-control';
        inputNode.id = 'search-country';
        inputNode.placeholder = 'Search Country'
        document.querySelector('.iti__flag-container').insertBefore(inputNode, document.querySelector('.iti__country-list'));
    }

    function DropDownBehavior() {
        let selectedFlag = document.querySelector('.iti__selected-flag');

        selectedFlag.addEventListener('click',() => {
            $('.iti__country-list').show()
            $('#search-country').toggle()
            inputNode.focus()
        })

        document.addEventListener('click', (event) => {
            if ( !$(event.target).closest( ".iti" ).length ) {
                $('.iti__country-list').hide()
                inputNode.style.display = 'none';
            }
        })

        inputNode.addEventListener('click', (event) => {
            event.stopPropagation()
            $('.iti__country-list').show()
        })

        document.querySelectorAll(".iti__country-list li").forEach(el => {
            el.addEventListener('click', () => {
                $('#search-country').val('').hide()
                resetInputValue = true;
                document.querySelectorAll(".iti__country-list li").forEach(el => { el.style.display = 'block'; })
                $('.iti__country-list').hide()
            })
        })
    }

    function HandleKeyBoardInput(event) {
        if(resetInputValue) {
            resetInputValue = false
            keyPresses = ''
        }

        if(event.type === 'keydown') {
            if (event.keyCode >= 65 && event.keyCode <= 90) {
                keyPresses = keyPresses.concat(event.key);
                inputNode.value = keyPresses;
            }

            if (event.keyCode === 8) {
                keyPresses = keyPresses.slice(0, keyPresses.length - 1);
                inputNode.value = keyPresses;
            }
        }
    }

    function HandleSearch() {
        // listen to the address dropdown for changes
        $('#search-country').bind('change keydown keyup', function (event) {
            let countryFields = document.querySelectorAll(".iti__country-list li"),
                itiContainer = document.querySelector('.iti'),
                countryField_old = countryFields,
                value = inputNode.value,
                countryData = window.intlTelInputGlobals.getCountryData();

            // Handle keyboard input
            if(itiContainer) HandleKeyBoardInput(event, resetInputValue);

            if (value.length !== 0) {
                countryField_old.forEach(el => { el.style.display = 'block'; })

                // Search with country Name || ISO2
                countryData = countryData.filter(el => { return el.name.startsWith(value.charAt(0).toUpperCase() + value.slice(1)) || el.iso2 === value })

                if (countryData.length !== 0) {
                    countryFields = [...countryFields].filter((item, index) => {
                        return [...countryData].some(el => {
                            return el.iso2 === item.getAttribute('data-country-code');
                        })
                    })
                }
            }

            countryField_old.forEach(el => el.style.display = 'none');
            countryFields.forEach(el => el.style.display = 'block');
        });
    }

    function __main__() {
        Init();
        CreateNodes();
        DropDownBehavior();
        HandleSearch();
    }

    // Load All functions
    __main__();
});
