/**
 * Created by gugan_mohan on 1/29/2016.
 */

angular.module('tlcengineApp').controller('AgentSearchCtrl', ['$rootScope', '$scope', '$controller', 'propertiesService', 'aaNotify', 'utilService', 'appAuth','$timeout', function ($rootScope, $scope, $controller, propertiesService, aaNotify, utilService, appAuth, $timeout) {

    $scope.init = function () {
        $scope.initTabSwitchCode();
        $scope.initAgentSearch();
        $scope.count=0;
        $scope.initOfficeSearch();
        $scope.itemsByPage = 10;
        $scope.agentRowCollection = [];
        $scope.officeRowCollection = [];
        $scope.agentSearchParams = {};
        $scope.OfficeSearchParams = {};
        $scope.agentMap = {};
        $scope.officeMap = {};
        $scope.mapBounds = {};
        $scope.officeSearchResults = {};
        $scope.agentSearchResults = {};
        $scope.click = 1;
        $scope.clickOnce = false;
        $scope.issuccessPopup =false;
        $scope.acfcpnp = "No Preference";
        $scope.acftpnp = "No Preference";
        $scope.acfagentno = "No";
        $scope.agentdetailsClasswithautoId = "agentDetails";
        $scope.aaNotifyMsgObj={};
    };
    $scope.map = {};
    $scope.itemsByPage = 10;
    $scope.disabledSubmit = false;

    $scope.initTabSwitchCode = function () {
        $('#office-criteria-container').hide();
        $('#AOSAgentTab').click(function () {
            $('#agent-criteria-container').show();
            $('#office-criteria-container').hide();
            $(this).addClass('selected');
            $('#AOSOfficeTab').removeClass('selected');

            $('#Office-tabstrip').hide();
            if ($scope.getDataCount('#agent-search-result-table')) {
                $('#agent-tabstrip').show();
            }
        });

        $('#AOSOfficeTab').click(function () {
            $('#office-criteria-container').show();
            $('#agent-criteria-container').hide();
            $(this).addClass('selected');
            $('#AOSAgentTab').removeClass('selected');

            $('#agent-tabstrip').hide();
            if ($scope.getDataCount('#Office-search-result-table')) {
                $('#Office-tabstrip').show();
            }
        });
    }

    $scope.submitAgentSearch = function () {
     if(!$(".aa-notification").is(':visible')){
          if( !$scope.agentForm.$dirty && $scope.checkingInputsAgentform() ){
            $scope.aaNotifyMsgObj = aaNotify.warning('Please enter at least one search criteria!', {
                showClose: true,                            //close button
                iconClass: 'fa fa-exclamation-triangle',    //iconClass for a <i></i> style icon to use
                allowHtml: true,                            //allows HTML in the message to render as HTML
                ttl: 1000 * 3                              //time to live in ms
            });
            $scope.disabledSubmit = false;
            $('#Master_FirstName,#Master_LastName,#Master_Address,#Master_City,#Master_State,#Master_Zip_agent,#Master_Zip_Office,#clear-search').click(function(){
              $timeout(function() { aaNotify.remove($scope.aaNotifyMsgObj); }, 0);
            });
            return;
        }
        else if($scope.checkingInputsAgentform()){
           $scope.aaNotifyMsgObj = aaNotify.warning('Please enter proper search criteria!', {
                showClose: true,                             //close button
                iconClass: 'fa fa-exclamation-triangle',    //iconClass for a <i></i> style icon to use
                allowHtml: true,                            //allows HTML in the message to render as HTML
                ttl: 1000 * 3                              //time to live in ms
            });
            $scope.disabledSubmit = false;
            return;
        }
        else if( ($scope.agentForm.Master$Zip.$viewValue !=undefined && $scope.agentForm.Master$Zip.$viewValue != "") && $scope.agentForm.Master$Zip.$viewValue.length != 5) {
           $scope.aaNotifyMsgObj = aaNotify.error('Please enter 5 digits in Zip code!',{
                showClose: true,                             //close button
                iconClass: 'fa fa-exclamation-triangle',    //iconClass for a <i></i> style icon to use
                allowHtml: true                            //allows HTML in the message to render as HTML
                //ttl: 1000 * 3                           //time to live in ms
            });
            //$scope.disabledSubmit = false;
            return false;
        }
      // }
      // else{
      //   return false;
      // }

        $scope.resetGridHeaders();
        
        $scope.disabledSubmit = true;

        if($scope.agentSearchParams.MemberFirstName == "") {
            delete $scope.agentSearchParams.MemberFirstName;
        }
        if($scope.agentSearchParams.MemberLastName == "") {
            delete $scope.agentSearchParams.MemberLastName;
        }
        if($scope.agentSearchParams.MemberAddress1 == "") {
            delete $scope.agentSearchParams.MemberAddress1;
        }
        if($scope.agentSearchParams.MemberCity == "") {
            delete $scope.agentSearchParams.MemberCity;
        }
        if($scope.agentSearchParams.MemberStateOrProvince==undefined || $scope.agentSearchParams.MemberStateOrProvince == "") {
            delete $scope.agentSearchParams.MemberStateOrProvince;
        }
        if($scope.agentSearchParams.MemberPostalCode==undefined || $scope.agentSearchParams.MemberPostalCode == "") {
            delete $scope.agentSearchParams.MemberPostalCode;
        }
       
        $scope.getAgentSearchResults();
       }
    }



    $scope.checkingInputsAgentform = function(){
        if( (($scope.agentForm.Master$FirstName.$viewValue ==undefined) || ($scope.agentForm.Master$FirstName.$viewValue).length==0) 
            && 
           (($scope.agentForm.Master$LastName.$viewValue ==undefined)  || ($scope.agentForm.Master$LastName.$viewValue).length==0) 
           &&
           (($scope.agentForm.Master$Address.$viewValue==undefined)  || ($scope.agentForm.Master$Address.$viewValue).length==0) 
           &&
           (($scope.agentForm.Master$City.$viewValue==undefined)  || ($scope.agentForm.Master$City.$viewValue).length==0) 
           &&
           (($scope.agentForm.Master$State.$viewValue==undefined)  || ($scope.agentForm.Master$State.$viewValue).length==0) 
           &&
           (($scope.agentForm.Master$Zip.$viewValue==undefined)  || ($scope.agentForm.Master$Zip.$viewValue).length==0))
        {
            return true;
        }
        else {
            return false;
        }
    }


    var valKeyDown;
    var valKeyUp;


    function integerOnly(e) {
    e = e || window.event;
    var code = e.which || e.keyCode;
    if (!e.ctrlKey && !e.metaKey) {
        var arrIntCodes1 = new Array(96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 8, 9, 116);   // 96 TO 105 - 0 TO 9 (Numpad)
        if (!e.shiftKey) {                          //48 to 57 - 0 to 9 
            arrIntCodes1.push(48);                  //These keys will be allowed only if shift key is NOT pressed
            arrIntCodes1.push(49);                  //Because, with shift key (48 to 57) events will print chars like @,#,$,%,^, etc.
            arrIntCodes1.push(50);
            arrIntCodes1.push(51);
            arrIntCodes1.push(52);
            arrIntCodes1.push(53);
            arrIntCodes1.push(54);
            arrIntCodes1.push(55);
            arrIntCodes1.push(56);
            arrIntCodes1.push(57);
        }
        var arrIntCodes2 = new Array(35, 36, 37, 38, 39, 40, 46);
        if ($.inArray(e.keyCode, arrIntCodes2) != -1) {
            arrIntCodes1.push(e.keyCode);
        }
        if ($.inArray(code, arrIntCodes1) == -1) {
            return false;
        }
    }
    return true;
    }

    $('.integerOnly').keydown(function (event) {
        valKeyDown = this.value;
        return integerOnly(event);
    });

    $('.integerOnly').keyup(function (event) {          //This is to protect if user copy-pastes some character value ,..
        valKeyUp = this.value;                          //In that case, pasted text is replaced with old value,
            if (!new RegExp('^[0-9]*$').test(valKeyUp)) {   //which is stored in 'valKeyDown' at keydown event.
                 $(this).val(valKeyDown);                    //It is not possible to check this inside 'integerOnly' function as,
                }                                               //one cannot get the text printed by keydown event 
    });                                                 //(that's why, this is checked on keyup)

    $('.integerOnly').bind('input propertychange', function(e) {    //if user copy-pastes some character value using mouse
        valKeyUp = this.value;
        if (!new RegExp('^[0-9]*$').test(valKeyUp)) {
          $(this).val(valKeyDown);
        }
    });
    

    $scope.resetAgentSearch = function () {
        $scope.agentSearchParams = {};
        $scope.agentRowCollection = [];
        $scope.hideElementById('#agent-tabstrip');
        $scope.resetGrid('#agent-search-result-table');
        $scope.click = 1;
        $timeout(function() { aaNotify.remove($scope.aaNotifyMsgObj); }, 0);
    }

    $scope.parseForAgentImage = function (profile) {
        if (profile != null) {
            profile = JSON.parse(profile);
            if (profile.ProfileImageName != null || profile.ProfileImageName != '') {
                return profile.ProfileImageName;
            }
        }
        return '../images/client-dashboard.png';

    }

    $scope.getAgentSearchResults = function () {
        propertiesService.getAgentSearchResult($scope.agentSearchParams
            , function (success) {
                if (document.getElementById('AOSAgentTab').checked) {
                console.log(success);
                if (success.Clients.length == 0) {
                    $scope.aaNotifyMsgObj = aaNotify.warning('No Agent to display! Please try different search values.', {
                        showClose: true,                            //close button
                        iconClass: 'fa fa-exclamation-triangle',    //iconClass for a <i></i> style icon to use
                        allowHtml: true,                            //allows HTML in the message to render as HTML
                        ttl: 1000 * 3                              //time to live in ms
                    });
                    $scope.hideElementById('#agent-tabstrip');
                    $scope.resetGrid('#Office-search-result-table');
                } else {
                    $scope.showElementById('#agent-tabstrip');
                    $scope.renderAgentSearchResults(success.Clients);
                }
                $scope.disabledSubmit = false;
              } 
            }, function (error) {
                console.log(error);
                $scope.disabledSubmit = false;
            });
    }

    $scope.renderAgentSearchResults = function (results) {
        var grid = $("#agent-search-result-table").data("kendoGrid");
        grid.dataSource.data(results);
        grid.refresh();
        //$scope.renderAgentSearchResultsOnMap(results);
        $scope.agentSearchResults = results;
        if($("#searchAgent li").eq(1).hasClass("k-state-active"))
            $scope.setGoogleMapMarker();
        $scope.click = 1;
    }

    /* 	$scope.renderAgentSearchResultsOnMap = function(mapResults) {
     $scope.setGoogleMapMarker(mapResults);

     } */




    $scope.submitOfficeSearch = function () {
     if(!$(".aa-notification").is(':visible')){

        $scope.resetGridHeaders();
        if (!$scope.officeForm.$valid) {
            return;
        }
        
        if( !$scope.officeForm.$dirty && $scope.checkingInputsOfficeform() ){
            $scope.aaNotifyMsgObj = aaNotify.warning('Please enter at least one search criteria!', {
                showClose: true,                            //close button
                iconClass: 'fa fa-exclamation-triangle',    //iconClass for a <i></i> style icon to use
                allowHtml: true,                            //allows HTML in the message to render as HTML
                ttl: 1000 * 3                              //time to live in ms
            });
             $('#Master_OfficeName,#Master_Address,#Master_City,#Master_State,##Master_Zip_agent,#Master_Zip_Office').click(function(){
              $timeout(function() { aaNotify.remove($scope.aaNotifyMsgObj); }, 0);
            });
            //$scope.disabledSubmit = false;
            return;
        }
        else if($scope.checkingInputsOfficeform()){
           $scope.aaNotifyMsgObj = aaNotify.warning('Please enter at least one search criteria!', {
                showClose: true,                             //close button
                iconClass: 'fa fa-exclamation-triangle',    //iconClass for a <i></i> style icon to use
                allowHtml: true,                            //allows HTML in the message to render as HTML
                ttl: 1000 * 3                              //time to live in ms
            });
            //$scope.disabledSubmit = false;
            return;
        }
        else if( ($scope.officeForm.Master$Zip.$viewValue!=undefined && $scope.officeForm.Master$Zip.$viewValue != "") && $scope.officeForm.Master$Zip.$viewValue.length != 5) {
           $scope.aaNotifyMsgObj = aaNotify.error('Please enter 5 digits in Zip code!',{
                showClose: true,                             //close button
                iconClass: 'fa fa-exclamation-triangle',    //iconClass for a <i></i> style icon to use
                allowHtml: true                            //allows HTML in the message to render as HTML
                //ttl: 1000 * 3                              //time to live in ms
            });
            //$scope.disabledSubmit = false;
            return false;
        }
        

       /*
        }else
            return false;

        $scope.disabledSubmit = true;
        if($scope.OfficeSearchParams.OfficeName == "") {
            delete $scope.OfficeSearchParams.OfficeName;
        }
        if($scope.OfficeSearchParams.OfficeFullStreetAddress == "") {
            delete $scope.OfficeSearchParams.OfficeFullStreetAddress;
        }
        if($scope.OfficeSearchParams.OfficeCity == "") {
            delete $scope.OfficeSearchParams.OfficeCity;
        }
        if($scope.OfficeSearchParams.OfficeState == "") {
            delete $scope.OfficeSearchParams.OfficeState;
        }
        if($scope.OfficeSearchParams.OfficePostalCode == "") {
            delete $scope.OfficeSearchParams.OfficePostalCode;
        }
        if (jQuery.isEmptyObject($scope.OfficeSearchParams)) {
            aaNotify.warning('Please enter at least one search criteria!', {
                showClose: true,                            //close button
                iconClass: 'fa fa-exclamation-triangle',    //iconClass for a <i></i> style icon to use
                allowHtml: true,                            //allows HTML in the message to render as HTML
                ttl: 1000 * 5                             //time to live in ms
            });
            $scope.disabledSubmit = false;
        } else {


            */
            $scope.getOfficeSearchResults();
        }
    }

    $scope.checkingInputsOfficeform = function(){
        if( (($scope.officeForm.Master$OfficeName.$viewValue ==undefined) || ($scope.officeForm.Master$OfficeName.$viewValue).length==0) 
           &&
           (($scope.officeForm.Master$Address.$viewValue==undefined)  || ($scope.officeForm.Master$Address.$viewValue).length==0) 
           &&
           (($scope.officeForm.Master$City.$viewValue==undefined)  || ($scope.officeForm.Master$City.$viewValue).length==0) 
           &&
           (($scope.officeForm.Master$State.$viewValue==undefined)  || ($scope.officeForm.Master$State.$viewValue).length==0) 
           &&
           (($scope.officeForm.Master$Zip.$viewValue==undefined)  || ($scope.officeForm.Master$Zip.$viewValue).length==0))
        {
            return true;
        }
        else {
            return false;
        }
    }

    $scope.resetOfficeSearch = function () {
        $scope.OfficeSearchParams = {};
        $scope.OfficeRowCollection = [];
        $scope.hideElementById('#Office-tabstrip');
        $scope.resetGrid('#Office-search-result-table');
        $scope.click = 1;
        $timeout(function() { aaNotify.remove($scope.aaNotifyMsgObj); }, 0);
    }





    $scope.parseForOfficeImage = function (profile) {
//        if(profile != null) {
//            profile = JSON.parse(profile);
//            if(profile.ProfileImageName != null || profile.ProfileImageName != '' ) {
//                return profile.ProfileImageName;
//            }
//        }
        return '../images/No-property.png';

    }

    $scope.getOfficeSearchResults = function () {
        console.log($scope.OfficeSearchParams);
        propertiesService.getOfficeSearchResult($scope.OfficeSearchParams
            , function (success) {
                if (document.getElementById('AOSOfficeTab').checked) {
                console.log(success);
                if (success.Offices.length == 0) {
                    $scope.aaNotifyMsgObj = aaNotify.warning('No Office to display! Please try different search values.', {
                        showClose: true,                            //close button
                        iconClass: 'fa fa-exclamation-triangle',    //iconClass for a <i></i> style icon to use
                        allowHtml: true,                            //allows HTML in the message to render as HTML
                        ttl: 1000 * 5                             //time to live in ms
                    });
                    $scope.hideElementById('#Office-tabstrip');
                    $scope.resetGrid('#Office-search-result-table');
                } else {
                    $scope.showElementById('#Office-tabstrip');
                    $scope.renderOfficeSearchResults(success.Offices);
                }
                $scope.disabledSubmit = false;
              }
            }, function (error) {
                console.log(error);
                $scope.disabledSubmit = false;
            });
    }

    $scope.renderOfficeSearchResults = function (results) {
        var grid = $("#Office-search-result-table").data("kendoGrid");
        grid.dataSource.data(results);
        grid.refresh();
        //$scope.renderOfficeSearchResultsOnMap(results);
        $scope.officeSearchResults = results;
        if($("#searchOffice li").eq(1).hasClass("k-state-active"))
            $scope.setGoogleMapOfficeSearchMarker();
        $scope.click = 1;
    }

    // $scope.renderOfficeSearchResultsOnMap = function(mapResults) {
    // $scope.setGoogleMapOfficeSearchMarker(mapResults);

    // }

    $scope.showElementById = function (id) {
        $(id).show();
    }

    $scope.hideElementById = function (id) {
        $(id).hide();
    }

    $scope.getDataCount = function (grid_id) {
        var grid = $(grid_id).data("kendoGrid");
        if (grid) {
            return grid.dataSource._data.length;
        }
        return false;
    }

    $scope.resetGrid = function (grid_id) {
        var grid = $(grid_id).data("kendoGrid");
        if (grid) {
            grid.dataSource.data([]);
            grid.refresh();
        }
    }
    $scope.resetGridHeaders = function(){
            var datasource = $("#Office-search-result-table").data("kendoGrid").dataSource;
            datasource.filter([]);
            var datasource = $("#agent-search-result-table").data("kendoGrid").dataSource;
            datasource.filter([]);
    }
    $scope.initAgentSearch = function () {
        var dataSource = new kendo.data.DataSource({
            data: [],
            type: "odata",
            schema: {
                model: {
                    fields: {
                        MemberProfilePhoto: { type: "string" },
                        MemberFullName: { type: "string" },
                        OfficeName: { type: "string" },
                        MemberFirstName: { type: "string" },
                        MemberLastName: { type: "string" },
                        MemberAddress1: { type: "string" },
                        MemberCity: { type: "string" },
                        MemberFullAddress: { type: "string" },
                        MemberStateOrProvince: { type: "string" },
                        MemberPostalCode: { type: "string" },
                        MemberEmail: { type: "string" },
                        MemberHomePhone: { type: "string" },
                        MemberMobilePhone: { type: "string" },
                        MemberContactDetails: { type: "string" }
                    }
                }
            },
            pageSize: 20
        });

        $("#agent-search-result-table").kendoGrid({
            dataSource: dataSource,
            sortable: true,
            filterable: {
                mode: "row"
            },
            pageable: true,
            columns: [
                {
                    template: "<div class='search-pic'> " +
                        "# var jsonProfile = JSON.parse(Profile)#" +
                        "<img class='customer-photo' onload='loadDefaultAgentImage(this)' onerror='setDefaultImage(this)' src='#: jsonProfile.ProfileImageName #'>" +
                        "</div> " +
                        "<div class='search-pic-content'>" +
                        "<div><h2 class='search-h2'><a href='javascript:void(0);' onclick='showCurrentAgentDetails(event);'>#: MemberFullName #</a></h2></div> " +
                        "<div><span class='search-span'><a  href='javascript:void(0);' onclick='showCurrentAgentOfficeDetails(event);'>#: OfficeName #</a></span></div> " +
                        " </div>",
                    field: "MemberFullName",
                    title: "Agent",
                    width: 240,
                    filterable: {
                        cell: {
                            showOperators: false,
                            operator: "contains"
                        }
                    }
                },
                {
                    field: "MemberFullAddress",
                    template: "<span>#: MemberFullAddress #</span>",
//                            "<span>, #: MemberCity #</span>" +
//                            "<span>, #: MemberStateOrProvince #</span>" +
//                            "<span>, #: MemberPostalCode #.</span><br>",
                    title: "Address",
                    filterable: {
                        cell: {
                            showOperators: false,
                            operator: "contains"
                        }
                    }
                },
                {
                    field: "MemberContactDetails",
                    title: "Contact Details",
                    template: //"<span><a href='mailto:#=MemberEmail#'>#: MemberEmail #</a></span><br>" +
                        "# var formattedHomeNumber = formatPhone(MemberHomePhone) #" +
                        "# var formattedMobileNumber = formatPhone(MemberMobilePhone) #" +
                        "# if(formattedMobileNumber == formattedHomeNumber) {formattedHomeNumber = 'NA'}#" +
                        "# if(MemberHomePhone == '') {formattedHomeNumber = 'NA'}#" +
                        "# if(MemberMobilePhone == '') {formattedMobileNumber = 'NA'}#" +
                        "<span><b class='fa fa-mobile fa-lg fa-agent-color'>&nbsp;</b><a href='tel:#=formattedMobileNumber#'>#: formattedMobileNumber #</a></span><br>" +
                        "<span><b class='fa fa-phone fa-lg fa-agent-color'>&nbsp;</b><a href='tel:#=formattedHomeNumber#'>#: formattedHomeNumber #</a></span><br>",
                    filterable: {
                        cell: {
                            showOperators: false,
                            operator: "contains"
                        }
                    }
                },
                { command: { text: "Contact Me", click: $scope.openAgentContactForm }, title: "Contact Me", width: "180px" },
                { command: { text: "Work With Me", click: $scope.openInvitaionPopup }, title: "Work With Me", width: "180px" }
            ]
        });

        $("[data-text-field=MemberFullName]").attr({"placeholder": "Agent Name", "maxlength": "50"});
        $("[data-text-field=MemberFullAddress]").attr({"placeholder": "910 hamilton ave, campbell, ca", "maxlength": "250"});
        $("[data-text-field=MemberContactDetails]").attr({"placeholder": "5715020370", "maxlength": "300"});

        $("#customAgentsorting").kendoDropDownList({

            select: onSelectAgent,
            height: 'auto'

        });

    }

    $scope.initOfficeSearch = function () {
        var officeDataSource = new kendo.data.DataSource({
            data: [],
            type: "odata",
            schema: {
                model: {
                    fields: {
                        OfficeName: { type: "string" },
                        OfficeFullStreetAddress: { type: "string" },
                        OfficeCity: { type: "string" },
                        OfficeState: { type: "string" },
                        OfficeEmail: { type: "string" },
                        OfficePhone: { type: "string" },
                        OfficeFax: { type: "string" },
                        OfficeContactDetail: { type: "string" },
                        OfficeFullAddress: { type: "string" },
                        OfficeUrl: { type: "string" },
                        OfficeEmail: { type: "string" }
                    }
                }
            },
            pageSize: 20
        });

        $("#Office-search-result-table").kendoGrid({
            dataSource: officeDataSource,
            sortable: {
                allowUnsort: false
            },
            filterable: {
                mode: "row"
            },
            pageable: {
                pageSize: 2,
                change: function (e) {
                    console.log("grid pager clicked!", e);
                }

            },
            detailTemplate: kendo.template($("#sub-agent-grid-template").html()),
            detailInit: $scope.detailInit,
            dataBound: function () {
                var dataSource = this.dataSource;
                this.element.find('tr.k-master-row').each(function () {
                    var row = $(this);
                    var data = dataSource.getByUid(row.data('uid'));
//                    // this example will work if ReportId is null or 0 (if the row has no details)
                    if (data.get('AgentCount') == "0") {
                        row.find('.k-hierarchy-cell a').css({ opacity: 0, cursor: 'default' }).click(function (e) {
                            e.stopImmediatePropagation();
                            return false;
                        });
                    }
                });
            },
            columns: [
                {
                    //
                    template: "<div class='search-pic'> " +
                        "<img class='customer-photo' onload='loadDefaultOfficeImage(this)' onerror='setDefaultOfficeImage(this)' src='#: Imageurl #'>" +
                        "</div> " +
                        "<div class='search-pic-content'>" +
                        "<div><h2 class='search-h2'><a href='javascript:void(0);' onclick='showCurrentOfficeDetails(event);'>#: OfficeName #</a></h2></div>" +
                        " </div>",
                    field: "OfficeName",
                    title: "Office",
                    width: 240,
                    filterable: {
                        cell: {
                            showOperators: false,
                            operator: "contains"
                        }
                    }
                },
                {
                    field: "OfficeFullAddress",
                    template: "<span>#: OfficeFullAddress #,</span><br>",
                    title: "Address",
                    filterable: {
                        cell: {
                            showOperators: false,
                            operator: "contains"
                        }
                    }
                },
                {
                    field: "OfficeContactDetail",
                    title: "Contact Details",
                    template:
                        "# var formattedOfficePhone = formatPhone(OfficePhone) #" +
                        "# var formattedOfficeFax = formatPhone(OfficeFax) #" +
                        "# var formattedOfficeUrl = OfficeUrl #" +
                        "# if(formattedOfficePhone == formattedOfficeFax) {formattedOfficeFax = 'NA'}#" +
                        "# if(OfficePhone == '') {formattedOfficePhone = 'NA'}#" +
                        "# if(OfficeFax == '') {formattedOfficeFax = 'NA'}#" +
                        "# if(formattedOfficeUrl != '') {formattedOfficeUrl = 'http://'+formattedOfficeUrl}#" +
                        "<span><b class='fa fa-phone fa-lg fa-agent-color'>&nbsp;</b><a href='tel:#=formattedOfficePhone#'>#: formattedOfficePhone #</a></span><br>" +
                        "<span><b class='fa fa-fax fa-lg fa-agent-color'>&nbsp;</b>#: formattedOfficeFax #</span><br>" +
                        "<span><a href='#=formattedOfficeUrl#' target='_blank'>#: OfficeUrl #</a><br>"+
                        "<span><a href='mailto:#=OfficeEmail#'>#: OfficeEmail #</a></span><br>",
                    filterable: {
                        cell: {
                            showOperators: false,
                            operator: "contains"
                        }
                    }
                },
                //{ command: { text: "View Details", click: $scope.showOfficeDetails }, title: "", width: "180px" }
            ]
        });

        $("[data-text-field=OfficeName]").attr({"placeholder": "Office Name", "maxlength": "50"});
        $("[data-text-field=OfficeFullAddress]").attr({"placeholder": "910 hamilton ave, campbell, ca", "maxlength": "250"});
        $("[data-text-field=OfficeContactDetail]").attr({"placeholder": "5715020370", "maxlength": "300"});

        $("#customOfficesorting").kendoDropDownList({

            select: onSelectOffice,
            height: 'auto'

        });

    }

    $scope.detailInit = function (e) {
        var OfficeId = e.data.OfficeId;

        propertiesService.getAgentSearchResult({"OfficeId": OfficeId}
            , function (success) {
                console.log(success);
                $scope.renderDetailResult(e, success);
            }, function (error) {
                console.log(error);
                aaNotify.warning('Error while displaying values!', {
                    showClose: true,                            //close button
                    iconClass: 'fa fa-exclamation-triangle',    //iconClass for a <i></i> style icon to use
                    allowHtml: true,                            //allows HTML in the message to render as HTML
                    ttl: 1000 * 3                              //time to live in ms
                });
            });
    }

    $scope.fomratMobileNumber = function (phoneNumber) {
        var piece1 = phoneNumber.substring(0, 3); //123
        var piece2 = phoneNumber.substring(3, 6); //456
        var piece3 = phoneNumber.substring(6); //7890
        return kendo.format("({0})-{1}-{2}", piece1, piece2, piece3);
    }

    $scope.renderDetailResult = function (e, success) {
        console.log(success);
        if (success.Clients.length == 0) {
            // Do Nothing
            aaNotify.warning('No Agent to display!', {
                showClose: true,                            //close button
                iconClass: 'fa fa-exclamation-triangle',    //iconClass for a <i></i> style icon to use
                allowHtml: true,                            //allows HTML in the message to render as HTML
                ttl: 1000 * 3                              //time to live in ms
            });
            var detailRow = e.detailRow;
            detailRow.find(".tabstrip").remove();
        } else {
            //For Generating the dynamic class getting the respective agents detials popup.
            $scope.count = $scope.count+1;       
            $scope.agentdetailsClasswithautoId = "agentDetails-"+$scope.count;
            //
            var detailRow = e.detailRow;
            detailRow.find(".tabstrip").kendoTabStrip({
                animation: {
                    open: { effects: "fadeIn" }
                }
            });

            var dataSource = new kendo.data.DataSource({
                data: success.Clients,
                type: "odata",
                schema: {
                    model: {
                        fields: {
                            MemberProfilePhoto: { type: "string" },
                            MemberFullName: { type: "string" },
                            OfficeName: { type: "string" },
                            MemberFirstName: { type: "string" },
                            MemberLastName: { type: "string" },
                            MemberAddress1: { type: "string" },
                            MemberCity: { type: "string" },
                            MemberFullAddress: { type: "string" },
                            MemberStateOrProvince: { type: "string" },
                            MemberPostalCode: { type: "string" },
                            MemberEmail: { type: "string" },
                            MemberHomePhone: { type: "string" },
                            MemberMobilePhone: { type: "string" },
                            MemberContactDetails: { type: "string" }
                        }
                    }
                },
                pageSize: 20
            });

            detailRow.find(".orders").kendoGrid({
                dataSource: dataSource,
                sortable: {
                    allowUnsort: false
                },
                pageable: true,
                columns: [
                    {
                        template: "<div class='search-pic'> " +
                            "# var jsonProfile = JSON.parse(Profile)#" +
                            "<img class='customer-photo' onload='loadDefaultAgentImage(this)' onerror='setDefaultImage(this)' src='#: jsonProfile.ProfileImageName #'>" +
                            "</div> " +
                            "<div class='search-pic-content'>" +
                            "<div><h2 class='search-h2'><a class='"+$scope.count+"' href='javascript:void(0);' onclick='showFindAgentDetails(event);'>#: MemberFullName #</a></h2></div> " +
                            " </div>",
                        field: "MemberFullName",
                        title: "Agent",
                        width: 240,
                        filterable: {
                            cell: {
                                showOperators: false,
                                operator: "contains"
                            }
                        }
                    },
                    {
                        field: "MemberFullAddress",
                        template: "<span>#: MemberFullAddress #</span>",
                        title: "Address",
                        filterable: {
                            cell: {
                                showOperators: false,
                                operator: "contains"
                            }
                        }
                    },
                    {
                        field: "MemberContactDetails",
                        title: "Contact Details",
                        template: //"<span><a href='mailto:#=MemberEmail#'>#: MemberEmail #</a></span><br>" +
                            "# var formattedHomeNumber = formatPhone(MemberHomePhone) #" +
                            "# var formattedMobileNumber = formatPhone(MemberMobilePhone) #" +
                            "# if(formattedMobileNumber == formattedHomeNumber) {formattedHomeNumber = 'NA'}#" +
                            "# if(MemberHomePhone == '') {formattedHomeNumber = 'NA'}#" +
                            "# if(MemberMobilePhone == '') {formattedMobileNumber = 'NA'}#" +
                            "<span><b class='fa fa-mobile fa-lg fa-agent-color'>&nbsp;</b><a href='tel:#=formattedMobileNumber#'>#: formattedMobileNumber #</a></span><br>" +
                            "<span><b class='fa fa-phone fa-lg fa-agent-color'>&nbsp;</b><a href='tel:#=formattedHomeNumber#'>#: formattedHomeNumber #</a></span><br>",
                        filterable: {
                            cell: {
                                showOperators: false,
                                operator: "contains"
                            }
                        }
                    },
                    { command: { text: "Contact Me", click: $scope.openAgentContactForm }, title: "Contact Me", width: "180px" },
                    { command: { text: "Work With Me", click: $scope.openInvitaionPopup }, title: "Work With Me", width: "180px" }
                ]
            }).addClass($scope.agentdetailsClasswithautoId);
        }

    }
    $scope.getOfficeInfoBubbleDetailHtml = function (data) {
        var officeName = data.OfficeName;
        var officeFullStreetAddress = data.OfficeFullStreetAddress;

        var html = '<div class="get-office">';
        html += '<table><tr><td><img onload="loadDefaultOfficeImage(this)" onerror="setDefaultOfficeImage(this)" src="' + data.Imageurl + '" class="get-office-img"></td>';
        html += '<td><table><tr><td  colspan="2"><div class="center-text"><b>' + officeName + '</b></div></td></tr>';
        html += '<tr><td class="get-office-bold"><b>Address:</b> </td><td class="get-office-value">' + officeFullStreetAddress + ' ' + data.OfficePostalCode + '</td></tr>';
        html += '<tr><td class="get-office-bold"><b>City:</b> </td><td class="get-office-value">' + data.OfficeCity + ' ' + data.OfficeState + '</td></tr>';
        html += '</table> </div>';
        return html;
    }

    $scope.getAgentInfoBubbleDetailHtml = function (data) {
        var memberName = data.MemberFullName;
        var memberAddress = data.MemberAddress1;
        var Profile = JSON.parse(data.Profile).ProfileImageName;
        var html = '<div class="get-agent">';
        html += '<table><tr><td><img onload="loadDefaultAgentImage(this)" onerror="setDefaultImage(this)" src="' + Profile + '" class="get-agent-img"></td>';
        html += '<td><table><tr><td  colspan="2"><div class="center-text"><b>' + memberName + '</b></div></td></tr>';
        html += '<tr><td class="get-agent-bold"><b>Address:</b> </td><td class="get-agent-value">' + memberAddress + ' ' + data.MemberPostalCode + '</td></tr>';
        html += '<tr><td class="get-agent-bold"><b>City:</b> </td><td class="get-agent-value">' + data.MemberCity + ' ' + data.MemberStateOrProvince + '</td></tr>';
        html += '<tr><td class="get-agent-bold"><b>Office Name:</b></td><td class="get-agent-value">' + data.OfficeName + '</td></tr> ';
        html += '</table></td></tr> </table></div>';
        return html;

    }

    // $scope.loadAgentsInOfficeDetail = function (OfficeId) {
    //     console.log(OfficeId)
    //     propertiesService.getAgentSearchResult({"OfficeId": OfficeId}
    //         , function (success) {
    //             console.log(success);
    //             $scope.renderDetailResult(e, success);
    //         }, function (error) {
    //             console.log(error);
    //             aaNotify.warning('Error while displaying values!', {
    //                 showClose: true,                            //close button
    //                 iconClass: 'fa fa-exclamation-triangle',    //iconClass for a <i></i> style icon to use
    //                 allowHtml: true,                            //allows HTML in the message to render as HTML
    //                 ttl: 1000 * 3                              //time to live in ms
    //             });
    //         });
    // }


    $scope.setGoogleMapMarker = function () {
        var dropdownlist = $("#customAgentsorting").data("kendoDropDownList");
        dropdownlist.wrapper.hide();
        setTimeout(function () {
            if ($scope.click != 1) {
                return false;
            }
            $scope.click++;
            mapResults = $scope.agentSearchResults;
            var myCenter = new google.maps.LatLng(39.3, -77.120850);
            var mapProp = {
                center: myCenter,
                zoom: 8,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            };
            $scope.agentMap = new google.maps.Map(document.getElementById("googleMapAgent"), mapProp);
            var markers = [];
            for (var index = 0; index < mapResults.length; index++) {
                if (mapResults[index].Latitude != 0) {
                    var lattitudeInfo = mapResults[index].Latitude;
                    var longitudeInfo = mapResults[index].Longitude;
                    var MemberFullName = mapResults[index].MemberFullName;
                    var infowindow = new google.maps.InfoWindow({
                        maxWidth: 300
                    });

                    var _coordinates = new google.maps.LatLng(lattitudeInfo, longitudeInfo);
                    var _marker = new google.maps.Marker({
                        position: _coordinates,
//                    map: $scope.agentMap,
                        animation: google.maps.Animation.DROP,
                        title: MemberFullName,
                        data: mapResults[index],
                        icon: "/images/markers/0_Large.png"
                    });
//                $scope.agentMap.setZoom(9);

                    google.maps.event.addListener(_marker, 'click', (function (_marker, index) {
                        return function () {
                            infowindow.setContent($scope.getAgentInfoBubbleDetailHtml(_marker.data));
                            infowindow.open($scope.agentMap, _marker);
                        }
                    })(_marker, index));
                    markers.push(_marker);
                }
            }
            var mc = new MarkerClusterer($scope.agentMap, markers, {
                styles: [
                    {
                        url: '/images/markers/0_Large.png',
                        height: 45,
                        width: 45,
                        anchor: [19, 0],
                        textColor: '#ffffff',
                        textSize: 11
                    },
                    {
                        url: '/images/markers/0_Large.png',
                        height: 45,
                        width: 45,
                        anchor: [19, 0],
                        textColor: '#ffffff',
                        textSize: 11
                    },
                    {
                        url: '/images/markers/0_Large.png',
                        height: 45,
                        width: 45,
                        anchor: [19, 0],
                        textColor: '#ffffff',
                        textSize: 11
                    }
                ]
            });
        }, 250);
    }

    $scope.resetContactAgentForm = function() {
        $('#acf-fn').val('');
        $('#acf-ln').val('');
        $('#acf-email').val('');
        $('#acf-sales-assocaite-name').val('');
        $('#acf-dayphone').val('');
        $('#acf-evephone').val('');
        $('#acf-cellphone').val('');
        $('#acf-comment').val('');
    }

    $scope.submitContactAgentForm = function() {
     if(!$(".aa-notification").is(':visible')){
       $scope.clickOnce = true;
       var mailToAgent = "Hi " + $scope.contactAgentSelected.MemberFullName;
       mailToAgent += "<br/><br/>Please find my contact details below. I would like to connect with you.<br/><br/>";
       mailToAgent += "<b>Name</b>:  " + $('#acf-fn').val() + ' ' + $('#acf-ln').val() + "<br/>";
       mailToAgent += "<b>Email</b>:  " + $('#acf-email').val() + "<br/>";
       mailToAgent += "<b>Daytime Phone (with area code)</b>:  " + $('#acf-dayphone').val() + "<br/>";
       mailToAgent += "<b>Evening Phone (with area code)</b>:  " + $('#acf-evephone').val() + "<br/>";
       mailToAgent += "<b>Cell Phone (with area code)</b>:  " + $('#acf-cellphone').val() + "<br/>";
       mailToAgent += "<b>Contact Preference</b>:  " + $('input[name=acf-cp]:checked').val() + "<br/>";;
       mailToAgent += "<b>Time of Day Preference</b>:  " + $('input[name=acf-tp]:checked').val() + "<br/>";;
       mailToAgent += "<b>Connected to any Agent?</b>:  " + $('input[name=acf-agent]:checked').val() + "<br/>";;
       mailToAgent += "<b>My Sales Associate's name</b>:  " + $('#acf-sales-assocaite-name').val() + "<br/>";
       mailToAgent += "<b>Comment</b>:  " + $('#acf-comment').val();
       mailToAgent += "<br/><br/>Thanks,<br/>";
       mailToAgent += $('#acf-fn').val();

        var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
        var phoneValid  = /^[(]{0,1}[0-9]{3}[)]{0,1}[-\s\.]{0,1}[0-9]{3}[-\s\.]{0,1}[0-9]{4}$/;
        var cellRegex = /^\(?([0-9]{10})\)$/;

        if($('#acf-fn').val().trim() == '') {
           $scope.aaNotifyMsgObj = aaNotify.warning('First name is required!', {
                showClose: true,                            //close button
                iconClass: 'fa fa-exclamation-triangle',    //iconClass for a <i></i> style icon to use
                allowHtml: true,                            //allows HTML in the message to render as HTML
                ttl: 1000 * 3                              //time to live in ms
            });
            $scope.clickOnce = false;
        } else if($('#acf-ln').val().trim() == '') {
           $scope.aaNotifyMsgObj = aaNotify.warning('Last name is required!', {
                showClose: true,                            //close button
                iconClass: 'fa fa-exclamation-triangle',    //iconClass for a <i></i> style icon to use
                allowHtml: true,                            //allows HTML in the message to render as HTML
                ttl: 1000 * 3                              //time to live in ms
            });
            $scope.clickOnce = false;
        } else if($('#acf-email').val().trim() == '' ) {
          $scope.aaNotifyMsgObj=aaNotify.warning('Email is required!', {
                showClose: true,                            //close button
                iconClass: 'fa fa-exclamation-triangle',    //iconClass for a <i></i> style icon to use
                allowHtml: true,                            //allows HTML in the message to render as HTML
                ttl: 1000 * 3                              //time to live in ms
            });
            $scope.clickOnce = false;
        } else if(!filter.test($('#acf-email').val().trim())) {
          $scope.aaNotifyMsgObj = aaNotify.warning('Invalid email address!', {
                showClose: true,                            //close button
                iconClass: 'fa fa-exclamation-triangle',    //iconClass for a <i></i> style icon to use
                allowHtml: true,                            //allows HTML in the message to render as HTML
                ttl: 1000 * 3                              //time to live in ms
            });
            $scope.clickOnce = false;
        } else if($scope.acdayphone != "" && $scope.acdayphone != undefined && !phoneValid.test($scope.acdayphone)) {
          $scope.aaNotifyMsgObj=aaNotify.warning('Invalid Daytime Phone number!', {
                showClose: true,                            //close button
                iconClass: 'fa fa-exclamation-triangle',    //iconClass for a <i></i> style icon to use
                allowHtml: true,                            //allows HTML in the message to render as HTML
                ttl: 1000 * 3                              //time to live in ms
            });
            $scope.clickOnce = false;
        } else if($scope.acevephone != "" && $scope.acevephone != undefined && !phoneValid.test($scope.acevephone)) {
         $scope.aaNotifyMsgObj= aaNotify.warning('Invalid Evening Phone number!', {
                showClose: true,                            //close button
                iconClass: 'fa fa-exclamation-triangle',    //iconClass for a <i></i> style icon to use
                allowHtml: true,                            //allows HTML in the message to render as HTML
                ttl: 1000 * 3                              //time to live in ms
            });
            $scope.clickOnce = false;
        } else if($scope.accellphone != "" && $scope.accellphone != undefined && !phoneValid.test($scope.accellphone)) {
           $scope.aaNotifyMsgObj =aaNotify.warning('Invalid Mobile Phone number!', {
                showClose: true,                            //close button
                iconClass: 'fa fa-exclamation-triangle',    //iconClass for a <i></i> style icon to use
                allowHtml: true,                            //allows HTML in the message to render as HTML
                ttl: 1000 * 3                              //time to live in ms
            });
            $scope.clickOnce = false;
        }else {
            console.log('here');
            $scope.sendEmailToAgent($('#acf-email').val(), $scope.contactAgentSelected.MemberEmail, "Interested to work with you", mailToAgent);
        }
     }
    }

    $('#agentContactForm').on('hidden.bs.modal', function () {
        if (!$scope.issuccessPopup) {
           $timeout(function() { aaNotify.remove($scope.aaNotifyMsgObj); }, 0);
           } else {
            $scope.issuccessPopup =false;
           }
    });

    $scope.closeAgentContactForm = function() {
        $('#agentContactForm').modal('hide');
    }

   $scope.sendEmailToAgent = function(From, To, Subject, Body){
       console.log(From, To, Subject, Body);
       propertiesService.sendEmailToagent({ "From":From, "To":To, "Subject":Subject, "Body":Body },
           function (success) {
               $scope.closeAgentContactForm();
               $scope.clickOnce = false;
               $scope.issuccessPopup = true;
               $scope.aaNotifyMsgObj = aaNotify.success('Agent notified successfully.', {
                   showClose: true,                            //close button
                   allowHtml: true,                            //allows HTML in the message to render as HTML
                   ttl: 1000 * 3                              //time to live in ms
               });
           },
           function (error) {
              $scope.aaNotifyMsgObj = aaNotify.warning('Error while trying to submit contact form. Please try later!.', {
                   showClose: true,                            //close button
                   iconClass: 'fa fa-exclamation-triangle',    //iconClass for a <i></i> style icon to use
                   allowHtml: true,                            //allows HTML in the message to render as HTML
                   ttl: 1000 * 3                              //time to live in ms
               });
               $scope.clickOnce = false;
           }
       );
   }

    $scope.setGoogleMapOfficeSearchMarker = function () {
        var dropdownlist = $("#customOfficesorting").data("kendoDropDownList");
        dropdownlist.wrapper.hide();

        setTimeout(function () {
            if ($scope.click != 1) {
                return false;
            }
            $scope.click++;
            mapResults = $scope.officeSearchResults;
            var myCenter = new google.maps.LatLng(39.3, -77.120850);
            var mapProp = {
                center: myCenter,
                zoom: 8,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            };
            $scope.officeMap = new google.maps.Map(document.getElementById("googleMapOffice"), mapProp);
            var markers = [];
            for (var index = 0; index < mapResults.length; index++) {
                if (mapResults[index].Latitude != 0) {
                    var lattitudeInfo = mapResults[index].Latitude;
                    var longitudeInfo = mapResults[index].Longitude;
                    var OfficeName = mapResults[index].OfficeName;
                    var infowindow = new google.maps.InfoWindow({
                        maxWidth: 300
                    });

                    var _coordinates = new google.maps.LatLng(lattitudeInfo, longitudeInfo);
                    ;
                    var _marker = new google.maps.Marker({
                        position: _coordinates,
                        //                      map: $scope.officeMap,
                        animation: google.maps.Animation.DROP,
                        title: OfficeName,
                        icon: "/images/markers/0_Large.png",
                        data: mapResults[index]
                    });


                    google.maps.event.addListener(_marker, 'click', (function (_marker, index) {
                        return function () {
                            infowindow.setContent($scope.getOfficeInfoBubbleDetailHtml(_marker.data));
                            infowindow.open($scope.officeMap, _marker);
                        }
                    })(_marker, index));
                    markers.push(_marker);
                }
            }

            var mc = new MarkerClusterer($scope.officeMap, markers, {
                styles: [
                    {
                        url: '/images/markers/0_Large.png',
                        height: 45,
                        width: 45,
                        anchor: [12, 0],
                        textColor: '#ffffff',
                        textSize: 19
                    },
                    {
                        url: '/images/markers/0_Large.png',
                        height: 45,
                        width: 45,
                        anchor: [14, 0],
                        textColor: '#ffffff',
                        textSize: 17
                    },
                    {
                        url: '/images/markers/0_Large.png',
                        height: 45,
                        width: 45,
                        anchor: [16, 0],
                        textColor: '#ffffff',
                        textSize: 15
                    }
                ]
            });
        }, 250);
    }

    $scope.openInvitaionPopup = function (e) {
        e.preventDefault();
        var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
        $rootScope.$emit("CallOpenWorkWithMePopup", dataItem);
    }

    $scope.openAgentContactForm = function (e) {
        $scope.resetContactAgentForm();
        e.preventDefault();
        var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
        console.log(dataItem);
        $scope.contactAgentSelected = dataItem;
        if(dataItem.MemberEmail && dataItem.MemberEmail != '') {
            $('#agentContactForm').modal('show');
            if(document.getElementById("captureUserName").innerHTML != "Login or Register") {
                $('#acf-fn').val(appAuth.isLoggedIn().Audience.FirstName);
                $scope.acfirstname = appAuth.isLoggedIn().Audience.FirstName
                $('#acf-ln').val(appAuth.isLoggedIn().Audience.LastName);
                $scope.aclastname =appAuth.isLoggedIn().Audience.LastName;
                var email = localStorage.janrainCaptureProfileData;
                if (typeof(Storage) !== "undefined") {
                    if (localStorage.janrainCaptureProfileData) {
                        email = JSON.parse(email);
                        email = email['email'];
                    }
                }
                $('#acf-email').val(email);
                $scope.acemail = email;
            } else {
                $('#acf-fn').val('');
                $('#acf-ln').val('');
                $('#acf-email').val('');
            }
        } else {
            aaNotify.warning('Sorry! Agent email detail is not available! Please contact the agent through the contact number(s).', {
                showClose: true,                            //close button
                iconClass: 'fa fa-exclamation-triangle',    //iconClass for a <i></i> style icon to use
                allowHtml: true,                            //allows HTML in the message to render as HTML
                ttl: 1000 * 3                              //time to live in ms
            });
        }
    }

    angular.element('#agentContactForm').on('hidden.bs.modal', function (e) {

        if(appAuth.isLoggedIn().Audience.FirstName) {
            $scope.acfirstname = null;    
        }

        if(appAuth.isLoggedIn().Audience.LastName) {
            $scope.aclastname = null;            
        }

        var email = localStorage.janrainCaptureProfileData;
        if (typeof(Storage) !== "undefined") {
            if (localStorage.janrainCaptureProfileData) {
                email = JSON.parse(email);
                email = email['email'];
            }
        }

        if(email) {
            $scope.acemail = null;
        }

        
        $scope.acdayphone = null;
        $scope.acevephone = null;
        $scope.accellphone = null;
        $scope.acfcpnp = "No Preference";
        $scope.acftpnp = "No Preference";
        $scope.acfagentno = "No";
        $scope.acfsalesassocaitename = null;
        $scope.acfcomment = null;
        $("#acf-cp-np").prop("checked", true);
        $("#acf-tp-np").prop("checked", true);
        $("#acf-agent-no").prop("checked", true);
    })

    $scope.init();

}]);

function formatPhone(value) {
    value = '' + value + '';
    var numbers = value.replace(/\D/g, ''),
        char = {0: '(', 3: ') ', 6: '-'};
    value = '';
    for (var i = 0; i < numbers.length; i++) {
        value += (char[i] || '') + numbers[i];
    }
    return value;
}

function loadAgentsInOfficeDetail(OfficeId) {
    var injector = angular.element(document).injector();
    var propertiesService = injector.get('propertiesService');
    propertiesService.getAgentSearchResult({"OfficeId": OfficeId}
        , function (success) {
            console.log(success);
            if (success.Clients.length == 0) {
                // Do Nothing
                var aaNotifyinjector = angular.element(document).injector();
                var aaNotify = aaNotifyinjector.get('aaNotify');
                aaNotify.warning('No Agent to display!', {
                    showClose: true,                            //close button
                    iconClass: 'fa fa-exclamation-triangle',    //iconClass for a <i></i> style icon to use
                    allowHtml: true,                            //allows HTML in the message to render as HTML
                    ttl: 1000 * 3                              //time to live in ms
                });
                var $rootScope = aaNotifyinjector.get('$rootScope');
                $rootScope.$digest();
            } else {
                 
               if (document.getElementById("agentListViewWindow")==null||document.getElementById("agentListViewWindow")==undefined) 
                {
                 $("#agentsListreset")[0].innerHTML = '<div id="agentListViewWindow"><div id="agentListView"></div><div id="agentListViewPager" style="display: none;" class="k-pager-wrap"></div></div>';
                }

                var dataSource = new kendo.data.DataSource({
                    data: success.Clients,
                    pageSize: 3
                });


                var ListViewPagerKendo = $("#agentListViewPager").kendoPager({
                    dataSource: dataSource,
                    autoBind: false,
                    previousNext: true,
                    //refresh: true,  
                }).data("kendoPager");
                ListViewPagerKendo.page(1);
              

                var ListViewKendo = $("#agentListView").kendoListView({
                    dataSource: dataSource,
                    template: kendo.template($("#agent-list-view").html()),
                });


                var wnd = $("#agentListViewWindow").kendoWindow({
                    title: 'Agents of ' + success.Clients[0].OfficeName,
                    modal: true,
                    visible: false,
                    resizable: false,
                    width: 500,
                    refresh: true,
                    close: function(e) {
                         wnd.destroy();
                     },
                }).data("kendoWindow");
                document.getElementById("agentListViewPager").style.display = '';
                wnd.center().open();
               }
        }, function (error) {
           $scope.aaNotifyMsgObj = aaNotify.warning('Error while trying to show our Agents. Please try later!.', {
                showClose: true,                            //close button
                iconClass: 'fa fa-exclamation-triangle',    //iconClass for a <i></i> style icon to use
                allowHtml: true,                            //allows HTML in the message to render as HTML
                ttl: 1000 * 3                              //time to live in ms
            });
        });
    var $rootScope = injector.get('$rootScope');
    $rootScope.$digest();
}

/* Kendo Grid Custom Sorting */

function customSorting(GridId, fieldName) {

    var kendoGrid = $("#" + GridId).data('kendoGrid');
    var dsSort = [];

    var ds = kendoGrid.dataSource;
    var sort = ds.sort();

    // Display sorting fields and direction
    if (sort) {
        for (var i = 0; i < sort.length; i++) {
            if (sort[i].dir == 'asc') {
                dsSort.push({ field: fieldName, dir: "desc" });
            } else if (sort[i].dir == 'desc') {
                dsSort.push({ field: fieldName, dir: "asc" });
            }
        }
    } else {
        dsSort.push({ field: fieldName, dir: "asc" });
    }

    kendoGrid.dataSource.sort(dsSort);
}

function showCustomSorting(selectbox) {
    var dropdownlist = $("#" + selectbox).data("kendoDropDownList");
    dropdownlist.wrapper.show();
}

function showCurrentAgentOfficeDetails(e, OfficeFullStreetAddress) {
    var query = {};
    if($("#office-marker-map").length>0)
        $("#office-marker-map").remove();
    if(e != null) {
        e.preventDefault();
        var record = $("#agent-search-result-table").data('kendoGrid').dataItem($(e.currentTarget).closest("tr"));
        query = {OfficeId: record.OfficeId};
    } else{
        query = {OfficeFullStreetAddress: OfficeFullStreetAddress};
    }
    var injector = angular.element(document).injector();
    var propertiesService = injector.get('propertiesService');
    propertiesService.getOfficeSearchResult(query
        , function (success) {
            console.log(success);
            var dataItem = success.Offices[0];
            // var height = 700;
            // if(dataItem.AgentCount == "0") {
            //     height = 700;
            // }
            var wnd = $("#view-office-window").kendoWindow({
                title: "Office Details",
                modal: true,
                visible: false,
                resizable: false,
                // width: 500
                // height: height
            }).data("kendoWindow");
            detailsTemplate = kendo.template($("#view-office-template").html());
            wnd.content(detailsTemplate(dataItem));
            if(dataItem.AgentCount != "0") {
                $('#view-my-agents-button').show();
            }
            wnd.center().open();
            showMap("office-marker-map", dataItem.Latitude, dataItem.Longitude, dataItem.OfficeName);
        }, function (error) {
            console.log(error);
        });
}

function showCurrentAgentDetails(e) {
    console.log('here');
    e.preventDefault();
    var wnd = $("#view-agent-window").kendoWindow({
        title: "Agent Details",
        modal: true,
        visible: false,
        resizable: false
    }).data("kendoWindow");

    detailsTemplate = kendo.template($("#view-agent-template").html());
    var dataItem = $("#agent-search-result-table").data('kendoGrid').dataItem($(e.currentTarget).closest("tr"));
    wnd.content(detailsTemplate(dataItem));
    wnd.center().open();
    showMap("agent-marker-map", dataItem.Latitude, dataItem.Longitude, dataItem.MemberFullName);
}

function showFindAgentDetails(e) {
    e.preventDefault();
    var wnd = $("#view-agent-window").kendoWindow({
        title: "Agent Details",
        modal: true,
        visible: false,
        resizable: false,
        // width: 500,
        // height: 500
    }).data("kendoWindow");

    var classNameClick = "agentDetails-"+$(e.currentTarget).attr('class');
    detailsTemplate = kendo.template($("#view-agent-template").html());
    var dataItem = $("."+classNameClick).data('kendoGrid').dataItem($(e.srcElement).closest("tr"));
    wnd.content(detailsTemplate(dataItem));
    wnd.center().open();
    showMap("agent-marker-map", dataItem.Latitude, dataItem.Longitude, dataItem.MemberFullName);
}

function showCurrentOfficeDetails(e) {
    e.preventDefault();
    // var height = 520;
    var dataItem = $("#Office-search-result-table").data('kendoGrid').dataItem($(e.currentTarget).closest("tr"));
    // if(dataItem.AgentCount == "0") {
    //    height = 520;
    // }
    var wnd = $("#view-office-window").kendoWindow({
        title: "Office Details",
        modal: true,
        visible: false,
        resizable: false,
        // width: 500,
        // height: height
    }).data("kendoWindow");
    detailsTemplate = kendo.template($("#view-office-template").html());
    wnd.content(detailsTemplate(dataItem));
    if(dataItem.AgentCount != "0") {
        $('#view-my-agents-button').show();
    }
    wnd.center().open();
    showMap("office-marker-map", dataItem.Latitude, dataItem.Longitude, dataItem.OfficeName);
}

function showMap(selector, lat, lng, name) { // generic
    var myLatLng = {lat: parseFloat(lat), lng: parseFloat(lng)};
//        var myLatLng = {lat: -25.363, lng: 131.044};

    map = new google.maps.Map(document.getElementById(selector), {
        zoom: 12,
        center: myLatLng
    });

    var marker = new google.maps.Marker({
        position: myLatLng,
        map: map,
        title: name + '\'s Location'
    });
}

function onSelectAgent(e) {
    var dataItem = this.dataItem(e.item);
    customSorting('agent-search-result-table', dataItem.value);
}

function onSelectOffice(e) {
    var dataItem = this.dataItem(e.item);
    customSorting('Office-search-result-table', dataItem.value);
}

function setDefaultImage(image) {
    image.onerror = "";
    image.src = "/images/client-dashboard.png";
    return true;
}
function setDefaultOfficeImage(image) {
    image.onerror = "";
    image.src = "/images/office-image-3d.png";
    return true;
}
function loadDefaultOfficeImage(img) {
    if (typeof img.naturalWidth !== "undefined" && img.naturalWidth <=1 ) {
         img.src = "/images/office-image-3d.png";
        return true;    
    }
}
function loadDefaultAgentImage(img) {
    if (typeof img.naturalWidth !== "undefined" && img.naturalWidth <=1 ) {
        img.src = "/images/client-dashboard.png";
        return true;    
    }
}