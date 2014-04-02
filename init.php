<?php

    /**
     * Здесь осуществляется подключение необходимых файлов и инициализация глобальных переменных
     * 
     * Внимание! Здесь запрещен какой-либо вывод (в т.ч. установка заголовков)!      
     */

    require_once __DIR__.'/settings.php';   
    require_once __DIR__.'/modules/vendor/autoload.php';
    //TODO переделать на autoload
    require_once __DIR__.'/core/HttpResponseCode.php';
    require_once __DIR__.'/core/RepositoryFactory.php';
    require_once __DIR__.'/core/Resource.php';
    require_once __DIR__.'/core/ResourceBase.php';      
    require_once __DIR__.'/core/ResourceDocument.php';
    require_once __DIR__.'/core/ResourceCollection.php';
    require_once __DIR__.'/core/ResourceController.php';        
    require_once __DIR__.'/core/MainQuestionDocument.php';
    require_once __DIR__.'/core/MainQuestionCollection.php';
    require_once __DIR__.'/core/MainAnswerDocument.php';
    require_once __DIR__.'/core/MainAnswerCollection.php';
    require_once __DIR__.'/core/MainAnswerMQCollection.php';
    require_once __DIR__.'/core/MainAnswerSACollection.php';
    require_once __DIR__.'/core/SecondQuestionDocument.php';
    require_once __DIR__.'/core/SecondQuestionCollection.php';
    require_once __DIR__.'/core/SecondQuestionMQCollection.php';
    require_once __DIR__.'/core/SecondAnswerDocument.php';
    require_once __DIR__.'/core/SecondAnswerCollection.php';
    require_once __DIR__.'/core/SecondAnswerSQCollection.php';
    require_once __DIR__.'/core/SecondAnswerRelController.php';
    require_once __DIR__.'/core/SecondAnswerLinkController.php';
    require_once __DIR__.'/core/SecondAnswerUnlinkController.php';          
    require_once __DIR__.'/core/CategoryDocument.php';
    require_once __DIR__.'/core/CategoryCollection.php';
    require_once __DIR__.'/core/HinterApi.php';
    
    use Maradik\User\UserCurrent;
    use Maradik\User\UserRepository;    
    
    use Maradik\HinterApi\RepositoryFactory;    
    
    $db = new PDO(
        "{$database_s['driver']}:host={$database_s['host']};dbname={$database_s['database']};charset=UTF8", 
        $database_s['username'], 
        $database_s['password']
    );
    
    $user = new UserCurrent(new UserRepository($db, $user_s['table'], $database_s['prefix']), $user_s['enctryptsalt']);
    $user->init(); 

    $repositoryFactory = new RepositoryFactory(
        $db,
        $database_s['prefix'],
        $table_s['category'],
        $table_s['mainquestion'],
        $table_s['mainanswer'],
        $table_s['secondquestion'],
        $table_s['secondanswer'],
        $table_s['relationanswers']
    );    
    

