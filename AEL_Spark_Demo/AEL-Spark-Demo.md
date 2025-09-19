# Pentaho Demo – Adaptive Execution Layer (AEL) Spark Demo

**Objective**  
Demonstrate scaling ETL on a Spark engine via Pentaho’s Adaptive Execution Layer using retail/location datasets.

**Outcome & Impact**  
Showed linear-ish throughput gains moving transformations from local to Spark execution; validated portability of PDI pipelines.

**Technical Steps Taken**  
1. Connected data sources: `zipcode.csv`, `zipcodestores.csv`, `products.csv`.  
2. Developed ETL joins/enrichments and tweaked steps for Spark compatibility.  
3. Exported a logical star model (Mondrian) for ad-hoc analysis where useful.  
4. Ran jobs on AEL Spark; captured metrics and logs.  
5. Built simple dashboards in PUC for QA spot-checks.  
6. Created a slide deck comparing local vs Spark runs; presented the demo.  
