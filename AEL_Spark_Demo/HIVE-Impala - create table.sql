
DROP TABLE IF EXISTS retailsalesdata;

CREATE TABLE retailsalesdata
(
  zipcode char(5),
  state char(2),
  city varchar(50),
  `year` int, 
  `month` int, 
  `day` int, 
  `hour` int,
  onlinesalesamount decimal(10,2),
  totalsessioncount int,
  retailstoresalesamount decimal(10,2),
  totalscannedeventcount int
    
)

ROW FORMAT DELIMITED FIELDS TERMINATED BY ";"
LINES TERMINATED BY '\n'
stored as textfile location '/user/zeus/restailsales/';


DROP TABLE IF EXISTS retailweblogsessioninfo;

CREATE TABLE retailweblogsessioninfo 
(
	`year` int, 
	`month` int, 
	`day` int, 
	`hour` int, 
	sessionid int, 
	salestotal decimal(10,2),
	clicktotal int, 
	sessioncounter int, 
	sessiondurationseconds int 
)
ROW FORMAT DELIMITED FIELDS TERMINATED BY ";"
LINES TERMINATED BY '\n'
stored as textfile location '/user/zeus/retailweblogsessioninfo/';


DROP TABLE IF EXISTS inventoryreceived;

CREATE TABLE inventoryreceived
(
  storeid int,
  zipcode char(5),
  `year` int, 
  `month` int, 
  `day` int, 
  `hour` int,
  state char(2),
  city varchar(50),
  productid int,
  productname varchar(50),
  supplier varchar(50),
  inventorycost decimal(10,2)
  
  
)
ROW FORMAT DELIMITED FIELDS TERMINATED BY ";"
LINES TERMINATED BY '\n'
stored as textfile location '/user/zeus/inventoryreceived/';



DROP TABLE IF EXISTS productstoresalesrevenue;

CREATE TABLE productstoresalesrevenue
(
  zipcode char(5),
  `year` int, 
  `month` int, 
  `day` int, 
  `hour` int,
  state char(2),
  city varchar(50),
  productid int,
  productname varchar(50),
  supplier varchar(50),
  totalsalesamount decimal(10,2),
  unitprice decimal(10,2)
  
)
ROW FORMAT DELIMITED FIELDS TERMINATED BY ";"
LINES TERMINATED BY '\n'
stored as textfile location '/user/zeus/productstoresalesrevenue/';