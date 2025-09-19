# Pentaho Demo – Candy (Consumer Packaged Goods)

**Objective**  
Unify sales performance and sentiment signals to evaluate promotional effectiveness in CPG.

**Outcome & Impact**  
Surfaced promo lift vs baseline, keyword/sentiment drivers, and inventory signals to guide spend allocation.

**Technical Steps Taken**  
1. Connected sales + social sources.  
2. Developed ETL: `cpg_sales.ktr`, `cpg_sentiment.ktr`, `cpg_keywords.ktr`; added `Create_Date_Dimension.ktr`.  
3. Exported Mondrian schema for SKU, channel, region hierarchies.  
4. Built dashboards in PUC for sales, sentiment, and promo KPIs.  
5. Created use-case slides and presented demo; packaged `CPG_Job.kjb`.  
