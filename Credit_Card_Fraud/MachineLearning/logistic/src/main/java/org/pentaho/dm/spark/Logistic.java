package org.pentaho.dm.spark;

import com.databricks.spark.csv.util.TextFile;
import org.apache.hadoop.conf.Configuration;
import org.apache.hadoop.fs.FileSystem;
import org.apache.hadoop.fs.Path;
import org.apache.spark.SparkConf;
import org.apache.spark.SparkContext;
import org.apache.spark.api.java.JavaSparkContext;
import org.apache.spark.ml.Pipeline;
import org.apache.spark.ml.PipelineModel;
import org.apache.spark.ml.PipelineStage;
import org.apache.spark.ml.classification.LogisticRegression;
import org.apache.spark.ml.classification.LogisticRegressionModel;
import org.apache.spark.ml.feature.VectorAssembler;
import org.apache.spark.ml.util.MLReader;
import org.apache.spark.sql.DataFrame;
import org.apache.spark.sql.Row;
import org.apache.spark.sql.SQLContext;
import scala.Tuple2;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.ObjectInputStream;
import java.io.ObjectOutput;
import java.io.ObjectOutputStream;
import java.io.OutputStream;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/**
 * Learn and predict with MLlib logistic regression for Strata demo
 *
 * @author Mark Hall (mhall{[at]}pentaho{[dot]}com)
 */
public class Logistic {

  /**
   * Returns a Configuration object configured with the name node and port
   * present in the supplied path ({@code hdfs://host:port/path}). Also returns
   * the path-only part of the URI. Note that absolute paths will require an
   * extra /. E.g. {@code hdfs://host:port//users/fred/input}. Also handles
   * local files system paths if no protocol is supplied - e.g. bob/george for a
   * relative path (relative to the current working directory) or /bob/george
   * for an absolute path.
   *
   * @param path     the URI or local path from which to configure
   * @param pathOnly will hold the path-only part of the URI
   * @return a Configuration object
   */
  public static Configuration getFSConfigurationForPath( String path,
                                                         String[] pathOnly ) {
    if ( !path.toLowerCase().contains( "://" ) ) {
      // assume local file system
      Configuration conf = new Configuration();
      conf.set( "fs.default.name", "file:/" );

      // convert path to absolute if necessary
      File f = new File( path );
      if ( !f.isAbsolute() ) {
        path = f.getAbsolutePath();
      }

      pathOnly[ 0 ] = path;

      return conf;
    }

    Configuration conf = new Configuration();
    // extract protocol,host and port part (hdfs://host:port//)
    String portAndHost = path.substring( 0, path.lastIndexOf( ":" ) );
    String portPlusRemainder =
      path.substring( path.lastIndexOf( ":" ) + 1, path.length() );
    String port =
      portPlusRemainder.substring( 0, portPlusRemainder.indexOf( "/" ) );
    String filePath =
      portPlusRemainder.substring( portPlusRemainder.indexOf( "/" ) + 1,
        portPlusRemainder.length() );

    conf.set( "fs.default.name", portAndHost + ":" + port );
    if ( pathOnly != null && pathOnly.length > 0 ) {
      pathOnly[ 0 ] = filePath;
    }

    return conf;
  }

  /**
   * Open the named file for writing to on either the local file system or HDFS.
   * HDFS files should use the form "{@code hdfs://host:port/<path>}". Note
   * that, on the local file system, the directory path must exist. Under HDFS,
   * the path is created automatically.
   *
   * @param file the file to write to
   * @return an OutputStream for writing to the file
   * @throws IOException if a problem occurs
   */
  public static OutputStream openFileForWrite( String file ) throws IOException {
    OutputStream result;

    String[] pathOnly = new String[ 1 ];
    Configuration conf = getFSConfigurationForPath( file, pathOnly );

    FileSystem fs = FileSystem.get( conf );
    Path p = new Path( pathOnly[ 0 ] );
    result = fs.create( p );

    return result;
  }

  /**
   * Opens the named file for reading on either the local file system or HDFS.
   * HDFS files should use the form "{@code hdfs://host:port/<path>}"
   *
   * @param file the file to open for reading on either the local or HDFS file system
   * @return an InputStream for the file
   * @throws IOException if a problem occurs
   */
  public static InputStream openFileForRead( String file ) throws IOException {

    InputStream result;
    if ( file.toLowerCase().indexOf( "://" ) > 0 ) {
      String[] pathOnly = new String[ 1 ];
      Configuration conf = getFSConfigurationForPath( file, pathOnly );

      FileSystem fs = FileSystem.get( conf );
      Path path = new Path( pathOnly[ 0 ] );
      result = fs.open( path );
    } else {
      // local file
      result = new FileInputStream( file );
    }

    return result;
  }

  /**
   * Return true if a flag is present in command line options
   *
   * @param flag    the flag character to look for
   * @param options the options
   * @return true if the flag is present
   * @throws Exception if a problem occurs
   */
  public static boolean getFlag( char flag, String[] options ) throws Exception {

    return getFlag( "" + flag, options );
  }

  /**
   * Return true if a flag is present in command line options
   *
   * @param flag    the flag string to look for
   * @param options the options
   * @return true if the flag is present
   * @throws Exception if a problem occurs
   */
  public static boolean getFlag( String flag, String[] options ) throws Exception {

    int pos = getOptionPos( flag, options );

    if ( pos > -1 ) {
      options[ pos ] = "";
    }

    return ( pos > -1 );
  }

  /**
   * Return the value of an option in the command line options
   *
   * @param flag    the option character
   * @param options the options to search
   * @return the value of the option or the empty string if not present
   * @throws Exception if a problem occurs
   */
  public static String getOption( char flag, String[] options )
    throws Exception {

    return getOption( "" + flag, options );
  }

  /**
   * Return the value of an option in the command line options
   *
   * @param flag    the option string
   * @param options the options to search
   * @return the value of the option or the empty string if not present
   * @throws Exception if a problem occurs
   */
  public static String getOption( String flag, String[] options )
    throws Exception {

    String newString;
    int i = getOptionPos( flag, options );

    if ( i > -1 ) {
      if ( options[ i ].equals( "-" + flag ) ) {
        if ( i + 1 == options.length ) {
          throw new Exception( "No value given for -" + flag + " option." );
        }
        options[ i ] = "";
        newString = new String( options[ i + 1 ] );
        options[ i + 1 ] = "";
        return newString;
      }
      if ( options[ i ].charAt( 1 ) == '-' ) {
        return "";
      }
    }

    return "";
  }

  protected static int getOptionPos( char flag, String[] options ) {
    return getOptionPos( "" + flag, options );
  }

  protected static int getOptionPos( String flag, String[] options ) {
    if ( options == null ) {
      return -1;
    }

    for ( int i = 0; i < options.length; i++ ) {
      if ( ( options[ i ].length() > 0 ) && ( options[ i ].charAt( 0 ) == '-' ) ) {
        // Check if it is a negative number
        try {
          Double.valueOf( options[ i ] );
        } catch ( NumberFormatException e ) {
          // found?
          if ( options[ i ].equals( "-" + flag ) ) {
            return i;
          }
          // did we reach "--"?
          if ( options[ i ].charAt( 1 ) == '-' ) {
            return -1;
          }
        }
      }
    }

    return -1;
  }

  /**
   * Print the schema for a DataFrame and the first 5 rows
   *
   * @param df the data frame to print the schema for
   */
  protected static void printDataFrameSchema( DataFrame df ) {
    System.out.println( "Schema:\n" );
    df.printSchema();
    System.out.println( "Number of rows in DataFrame: " + df.count() );
    System.out.println( "First 5 rows:\n" );
    List<Row> rowList = df.takeAsList( 5 );
    for ( Row r : rowList ) {
      System.out.println( r.toString() );
    }
  }

  /**
   * Load a DataFrame (specific to the Strata demo). Removes one column that is all missing. Renames the
   * reported_as_fraud column to "label" (as the machine learning algorithms look for this as the target column). Drops
   * all rows with missing values
   *
   * @param dataPath the path to the DataFrame
   * @param jsc      the JavaSparkContext in use
   * @return the data frame
   */
  protected static DataFrame loadData( String dataPath, JavaSparkContext jsc ) {
    if ( dataPath == null || dataPath.length() == 0 ) {
      throw new IllegalArgumentException( "No path to training data provided!" );
    }

    SQLContext sqlContext = new SQLContext( jsc );

    DataFrame df =
      sqlContext.read().format( "com.databricks.spark.csv" )
        .option( "inferSchema", "true" )
        .option( "header", "true" )
        .option( "delimiter", "," ).option( "quote", "'" ).option( "nullValue", "" )
        .option( "charset", TextFile.DEFAULT_CHARSET().name() )
        .load( dataPath );

    df = df.withColumnRenamed( "reported_as_fraud", "label" );

    // this column is all missing (in the training data at least)
    df = df.drop( "ShipToAddress" );

    return df;
  }

  protected static Map<String, Object> computeMeansForNumerics( DataFrame df ) {
    String[] cols =
      new String[] { "Card_Number", "Expiry_Date", "ShipToCustomerNumber", "ShipToZip", "OrderDollarAmount",
        "NumItems", "AvgLineItemPrice", "ZipDistance", "BillingShippingZipEqual" };

    Map<String, Object> meansForCols = new HashMap<>();
    Map<String, String> stats = new LinkedHashMap<>();
    for ( String s : cols ) {
      stats.put( s, "avg" );
    }
    DataFrame means = df.agg( stats );
    printDataFrameSchema( means );
    Tuple2<String, String> colsAndTypes[] = means.dtypes();

    Row[] results = means.collect();
    for ( Tuple2<String, String> col : colsAndTypes ) {
      String colName = col._1();
      int indexOfMean = results[ 0 ].fieldIndex( colName );

      String colNameOrig = colName.replace( "avg(", "" ).replace( ")", "" );
      int indexOfOrig = df.schema().fieldIndex( colNameOrig );

      String typeOfOrig = df.schema().fields()[ indexOfOrig ].dataType().typeName();
      if ( typeOfOrig.toLowerCase().startsWith( "double" ) ) {
        meansForCols.put( colNameOrig, results[ 0 ].getDouble( indexOfMean ) );
      } else if ( typeOfOrig.toLowerCase().startsWith( "int" ) ) {
        meansForCols.put( colNameOrig, ( (int) results[ 0 ].getDouble( indexOfMean ) ) );
      }
    }

    return meansForCols;
  }

  protected static DataFrame imputeMissingValuesForNumerics( DataFrame df, Map<String, Object> means ) {
    return df.na().fill( means );
  }

  /**
   * Build a pipeline that assembles the number columns into input features, ready for the logistic regression
   * (part 2 of the pipeline) to learn from
   *
   * @param trainingData the training data frame
   * @return the fitted pipeline
   */
  protected static PipelineModel buildPipeline( DataFrame trainingData ) {

    VectorAssembler vectorAssembler = new VectorAssembler();
    vectorAssembler.setInputCols(
      new String[] { "Card_Number", "Expiry_Date", "ShipToCustomerNumber", "ShipToZip", "OrderDollarAmount", "NumItems",
        "AvgLineItemPrice", "ZipDistance", "BillingShippingZipEqual" } );
    vectorAssembler.setOutputCol( "features" );

    DataFrame trainingData2 = vectorAssembler.transform( trainingData );
    printDataFrameSchema( trainingData2 );
    LogisticRegression lr = new LogisticRegression().setMaxIter( 20 )
      .setPredictionCol( "PredictedFraud" );//.setRegParam( 0.3 ).setElasticNetParam( 0.8 );


    Pipeline pipeline = new Pipeline();
    pipeline.setStages( new PipelineStage[] { vectorAssembler, lr } );

    return pipeline.fit( trainingData );
  }

  /**
   * Print the logistic regression model to standard out
   *
   * @param lrModel the model to print
   */
  protected static void printModel( LogisticRegressionModel lrModel ) {
    System.out
      .println( "Logistic regression coefficients: " + lrModel.coefficients() + " intercept: " + lrModel.intercept() );

  }

  /**
   * Print the logistic regression model to standard out
   *
   * @param model the pipeline model (containing the logistic regression) to print
   */
  protected static void printModel( PipelineModel model ) {
    LogisticRegressionModel lrModel = (LogisticRegressionModel) ( model.stages()[ 1 ] );
    printModel( lrModel );
  }

  /**
   * Save the (fitted) pipeline (and map of means for missing value replacement, if not null)
   *
   * @param pipelineModel      the pipeline to save
   * @param savePath           the path to save to
   * @param meansForImputation map of column names->mean for numeric columns.
   * @throws IOException if a problem occurs
   */
  protected static void saveModel( PipelineModel pipelineModel, String savePath,
                                   Map<String, Object> meansForImputation ) throws IOException {

    pipelineModel.write().overwrite().save( savePath );

    if ( meansForImputation != null && meansForImputation.size() > 0 ) {

      // since saving the pipleline creates a directory containing
      // subdirectories called metadata and stages we can probably
      // just serialize the map into the top-level directory.

      // assume non-windows separator
      String pathToSerializedMeans = savePath + "/missingValImputation.ser";
      OutputStream os = openFileForWrite( pathToSerializedMeans );
      ObjectOutputStream oos = new ObjectOutputStream( os );
      try {
        oos.writeObject( meansForImputation );
      } finally {
        oos.flush();
        oos.close();
      }
    }
  }

  /**
   * Loads the map of column names->mean values for imputation of missing values in numeric columns
   *
   * @param loadPath the path to load from
   * @return the map of means for numeric variables
   * @throws IOException if a problem occurs
   * @throws ClassNotFoundException if a problem occurs
   */
  protected static Map<String, Object> loadMeansForImputation( String loadPath )
    throws IOException, ClassNotFoundException {
    String pathToSerializedMeans = loadPath + "/missingValImputation.ser";

    InputStream is = openFileForRead( pathToSerializedMeans );
    ObjectInputStream ois = new ObjectInputStream( is );
    Map<String, Object> means = null;
    try {
      means = (Map<String, Object>) ois.readObject();
    } finally {
      ois.close();
    }

    return means;
  }

  /**
   * Predict the supplied data frame using the pipeline model
   *
   * @param model     the pipe line containing the logistic regression
   * @param toPredict the data frame to predict
   * @return a new data frame with predictions appended
   */
  protected static DataFrame predictData( PipelineModel model, DataFrame toPredict ) {
    return model.transform( toPredict );
  }

  /**
   * Write predicted data
   *
   * @param predicted the data frame with predictions
   * @param scoredPath the path to write to
   */
  protected static void writePredicted( DataFrame predicted, String scoredPath ) {
    predicted.write().format( "com.databricks.spark.csv" )
      .option( "header", "true" )
      .option( "delimiter", "," ).option( "quote", "'" )
      .option( "nullValue", "" )
      .option( "charset", "UTF-8" )
      .save( scoredPath );
  }

  public static void main( String[] args ) throws Exception {
    if ( Logistic.getFlag( 'h', args ) || Logistic.getFlag( "help", args ) ) {
      System.out.println( "Usage (following spark-submit options): [-training <path to training csv>] "
        + "[-test <path to test csv>] [-save <path to save model/pipeline to] [-load <path to load model/pipeline "
        + "from>] [-scored-out <path to write scored test data to>]" );
      System.exit( 1 );
    }

    String trainingDataPath = Logistic.getOption( "training", args );
    String testDataPath = Logistic.getOption( "test", args );
    String savePath = Logistic.getOption( "save", args );
    String loadPath = Logistic.getOption( "load", args );
    String scoredDataOutputPath = Logistic.getOption( "scored-out", args );

    if ( loadPath.length() > 0 && trainingDataPath.length() > 0 ) {
      throw new Exception( "No point in specifying both data to learn from and a previously saved model to use" );
    }

    Map<String, Object> meansForImputation = null;
    JavaSparkContext jsc = null;
    PipelineModel lrPipeline = null;
    if ( loadPath.length() > 0 ) {
      MLReader<PipelineModel> reader = PipelineModel.read();
      lrPipeline = reader.load( loadPath );
      System.out.println( "Loaded model:\n\n" );
      meansForImputation = loadMeansForImputation( loadPath );
      printModel( lrPipeline );
      SparkContext sc = reader.sc();
      jsc = new JavaSparkContext( sc );
    } else {
      SparkConf conf = new SparkConf().setAppName( "Pentaho Spark Logistic Regression" );
      jsc = new JavaSparkContext( conf );
    }

    if ( trainingDataPath.length() > 0 ) {
      DataFrame trainingDF = loadData( trainingDataPath, jsc );
      meansForImputation = computeMeansForNumerics( trainingDF );
      trainingDF = imputeMissingValuesForNumerics( trainingDF, meansForImputation );
      printDataFrameSchema( trainingDF );

      lrPipeline = buildPipeline( trainingDF );
      printModel( lrPipeline );
    }

    if ( testDataPath.length() > 0 ) {
      DataFrame testDF = loadData( testDataPath, jsc );
      if ( meansForImputation != null ) {
        testDF = imputeMissingValuesForNumerics( testDF, meansForImputation );
      }
      DataFrame predicted = predictData( lrPipeline, testDF );
      printDataFrameSchema( predicted );
      if ( scoredDataOutputPath.length() > 0 ) {
        writePredicted( predicted, scoredDataOutputPath );
      }
    }

    if ( savePath.length() > 0 ) {
      saveModel( lrPipeline, savePath, meansForImputation );
    }

    jsc.stop();
  }
}
