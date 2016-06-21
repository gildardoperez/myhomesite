var globalSettings = {
    APIUrl : '//uatapimrisv2.tlcengine.com/v2/api',
    API_NSMLS_MLSUrl:'//uatapimrisv2.tlcengine.com/v2/api/mris',
    API_MRIS_MLSUrl:'//uatapimrisv2.tlcengine.com/v2/api/mris',
    propertyDetailOnOff : true,
    defaultState:'MD',
    agentId: "119FE020-B4FE-44A4-9D9A-3CA59421A7C1"
};

if(window.location.hostname == "localhost") {
    globalSettings = {
        APIUrl : '//devapimrisv2.tlcengine.com/v2/api',
        API_NSMLS_MLSUrl:'//devapimrisv2.tlcengine.com/v2/api/mris',
        API_MRIS_MLSUrl:'//devapimrisv2.tlcengine.com/v2/api/mris',
        propertyDetailOnOff : true,
        defaultState:'MD',
        agentId: "6B91172B-1E24-4A6D-94D0-FA85AF7F6ABC"
    };
}

if(window.location.hostname == "mrisdev.tlcengine.com") {
    globalSettings = {
        APIUrl : '//devapimrisv2.tlcengine.com/v2/api',
        API_NSMLS_MLSUrl:'//devapimrisv2.tlcengine.com/v2/api/mris',
        API_MRIS_MLSUrl:'//devapimrisv2.tlcengine.com/v2/api/mris',
        propertyDetailOnOff : true,
        defaultState:'MD',
        agentId: "6B91172B-1E24-4A6D-94D0-FA85AF7F6ABC"
    };
}

if(window.location.hostname == "mrishomes.sysvine.local") {
    globalSettings = {
        APIUrl : '//mrishomesapi.sysvine.local/api',
        API_NSMLS_MLSUrl:'//mrishomesapi.sysvine.local/api/mris',
        API_MRIS_MLSUrl:'//mrishomesapi.sysvine.local/api/mris',
        propertyDetailOnOff : true,
        defaultState:'MD',
        agentId: "6B91172B-1E24-4A6D-94D0-FA85AF7F6ABC"
    };
}
if(window.location.hostname == "mrishomestest.tlcengine.com") {
    globalSettings = {
        APIUrl : '//mristestapi.tlcengine.com/api',
        API_NSMLS_MLSUrl:'//mristestapi.tlcengine.com/api/mris',
        API_MRIS_MLSUrl:'//mristestapi.tlcengine.com/api/mris',
        propertyDetailOnOff : true,
        defaultState:'MD',
        agentId: "119FE020-B4FE-44A4-9D9A-3CA59421A7C1"
    };
}