# Pentaho Demo – Credit Card Fraud

**Objective**  
Stand up a repeatable pipeline for ingesting card transactions and preparing features for fraud analysis.

**Outcome & Impact**  
Automated HDFS environment prep and data hygiene, enabling faster model experimentation and rule evaluation.

**Technical Steps Taken**  
1. Connected raw transaction sources.  
2. Developed ETL for cleansing, deduping, and tagging suspicious patterns.  
3. Exported curated feature sets for analytics (and Mondrian where pivoting helped).  
4. Built operational job: **Cleanup & Setup Directories on HDFS.kjb** for idempotent runs.  
5. Produced QA dashboards in PUC and presented the demo.  
