<?php

// by default, we assume the environment is production
$detectedEnvironment = "production";
// dev server urls (using url to determine environment)
$devServerURLs = ['indystardev.com'];


if (isset($_SERVER['HTTP_HOST'])) {
    
    // check dev server urls
    foreach ($devServerURLs as $devServerURL) {
        // if the request url contains a dev server url
        if (strpos($_SERVER['HTTP_HOST'], $devServerURL) !== false) 
        {
            // then we are running in a dev environment, intead of production
            $detectedEnvironment = "dev";
        }    
    }
    
} else {
    
    $detectedEnvironment = 'cli';
    
}

// build path to environment config
$environmentPath = __DIR__ . '/../env/' . $detectedEnvironment;
// if an environment config has been defined for this environment
if ( file_exists( $environmentPath ) ) 
{
    // load the environment config
    Dotenv::load( $environmentPath );
} else {
    echo PHP_EOL . "No environment config defined for this environment.";
    die();
}

?>
