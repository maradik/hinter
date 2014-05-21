<?php

    require_once __DIR__.'/settings.php';   
    require_once __DIR__.'/vendor/autoload.php';

    use Maradik\User\UserCurrent;
    use Maradik\User\UserRepository;    
    
    use Maradik\Hinter\Core\RepositoryFactory; 
    use Maradik\Hinter\Core\Params;  
    
    $db = new PDO(
        "{$database_s['driver']}:host={$database_s['host']};dbname={$database_s['database']};charset=UTF8", 
        $database_s['username'], 
        $database_s['password']
    );
    
    $user = new UserCurrent(new UserRepository($db, $table_s['user'], $database_s['prefix']), $general_s['enctryptsalt']);
    $user->init(); 

    $repositoryFactory = new RepositoryFactory(
        $db,
        $database_s['prefix'],
        $table_s['category'],
        $table_s['mainquestion'],
        $table_s['mainanswer'],
        $table_s['secondquestion'],
        $table_s['secondanswer'],
        $table_s['relationanswers'],
        $table_s['param'],
        $table_s['file'],
        $general_s['upload_dir']
    );    

    Params::setRepository($repositoryFactory->getParamRepository());
