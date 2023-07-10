<?php namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Response;
use Illuminate\Support\Facades\Input;
use App\Models\Base64PNGImageCreator;
use App\Models\S3Bucket;
use Folklore\Image\Facades\Image;

class UploadController extends Controller {

    public function sendImageBase64() 
    {
        
        // get base64 image data (and replace spaces with +s)
        $imageBase64 = str_replace(' ', '+', Input::get('imageBase64'));
        
        // determine where to store the image
        $storagePath = public_path('uploadedImages');

        // save the image from the imageBase64
        $imageCreator = Base64PNGImageCreator::instance()
            ->storagePath($storagePath)
            ->base64($imageBase64)
            ->save()
            ->makeJPEG()
        ;
        
        // make a smaller version for email blast
        $thumbnailFileFullpath  = str_replace('.jpeg', '_500.jpeg', $imageCreator->jpegFileFullpath);
        $thumbnailFilename      = str_replace('.jpeg', '_500.jpeg', $imageCreator->jpegFilename);
        $thumbnail = Image::make($imageCreator->jpegFileFullpath, array(
            'width' => 500,
        ))->save($thumbnailFileFullpath);

        // send them to S3 bucket and get links
        // png
        S3Bucket::put( (object)
           [
              's3Filename'      => $imageCreator->filename,
              'localFilename'   => $imageCreator->fileFullpath,
              'visibility'      => 'public'
           ] 
        );
        // jpeg
        S3Bucket::put( (object)
           [
              's3Filename'      => $imageCreator->jpegFilename,
              'localFilename'   => $imageCreator->jpegFileFullpath,
              'visibility'      => 'public'
           ] 
        );
        // thumbnail
        S3Bucket::put( (object)
           [
              's3Filename'      => $thumbnailFilename,
              'localFilename'   => $thumbnailFileFullpath,
              'visibility'      => 'public'
           ] 
        );


        // remove local files
        unlink($imageCreator->fileFullpath);
        unlink($imageCreator->jpegFileFullpath);
        unlink($thumbnailFileFullpath);

        // calculate the href for the image
        $link = S3Bucket::getURL($imageCreator->filename);
        // and for the thumbnail
        $thumbnailLink = S3Bucket::getURL($thumbnailFilename);
        
        // build and return the api response
        $responseObject = new \stdClass();
        //$responseObject->imageCreator       = $imageCreator;
        $responseObject->link               = $link;
        $responseObject->thumbnailLink      = $thumbnailLink;
        
        
        return Response::json($responseObject);
    }
   
    
    
    
}
