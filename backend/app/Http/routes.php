<?php

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It's a breeze. Simply tell Laravel the URIs it should respond to
| and give it the controller to call when that URI is requested.
|
*/

// default welcome
Route::get('/', function () {
    return view('welcome');
});
 
// Authentication routes...
// Route::get('auth/login', 'Auth\AuthController@getLogin');
// Route::post('auth/login', 'AuthCheckController@postLogin');
// Route::get('auth/logout', 'Auth\AuthController@getLogout');
// Route::get('auth/isLoggedIn', 'AuthCheckController@isLoggedIn');

// Registration routes...
// Route::get('auth/register', 'Auth\AuthController@getRegister');
// Route::post('auth/register', 'Auth\AuthController@postRegister');


// application routes.. 

Route::post('sendEmail', 'EmailController@sendEmail');
Route::get('downloadContestPDF', 'DownloadController@downloadContestPDF');

/**
 * Email Routes (need to switched to POST after testing is complete)
 */
// sendEmail (for sharing from Home)
Route::post('sendEmail/{from}/{to}/{message}', 'EmailController@sendEmail');
Route::post('sendEmailPreview/{from}/{to}/{message}.{format}', 'EmailController@sendEmailPreview');
Route::post('sendEmailPreview/{from}/{to}/{message}', 'EmailController@sendEmailPreview');

Route::get('sendEmail/{from}/{to}/{message}', 'EmailController@sendEmail');
Route::get('sendEmailPreview/{from}/{to}/{message}.{format}', 'EmailController@sendEmailPreview');
Route::get('sendEmailPreview/{from}/{to}/{message}', 'EmailController@sendEmailPreview');


Route::post('sendSubmission/{name}/{age}/{phone}/{parentName}/{email}/{zipCode}', 'EmailController@sendEmailSubmission');
Route::post('sendSubmission', 'EmailController@sendEmailSubmission');
Route::post('sendSubmissionPreview/{name}/{age}/{phone}/{parentName}/{email}/{zipCode}.{format}', 'EmailController@sendEmailSubmissionPreview');
Route::post('sendSubmissionPreview/{name}/{age}/{phone}/{parentName}/{email}/{zipCode}', 'EmailController@sendEmailSubmissionPreview');

Route::get('sendSubmission/{name}/{age}/{phone}/{parentName}/{email}/{zipCode}', 'EmailController@sendEmailSubmission');
Route::get('sendSubmissionPreview/{name}/{age}/{phone}/{parentName}/{email}/{zipCode}.{format}', 'EmailController@sendEmailSubmissionPreview');
Route::get('sendSubmissionPreview/{name}/{age}/{phone}/{parentName}/{email}/{zipCode}', 'EmailController@sendEmailSubmissionPreview');


/**
 * Image Upload
 */
Route::post('sendImageBase64', 'UploadController@sendImageBase64');

/**
 * Remote File Download as Attachment
 */
Route::get('download.png',              'DownloadController@downloadPNG');
Route::get('downloadWithChrome.png',    'DownloadController@downloadPNGWithChrome');

Route::post('actionTracking', 'ActionTrackingController@postRecordAction');

 
?>

