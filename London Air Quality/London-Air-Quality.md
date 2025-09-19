# Pentaho Demo – London Air Quality

**Objective**  
Ingest and analyze London air quality measurements with temporal rollups and site-level drilldowns.

**Outcome & Impact**  
Delivered workshop-ready content and dashboards for pollutant trends by site, month/day, and postcode proximity.

**Technical Steps Taken**  
1. Connected API/source files including `SiteCodePostCode.csv`.  
2. Developed ETL: `t_get_air_quality_data_ms_mf_inline.ktr` and `t_create_month_day_tables.ktr`.  
3. Orchestrated with `London Air Quality Job.kjb` and parameterized paths.  
4. Exported Mondrian model for Time → Site → Pollutant hierarchies.  
5. Built PUC dashboards; included handbooks and workshop slides; presented demo.  
