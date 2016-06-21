/**
 * Created by gugan_mohan on 6/15/2016.
 */

/**
 * Created by gugan_mohan on 1/29/2016.
 */

angular.module('tlcengineApp').controller('contactSyncCtrl', ['$rootScope', '$scope', '$controller', 'propertiesService', 'aaNotify', 'utilService', 'appAuth','$timeout', function ($rootScope, $scope, $controller, propertiesService, aaNotify, utilService, appAuth, $timeout) {

    $scope.init = function () {
        $scope.initClientsSearch();
        $scope.getClientsResult();
    };

    $scope.getClientsResult  = function () {
        propertiesService.getContactSyncClients({}, function (success) {
            console.log(success);
            $scope.renderClientsResults(success.Clients);
        }, function (error) {
            console.log(error);
        });
    }

    $scope.renderClientsResults = function (results) {
        var grid = $("#contact-sync-result-table").data("kendoGrid");
        grid.dataSource.data(results);
        grid.refresh();
        $scope.agentSearchResults = results;
    }

    $scope.initClientsSearch = function () {
        var dataSource = new kendo.data.DataSource({
            data: [],
            type: "odata",
            schema: {
                model: {
                    fields: {
                        FirstName: { type: "string" },
                        LastName: { type: "string" },
                        Email: { type: "string" },
                        MobilePhone: { type: "string" },
                        OfficePhone: { type: "string" },
                        HomePhone: { type: "string" },
                        StreetAddress: { type: "string" },
                        City: { type: "string" },
                        State: { type: "string" },
                        Postalcode: { type: "string" },
                        ClientSSOId: { type: "string" },
                        CreatedOn: { type: "string" },
                        LastUpdatedOn: { type: "string" },
                        agent_sso_id: { type: "string"}
                    }
                }
            },
            pageSize: 25
        });

        $("#contact-sync-result-table").kendoGrid({
            dataSource: dataSource,
            sortable: true,
            pageable: true,
            resizable: true,
            filterable: {
                mode: "row"
            },
            columns: [
                {  field: "FirstName", title: "First Name",
                    filterable: {
                        cell: {
                            showOperators: false,
                            operator: "contains"
                        }
                    }
                },
                {  field: "LastName", title: "Last Name",
                    filterable: {
                        cell: {
                            showOperators: false,
                            operator: "contains"
                        }
                    }
                },
                {  field: "Email", title: "Email", width: 300,
                    filterable: {
                        cell: {
                            showOperators: false,
                            operator: "contains"
                        }
                    }
                },
                {  field: "MobilePhone", title: "Mobile Phone",
                    filterable: {
                        cell: {
                            showOperators: false,
                            operator: "contains"
                        }
                    }
                },
                {  field: "OfficePhone", title: "Office Phone",
                    filterable: {
                        cell: {
                            showOperators: false,
                            operator: "contains"
                        }
                    }
                },
                {  field: "HomePhone", title: "Home Phone",
                    filterable: {
                        cell: {
                            showOperators: false,
                            operator: "contains"
                        }
                    }
                },
                {  field: "StreetAddress", title: "Street Address",
                    filterable: {
                        cell: {
                            showOperators: false,
                            operator: "contains"
                        }
                    }
                },
                {  field: "City", title: "City",
                    filterable: {
                        cell: {
                            showOperators: false,
                            operator: "contains"
                        }
                    }
                },
                {  field: "State", title: "State",
                    filterable: {
                        cell: {
                            showOperators: false,
                            operator: "contains"
                        }
                    }
                },
                {  field: "Postalcode", title: "Postal Code",
                    filterable: {
                        cell: {
                            showOperators: false,
                            operator: "contains"
                        }
                    }
                },
                {  field: "ClientSSOId", title: "Client SSO Id",
                    filterable: {
                        cell: {
                            showOperators: false,
                            operator: "contains"
                        }
                    }
                },
                {  field: "agent_sso_id", title: "Agent SSO Id",
                    filterable: {
                        cell: {
                            showOperators: false,
                            operator: "contains"
                        }
                    }
                },
                {  field: "CreatedOn", title: "Created", width: 200,
                    filterable: {
                        cell: {
                            showOperators: false,
                            operator: "contains"
                        }
                    }
                },
                {  field: "LastUpdatedOn", title: "Last Updated", width: 200,
                    filterable: {
                        cell: {
                            showOperators: false,
                            operator: "contains"
                        }
                    }
                },
            ]
        });

    }

    $scope.init();

}]);