<?php namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Input;
use Illuminate\Support\Facades\Response;
use App\Models\Base64PNGImageCreator;


class DownloadController extends Controller {

    public function downloadContestPDF() {
        
        $response = Response::download(
            storage_path('PDF/CarsonsColoringContest_print.pdf'),
            "CircleOfLightsContest.pdf",
            [
                'Content-Type: application/pdf'
            ]
        );
        ob_end_clean();
        return $response;
    }
    
    public function downloadPNG() {
        
        $filename = Input::get('filename');
        $url = 'http://s3.amazonaws.com//circleoflights/' . $filename;
        $folder = "s3DownloadTemp/";
        $unique = time() + substr(str_shuffle("0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"), 0, 20);
        $localFilepath = storage_path($folder . $unique);
        
        copy($url, $localFilepath);
        
        $response = Response::download(
           $localFilepath, 
            'CircleOfLightsContestSubmission.png',
            [
                
            ]
        )->deleteFileAfterSend(true);
        ob_end_clean();

        return $response;
        
    }
    
    public function downloadPNGWithChrome() {
        
        $filename = Input::get('filename');
        
        $url = 'http://s3.amazonaws.com//circleoflights/' . $filename;
        
        //$url = 'http://s3.amazonaws.com//circleoflights/1445292119UoqjzdRhbjBmhHO7Fniu.png';
        
        $folder = "tempImages/";
        $unique = time() + substr(str_shuffle("0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"), 0, 20);
        $localFilepath = public_path($folder . $unique);
        /*
        copy($url, $localFilepath);
        */
        
        $src = imagecreatefrompng($url);
        $dest = imagecreatefrompng(public_path('ContestSubmissionChrome.png'));
        
        $srcWidth  = imagesx($src);
        $srcHeight = imagesy($src);
        
        $destWidth = imagesx($dest);
        $destHeight = imagesy($dest);
        
        $srcWidthScaled     = 890;
        $srcHeightScaled    = 851;
    
        $srcScaled = imagescale($src, $srcWidthScaled, $srcHeightScaled);
        
        $srcX = 0;
        $srcY = 0;
        
        $destX = ($destWidth - $srcWidthScaled) / 2;
        $destY = 210;
        
        imagecopymerge($dest, $srcScaled, $destX, $destY, $srcX, $srcY, $srcWidthScaled, $srcHeightScaled, 100);
        $localFile = $localFilepath . '.png';
        
        imagepng($dest, $localFile);
        
        $response = Response::download(
           $localFile, 
            'CircleOfLightsContestSubmission.png',
            [
                
            ]
        )->deleteFileAfterSend(true);
        ob_end_clean();

        return $response;
        
    }
    
   
    
    
}
