const ddlControl = {


    initFunc: function (initParam) {
        if (typeof initParam !== 'object' || Object.keys(initParam).length === 0) {
            console.error('Error: Invalid or empty initParam object.');
            return;
        }

        const { id, data, additionalOptions, initText } = initParam;


        if (!Array.isArray(data) || data.length === 0) {
            console.error('Error: Invalid or empty "data" array in initParam');
            return;
        }
        const filteredData = data.map(function (option) {
            if (!option.hasOwnProperty('id') || typeof option.id !== "number") {
                console.error('Error: Invalid or missing "id" property for option:', option);
                return;
            }
            const filteredOption = {
                id: option.id
            };
            if (option.hasOwnProperty('name') || typeof option.name !== 'string') {
                filteredOption.name = option.name;

            }
            if (option.hasOwnProperty('color') && typeof option.color === 'string') {
                filteredOption.color = option.color;
            }
            if (option.hasOwnProperty('children')) {
                filteredOption.children = option.children;
            }
            return filteredOption;
        }).filter(Boolean);

   
        const filteredInitParam = {
            id: id,
            data: filteredData,

            additionalOptions: {
                hasSearch: typeof additionalOptions.hasSearch === 'boolean' ? additionalOptions.hasSearch : false,
                hasMultiSelect: typeof additionalOptions.hasMultiSelect === 'boolean' ? additionalOptions.hasMultiSelect : false,
                hasTreeView: typeof additionalOptions.hasTreeView === 'boolean' ? additionalOptions.hasTreeView : false,
            },
            initText,
        };
   
        document.addEventListener('click', function (event) {
            const target = event.target;
            if (!target.closest('.select-menu')) {
                ddlControl.closeAllDropdowns();
            }
        });

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
        const menuId = id + 'select_menu';
        console.log(menuId);
        const selectMenu = document.createElement('div');
        selectMenu.classList.add('select-menu');
        selectMenu.setAttribute('id', menuId);

        // Draw the header
        ddlControl.drawHeader(selectMenu, initText);

        // Draw the tree view + multi select if both true
        if (additionalOptions && additionalOptions.hasTreeView && additionalOptions.hasMultiSelect) {
            ddlControl.drawMultiSelectWithTreeView(selectMenu, data);
            console.log("Tree view option with multi-select is true");
        }
        else
        {
            ddlControl.drawOptions(selectMenu, initParam);
        }

        targetElement.appendChild(selectMenu);

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

    drawOptions: function (selectMenu, initParam) {
        const { data, additionalOptions } = initParam;

        const optionsList = document.createElement('ul');
        optionsList.classList.add('options');
        optionsList.classList.add('scrollable');

        // Draw the search if true 
        if (additionalOptions && additionalOptions.hasSearch) {
            const searchContainer = document.createElement('div');
            searchContainer.classList.add('search-container');

            const searchInput = document.createElement('input');
            searchInput.setAttribute('type', 'text');
            searchInput.setAttribute('placeholder', 'بحث');
            searchInput.classList.add('search-input');

            searchContainer.appendChild(searchInput);
            selectMenu.appendChild(searchContainer);

            ddlControl.addSearch(selectMenu);
        }
         // Draw the select buttons if multi select true
        if (additionalOptions && additionalOptions.hasMultiSelect) {
            ddlControl.createSelectButtons(selectMenu,optionsList);
        }
        // Draw the tree view if true
        if (additionalOptions && additionalOptions.hasTreeView) {
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
        }
      
        else {
            // Add options to the dropdown
            data.forEach(function (option) {
                const optionItem = document.createElement('li');
                optionItem.classList.add('option');
                optionItem.setAttribute('id', option.id);

                const optionBadge = document.createElement('span');
                optionBadge.classList.add('option-badge');
                optionBadge.style.backgroundColor = option.color;

                const optionText = document.createElement('span');
                optionText.classList.add('option-text');
                optionText.textContent = option.name;

                optionItem.appendChild(optionBadge);
                optionItem.appendChild(optionText);

                // Draw the multi select if true
                if (additionalOptions && additionalOptions.hasMultiSelect) {
                    const checkbox = document.createElement('input');
                    checkbox.setAttribute('type', 'checkbox');
                    checkbox.classList.add('multi-select-checkbox');
                    optionItem.appendChild(optionBadge);
                    optionItem.appendChild(optionText);
                    optionItem.appendChild(checkbox);

                   const checkboxItems = selectMenu.querySelectorAll('.multi-select-checkbox');
                    checkboxItems.forEach(function (checkboxItem) {
                        checkboxItem.addEventListener('change', function () {
                            ddlControl.handleCheckboxSelection(selectMenu);
                        });
                    });
                }
                optionsList.appendChild(optionItem);
            });
          
        }
        selectMenu.appendChild(optionsList);

        let selectedOption;
        const selectBtn = selectMenu.querySelector('.select-btn');
        const optionItems = optionsList.querySelectorAll('.option');
        let isOpen = false;
        
        // Toggle the dropdown list
        selectBtn.addEventListener('click', function () {
            ddlControl.closeAllDropdowns();
            isOpen = !isOpen;
            optionsList.style.display = isOpen ? 'block' : 'none';
            selectBtn.classList.toggle('active', isOpen);
            selectMenu.classList.toggle('active', isOpen);
        });

        //selection
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

    createSelectButtons: function (selectMenu,optionsList) {
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

      //events
        selectAllBtn.addEventListener('click', function () {
            selectMenu.querySelectorAll('.multi-select-checkbox').forEach(function (checkboxItem) {
                checkboxItem.checked = true;
            });
            ddlControl.handleCheckboxSelection(selectMenu);
        });

        unselectAllBtn.addEventListener('click', function () {
            selectMenu.querySelectorAll('.multi-select-checkbox').forEach(function (checkboxItem) {
                checkboxItem.checked = false;
            });
            ddlControl.handleCheckboxSelection(selectMenu);

            var selectText = selectMenu.querySelector('.sBtn-text');
            const initText = selectText.getAttribute('init-text')
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

    getter: function (menuId) {
        const selectMenu = document.getElementById(menuId);

        if (!selectMenu) {
            console.error(`Error: Element with ID '${menuId}' not found.`);
            return [];
        }

        const selectedOptionsArr = [];
        const optionItems = selectMenu.querySelectorAll('.option');

        optionItems.forEach(function (optionItem) {
            const checkbox = optionItem.querySelector('input[type="checkbox"]');
            if (checkbox) {
                if (optionItem.classList.contains('selected')) {
                    const optionId = optionItem.getAttribute('id');
                    selectedOptionsArr.push(optionId);
                }
            } else if (optionItem.classList.contains('selected')) {
                const optionId = optionItem.getAttribute('id');
                selectedOptionsArr.push(optionId);
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
        const selectedOptionsText = [];

        optionItems.forEach(function (optionItem) {
            const checkbox = optionItem.querySelector('input[type="checkbox"]');
            const optionText = optionItem.querySelector('.option-text').textContent;
            const optionId = optionItem.getAttribute('id');

            if (checkbox && optionsToSelect.includes(optionId)) {
                found = true;
                hasMultiSelect = true;
                optionItem.classList.add('selected');
                checkbox.checked = true;
                selectedOptionsText.push(optionText);
            }
        });

        if (!hasMultiSelect) {

            optionItems.forEach(function (optionItem) {
                const optionText = optionItem.querySelector('.option-text').textContent;
                const optionId = optionItem.getAttribute('id');

                if (optionsToSelect.includes(optionId)) {
                    found = true;
                    optionItem.classList.toggle('selected');
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
