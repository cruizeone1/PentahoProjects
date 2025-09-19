# Pentaho Demo – Metadata Injection: Self Service Onboarding

**Objective**  
Enable self-service data onboarding by injecting metadata dynamically into Pentaho transformations so multiple customers can map their own schemas without developer rewrites.

**Outcome & Impact**  
Reduced onboarding effort and cycle time for new customers; standardized field mappings and lowered maintenance by centralizing schema logic.

**Technical Steps Taken**  
1. Connected data sources (sample and customer CSVs).  
2. Developed ETL and modified Pentaho Java-based steps where needed to support dynamic mappings.  
3. Created and populated a metadata database; defined `file_type_fields.csv` for file-type driven mappings.  
4. Built `t_file2hdfs.ktr` to load staged files to HDFS with parameterized paths.  
5. Exported data models (Mondrian schemas) for downstream analytics where applicable.  
6. Developed front-end dashboards in Pentaho User Console (PUC) to validate onboarding results.  
7. Created use-case slides and demo script; presented the demo.  
