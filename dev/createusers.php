<?php
    use \Maradik\User\UserCurrent;
    use \Maradik\User\UserRepository;
    use \Maradik\User\UserData;



    $user->init(false);
    $userData = new UserData(
        0,
        'admin',
        'admin',
        '',
        'admin',
        2,
        time(),
        time()
    );
    if ($user->register($userData)) {        
        setcookie("admin", $user->data()->session);
    }
    
    $user->init(false);
    $userData = new UserData(
        0,
        'user',
        'user',
        '',
        'user',
        0,
        time(),
        time()
    );
    if ($user->register($userData)) {
        setcookie("user", $user->data()->session);
    }
    
    die(); 