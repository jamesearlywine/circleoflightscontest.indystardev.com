<?php

return [
    // whitelists should be lowercased, 
    // input will be lowercased before comparison
    'whitelists' => [
        // valid actions (re: recording user coupon interactions)
        'pages' => [
            'home',
            'canvas',
            'preview',
            'thanks'
        ],
        'actionTypes' => [
            'info',
            'share',
            'print',
            'download',
            'coloring-complete',
            'coloring-submitted',
        ],
        'actionDetails' => [
            'email',
            'pinterest',
            'facebook',
            'googleplus',
            'twitter',
            'contest-rules',
            'contest-application',
            'completed-coloring',
            'more-information'
        ]
    ]
    
];
