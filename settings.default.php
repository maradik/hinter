<?php
    
    /**
     * Общие настройки
     */
    
    $database_s = array (
        'database' => 'hintok',
        'username' => 'root',
        'password' => '',
        'host' => 'localhost',        
        'driver' => 'mysql',
        'prefix' => ''
    ); 
    
    $user_s = array (
        'table' => 'user',
        'enctryptsalt' => '3D,j6_9f~.s3'
    );  
    
    $table_s = array (
        'category'          => 'category',
        'mainquestion'      => 'mainquestion',
        'secondquestion'    => 'secondaryquestion',
        'mainanswer'        => 'mainanswer',
        'secondanswer'      => 'secondaryanswer',
        'relationanswers'   => 'relationanswers'
    );
