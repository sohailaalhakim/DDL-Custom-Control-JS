const ddlControl = {


    initFunc: function (initParam) {
        if (typeof initParam !== 'object' || Object.keys(initParam).length === 0) {
            console.error('Error: Invalid or empty initParam object.');
            return;
        }
        const { id, data, additionalOptions, initText } = initParam;
        if (!id || typeof id !== 'string') {
            console.error('Error: Invalid or missing "id" property in initParam');
            return;
        }

        if (!Array.isArray(data) || data.length === 0) {
            console.error('Error: Invalid or empty "data" array in initParam');
            return;
        }

        if (typeof additionalOptions !== 'object' || Object.keys(additionalOptions).length === 0) {
            console.error('Error: Invalid or empty "additionalOptions" array in initParam');
            return;
        }

        const filteredData = data.map(function (option) {
            if (!option.hasOwnProperty('name') || typeof option.name !== 'string') {
                console.error('Error: Invalid or missing "name" property for option:', option);
                return;
            }

            const filteredOption = {
                name: option.name
            };

            if (option.hasOwnProperty('color') && typeof option.color === 'string') {
                filteredOption.color = option.color;
            }
            if (option.hasOwnProperty('children')) {
                console.log(option.children);
                console.log("has an array of children");
                filteredOption.children = option.children;
            }

            return filteredOption;
        }).filter(Boolean);

        const chosenOptions = {};

        if (initParam.additionalOptions.hasOwnProperty('hasSearch') && typeof initParam.additionalOptions.hasSearch === 'boolean') {
            chosenOptions.hasSearch = initParam.additionalOptions.hasSearch;
        }

        if (initParam.additionalOptions.hasOwnProperty('hasMultiSelect') && typeof initParam.additionalOptions.hasMultiSelect === 'boolean') {
            chosenOptions.hasMultiSelect = initParam.additionalOptions.hasMultiSelect;
        }

        if (initParam.additionalOptions.hasOwnProperty('hasTreeView') && typeof initParam.additionalOptions.hasTreeView === 'boolean') {
            chosenOptions.hasTreeView = initParam.additionalOptions.hasTreeView;
        }
        const filteredInitParam = {
            id: id,
            data: filteredData,
            additionalOptions: chosenOptions,
            initText: initText
        };
        ddlControl.DrawDDL(filteredInitParam);
    },

    DrawDDL: function (initParam) {
        const { id, data, initText, additionalOptions } = initParam;

        const targetElement = document.getElementById(id);
        if (!targetElement) {
            console.error('Error: Target element not found.');
            return;
        }

        // Create the dropdown structure
        const menuId = id + 'select-menu';
        console.log(menuId);
        const selectMenu = document.createElement('div');
        selectMenu.classList.add('select-menu');
        selectMenu.setAttribute('id', menuId);
        
        // Draw the header
        ddlControl.drawHeader(selectMenu, initText);

        // Draw the search input if true
        if (additionalOptions && additionalOptions.hasSearch) {
            console.log("Search option is true");
            ddlControl.drawSearch(selectMenu);
        }
        // Draw the tree view + multi select if both true
        if (additionalOptions && additionalOptions.hasTreeView && additionalOptions.hasMultiSelect) {
            ddlControl.drawMultiSelectWithTreeView(selectMenu, data);
            console.log("Tree view option with multi-select is true");
        }
        // Draw the multi select if true
        else if (additionalOptions && additionalOptions.hasMultiSelect) {
            selectMenu.setAttribute('data-has-multi-select', 'true');
            ddlControl.drawMultiSelect(selectMenu, data);
            console.log("Multi Select option is true");
        }
        // Draw the tree view if true
        else if (additionalOptions && additionalOptions.hasTreeView) {
            ddlControl.drawTreeOptions(selectMenu, data)
            console.log("Tree view option is true");
        }
        else {
            ddlControl.drawOptions(selectMenu, data);
        }
        targetElement.appendChild(selectMenu);

        let isOpen = false;
        const selectBtn = selectMenu.querySelector('.select-btn');
        const optionsList = selectMenu.querySelector('.options');
        let selectedOption;

    
        // Toggle the dropdown list
        selectBtn.addEventListener('click', function () {
            ddlControl.closeAllDropdowns();
            isOpen = !isOpen;
            optionsList.style.display = isOpen ? 'block' : 'none';
            selectBtn.classList.toggle('active', isOpen);
            selectMenu.classList.toggle('active', isOpen);
        });
        //click
        document.addEventListener('click', function (event) {
            const target = event.target;
            if (!target.closest('.select-menu')) {
              ddlControl. closeAllDropdowns();
            }
        });
        //selection
        const optionItems = optionsList.querySelectorAll('.option');
        optionItems.forEach(function (optionItem) {
            optionItem.addEventListener('click', function () {
                if (additionalOptions && additionalOptions.hasMultiSelect) {
                    ddlControl.handleCheckboxSelection(selectMenu);
                }
                else {
                    if (selectedOption) {
                        selectedOption.classList.remove('selected');
                    }
                    selectedOption = optionItem;
                    selectedOption.classList.add('selected');
                    const selectedOptionText = optionItem.querySelector('.option-text').textContent;
                    selectText.textContent = selectedOptionText;

                    //optionItem.classList.add('selected');
                    selectText.textContent = selectedOptionText;
                    optionsList.style.display = 'none';
                    isOpen = false;
                    selectBtn.classList.remove('active');
                    selectMenu.classList.remove('active');

                    console.log('Selected option:', selectedOptionText);
                }
            });
        });

        // Check if search functionality is true
        if (additionalOptions && additionalOptions.hasSearch) {
            ddlControl.addSearch(selectMenu);
        }
    },

    drawHeader: function (selectMenu, initText) {
        const selectBtn = document.createElement('div');
        selectBtn.classList.add('select-btn');

        selectText = document.createElement('span');
        selectText.classList.add('sBtn-text');
        selectText.setAttribute('init-text', initText);
        selectText.textContent = initText;

        const selectIcon = document.createElement('i');
        selectIcon.classList.add('bx', 'bx-chevron-down');
        selectBtn.appendChild(selectText);
        selectBtn.appendChild(selectIcon);

        selectMenu.appendChild(selectBtn);
    },

    drawOptions: function (selectMenu, data) {
        const optionsList = document.createElement('ul');
        optionsList.classList.add('options');
        optionsList.classList.add('scrollable');

        // Add options to the dropdown
        data.forEach(function (option) {
            const optionItem = document.createElement('li');
            optionItem.classList.add('option');

            const optionBadge = document.createElement('span');
            optionBadge.classList.add('option-badge');
            optionBadge.style.backgroundColor = option.color;

            const optionText = document.createElement('span');
            optionText.classList.add('option-text');
            optionText.textContent = option.name;

            optionItem.appendChild(optionBadge);
            optionItem.appendChild(optionText);

            optionsList.appendChild(optionItem);
        });

        selectMenu.appendChild(optionsList);
    },

    drawSearch: function (selectMenu) {
        const searchContainer = document.createElement('div');
        searchContainer.classList.add('search-container');

        //const searchIcon = document.createElement('i');
        //searchIcon.classList.add('bx', 'bx-search');

        const searchInput = document.createElement('input');
        searchInput.setAttribute('type', 'text');
        searchInput.setAttribute('placeholder', 'بحث');
        searchInput.classList.add('search-input');

        searchContainer.appendChild(searchInput);
        //searchContainer.appendChild(searchIcon);

        selectMenu.appendChild(searchContainer);
    },

    drawMultiSelect: function (selectMenu, data) {
        const optionsList = document.createElement('ul');
        optionsList.classList.add('options');
        optionsList.classList.add('scrollable');

        //buttons
        ddlControl.createSelectButtons(optionsList);
        selectMenu.appendChild(optionsList);

        data.forEach(function (option) {
            const optionItem = document.createElement('li');
            optionItem.classList.add('option');

            const optionBadge = document.createElement('span');
            optionBadge.classList.add('option-badge');
            optionBadge.style.backgroundColor = option.color;

            const optionText = document.createElement('span');
            optionText.classList.add('option-text');
            optionText.textContent = option.name;

            const checkbox = document.createElement('input');
            checkbox.setAttribute('type', 'checkbox');
            checkbox.classList.add('multi-select-checkbox');
            optionItem.appendChild(optionBadge);
            optionItem.appendChild(optionText);
            optionItem.appendChild(checkbox);

            optionsList.appendChild(optionItem);
        });

        ddlControl.addSelectButtonsListeners(optionsList, selectMenu);
    },

    drawTreeOptions: function (selectMenu, data) {
        const optionsList = document.createElement('ul');
        optionsList.classList.add('options');
        optionsList.classList.add('scrollable');

        const buildTreeOptions = (options, parentElement) => {
            options.forEach((option) => {
                const optionItem = document.createElement('li');
                optionItem.classList.add('option');

                const optionBadge = document.createElement('span');
                optionBadge.classList.add('option-badge');
                optionBadge.style.backgroundColor = option.color;

                const optionText = document.createElement('span');
                optionText.classList.add('option-text');
                optionText.textContent = option.name;

                optionItem.appendChild(optionBadge);
                optionItem.appendChild(optionText);

                parentElement.appendChild(optionItem);

                if (option.children && option.children.length > 0) {
                    const childOptionsList = document.createElement('ul');

                    childOptionsList.classList.add('child-options');
                    childOptionsList.classList.add('option-text');

                    childOptionsList.classList.add('scrollable');
                    optionItem.appendChild(childOptionsList);


                    buildTreeOptions(option.children, childOptionsList);
                }

            });
        };

        buildTreeOptions(data, optionsList);
        selectMenu.appendChild(optionsList);
    },

    drawMultiSelectWithTreeView: function (selectMenu, data) {
        const optionsList = document.createElement('ul');
        optionsList.classList.add('options');
        optionsList.classList.add('scrollable');
        // add buttons 
        ddlControl.createSelectButtons(optionsList);

        const buildTreeOptions = (options, parentElement) => {
            options.forEach((option) => {
                const optionItem = document.createElement('li');
                optionItem.classList.add('option');

                const optionBadge = document.createElement('span');
                optionBadge.classList.add('option-badge');
                optionBadge.style.backgroundColor = option.color;

                const optionText = document.createElement('span');
                optionText.classList.add('option-text');
                optionText.textContent = option.name;

                optionItem.appendChild(optionBadge);
                optionItem.appendChild(optionText);

                if (option.children && option.children.length > 0) {
                    const checkbox = document.createElement('input');
                    checkbox.setAttribute('type', 'checkbox');
                    checkbox.classList.add('multi-select-checkbox');
                    optionItem.appendChild(checkbox);
                    const childOptionsList = document.createElement('ul');
                    childOptionsList.classList.add('child-options');
                    childOptionsList.classList.add('.option-text');
                    childOptionsList.classList.add('scrollable');
                    optionItem.appendChild(childOptionsList);

                    buildTreeOptions(option.children, childOptionsList);
                } else {
                    const checkbox = document.createElement('input');
                    checkbox.setAttribute('type', 'checkbox');
                    checkbox.classList.add('multi-select-checkbox');
                    optionItem.appendChild(checkbox);
                }

                parentElement.appendChild(optionItem);
            });
        };
        const checkboxItems = selectMenu.querySelectorAll('.multi-select-checkbox');
        checkboxItems.forEach(function (checkboxItem) {
            checkboxItem.addEventListener('change', function () {
                ddlControl.handleCheckboxSelection(selectMenu);
            });
        });
        buildTreeOptions(data, optionsList);

        ddlControl.addSelectButtonsListeners(optionsList, selectMenu);

        selectMenu.appendChild(optionsList);
    },

    closeAllDropdowns: function () {
        const openDropdowns = document.querySelectorAll('.select-menu.active');
        openDropdowns.forEach((dropdown) => {
            const selectBtn = dropdown.querySelector('.select-btn');
            const optionsList = dropdown.querySelector('.options');

            optionsList.style.display = 'none';
            selectBtn.classList.remove('active');
            dropdown.classList.remove('active');
        });
    },

    createSelectButtons: function (optionsList) {
        const buttonContainer = document.createElement('div');
        buttonContainer.classList.add('button-container');

        // Create buttons
        const selectAllBtn = document.createElement('button');
        selectAllBtn.textContent = 'اختيار الكل';
        selectAllBtn.classList.add('select-all-btn');

        const unselectAllBtn = document.createElement('button');
        unselectAllBtn.textContent = 'الغاء الأختيار';
        unselectAllBtn.classList.add('unselect-all-btn');

        buttonContainer.appendChild(selectAllBtn);
        buttonContainer.appendChild(unselectAllBtn);

        optionsList.appendChild(buttonContainer);

        return buttonContainer;
    },

    addSelectButtonsListeners: function (optionsList, selectMenu) {
        const checkboxItems = optionsList.querySelectorAll('.multi-select-checkbox');

        checkboxItems.forEach(function (checkboxItem) {
            checkboxItem.addEventListener('change', function () {
              ddlControl.handleCheckboxSelection(selectMenu);
            });
        });

        const selectAllBtn = optionsList.querySelector('.select-all-btn');
        selectAllBtn.addEventListener('click', function () {
            checkboxItems.forEach(function (checkboxItem) {
                checkboxItem.checked = true;
            });
            ddlControl.handleCheckboxSelection(selectMenu);
        });

        const unselectAllBtn = optionsList.querySelector('.unselect-all-btn');
        unselectAllBtn.addEventListener('click', function () {
            checkboxItems.forEach(function (checkboxItem) {
                checkboxItem.checked = false;
            });
            ddlControl.handleCheckboxSelection(selectMenu);
            var selectText = selectMenu.querySelector('.sBtn-text');
            const initText= selectText.getAttribute('init-text')
            selectText.textContent = initText;

        });
    },

    addSearch: function (selectMenu) {
        const searchInput = selectMenu.querySelector('.search-input');
        const optionItems = selectMenu.querySelectorAll('.option')
        searchInput.addEventListener('input', function (event) {
            const searchedText = event.target.value.toLowerCase();
            optionItems.forEach(function (optionItem) {
                const optionText = optionItem.querySelector('.option-text').textContent.toLowerCase();
                if (optionText.includes(searchedText)) {
                    optionItem.style.display = 'block';
                } else {
                    optionItem.style.display = 'none';
                }
            });
        });
    },

    handleCheckboxSelection: function (selectMenu) {
        const selectedOptions = [];
        const optionItems = selectMenu.querySelectorAll('.option');
        optionItems.forEach(function (optionItem) {
            
            const checkbox = optionItem.querySelector('input[type="checkbox"]');
            const optionText = optionItem.querySelector('.option-text').textContent;

            if (checkbox.checked) {
                optionItem.classList.add('selected');
                selectedOptions.push(optionText);
            }
            else {
                optionItem.classList.remove('selected');

            }
        });

        const selectText = selectMenu.querySelector('.sBtn-text');
        if (selectedOptions.length > 0) {
            selectText.textContent = selectedOptions.join(', ');
        } else {
            const initText = selectMenu.getAttribute('data-init-text');
            selectText.textContent = initText;
        }
    },

    findParentOption: function (optionItem) {
        const parentOption = optionItem.closest('.option');
        return parentOption;
    },

    getter: function (menuId) {
        const selectMenu = document.getElementById(menuId);

        if (!selectMenu) {
            console.error(`Error: Element with ID '${menuId}' not found.`);
            return [];
        }

        const selectedOptionsArr = [];
        const optionItems = selectMenu.querySelectorAll('.option');

        //let hasMultiSelect = false;

        optionItems.forEach(function (optionItem) {
            const checkbox = optionItem.querySelector('input[type="checkbox"]');
            if (checkbox) {
                //hasMultiSelect = true;
                if (optionItem.classList.contains('selected')) {
                    const optionText = optionItem.querySelector('.option-text').textContent;
                    selectedOptionsArr.push(optionText);
                }
            } else if (optionItem.classList.contains('selected')) {
                const optionText = optionItem.querySelector('.option-text').textContent;
                selectedOptionsArr.push(optionText);
            }
        });

        return selectedOptionsArr;
    },

    setter: function (menuId, optionsToSelect) {
        const selectMenu = document.getElementById(menuId);

        if (!selectMenu) {
            console.error(`Error: Element with ID '${menuId}' not found.`);
            return [];
        }

        const optionItems = selectMenu.querySelectorAll('.option');

        let hasMultiSelect = false;
        let found = false;

        optionItems.forEach(function (optionItem) {
            const checkbox = optionItem.querySelector('input[type="checkbox"]');
            const optionText = optionItem.querySelector('.option-text').textContent;

            if (checkbox && optionsToSelect.includes(optionText)) {
                found = true;
                hasMultiSelect = true;
                checkbox.checked = optionsToSelect.includes(optionText);
                ddlControl.setHeaderValue(menuId, optionsToSelect);
            }
        });

        if (!hasMultiSelect) {

            optionItems.forEach(function (optionItem) {
                const optionText = optionItem.querySelector('.option-text').textContent;

                if (optionsToSelect.includes(optionText)) {
                    found = true;
                    optionItem.classList.add('selected');
                    const selectText = selectMenu.querySelector('.sBtn-text');
                    selectText.textContent = optionText;
                }
            });
        }
        if (!found) {
            console.error(`Error: The set option does not exist in the dropdown menu`);
        }
    },

    setHeaderValue: function (menuId, optionsToSelect) {
        const selectMenu = document.getElementById(menuId)
        var selectText = selectMenu.querySelector('.sBtn-text');
        if (optionsToSelect.length > 0) {
            selectText.textContent = optionsToSelect.join(', ');
        } else {
            const initText = selectMenu.getAttribute('data-init-text');
            selectText.textContent = initText;
        }
    },


};



//getter: function (menuId) {
//    const selectMenu = document.getElementById(menuId);

//    if (!selectMenu) {
//        console.error(`Error: Element with ID '${menuId}' not found.`);
//        return [];
//    }

//    const selectedOptionsArr = [];
//    const optionItems = selectMenu.querySelectorAll('.option');

//    optionItems.forEach(function (optionItem) {
//        if (optionItem.classList.contains('selected')) {
//            const optionId = optionItem.getAttribute('data-id');
//            selectedOptionsArr.push(optionId);
//        }
//    });

//    return selectedOptionsArr;
//},






//drawMultiSelect: function (selectMenu, data) {
    //    // Create the optionsList element
    //    const optionsList = document.createElement('ul');
    //    optionsList.classList.add('options');
    //    optionsList.classList.add('scrollable');

    //    const buttonContainer = document.createElement('div');
    //    buttonContainer.classList.add('button-container');

    //    // Create buttons
    //    const selectAllBtn = document.createElement('button');
    //    selectAllBtn.textContent = 'اختيار الكل';
    //    selectAllBtn.classList.add('select-all-btn');

    //    const unselectAllBtn = document.createElement('button');
    //    unselectAllBtn.textContent = 'الغاء الأختيار';
    //    unselectAllBtn.classList.add('unselect-all-btn');

    //    // Append buttons to the button container
    //    buttonContainer.appendChild(selectAllBtn);
    //    buttonContainer.appendChild(unselectAllBtn);

    //    // Append the button container to the selectMenu
    //    selectMenu.appendChild(buttonContainer);

    //    // Add event listeners to the buttons
    //    selectAllBtn.addEventListener('click', function () {
    //        const checkboxes = optionsList.querySelectorAll('.multi-select-checkbox');
    //        checkboxes.forEach(function (checkbox) {
    //            checkbox.checked = true;
    //        });
    //        ddlControl.handleCheckboxSelection(selectMenu);
    //    });

    //    unselectAllBtn.addEventListener('click', function () {
    //        const checkboxes = optionsList.querySelectorAll('.multi-select-checkbox');
    //        checkboxes.forEach(function (checkbox) {
    //            checkbox.checked = false;
    //        });
    //        ddlControl.handleCheckboxSelection(selectMenu);
    //    });

    //    // Append buttons to the selectMenu
    //    selectMenu.appendChild(selectAllBtn);
    //    selectMenu.appendChild(unselectAllBtn);

    //    // Append optionsList to selectMenu
    //    selectMenu.appendChild(optionsList);

    //     // Add options to the dropdown with checkboxes
    //    data.forEach(function (option) {
    //        const optionItem = document.createElement('li');
    //        optionItem.classList.add('option');

    //        const optionBadge = document.createElement('span');
    //        optionBadge.classList.add('option-badge');
    //        optionBadge.style.backgroundColor = option.color;

    //        const optionText = document.createElement('span');
    //        optionText.classList.add('option-text');
    //        optionText.textContent = option.name;

    //        const checkbox = document.createElement('input');
    //        checkbox.setAttribute('type', 'checkbox');
    //        checkbox.classList.add('multi-select-checkbox');
    //        optionItem.appendChild(optionBadge);
    //        optionItem.appendChild(optionText);
    //        optionItem.appendChild(checkbox);

    //        optionsList.appendChild(optionItem);
    //    });

    //    // Handle checkbox selection
    //    const checkboxItems = optionsList.querySelectorAll('.multi-select-checkbox');
    //    checkboxItems.forEach(function (checkboxItem) {
    //        checkboxItem.addEventListener('change', function () {
    //            ddlControl.handleCheckboxSelection(selectMenu);
    //        });
    //    });
    //},


//handleCheckboxSelection: function (selectMenu) {

//    const selectedOptions = [];
//    const optionItems = selectMenu.querySelectorAll('.option');

//    const updateSelectedOptions = function () {
//        selectedOptions.length = 0;
//        optionItems.forEach(function (item) {
//            if (item.classList.contains('selected')) {
//                selectedOptions.push(item.querySelector('.option-text').textContent);
//            }
//        });

//        const selectText = selectMenu.querySelector('.sBtn-text');
//        if (selectedOptions.length > 0) {
//            selectText.textContent = selectedOptions.join(', ');
//        } else {
//            const initText = selectMenu.getAttribute('data-init-text');
//            selectText.textContent = initText;
//        }
//    };

//    optionItems.forEach(function (optionItem) {
//        const checkbox = optionItem.querySelector('input[type="checkbox"]');
//        const optionText = optionItem.querySelector('.option-text').textContent;

//        const handleOptionItemClick = function () {
//            if (checkbox) {
//                checkbox.checked = !checkbox.checked;
//            }

//            optionItem.classList.toggle('selected');
//            updateSelectedOptions();
//        };

//        if (checkbox) {
//            checkbox.addEventListener('change', function (event) {
//                optionItem.classList.toggle('selected', event.target.checked);
//                updateSelectedOptions();
//            });
//        }

//        optionItem.addEventListener('click', handleOptionItemClick);

//        if (checkbox && checkbox.checked) {
//            optionItem.classList.add('selected');
//            selectedOptions.push(optionText);
//        }
//        else if (optionItem.classList.contains('selected')) {
//            selectedOptions.push(optionText);
//        }
//    });
//},

