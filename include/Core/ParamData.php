<?php
    namespace Maradik\Hinter\Core;
    
    use Maradik\Testing\BaseData;
    use Respect\Validation\Validator;
    
    /**
     * Класс-контейнер для оперирования сущностями типа Параметр, хранящимися в БД
     */
    class ParamData extends BaseData
    {
        /**
         * @var string $key Ключ параметра
         */
        public $key;
        
        /**
         * @var string $value Значение параметра 
         */
        public $value;        
        
        /**
         * @param int $key Ключ
         * @param int $value Значение
         * @param int $id Идентификатор параметра
         */
        public function __construct(
            $key    = '',
            $value  = '',
            $id     = 0            
        ) {
            parent::__construct($id);
            
            $this->key      = (string) $key;
            $this->value    = (string) $value;
        }   
        
        /**
         * @param string[] $fields Названия полей для проверки.
         * @return \Respect\Validation\Validatable[] Возвращает массив валидаторов.
         */
        protected function validators($fields) 
        {
            $v = parent::validators($fields);
            
            if (in_array($f = 'key', $fields)) {
                $v[$f] = Validator::attribute($f, Validator::string()->notEmpty()->length(1, 30))
                    ->setName($f)
                    ->setTemplate('{$fields} должно быть строкой длиной от 1 до 30 символов.');
            }
            
            if (in_array($f = 'value', $fields)) {
                $v[$f] = Validator::attribute($f, Validator::string()->length(0, 255))
                    ->setName($f)
                    ->setTemplate('{$fields} должно быть строкой длиной от 0 до 255 символов.');
            }            
            
            return $v;
        }               
    }
