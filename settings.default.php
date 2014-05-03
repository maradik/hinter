<?php
    
    /**
     * Настройки базы данных
     */
    $database_s = array(
        'database' => 'hintok',
        'username' => 'root',
        'password' => '',
        'host' => 'localhost',        
        'driver' => 'mysql',
        'prefix' => ''
    ); 
    
    /**
     * Общие настройки
     */
    $general_s = array(
        'enctryptsalt' => 'a0s9D8F7g6H5'
    );     
    
    
    /**
     * Системные настройки (лучше не менять)
     */    
    $table_s = array(
        'category'          => 'category',
        'mainquestion'      => 'mainquestion',
        'secondquestion'    => 'secondaryquestion',
        'mainanswer'        => 'mainanswer',
        'secondanswer'      => 'secondaryanswer',
        'relationanswers'   => 'relationanswers',
        'param'             => 'params',
        'user'              => 'user'   
    );

    $templates_s = array(
        'templates_path'    => __DIR__.'/templates',
        'compiled_path'     => __DIR__.'/templates/compiled'
    );
    
    $system_s = array(
        'api_base_uri'      => '/api',
        'dev_server'        => $_SERVER['SERVER_NAME'] == 'hintok.an'
    );
    
