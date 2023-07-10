<?php namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Session;
use Carbon\Carbon;

use App\Models\GoogleDocSubmitter;
use App\Models\EmailSecurity;

class EmailController extends Controller {

    public function showErrors() {
            
        ini_set('display_errors',1);
        ini_set('display_startup_errors',1);
        error_reporting(-1);

    }    
    
    public function generateFingerprint() {
        if (is_null(\Session::get('fingerprint'))) {
            \Session::put('fingerprint', str_random(40));
        }
        return '';
    }
        
    
    /**
     * @brief   Sends an Email (POST)
     */
    public function sendEmail(
            Request     $request,
            $from = null,
            $to = null,
            $message = null
    ) {

        $from       = is_null($from)    ? \Input::get('from')    : $from;
        $to         = is_null($to)      ? \Input::get('to')      : $to;
        $body       = is_null($message) ? \Input::get('message') : $message;        
        $imageUrl   = \Input::get('imageUrl', null);
        $thumbnailUrl = \Input::get('thumbnailUrl', null);
        if (is_null($thumbnailUrl)) {
            $thumbnailUrl = $imageUrl;
        }    
        $subject    = \Config::get('mail.offerEmailSubjectLine');
        
        // build request object
        $oRequest = new \stdClass();
        $oRequest->apiKey       = \Input::get('apiKey');
        /*
        if ($oRequest->apiKey !== \Config::get('api.apiKey')) {
            // echo PHP_EOL . "bad api key";
            // die()
            
            // return empty response (keeps fingerprint persistent across requests)
            return '';
        }
        */
        
        
        $oRequest->from         = $from;
        $oRequest->to           = $to;
        $oRequest->dirtyBody    = $body;
        $oRequest->subject      = $subject;
        $oRequest->imageUrl     = $imageUrl;
        $oRequest->thumbnailUrl = $thumbnailUrl;
        $oRequest->ipaddress = $request->ip();
        $oRequest->datetime  = Carbon::now()->toDateTimeString();
        $oRequest->useragent = $request->server('HTTP_USER_AGENT');


        // -- you can add these functionalities if you like
        
        // normalize (limit size, strip html tags)
        $oRequest->body     
            = EmailSecurity::cleanMessage(
                        $oRequest->dirtyBody, // original message
                        \Config::get('emailsecurity.maxMessageLength'), // maxMessageLength
                        true // strip HTML tags
                    );
        
        // check some stuff for security 
        // (ex: repeated sends from ip address in x minutes?)
        //$isOkayToSend = EmailSecurity::isOkayToSend($oRequest);
        $isOkayToSend = true;
        
        // record some stuff for security
        // (ex: email send from this ip-address)
        //EmailSecurity::log($oRequest);
        
        $textView = is_null($imageUrl) 
                    ? 'emails.shared_text' 
                    : 'emails.shared_with_image_text'
        ;
        $htmlView = is_null($imageUrl) 
                    ? 'emails.shared_html' 
                    : 'emails.shared_with_image_html'
        ;
        
        if ($isOkayToSend) {
            // send email
            \Mail::send(
                // view templates for composing email body
                [
                    'text'  => $textView,
                    'html'  => $htmlView
                ],
                // variables to pass to the view template
                [
                    'from'  =>  $oRequest->from,
                    'to'    =>  $oRequest->to,
                    'body'  =>  $oRequest->body,
                    'imageUrl' => $oRequest->imageUrl,
                    'thumbnailUrl' => $oRequest->thumbnailUrl
                ],
                // configure the email itself
                function($message) use ($oRequest) {
                    $message
                        ->to([$oRequest->to, $oRequest->to])
                        ->subject($oRequest->subject)
                    ;
                }
            ); // end \Mail::send()
        } // end if($isOkayToSend)
        
        
        
        // api response 
         $oResponse = new \stdClass();
         $oResponse->request = $oRequest;
         return \Response::json($oResponse);
        
        // no response to client-side
        // die();
        
        // empty response to client-side
        return '';
        
    }
   
     /**
     * @brief   Sends an Email (POST)
     */
    public function sendEmailPreview(
            Request     $request,
            $from = null,
            $to = null,
            $message = null,
            $format = 'html'
    ) {
        
        $from       = is_null($from)    ? \Input::get('from')    : $from;
        $to         = is_null($to)      ? \Input::get('to')      : $to;
        $body       = is_null($message) ? \Input::get('message') : $message;        
        $imageUrl   = \Input::get('imageUrl', null);
        $thumbnailUrl = \Input::get('thumbnailUrl', null);
        if (is_null($thumbnailUrl)) {
            $thumbnailUrl = $imageUrl;
        }   
        $subject    = \Config::get('mail.offerEmailSubjectLine');
        
        // build request object
        $oRequest = new \stdClass();
        $oRequest->apiKey       = \Input::get('apiKey');
        /*
        if ($oRequest->apiKey !== \Config::get('api.apiKey')) {
            // echo PHP_EOL . "bad api key";
            // die()
            
            // return empty response (keeps fingerprint persistent across requests)
            return '';
        }
        */
        
        
        $oRequest->from         = $from;
        $oRequest->to           = $to;
        $oRequest->dirtyBody    = $body;
        $oRequest->subject      = $subject;
        $oRequest->imageUrl     = $imageUrl;
        $oRequest->thumbnailUrl = $thumbnailUrl;
        $oRequest->ipaddress = $request->ip();
        $oRequest->datetime  = Carbon::now()->toDateTimeString();
        $oRequest->useragent = $request->server('HTTP_USER_AGENT');

        
        // -- you can add these functionalities if you like
        
        // normalize (limit size, strip html tags)
        $oRequest->body     
            = EmailSecurity::cleanMessage(
                        $oRequest->dirtyBody, // original message
                        \Config::get('emailsecurity.maxMessageLength'), // maxMessageLength
                        true // strip HTML tags
                    );
                    
       $textView = is_null($imageUrl) 
                    ? 'emails.shared_text' 
                    : 'emails.shared_with_image_text'
        ;
        $htmlView = is_null($imageUrl) 
                    ? 'emails.shared_html' 
                    : 'emails.shared_with_image_html'
        ;

        $data = [
                    'from'  =>  $oRequest->from,
                    'to'    =>  $oRequest->to,
                    'body'  =>  $oRequest->body,
                    'imageUrl' => $oRequest->imageUrl,
                    'thumbnailUrl' => $oRequest->thumbnailUrl
                ];
        
        if ($format == 'txt') {
            return \Response::view($textView, $data);
        } else {
            return \Response::view($htmlView, $data);
        }  

        
    }
    
    
    
    
    /**
     * @brief   Sends an Email (POST)
     */
    public function sendEmailSubmission(
            Request     $request,
            $name = null,
            $age = null,
            $phone = null,
            $parentName = null,
            $email = null,
            $zipCode = null
    ) {

        $body       = null;
        $from       = \Config::get('mail.username');
        $to         = \Config::get('mail.sendSubmissionsTo');
        $name       = is_null($name)        ? \Input::get('name')       : $name;
        $age        = is_null($age)         ? \Input::get('age')        : $age;
        $phone      = is_null($phone)       ? \Input::get('phone')      : $phone;
        $parentName = is_null($parentName)  ? \Input::get('parentName') : $parentName;
        $email      = is_null($email)       ? \Input::get('email')      : $email;
        $zipCode    = is_null($zipCode)     ? \Input::get('zipCode')    : $zipCode;
        $imageUrl   = \Input::get('imageUrl', null);
        $thumbnailUrl = \Input::get('thumbnailUrl', null);
        $subject    = \Config::get('mail.submissionEmailSubjectLine');;
        
        // build request object
        $oRequest = new \stdClass();
        $oRequest->apiKey       = \Input::get('apiKey');
        /*
        if ($oRequest->apiKey !== \Config::get('api.apiKey')) {
            // echo PHP_EOL . "bad api key";
            // die()
            
            // return empty response (keeps fingerprint persistent across requests)
            return '';
        }
        */
        if (is_array($to)) {
            $oRequest->recipients = $to;
        } else {
            $oRequest->recipients = [$to];
        }
        
        if (is_array($to)) {
            $to = $to[0];
        }
        
        $oRequest->from         = $from;
        $oRequest->to           = $to;
        $oRequest->name         = $name;
        $oRequest->age          = $age;
        $oRequest->phone        = $phone;
        $oRequest->parentName   = $parentName;
        $oRequest->email        = $email;
        $oRequest->zipCode      = $zipCode;
        $oRequest->dirtyBody    = $body;
        $oRequest->subject      = $subject;
        $oRequest->imageUrl     = $imageUrl;
        $oRequest->thumbnailUrl = $thumbnailUrl;
        $oRequest->ipaddress = $request->ip();
        $oRequest->datetime  = Carbon::now()->toDateTimeString();
        $oRequest->useragent = $request->server('HTTP_USER_AGENT');

        
        // save to googledoc (see app/config/googledoc.php)
        $googleDocSubmitter = GoogleDocSubmitter::instance()
            ->data($oRequest)
            ->submit()
        ;
        
        // normalize (limit size, strip html tags)
        $oRequest->body     
            = EmailSecurity::cleanMessage(
                        $oRequest->dirtyBody, // original message
                        \Config::get('emailsecurity.maxMessageLength'), // maxMessageLength
                        true // strip HTML tags
                    );
        
        // check some stuff for security 
        // (ex: repeated sends from ip address in x minutes?)
        //$isOkayToSend = EmailSecurity::isOkayToSend($oRequest);
        $isOkayToSend = true;
        
        // record some stuff for security
        // (ex: email send from this ip-address)
        //EmailSecurity::log($oRequest);
        
        $textView  = 'emails.submitted_with_image_text';
        $htmlView  = 'emails.submitted_with_image_html';
        
        if ($isOkayToSend) {
            foreach ($oRequest->recipients as $recipient) {
                $oRequest->to = $recipient;
                // send email
                \Mail::send(
                    // view templates for composing email body
                    [
                        'text'  => $textView,
                        'html'  => $htmlView
                    ],
                    // variables to pass to the view template
                    (array) $oRequest,
                    // configure the email itself
                    function($message) use ($oRequest) {
                        $message
                            ->to([$oRequest->to, $oRequest->to])
                            ->subject($oRequest->subject)
                        ;
                    }
                ); // end \Mail::send()    
            }
            
            
        } // end if($isOkayToSend)
        
        
        
        // api response 
         $oResponse = new \stdClass();
         $oResponse->request = $oRequest;
         $oResponse->googleDocSubmitter = $googleDocSubmitter;
         return \Response::json($oResponse);
        
        // no response to client-side
        // die();
        
        // empty response to client-side
        return '';
        
    }
   
     /**
     * @brief   Sends an Email (POST)
     */
    public function sendEmailSubmissionPreview(
            Request     $request,
            $name = null,
            $age = null,
            $phone = null,
            $parentName = null,
            $email = null,
            $zipCode = null,
            $format = 'html'
    ) {
        
        $body       = null;
        $from       = \Config::get('mail.username');
        $to         = \Config::get('mail.sendSubmissionsTo');
        $name       = is_null($name)        ? \Input::get('name')       : $name;
        $age        = is_null($age)         ? \Input::get('age')        : $age;
        $phone      = is_null($phone)       ? \Input::get('phone')      : $phone;
        $parentName = is_null($parentName)  ? \Input::get('parentName') : $parentName;
        $email      = is_null($email)       ? \Input::get('email')      : $email;
        $zipCode    = is_null($zipCode)     ? \Input::get('zipCode')    : $zipCode;
        $imageUrl   = \Input::get('imageUrl', null);
        $thumbnailUrl = \Input::get('thumbnailUrl', null);
        $subject    = \Config::get('mail.submissionEmailSubjectLine');;
        
        if (is_array($to)) {
            $to = $to[0];
        }
        
        // build request object
        $oRequest = new \stdClass();
        $oRequest->apiKey       = \Input::get('apiKey');
        /*
        if ($oRequest->apiKey !== \Config::get('api.apiKey')) {
            // echo PHP_EOL . "bad api key";
            // die()
            
            // return empty response (keeps fingerprint persistent across requests)
            return '';
        }
        */
        
        
        $oRequest->from         = $from;
        $oRequest->to           = $to;
        $oRequest->name         = $name;
        $oRequest->age          = $age;
        $oRequest->phone        = $phone;
        $oRequest->parentName   = $parentName;
        $oRequest->email        = $email;
        $oRequest->zipCode      = $zipCode;
        $oRequest->dirtyBody    = $body;
        $oRequest->subject      = $subject;
        $oRequest->imageUrl     = $imageUrl;
        $oRequest->thumbnailUrl = $thumbnailUrl;
        $oRequest->session_id   = Session::getId();
        $oRequest->ipaddress = $request->ip();
        $oRequest->datetime  = Carbon::now()->toDateTimeString();
        $oRequest->useragent = $request->server('HTTP_USER_AGENT');

        // normalize (limit size, strip html tags)
        $oRequest->body     
            = EmailSecurity::cleanMessage(
                        $oRequest->dirtyBody, // original message
                        \Config::get('emailsecurity.maxMessageLength'), // maxMessageLength
                        true // strip HTML tags
                    );
                    
        $textView  = 'emails.submitted_with_image_text';
        $htmlView = 'emails.submitted_with_image_html';

        $data = (array) $oRequest;
        
        if ($format == 'txt') {
            return \Response::view($textView, $data);
        } else {
            return \Response::view($htmlView, $data);
        }  

        
    }
    
    
    
   
    
    
    
}
