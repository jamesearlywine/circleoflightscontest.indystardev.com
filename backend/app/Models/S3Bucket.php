<?php 

namespace App\Models;

use \Storage;

class S3Bucket {
    
    public function __construct() {
        // ..
    }
    
    public static function put($options) {
        
        return Storage::disk('s3')
            ->put(
                $options->s3Filename,
                file_get_contents($options->localFilename),
                $options->visibility
            )
        ;   
        
    }
    
    public static function remove($options) {
        
    }
    
    public static function getURL($s3Filename) {
        $disk = Storage::disk('s3');
        if ($disk->exists($s3Filename)) {
            $command = $disk->getDriver()
                            ->getAdapter()
                            ->getClient()
                            ->getCommand('GetObject', [
                'Bucket'                     => \Config::get('filesystems.disks.s3.bucket'),
                'Key'                        => $s3Filename
            ]);
    
            $request = $disk->getDriver()
                            ->getAdapter()
                            ->getClient()
                            ->createPresignedRequest($command, '+5 minutes');
    
            $s3URL = $request->getUri();
        } else {
            $s3URL = null;
        }
        
        if (!is_null($s3URL)) {
            return 'http://' . $s3URL->getHost() . '/' . $s3URL->getPath();    
        } else {
            return null;
        }
        
    }
    
    public static function makeDirectory($dir) {
        return Storage::disk('s3')
            ->makeDirectory($dir)
        ;
    }
    
    public static function deleteDirectory($dir) {
        return Storage::disk('s3')
            ->deleteDirectory($dir)
        ;
    }
    
    
}