<?php namespace App\Models;

class Base64PNGImageCreator {

    public $defaultImageType    = 'png';
    // public static $validStorageTypes = array('png', 'jpeg');
    
    public $pngCompression      = 2;
    
    public $storagePath         = null;
    public $fileFullpath        = null;
    public $filename            = null;
    public $imageType           = null;
    public $saveResults         = null;

    public $jpegQuality         = 90;
    
    public $jpegFilename        = null;
    public $jpegFileFullpath    = null;

    /**
     * Fluent Mutators
     */
     // required
    public function storagePath($storagePath = null) 
    {
        if (is_null($storagePath)) { return $this->storagePath; }
        $this->storagePath = $storagePath;
        return $this;
    }
    // required - the image data
    public function base64($base64 = null) 
    {
        if (is_null($base64)) { return $this->base64; }
        $this->base64 = $base64;
        return $this;
    }
    // optional, will use default if not specified
    public function imageType($imageType = null) 
    {
        if (is_null($imageType)) { 
            return is_null($this->imageType) 
                    ? $this->defaultImageType 
                    : $this->imageType
            ; 
        }
        $this->imageType = $imageType;
        return $this;
    }
    // optional, will use a randomly-generated filename if not specified
    public function filename($filename = null) 
    {
        if (is_null($filename)) { return $this->filename; }
        $this->filename = $filename;
        return $this;
    }
    
    
    
    /**
     * Execute
     */
    // Save the image 
    public function save() {
        
        // use default image type if one has not been specified
        if ($this->imageType === null) {$imageType = $this->defaultImageType;}
        
        // generate a random filename is one has not been specified
        $this->filename     = is_null($this->filename)
                            ? Base64PNGImageCreator::generateFilename($this->imageType())
                            : $this->filename
        ;
        
        // die if the user has not specified a storagePath
        if (is_null($this->storagePath)) {echo PHP_EOL . "You must specify a storage directory to save an image.";}
        
        // calculate the full path for saving the file
        $this->fileFullpath = $this->storagePath . '/' . $this->filename;
        
        // decode the base64
        $data = base64_decode(preg_replace('#^data:image/\w+;base64,#i', '', $this->base64));
        
        // save the file
        $this->saveResults = file_put_contents($this->fileFullpath, $data);
        
        return $this;
    }

    public function makeJPEG() {
        $this->jpegFilename     = str_replace('.png', '.jpeg', $this->filename);
        $this->jpegFileFullpath = str_replace('.png', '.jpeg', $this->fileFullpath);
        Base64PNGImageCreator::png2jpg($this->fileFullpath, $this->jpegFileFullpath, $this->jpegQuality);
        return $this;
    }

    /**
     * Static Utility  Methods
     */
    // generate a random filename (time + random 20 characters)
    public static function generateFilename($fileExtension = null) 
    {
        $time = (string) time();
        $random = Base64PNGImageCreator::randomString(20);
        $filename = $time . $random . "." . $fileExtension;
        return $filename;
    }
    // random characters
    public static function randomString($length, $charset='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789')
    {
        $str = '';
        $count = strlen($charset);
        while ($length--) {
            $str .= $charset[mt_rand(0, $count-1)];
        }
        return $str;
    }
    // create jpeg from png
    public static function png2jpg($originalFile, $outputFile, $quality) {
        $image = imagecreatefrompng($originalFile);
        imagejpeg($image, $outputFile, $quality);
        imagedestroy($image);
    }
    // return an imageCreator
    public static function instance() 
    {
        return new static;    
    }
    
}
