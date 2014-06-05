<?php
    namespace Maradik\Hinter\Core;        
    
    use Maradik\Testing\BaseRepository;
    
    /**
     * Репозиторий для взаимодействия с БД в отношении параметров ParamData
     */
    class ParamRepository extends BaseRepository
    {                              
        /**
         * @param int $id
         * @return ParamData
         */
        public function getById($id)
        {
            return parent::getById($id);                        
        }        

        /**
         * @param string $key
         * @return ParamData
         */
        public function getByKey($key)
        {
            return $this->query()->addFilterField('key', $key)->getOneEntity();                        
        }  

        /**
         * @param ParamData $param
         * @return boolean
         */
        public function insert(ParamData $param)
        {
            return parent::insert($param);  
        }

        /**
         * @param ParamData $param
         * @return boolean
         */
        public function update(ParamData $param)
        {
            return parent::update($param);                       
        }                     
    
        /**
         * @return ParamData
         */
        public function rowToObject(array $row)
        {
            $param = new ParamData(                
                $row['key'],
                $row['value'],
                $row['id']                
            );
            
            return $param;
        }          
        
        /**
         * Используется для задания правила отображения поля сущности в поле таблицы. 
         *
         * @return array Массив["поле_сущности"] = "поле_таблицы"
         */
        protected function tableFields()
        {
            return array(
                'id'        => 'id',
                'key'       => 'key',
                'value'     => 'value'
            );            
        }          

        /**
         * Создание необходимых таблиц в БД и первичная настройка
         *          
         * @return boolean true в случае успеха, иначе false
         */        
        public function install()
        {                       
            try {
                $sql = "CREATE TABLE IF NOT EXISTS `{$this->tableFullName()}` (
                          `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
                          `key` varchar(30) NOT NULL,
                          `value` varchar(255) NOT NULL,
                          PRIMARY KEY (`id`),
                          UNIQUE KEY `{$this->tableFullName()}_key` (`key`)
                        ) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;";        
                $ret = $this->db->query($sql) !== false;            
            } catch (\Exception $err) {
                throw new \Exception(ERROR_TEXT_DB, 0, $err);              
            }     
            
            return $ret;           
        }
    }
