<?php

    namespace Maradik\Hinter\Core;
    
    class FileParentType
    {
        const MAIN_QUESTION = 1;
        const MAIN_ANSWER   = 2;
        const SECOND_QUESTION = 3;
        const SECOND_ANSWER   = 4;
        
        static public function getAll()
        {
            return array(
                self::MAIN_QUESTION,
                self::MAIN_ANSWER,
                self::SECOND_QUESTION,
                self::SECOND_ANSWER
            );
        }
    }
