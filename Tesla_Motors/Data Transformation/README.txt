1.	Make sure the TWITTER_CONSUMER_KEY and TWITTER_CONSUMER_SECRET values are set in your kettle.properties file
2.	Configure the Mongo output step in the transformation to write to your collection and db.
3.	Run the job setting the parameters appropriately.

Notes:

- The twitter API only seems to supply 7 days of history.
- The Weka scoring step will throw a null pointer exception (NPE) on the final pass where the Twitter API returns zero results.  
I haven't found a way around the NPE, but the transformation itself is completing successfully.  The NPE can be ignored for now.
- The SGD Text model that the Weka scoring step is using is located in the SVN directory with the transformation.