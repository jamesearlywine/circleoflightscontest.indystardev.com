<?php

namespace App\Http\Controllers;

// use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Response;
use Illuminate\Support\Facades\Request;
use Illuminate\Support\Facades\Input;
use Illuminate\Support\Facades\Auth;

use App\Models\Publication;
use stdClass;


class AuthCheckController extends Controller
{
    public function isLoggedIn() {
        $isLoggedIn = Auth::check();
        
        $responseObject = new stdClass();
        $responseObject->isLoggedIn = $isLoggedIn;
        
        return Response::json($responseObject, 200);
    }
    
    public function postLogin() {
        $responseObject = new stdClass();
        $responseObject->success = Auth::attempt([
            'email'     => Input::get('email'),
            'password'  => Input::get('password')
        ]);
        return Response::json($responseObject);
    }
    
    public function getLogout() {
        Auth::logout();
    }
}
