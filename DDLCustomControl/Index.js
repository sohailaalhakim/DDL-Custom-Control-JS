$(document).ready(function () {

    var initParamNorml = {
        id: "DDLNormalSelect_container",
        data: [
            { id: 1, name: 'اداره عسير', color: '#FF0000' },
            { id: 2, name: 'اداره الرياض', color: '#00FF00' },
            { id: 3, name: 'اداره مكة', color: '#660033' },
            { id: 4, name: 'اداره جدة', color: '#FF0099' },
            { id: 5, name: 'اداره الباحة', color: '#CC6633' },
            { id: 6, name: 'اداره عسير', color: '#FF0000' },

        ],
        additionalOptions: 
        {
            hasSearch: false,
            hasMultiSelect: true,
            hasTreeView: false,
            },
        
        initText: "اختر الادارة",
        onChange: function (selectedItems) {
            console.log("Selected Items : ",selectedItems);
        }
    }
    ddlControl.initFunc(initParamNorml);

    var initParamSearched = {
        id: "DDLSearchedSelect_container",
        data: [
            { id: 1, name: 'اداره عسير', color: '#FF0000' },
            { id: 2, name: 'اداره الرياض', color: '#00FF00' },
            { id: 3, name: 'اداره مكة', color: '#660033' },
            { id: 4, name: 'اداره جدة', color: '#FF0099' },
            { id: 5, name: 'اداره الباحة', color: '#CC6633' },
            { id: 6, name: 'اداره عسير', color: '#FF0000' },
        ],
        additionalOptions:
        {
            hasSearch: true,
            hasMultiSelect: false,
            hasTreeView: false,
        },

        initText: "اختر الادارة",
    }
        //ddlControl.initFunc(initParamSearched);

    var initParamMultiSelect= {
        id: "DDLMultiSelected_container",
        data: [
            { id: 1, name: 'اداره عسير', color: '#FF0000'},
            { id: 2, name: 'اداره الرياض', color: '#00FF00' },
            { id: 3, name: 'اداره مكة', color: '#660033' },
            { id: 4,  name: 'اداره جدة', color: '#FF0099' },
            { id: 5, name: 'اداره الباحة', color: '#CC6633' },
            { id: 6, name: 'اداره عسير', color: '#FF0000' },
        ],
        additionalOptions:
        {
            hasSearch: false,
            hasMultiSelect: false,
            hasTreeView: false,
        },

        initText: "اختر الادارة",
    }
    //ddlControl.initFunc(initParamMultiSelect);

    var initParamTreeView = {
        id: "DDLTreeView_container",
        data: [
            {
                id: 1, name: 'اداره عسير', color: '#FF0000',
                children: [
                    { id: 11, name: 'شريف أحمد' }, { id: 12, name: 'خالد الباز' }, { id: 13, name: 'كريم رئاسه' }
                ]
            },
            { id: 2, name: 'اداره الرياض', color: '#00FF00', },
            { id: 3, name: 'اداره مكة', color: '#660033' },
            { id: 4, name: 'اداره جدة', color: '#FF0099' },
            {
                id: 5, name: 'اداره الباحة', color: '#CC6633', children: [
                    { name: 'شريف أحمد' }, { code: '2', name: 'خالد الباز' }, { code: '3', name: 'كريم رئاسه' }
                ]
            },
            { id: 6, name: 'اداره عسير', color: '#FF0000' },
        ],
        additionalOptions:
        {
            hasSearch: false,
            hasMultiSelect: false,
            hasTreeView: true,
        },

        initText: "اختر الادارة",
    }
    //ddlControl.initFunc(initParamTreeView);

    var initParamMixed = {
        id: "DDLMixed_container",
        data: [
            { id: 1, name: 'اداره عسير', color: '#FF0000' },
            { id: 2, name: 'اداره الرياض', color: '#00FF00' },
            { id: 3, name: 'اداره مكة', color: '#660033' },
            { id: 4, name: 'اداره جدة', color: '#FF0099' },
            { id: 5, name: 'اداره الباحة', color: '#CC6633' },
            { id: 6, name: 'اداره عسير', color: '#FF0000' },
        ],
        additionalOptions:
        {
            hasSearch: false,
            hasMultiSelect: false,
            hasTreeView: true,
        },

        initText: "اختر الادارة",
    }
   //ddlControl.initFunc(initParamMixed);

    //get all selected options by div id 

    ddlControl.getter("DDLMultiSelected_container");

    // set options to select 

    //const optionsToSelect = ['اداره عسير', 'اداره جدة'];
    //ddlControl.setter("DDLMultiSelected-container", optionsToSelect);

});

