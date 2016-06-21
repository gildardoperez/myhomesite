'use strict';

/**
 * @ngdoc service
 * @name tlcengineApp.propertiesService
 * @description
 * # propertiesService
 * Factory in the tlcengineApp.
*/
angular.module('tlcengineApp')
  .factory('propertiesService', [ '$resource', function ($resource) {
    // AngularJS will instantiate a singleton by calling "new" on this function

    var coreUrl = globalSettings.APIUrl; //"http://devapiv2.tlcengine.com/v2/api";
    var hostUrl = globalSettings.API_NSMLS_MLSUrl; //coreUrl + "/nsmls";
    //var headerParameters = {"Authorization" : "token 86C6050A-27B9-4372-9B4A-E1CF92CB12AC"};
//    var headerParameters = {"Authorization" : "bearer 11c08731-17f2-4f21-9d0a-2d4f19bfebd4"};
//    var postHeaderParameters = {"Authorization":"bearer 11c08731-17f2-4f21-9d0a-2d4f19bfebd4","Content-Type":"application/json;charset=utf-8","Accept":"application/json, text/plain, */*"}
    //var headerParameters = {"Authorization" : "bearer 16855167-2ea8-4c37-851a-265476204685"};
    //var postHeaderParameters = {"Authorization":"bearer 16855167-2ea8-4c37-851a-265476204685","Content-Type":"application/json;charset=utf-8","Accept-Encoding":"gzip, deflate","Accept":"application/json, text/plain, */*"}
    var propertiesService = $resource(hostUrl, {},{
      //getProperties : {url: hostUrl + '/listingsdata', method: "POST", isArray:false},
      getLatestListings : {url: hostUrl + '/listings/latest', method: "GET", isArray:false },
      getPropertyDetail : {url: hostUrl + '/listingsdata/:id', method: "GET", isArray:false },
      getPropertyDetailByMLS : {url: hostUrl + '/listings/mlsids/:id', method: "GET", isArray:false },
      getDemographicsDetail : {url: coreUrl + '/demographics/:zipcode', method: "GET", isArray:false },
      getPOIS : {url: hostUrl + '/listings/:id/pois', method: "GET", isArray:false },
      getClients : {url: hostUrl + '/agents/:agentId/clients', method: "GET", isArray:false },
      deleteClientFromAgent : {url: hostUrl + '/agents/:agentId/clients/:clientId', method: "DELETE" },
      agentClientDetail : {url: hostUrl + '/agents/:agentId/clients/:clientId', method: "GET", isArray:false },
      getClientDetail : {url: hostUrl.replace("http:","https:") + '/clients/:clientId', method: "GET", isArray:false },
      tlcCalculator : {url: hostUrl + '/tlc/listings/:id', method: "POST", isArray:false },
      tlcClientCalculator : {url: hostUrl + '/tlc/listings/:id/clients/:clientId', method: "POST", isArray:false },
      getVehicles : {url: hostUrl + '/basedata/vehicles/:year', method: "GET", isArray:false },
      bookmarksClient : {url: hostUrl + '/agents/:agentId/clients/:clientId/bookmarks', method: "POST" },
      getbookmarksClient : {url: hostUrl + '/agents/:agentId/clients/:clientId/bookmarks', method: "Get", isArray:false },
      //deletebookmarksClient : {url: hostUrl + '/agents/:agentId/clients/:clientId/bookmarks', method: "DELETE"},
      getGasRates : {url: hostUrl + '/basedata/gasrates', method: "GET", isArray:false },
      getAllAPRRates : {url: hostUrl + '/basedata/aprrates', method: "GET", ignoreLoadingBar: true, isArray:false },
      getAPRRates : {url: hostUrl + '/basedata/aprrates/:stateCode', method: "GET", isArray:false },
      // agentNewClient : {url: hostUrl.replace("http:","https:") + '/agents/:agentId/clients', method: "POST" },
      agentNewClient : {url: hostUrl + '/agents/addnewclient', method: "POST" },
      agentUpdateClient : {url: hostUrl.replace("http:","https:") + '/agents/:agentId/clients/:clientId', method: "PUT" },
      updateClient : {url: hostUrl.replace("http:","https:") + '/clients/:clientId', method: "PUT" },
      residencecost : {url: hostUrl + '/tlc/residencecost', method: "POST", isArray:true },
      entertainmentByPostalCode : {url: hostUrl + '/basedata/entertainment/:postalCode', method: "GET", isArray:false },
      //existingClientEmailVerify : {url: hostUrl + '/clients/:clientId/:email/verifydupicates', method: "POST",  headers: headerParameters},
      //newClientEmailVerify : {url: hostUrl + '/clients/:email/verifydupicates', method: "POST"},
      agentClientEmailValidate : {url: hostUrl + '/agents/:agentId/clients/verifyduplicates', method: "POST" },
      clientEmailVerify : {url: hostUrl + '/clients/verifyduplicates', method: "POST" },
      getAuthentication : {url: hostUrl.replace("http:","https:") + '/accesstokens/auth', method: "GET", isArray:false },
      agentLogin : {url: hostUrl.replace("http:","https:") + '/accesstokens/agents', method: "POST" },
      clientLogin : {url: hostUrl.replace("http:","https:") + '/accesstokens/clients', method: "POST" },
      getAgentDetail : {url: hostUrl + '/agents/:agentId', method: "GET", isArray:false },
      updateAgentDetail : {url: hostUrl + '/agents/:agentId', method: "PUT" },
      saveAgentSearch: {url: hostUrl + '/agents/:agentId/savedsearches', method: "POST" },
      saveClientSearchByAgent: {url: hostUrl + '/agents/:agentId/clients/:clientId/savedsearches', method: "POST" },
      getAgentSavedSearch: {url: hostUrl + '/agents/:agentId/savedsearches', ignoreLoadingBar: true, method: "GET" },
      getClientSearchByAgent: {url: hostUrl + '/agents/:agentId/clients/:clientId/savedsearches', method: "GET" },
      deleteAgentSavedSearch: {url: hostUrl + '/agents/:agentId/savedsearches/:savedSearchId', method: "DELETE" },
      saveClientSearch: {url: hostUrl + '/clients/:clientId/savedsearches', method: "POST" },
      getClientSavedSearch: {url: hostUrl + '/clients/:clientId/savedsearches', method: "GET" },
      deleteClientSavedSearch: {url: hostUrl + '/clients/:clientId/savedsearches/:savedSearchId', method: "DELETE" },
      getAgentDetailForClient : {url: hostUrl + '/clients/:clientId/agent', method: "GET", isArray:false },
      getBookmarksForClient : {url: hostUrl + '/clients/:clientId/bookmarks', method: "GET", isArray:false },
      getFavoritesForClient : {url: hostUrl + '/clients/:clientId/favorites', method: "GET", isArray:false },
      favoritesClient : {url: hostUrl + '/clients/:clientId/favorites', method: "POST" },
      resetPassword : {url: hostUrl.replace("http:","https:") + '/accesstokens/credentials/reset', method: "POST" },
      changePassword : {url: hostUrl.replace("http:","https:") + '/accesstokens/credentials/update', method: "POST" },
      getAnalyticskeys : {url: hostUrl + '/basedata/analyticskeys', method: "GET", isArray:false },
      getAgentClientAnalytics : {url: hostUrl + '/agents/:agentId/clientAnalytics', method: "GET", isArray:true },
      getClientAnalytics : {url: hostUrl + '/agents/:agentId/clients/:clientId/clientAnalytics', method: "GET", isArray:true },
      /*getSamlAuthentication : {url: hostUrl + '/accesstokens/auth', method: "GET", isArray:false},
       agentSamlLogin : {url: hostUrl + '/accesstokens/agents', method: "POST"},
       clientSamlLogin : {url: hostUrl + '/accesstokens/clients', method: "POST"},*/
      sendiFrameVendorInstruction : {url: hostUrl + '/agents/:agentId/iFrameVendorInstructions', method: "POST" },
      resendPasswordToClient: {url: hostUrl + '/agents/:agentId/clients/:clientId/resendpassword', method: "POST" },
      getSettings : {url: hostUrl + '/basedata/settings', method: "GET", isArray:false},
      logoutClient: {url: hostUrl + '/accesstokens/clients/:clientId/:accessToken', method: "DELETE" },
      logoutAgent: {url: hostUrl + '/accesstokens/agents/:agentId/:accessToken', method: "DELETE" },
      getSchoolsdistrict : {url: hostUrl + '/basedata/schooldistricts', method: "POST", isArray:false },
      getSubdivision : {url: hostUrl + '/basedata/subdivision', method: "POST", isArray:false },
      updateAgentSavedSearchNotification : {url: hostUrl + '/agents/:agentId/savedsearches/:savedSearchId/notifications', method: "POST" },
      updateClientSavedSearchNotification : {url: hostUrl + '/clients/:clientId/savedsearches/:savedSearchId/notifications', method: "POST" },
      updateLifestyledata : {url: hostUrl + '/agents/:agentId/listings/:listingId/lifestyledata', method: "POST" },
      compareneighbourhood : {url: hostUrl + '/compareneighbourhood', method: "POST", isArray:true },
      unsubscribeNotifications : {url: hostUrl + '/unsubscribeNotifications/:agentId', method: "POST" },
      clustersZipcode : {url: hostUrl + '/listings/clusters/zipcode', method: "GET", isArray:true },
      clustersTowns : {url: hostUrl + '/listings/clusters/towns', method: "GET", isArray:true },
      clustersLakes : {url: hostUrl + '/listings/clusters/lakes', method: "GET", isArray:true },
      clustersNeighborhoods : {url: hostUrl + '/listings/clusters/neighborhoods', method: "GET", isArray:true },
      clustersCounties : {url: hostUrl + '/listings/clusters/counties', method: "GET", isArray:true },
      getSchoolsDetail : {url: hostUrl + '/listings/:listingId/schools/:number', method: "GET", isArray:true },
      getAgentSearchResult : {url: hostUrl + '/agents/agentsearch', method: "POST", isArray:false },
      getOfficeSearchResult : {url: hostUrl + '/agents/officesearch', method: "POST", isArray:false },
      addfavorites : {url: hostUrl + '/agents/mozaic/bookmarks/addfavorites', method: "POST" },
      getFavorites : {url: hostUrl + '/agents/mozaic/bookmarks/getfavorites', method: "POST" },
      inviteAgent : {url: hostUrl + '/inviteagent/sendrequest', method: "POST" },
      getBasicSettings : {url: hostUrl + '/basedata/dcat', method: "GET", isArray:false},
      getMozaicAgent : {url: hostUrl + '/askquestion/getagents', method: "POST", isArray:false},
      saveAgentId : {url: hostUrl + '/clients/updateagentid', method: "POST", isArray:false},
      askQuestion : {url: hostUrl + '/askquestion/savequestions', method: "POST", isArray:false},
      getCity : {url: hostUrl + '/community/:state/:cityname', method: "GET"},
      getlistingId : {url: hostUrl + '/getlistingid/', method: "POST", isArray:true },
      getCityBoundary : {url: hostUrl + '/community/:state/:cityname/boundary', method: "GET"},
      getCityDemographics : {url: hostUrl + '/community/:state/:cityname/demographics', method: "GET"},
      getCitySchool : {url: hostUrl + '/community/:state/:cityname/schools', method: "GET", isArray:true },
      getNearByCity : {url: hostUrl + '/community/nearbycity', method: "POST", isArray:true },
      getNearByOffice : {url: hostUrl + '/community/nearbyoffice', method: "POST", isArray:true },
      sendEmailToagent : {url: hostUrl + '/agents/emailagent', method: "POST" },
      getAllNeighborhood : {url: hostUrl + '/basedata/neighborhood', method: "GET", ignoreLoadingBar: true, isArray:false },
      getcitystate: { url: hostUrl + '/getcitystate/', method: "POST", isArray: true },
      getContactSyncClients : { url: hostUrl + '/clients/getclients', method: "GET", isArray: false}
    });

    var getSortPrice = function(price){
      return addCommas(Math.round(price / 1000))+"k";
    }

    return propertiesService;

  }]);


angular.module('tlcengineApp')
  .factory('bookmarkService', [ '$resource','$http','$q', function ($resource,$http,$q) {
    // AngularJS will instantiate a singleton by calling "new" on this function

    var coreUrl = globalSettings.APIUrl; //"http://devapiv2.tlcengine.com/v2/api";
    var hostUrl = globalSettings.API_NSMLS_MLSUrl; //coreUrl + "/nsmls";
    //  var headerParameters = {"Authorization" : "token 86C6050A-27B9-4372-9B4A-E1CF92CB12AC",
    //"Content-Type": "application/json;charset=utf-8"}
    var headerParameters = {"Content-Type": "application/json;charset=utf-8"};
//      var postHeaderParameters = {"Authorization":"bearer 11c08731-17f2-4f21-9d0a-2d4f19bfebd4","Content-Type":"application/json;charset=utf-8","Accept":"application/json, text/plain, */*"}

    var getProperties = function(filterCriteria){
      //console.log(filterCriteria);
      var canceller = $q.defer();

      var cancel = function(reason){
        //console.log("cancel request");
        canceller.resolve(reason);
      };
      var promise = $http({
        url: hostUrl + '/listingsdata',
        method: "POST",
        data: filterCriteria,
        timeout: canceller.promise,
        headers: headerParameters
      }).then(function(response){
        return response.data;
      });


      return {
        promise: promise,
        cancel: cancel
      };
    };

    return {
      getProperties: getProperties,
      deletebookmarksByAgent: function (agentId,clientId,ListingIds) {
        return $http({
          url: hostUrl + '/agents/' + agentId + '/clients/' + clientId + '/bookmarks',
          method: "DELETE",
          data: ListingIds,
          headers: headerParameters
        });
      },
      deletebookmarksByClient: function (clientId,ListingIds) {
        return $http({
          url: hostUrl + '/clients/' + clientId + '/bookmarks',
          method: "DELETE",
          data: ListingIds,
          headers: headerParameters
        });
      },
      deletefavoritesClient: function (clientId,ListingIds) {
        return $http({
          url: hostUrl + '/clients/' + clientId + '/favorites',
          method: "DELETE",
          data: ListingIds,
          headers: headerParameters
        });
      }
    }
  }]);
