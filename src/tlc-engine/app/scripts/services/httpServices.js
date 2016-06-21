angular.module('tlcengineApp').factory('httpServices', ['propertiesService','appAuth','bookmarkService','localStorageService','$analytics',
  function (propertiesService,appAuth,bookmarkService,localStorageService,$analytics) {

  return {
    getClientDetail: function (clientId) {
      if(appAuth.isLoggedIn().AudienceType == 'CLIENT') {
        return propertiesService.getClientDetail({clientId:appAuth.getAudienceId() }).$promise;
      }
      else {
        return propertiesService.agentClientDetail({clientId: clientId, agentId: appAuth.getAudienceId()}).$promise;
      }
    },
    updateClientDetail: function (client) {
      if(appAuth.isLoggedIn().AudienceType == 'CLIENT') {
        return propertiesService.updateClient({clientId:client.Id },client).$promise;
      }
      else {
        return propertiesService.agentUpdateClient({clientId: client.Id, agentId: appAuth.getAudienceId()},client).$promise;
      }
    },
    clientEmailVerify: function (client) {
      if(appAuth.isLoggedIn().AudienceType == 'CLIENT') {
        return propertiesService.clientEmailVerify(client).$promise;
      }
      else {
        return propertiesService.agentClientEmailValidate({agentId: appAuth.getAudienceId()},client).$promise;
      }
    },
    getAgentDetail: function () {
      if(appAuth.isLoggedIn().AudienceType == 'CLIENT') {
        return propertiesService.getAgentDetailForClient({clientId:appAuth.getAudienceId() }).$promise;
      }
      else {
        return propertiesService.getAgentDetail({agentId: appAuth.getAudienceId() }).$promise;
      }
    },
    getAgentDetailWithoutLogin: function () {
      var audi_id = getAgentId();
      if(appAuth.isLoggedIn().AudienceType == 'CLIENT') {
        return propertiesService.getAgentDetailForClient({clientId: audi_id }).$promise;
      }
      else {
        return propertiesService.getAgentDetail({agentId: audi_id }).$promise;
      }
    },
    getSavedSearch: function () {
      if(appAuth.isLoggedIn().AudienceType == 'CLIENT') {
        return propertiesService.getClientSavedSearch({clientId:appAuth.getAudienceId() }).$promise;
      }
      else {
        return propertiesService.getAgentSavedSearch({agentId: appAuth.getAudienceId() }).$promise;
      }
    },
    deleteClientFromAgent: function (clientId) {
      if(appAuth.isLoggedIn().AudienceType != 'CLIENT') {
        return propertiesService.deleteClientFromAgent({agentId: appAuth.getAudienceId(), "clientId": clientId }).$promise;
      }
    },
    deleteSavedSearch: function (savedSearchId) {
      if(appAuth.isLoggedIn().AudienceType == 'CLIENT') {
        return propertiesService.deleteClientSavedSearch({clientId:appAuth.getAudienceId(), "savedSearchId": savedSearchId }).$promise;
      }
      else {
        return propertiesService.deleteAgentSavedSearch({agentId: appAuth.getAudienceId(), "savedSearchId": savedSearchId }).$promise;
      }
    },
    updateSavedSearchNotification: function (savedSearchId, obj) {
      if(appAuth.isLoggedIn().AudienceType == 'CLIENT') {
        return propertiesService.updateClientSavedSearchNotification({clientId:appAuth.getAudienceId(), "savedSearchId": savedSearchId }, obj).$promise;
      }
      else {
        return propertiesService.updateAgentSavedSearchNotification({agentId: appAuth.getAudienceId(), "savedSearchId": savedSearchId }, obj).$promise;
      }
    },
    saveSearch: function (obj) {
      if(appAuth.isLoggedIn().AudienceType == 'CLIENT') {
        return propertiesService.saveClientSearch({clientId:appAuth.getAudienceId() },obj).$promise;
      }
      else {
        return propertiesService.saveAgentSearch({agentId: appAuth.getAudienceId() },obj).$promise;
      }
    },
    saveClientSearchByAgent: function (clientId, obj) {
      if(appAuth.isLoggedIn().AudienceType != 'CLIENT') {
          return propertiesService.saveClientSearchByAgent({agentId: appAuth.getAudienceId(), clientId: clientId },obj).$promise;
      }
    },
    tlcCalculator: function (type,listingId,objCalculator,clientId) {
      if(type == 'manual') {
        return propertiesService.tlcCalculator({id: listingId},objCalculator).$promise;
      }
      else {
        return propertiesService.tlcClientCalculator({id: listingId,clientId: clientId},objCalculator).$promise;
      }
    },
    favoritesClient: function (ListingIds) {
        return propertiesService.favoritesClient({clientId:appAuth.getAudienceId()},ListingIds).$promise;
    },
    deletebookmarksByClient: function (ListingIds) {
      return bookmarkService.deletebookmarksByClient(appAuth.getAudienceId(), ListingIds);
    },
    deletefavoritesClient: function (ListingIds) {
      return bookmarkService.deletefavoritesClient(appAuth.getAudienceId(), ListingIds);
    },
    getAuthentication: function () {
      return propertiesService.getAuthentication({}).$promise;
    },
    getPropertyDetail: function (listingId, mlsNumber) {
      if(listingId > 0) {
        return propertiesService.getPropertyDetail({ id: listingId }).$promise;
      }
      else if(mlsNumber > 0)
      {
        return propertiesService.getPropertyDetailByMLS({ id: mlsNumber }).$promise;
      }
    },
    getPropertyDetailForCompare: function (listingId) {
        return propertiesService.getPropertyDetailForCompare({ PropertyId: listingId }).$promise;
    },
    getPropertylistingId: function (mlsNumber) {
        var requestParams = {
            "mlsNumber":mlsNumber
        };
        return propertiesService.getlistingId(requestParams).$promise;
    },    
    compareneighbourhood: function (compareNeighbourhood) {
      return propertiesService.compareneighbourhood(compareNeighbourhood).$promise;
    },
    getclustersByType: function (type,data) {
      switch(type)
      {
        case 'zipcode':
          return propertiesService.clustersZipcode(data).$promise;
          break;
        case 'towns':
          return propertiesService.clustersTowns(data).$promise;
          break;
        case 'lakes':
          return propertiesService.clustersLakes(data).$promise;
          break;
        case 'neighborhoods':
          return propertiesService.clustersNeighborhoods(data).$promise;
          break;
        case 'counties':
          return propertiesService.clustersCounties(data).$promise;
          break;
      }
    },
    logoutUser: function () {
      if(appAuth.isLoggedIn().AudienceType == 'CLIENT') {
        propertiesService.logoutClient({clientId:appAuth.getAudienceId(),accessToken:appAuth.isLoggedIn().AccessToken}).$promise.then(
          function (success) {
            appAuth.logout();
          },
          function (error) {
            appAuth.logout();
          });
      }
      else {
        return propertiesService.logoutAgent({agentId: appAuth.getAudienceId(),accessToken:appAuth.isLoggedIn().AccessToken}).$promise.then(
          function (success) {
            if(success.RedirectUrl)
            {
              localStorageService.remove('authorizationData');
              localStorageService.remove('settings');
              //localStorageService.remove('redirectToUrlAfterLogin');

              window.location.href = success.RedirectUrl;
            }
            else {
              appAuth.logout();
            }
          },
          function (data, status, headers, config) {
            /*console.log(data);
            console.log(status);
            console.log(headers);
            console.log(config);
            /*if(data.status == 302)
            {
              window.location.href = data.headers.location;
            }
            else
            {
              appAuth.logout();
            }*/

            appAuth.logout();
          });
      }
    },
    trackGoogleEvent : function(eventName, category, value, label)
    {
      $analytics.eventTrack(eventName, {
        category: category, label: label || appAuth.isLoggedIn().AudienceType, value: value
      });
        console.log(eventName, category, value, label)
    },
    getCity: function (stateName,cityName) {
        return propertiesService.getCity({state:stateName,cityname: cityName}).$promise;
    },
    getCityBoundaryDetails: function (stateName,cityName) {
        return propertiesService.getCityBoundary({state:stateName,cityname: cityName}).$promise;
    },
    getCityDemographicsDetails: function (stateName,cityName) {
        return propertiesService.getCityDemographics({state:stateName,cityname: cityName}).$promise;
    },
    getCitySchoolsDetails: function (stateName,cityName) {
        return propertiesService.getCitySchool({state:stateName,cityname: cityName}).$promise;
    },
    getNearByOfficeDetails: function (Latitude,Longitude,nearCityOffice) {
        var requestJson = {
            "latitude":Latitude,
            "longitude":Longitude,
            "sortby":nearCityOffice
        };
        return propertiesService.getNearByOffice(requestJson).$promise;
    },
    getNearByCityDetails: function (Latitude,Longitude,nearCityOffice,City) {
        var requestJson = {
            "latitude":Latitude,
            "longitude":Longitude,
          "city": City
        };
        return propertiesService.getNearByCity(requestJson).$promise;
    },

    getSchoolData: function (SchoolName) {
      var SchoolName = {"SchoolName": SchoolName};
      return propertiesService.getSchoolsdistrict(SchoolName).$promise;
    },

    getSubDivisionData: function (SubDivisionName) {
      var SchoolName = {"SubDivisionName": SubDivisionName};
      return propertiesService.getSubdivision(SchoolName).$promise;
    },

    getCityDetails: function (citySuggestion) {
      var requestJson = {
        "city":citySuggestion,
      };
      return propertiesService.getcitystate(requestJson).$promise;
    },
  }
}]);

