**Search Query**

**URL:** [https://enterprise-dev-eifa-approuter.cfapps.eu10.hana.ondemand.com/EIFA-NODE_api/search]()

**METHOD:** POST

**REQUEST BODY:**

```
{
    "keyword":"What is my revenue",
    "initialQuestion": true
}
```

**RESPONSE BODY:**


```
{
    "status": "success",
    "dataFound": true,
    "data": [
        {
            "Revenue": "359324885.50",
            "Quarter": "Q1"
        },
        {
            "Revenue": "363699132.50",
            "Quarter": "Q2"
        }
    ],
    "axis": {
        "y": [
            "Revenue"
        ],
        "x": "Quarter"
    },
    "currency": "USD",
    "chartType": "line",
    "title": "2020 Revenue by Quarter",
    "type": "question",
    "validQuestion": true,
    "sql": "SELECT SUM(\"Revenue\") AS \"Revenue\", \"Quarter\" AS \"Quarter\" FROM \"7948535F11F94C619C2DE45470343ED7\".\"EIFA.db.datModels::RevenueActualPlanned\" WHERE UPPER(\"Year\") = 2020 GROUP BY \"Quarter\" LIMIT 1000",
    "question": "What is my revenue",
    "suggestedQuestions": [
        "Overall Revenue",
        "what is revenue by quarter",
        "what is ebit",
        "what is actual vs budget",
        "what is cost by location",
        "what is profit for different segment"
    ]
}
```



**Add Favorites (Sample Request):**

**URL:** [https://enterprise-dev-eifa-approuter.cfapps.eu10.hana.ondemand.com/EIFA-NODE_api/addfavourite]()

**METHOD:** POST

**REQUEST BODY:**
              
```
{
                "question": "What is the revenue by Year?",
               "sql": "SELECT SUM(\"Amount\") AS \"SUM\", \"Year\" AS \"Year\" FROM \"7948535F11F94C619C2DE45470343ED7\".\"EIFA.db.datModels::RevenueActual\" GROUP BY \"Year\" LIMIT 1000",
               "chartType": "bar"
}
```


**RESPONSE BODY:**


```
{
    "status": "success",
    "UserFavoritesID": 19,
    "message": "Favourites added successfully!"
}
```



## **GET Favourites by UserId:**

**URL:** [https://enterprise-dev-eifa-approuter.cfapps.eu10.hana.ondemand.com/EIFA-NODE_api/getuserfavourite]()

**METHOD:** GET

**RESPONSE BODY:**


```
{
    "status": "success",
    "charts": [
        {
            "dataFound": true,
            "data": [
                {
                    "Revenue": "1323155404.30",
                    "Year": "2017"
                },
                {
                    "Revenue": "723024018.00",
                    "Year": "2020"
                },
                {
                    "Revenue": "1344708313.00",
                    "Year": "2018"
                },
                {
                    "Revenue": "1358797336.20",
                    "Year": "2019"
                }
            ],
            "axis": {
                "y": "Revenue",
                "x": "Year"
            },
            "chartType": "bar",
            "type": "question",
            "validQuestion": true,
            "sql": "SELECT SUM(\"Amount\") AS \"SUM\", \"Year\" AS \"Year\" FROM \"7948535F11F94C619C2DE45470343ED7\".\"EIFA.db.datModels::RevenueActual\" GROUP BY \"Year\" LIMIT 1000",
            "question": "What is the revenue by Year?",
            "ChartId": 11
        },
        {
            "dataFound": true,
            "data": [
                {
                    "Revenue": "1349537332.80",
                    "Quarter": "Q1"
                },
                {
                    "Revenue": "1366494086.60",
                    "Quarter": "Q2"
                },
                {
                    "Revenue": "1000963357.80",
                    "Quarter": "Q3"
                },
                {
                    "Revenue": "1032690294.30",
                    "Quarter": "Q4"
                }
            ],
            "axis": {
                "y": "Revenue",
                "x": "Quarter"
            },
            "chartType": "bar",
            "type": "question",
            "validQuestion": true,
            "sql": "SELECT SUM(\"Amount\") AS \"SUM\", \"Quarter\" AS \"Quarter\" FROM \"7948535F11F94C619C2DE45470343ED7\".\"EIFA.db.datModels::RevenueActual\" GROUP BY \"Quarter\" LIMIT 1000",
            "question": "What is the revenue by Quarter?",
            "ChartId": 10
        }
    ]
}
```

## Remove Favourites (Sample Request):

**URL:** [https://enterprise-dev-eifa-approuter.cfapps.eu10.hana.ondemand.com/EIFA-NODE_api/removefavourite]()

**METHOD:** POST

**REQUEST BODY:**
              
```
{
  "favouriteId": 69
}
```

**RESPONSE BODY:**

```
{
    "status": "success",
    "result": 1,
    "message": "Favourites deleted successfully!"
}
```

## **GET Tile View:**

**URL:** [https://enterprise-dev-eifa-approuter.cfapps.eu10.hana.ondemand.com/EIFA-NODE_api/tileview]()

**METHOD:** GET

**RESPONSE BODY:**

```
{
    "status": "success",
    "data": [
        {
            "tilename": "Revenue - FY20",
            "value": "EUR 500M"
        },
        {
            "tilename": "Gross Profit - FY20",
            "value": "EUR 275M"
        },
        {
            "tilename": "Free Cash Flow - FY20",
            "value": 11.6
        },
        {
            "tilename": "Profit/Loss - FY20",
            "value": 30.8
        },
        {
            "tilename": "EBIT Margin - FY20",
            "value": "7.9%"
        }
    ]
}
```

## **GET User Details:**

**URL:** [https://enterprise-dev-eifa-approuter.cfapps.eu10.hana.ondemand.com/EIFA-NODE_api/getuserdetails]()

**METHOD:** GET

**RESPONSE BODY:**

```
{
    "status": "success",
    "userId": "prem.p1@gds.ey.com",
    "name": {
        "givenName": "Prem Chander",
        "familyName": "P"
    },
    "email": "prem.p1@gds.ey.com"
}
```

## Save User Analysis:

**URL:** [https://enterprise-dev-eifa-approuter.cfapps.eu10.hana.ondemand.com/EIFA-NODE_api/analysis/addanalysis]()

**METHOD:** POST

**REQUEST BODY:**


```
{
    "anlaysisName":"Germany segment Revenue by BusinessArea",
    "anlaysis": [{
        "question":"What is my revenue",
        "sql":"SELECT SUM(\"Revenue\") AS \"Revenue\", \"Quarter\" AS \"Quarter\" FROM \"7948535F11F94C619C2DE45470343ED7\".\"EIFA.db.datModels::RevenueActualPlanned\" WHERE UPPER(\"Year\") = 2020 GROUP BY \"Quarter\" LIMIT 1000",
        "chartType":"line"
    },{
        "question":"for Germany",
        "sql":"SELECT SUM(\"Revenue\") AS \"Revenue\", \"Quarter\" AS \"Quarter\" FROM \"7948535F11F94C619C2DE45470343ED7\".\"EIFA.db.datModels::RevenueActualPlanned\" WHERE (UPPER(\"Country\") = 'GERMANY') AND (UPPER(\"Year\") = 2020) GROUP BY \"Quarter\" LIMIT 1000",
        "chartType":"line"
    },
    {
        "question":"by segment",
        "sql":"SELECT SUM(\"Revenue\") AS \"Revenue\", \"BusinessArea\" AS \"BusinessArea\" FROM \"7948535F11F94C619C2DE45470343ED7\".\"EIFA.db.datModels::RevenueActualPlanned\" WHERE UPPER(\"Country\") = 'GERMANY' GROUP BY \"BusinessArea\" LIMIT 1000",
        "chartType":"bar"
    }]
}
```


**RESPONSE BODY:**

```
{
    "status": "success",
    "UserSaveAnalysisHeaderID": 36,
    "message": "Favourites added successfully!"
}
```



## Get all user analysis:

**URL:** [https://enterprise-dev-eifa-approuter.cfapps.eu10.hana.ondemand.com/EIFA-NODE_api/analysis/getalluseranalysis]()

**METHOD:** POST

**RESPONSE BODY:**

```
{
    "status": "success",
    "charts": [
        {
            "dataFound": true,
            "data": [
                {
                    "Revenue": "1323476907.70",
                    "BusinessArea": "Buses"
                },
                {
                    "Revenue": "1156000340.10",
                    "BusinessArea": "Special-Purpose Vehicles"
                },
                {
                    "Revenue": "2270207823.70",
                    "BusinessArea": "Trucks"
                }
            ],
            "axis": {
                "y": [
                    "Revenue"
                ],
                "x": "BusinessArea"
            },
            "currency": "USD",
            "chartType": "bar",
            "title": "by segment",
            "type": "question",
            "validQuestion": true,
            "sql": "SELECT SUM(\"Revenue\") AS \"Revenue\", \"BusinessArea\" AS \"BusinessArea\" FROM \"7948535F11F94C619C2DE45470343ED7\".\"EIFA.db.datModels::RevenueActualPlanned\" GROUP BY \"BusinessArea\" LIMIT 1000",
            "question": "by segment",
            "ChartId": 35
        }
    ]
}
```


## Get specific User Analysis:

**URL:** [https://enterprise-dev-eifa-approuter.cfapps.eu10.hana.ondemand.com/EIFA-NODE_api/analysis/getuseranalysis]()

**METHOD:** POST

**REQUEST BODY:**

```
{
    "analysisId":35
}
```


**RESPONSE BODY:**

```
{
    "status": "success",
    "charts": [
        {
            "dataFound": true,
            "data": [
                {
                    "Revenue": "359324885.50",
                    "Quarter": "Q1"
                },
                {
                    "Revenue": "363699132.50",
                    "Quarter": "Q2"
                }
            ],
            "axis": {
                "y": [
                    "Revenue"
                ],
                "x": "Quarter"
            },
            "currency": "USD",
            "chartType": "line",
            "title": "What is my revenue",
            "type": "question",
            "validQuestion": true,
            "sql": "SELECT SUM(\"Revenue\") AS \"Revenue\", \"Quarter\" AS \"Quarter\" FROM \"7948535F11F94C619C2DE45470343ED7\".\"EIFA.db.datModels::RevenueActualPlanned\" WHERE UPPER(\"Year\") = 2020 GROUP BY \"Quarter\" LIMIT 1000",
            "question": "What is my revenue",
            "ChartId": 35,
            "ChartOrder": 1
       },
        {
            "dataFound": true,
            "data": [
                {
                    "Revenue": "1323476907.70",
                    "BusinessArea": "Buses"
                },
                {
                    "Revenue": "1156000340.10",
                    "BusinessArea": "Special-Purpose Vehicles"
                },
                {
                    "Revenue": "2270207823.70",
                    "BusinessArea": "Trucks"
                }
            ],
            "axis": {
                "y": [
                    "Revenue"
                ],
                "x": "BusinessArea"
            },
            "currency": "USD",
            "chartType": "bar",
            "title": "by segment",
            "type": "question",
            "validQuestion": true,
            "sql": "SELECT SUM(\"Revenue\") AS \"Revenue\", \"BusinessArea\" AS \"BusinessArea\" FROM \"7948535F11F94C619C2DE45470343ED7\".\"EIFA.db.datModels::RevenueActualPlanned\" GROUP BY \"BusinessArea\" LIMIT 1000",
            "question": "by segment",
            "ChartId": 35,
            "ChartOrder": 2
        }
    ]
}
```



## Delete specific User Analysis:

**URL:** [https://enterprise-dev-eifa-approuter.cfapps.eu10.hana.ondemand.com/EIFA-NODE_api/analysis/removeanalysis]()

**METHOD:** POST

**REQUEST BODY:**

```
{
    "analysisId":35
}
```

**RESPONSE BODY:**

```
{
    "status": "success",
    "result": 4,
    "message": "Analysis deleted successfully!"
}
```

## **GET Insights by UserId:** - @<30DF6CBA-05EA-6EC6-8357-FBC4A54097C1> 

**URL:** [https://enterprise-dev-eifa-approuter.cfapps.eu10.hana.ondemand.com/EIFA-NODE_api/getuserinsights]()

**METHOD:** GET

**RESPONSE BODY:**

```
{
    "status": "success",
    "charts": [
        {
            "dataFound": true,
            "data": [
                {
                    "Revenue": "67283453.10",
                    "BusinessArea": "SPPV",
                    "Quarter": "Q1"
                },
                {
                    "Revenue": "68351584.10",
                    "BusinessArea": "SPPV",
                    "Quarter": "Q2"
                },
                {
                    "Revenue": "147581255.10",
                    "BusinessArea": "TRKS",
                    "Quarter": "Q1"
                },
                {
                    "Revenue": "150308029.90",
                    "BusinessArea": "TRKS",
                    "Quarter": "Q2"
                },
                {
                    "Revenue": "78314322.60",
                    "BusinessArea": "BUSS",
                    "Quarter": "Q1"
                },
                {
                    "Revenue": "78850996.00",
                    "BusinessArea": "BUSS",
                    "Quarter": "Q2"
                }
            ],
            "axis": {
                "y": [
                    "Revenue",
                    "BusinessArea"
                ],
                "x": "Quarter"
            },
            "currency": "USD",
            "chartType": "Dline",
            "title": "Hello EIFA, what is our quarterly revenue by segment?",
            "type": "question",
            "validQuestion": true,
            "sql": "SELECT SUM(\"Revenue\") AS \"Revenue\", \"BusinessArea\" AS \"BusinessArea\", \"Quarter\" AS \"Quarter\" FROM \"7948535F11F94C619C2DE45470343ED7\".\"EIFA.db.datModels::GeneralLedgerActualPlanned\" WHERE UPPER(\"Year\") = 2020 GROUP BY \"BusinessArea\", \"Quarter\" LIMIT 1000",
            "question": "Hello EIFA, what is our quarterly revenue by segment?",
            "ChartId": 3636
        },
        {
            "dataFound": true,
            "data": [
                {
                    "EBIT": "572376786.00",
                    "NetProfitMargin": "198.8299795211684013794072478392271",
                    "Quarter": "Q1"
                },
                {
                    "EBIT": "580470186.70",
                    "NetProfitMargin": "198.7126426516351803386104448510256",
                    "Quarter": "Q2"
                }
            ],
            "axis": {
                "y": [
                    "EBIT",
                    "NetProfitMargin"
                ],
                "x": "Quarter"
            },
            "currency": "USD",
            "chartType": "Dline",
            "title": "What is my ebit margin?",
            "type": "question",
            "validQuestion": true,
            "sql": "SELECT SUM(\"EBIT\") AS \"EBIT\", SUM(\"NetIncome\")/SUM(\"Revenue\")*100 AS \"NetProfitMargin\", \"Quarter\" AS \"Quarter\" FROM \"7948535F11F94C619C2DE45470343ED7\".\"EIFA.db.datModels::GeneralLedgerActualPlanned\" WHERE UPPER(\"Year\") = 2020 GROUP BY \"Quarter\" LIMIT 1000",
            "question": "What is my ebit margin?",
            "ChartId": 3635
        },
        {
            "dataFound": true,
            "data": [
                {
                    "GrossProfit": "501519430.60",
                    "Quarter": "Q1"
                },
                {
                    "GrossProfit": "508806322.00",
                    "Quarter": "Q2"
                }
            ],
            "axis": {
                "y": [
                    "GrossProfit"
                ],
                "x": "Quarter"
            },
            "currency": "USD",
            "chartType": "line",
            "title": "What is my net profit?",
            "type": "question",
            "validQuestion": true,
            "sql": "SELECT SUM(\"GrossProfit\") AS \"GrossProfit\", \"Quarter\" AS \"Quarter\" FROM \"7948535F11F94C619C2DE45470343ED7\".\"EIFA.db.datModels::GeneralLedgerActualPlanned\" WHERE UPPER(\"Year\") = 2020 GROUP BY \"Quarter\" LIMIT 1000",
            "question": "What is my net profit?",
            "ChartId": 3627
        },
        {
            "dataFound": true,
            "data": [
                {
                    "GrossProfit": "501519430.60",
                    "Quarter": "Q1"
                },
                {
                    "GrossProfit": "508806322.00",
                    "Quarter": "Q2"
                }
            ],
            "axis": {
                "y": [
                    "GrossProfit"
                ],
                "x": "Quarter"
            },
            "currency": "USD",
            "chartType": "line",
            "title": "What is my net profit?",
            "type": "question",
            "validQuestion": true,
            "sql": "SELECT SUM(\"GrossProfit\") AS \"GrossProfit\", \"Quarter\" AS \"Quarter\" FROM \"7948535F11F94C619C2DE45470343ED7\".\"EIFA.db.datModels::GeneralLedgerActualPlanned\" WHERE UPPER(\"Year\") = 2020 GROUP BY \"Quarter\" LIMIT 1000",
            "question": "What is my net profit?",
            "ChartId": 3626
        },
        {
            "dataFound": true,
            "data": [
                {
                    "RevenuePlanned": "0.00",
                    "Revenue": "0.00",
                    "Quarter": "Q1"
                },
                {
                    "RevenuePlanned": "0.00",
                    "Revenue": "0.00",
                    "Quarter": "Q2"
                }
            ],
            "axis": {
                "y": [
                    "RevenuePlanned",
                    "Revenue"
                ],
                "x": "Quarter"
            },
            "currency": "USD",
            "chartType": "Dline",
            "title": "What is my Selling and Distribution Expense actual vs budget?",
            "type": "question",
            "validQuestion": true,
            "sql": "SELECT SUM(\"RevenuePlanned\") AS \"RevenuePlanned\", SUM(\"Revenue\") AS \"Revenue\", \"Quarter\" AS \"Quarter\" FROM \"7948535F11F94C619C2DE45470343ED7\".\"EIFA.db.datModels::GeneralLedgerActualPlanned\" WHERE (UPPER(\"Year\") = 2020) AND (UPPER(\"AccountingNumber\") in (401000)) GROUP BY \"Quarter\" LIMIT 1000",
            "question": "What is my Selling and Distribution Expense actual vs budget?",
            "ChartId": 3623
        },
        {
            "dataFound": true,
            "data": [
                {
                    "EBIT": "572376786.00",
                    "NetProfitMargin": "198.8299795211684013794072478392271",
                    "Quarter": "Q1"
                },
                {
                    "EBIT": "580470186.70",
                    "NetProfitMargin": "198.7126426516351803386104448510256",
                    "Quarter": "Q2"
                }
            ],
            "axis": {
                "y": [
                    "EBIT",
                    "NetProfitMargin"
                ],
                "x": "Quarter"
            },
            "currency": "USD",
            "chartType": "Dline",
            "title": "What is the ebit margin?",
            "type": "question",
            "validQuestion": true,
            "sql": "SELECT SUM(\"EBIT\") AS \"EBIT\", SUM(\"NetIncome\")/SUM(\"Revenue\")*100 AS \"NetProfitMargin\", \"Quarter\" AS \"Quarter\" FROM \"7948535F11F94C619C2DE45470343ED7\".\"EIFA.db.datModels::GeneralLedgerActualPlanned\" WHERE UPPER(\"Year\") = 2020 GROUP BY \"Quarter\" LIMIT 1000",
            "question": "What is the ebit margin?",
            "ChartId": 3619
        },
        {
            "dataFound": true,
            "data": [
                {
                    "GrossProfit": "501519430.60",
                    "Quarter": "Q1"
                },
                {
                    "GrossProfit": "508806322.00",
                    "Quarter": "Q2"
                }
            ],
            "axis": {
                "y": [
                    "GrossProfit"
                ],
                "x": "Quarter"
            },
            "currency": "USD",
            "chartType": "line",
            "title": "What is the profit by quarters in 2020?",
            "type": "question",
            "validQuestion": true,
            "sql": "SELECT SUM(\"GrossProfit\") AS \"GrossProfit\", \"Quarter\" AS \"Quarter\" FROM \"7948535F11F94C619C2DE45470343ED7\".\"EIFA.db.datModels::GeneralLedgerActualPlanned\" WHERE UPPER(\"Year\") = 2020 GROUP BY \"Quarter\" LIMIT 1000",
            "question": "What is the profit by quarters in 2020?",
            "ChartId": 3618
        },
        {
            "dataFound": true,
            "data": [
                {
                    "Revenue": "1058911995.00",
                    "Year": "2017"
                },
                {
                    "Revenue": "1076595655.90",
                    "Year": "2018"
                },
                {
                    "Revenue": "1093729698.80",
                    "Year": "2019"
                }
            ],
            "axis": {
                "y": [
                    "Revenue"
                ],
                "x": "Year"
            },
            "currency": "USD",
            "chartType": "line",
            "title": "Show me relationship analysis between Amount of sales vs amount of warranty provision - Any gaps over the last 5 years?",
            "type": "question",
            "validQuestion": true,
            "sql": "SELECT SUM(\"Revenue\") AS \"Revenue\", \"Year\" AS \"Year\" FROM \"7948535F11F94C619C2DE45470343ED7\".\"EIFA.db.datModels::GeneralLedgerActualPlanned\" WHERE UPPER(\"Year\") in (2019, 2018, 2017, 2016, 2015) GROUP BY \"Year\" LIMIT 1000",
            "question": "Show me relationship analysis between Amount of sales vs amount of warranty provision - Any gaps over the last 5 years?",
            "ChartId": 3616
        },
        {
            "dataFound": true,
            "data": [
                {
                    "Revenue": "1058911995.00",
                    "Year": "2017"
                },
                {
                    "Revenue": "1076595655.90",
                    "Year": "2018"
                },
                {
                    "Revenue": "1093729698.80",
                    "Year": "2019"
                }
            ],
            "axis": {
                "y": [
                    "Revenue"
                ],
                "x": "Year"
            },
            "currency": "USD",
            "chartType": "line",
            "title": "Show me relationship analysis between Amount of sales vs amount of warranty provsion - Any gaps over the last 5 years?",
            "type": "question",
            "validQuestion": true,
            "sql": "SELECT SUM(\"Revenue\") AS \"Revenue\", \"Year\" AS \"Year\" FROM \"7948535F11F94C619C2DE45470343ED7\".\"EIFA.db.datModels::GeneralLedgerActualPlanned\" WHERE UPPER(\"Year\") in (2019, 2018, 2017, 2016, 2015) GROUP BY \"Year\" LIMIT 1000",
            "question": "Show me relationship analysis between Amount of sales vs amount of warranty provsion - Any gaps over the last 5 years?",
            "ChartId": 3615
        },
        {
            "dataFound": true,
            "data": [
                {
                    "Revenue": "1058911995.00",
                    "Year": "2017"
                },
                {
                    "Revenue": "1076595655.90",
                    "Year": "2018"
                },
                {
                    "Revenue": "1093729698.80",
                    "Year": "2019"
                }
            ],
            "axis": {
                "y": [
                    "Revenue"
                ],
                "x": "Year"
            },
            "currency": "USD",
            "chartType": "line",
            "title": "Show me relationship analysis between Amount of sales vs amount of warrant provsion - Any gaps over the last 5 years?",
            "type": "question",
            "validQuestion": true,
            "sql": "SELECT SUM(\"Revenue\") AS \"Revenue\", \"Year\" AS \"Year\" FROM \"7948535F11F94C619C2DE45470343ED7\".\"EIFA.db.datModels::GeneralLedgerActualPlanned\" WHERE UPPER(\"Year\") in (2019, 2018, 2017, 2016, 2015) GROUP BY \"Year\" LIMIT 1000",
            "question": "Show me relationship analysis between Amount of sales vs amount of warrant provsion - Any gaps over the last 5 years?",
            "ChartId": 3614
        }
    ]
}
```


****