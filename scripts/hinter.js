var Hinter = function () {
    //-------------------------------------------------------
    // Модели
    function Category(
        id, 
        title, 
        description,
        parentId
    ) {
        var self = this;
        self.Id = id;
        self.Title = title;
        self.Description = description;
        self.ParentId = parentId;
        self.Editing = false;
    
        self.pack = function() {
            return {
                id:         this.Id,
                title:      this.Title,
                description:this.Description, 
                parentId:   this.ParentId
            }
        }
    }

    Category.unpack = function(json) {
        return new Category(
            json.id,
            json.title,
            json.description,
            json.parentId
        );
    } 

    function MainQuestion(
        id, 
        title, 
        description,
        categoryId,
        createDate,
        order,
        isOwner
    ) {
        var self = this;
        self.Id = id;
        self.Title = title;
        self.Description = description;
        self.CategoryId = categoryId;
        self.CreateDate = createDate;
        self.Order = order;
        self.IsOwner = isOwner;     
        self.Editing = false;      
        
        self.pack = function() {
            return {
                id:         this.Id,
                title:      this.Title,
                description:this.Description, 
                categoryId: this.CategoryId,
                order:      this.Order                      
            }
        }        
    }
    
    MainQuestion.unpack = function(json) {
        return new MainQuestion(
            json.id,
            json.title,
            json.description,
            json.categoryId,
            json.createDate,
            json.order,
            json.isOwner
        );
    }     
    
    function MainAnswer(
        id, 
        title, 
        description,
        questionId,
        createDate,
        order,
        isOwner
    ) {
        var self = this;
        self.Id = id;
        self.Title = title;
        self.Description = description;
        self.QuestionId = questionId;
        self.CreateDate = createDate;
        self.Order = order;
        self.IsOwner = isOwner;
        self.Editing = false;
        
        self.pack = function() {
            return {
                id:         this.Id,
                title:      this.Title,
                description:this.Description, 
                questionId: this.QuestionId,
                order:      this.Order                      
            }
        }         
    }    
    
    MainAnswer.unpack = function(json) {
        return new MainAnswer(
            json.id, 
            json.title, 
            json.description,
            json.questionId,
            json.createDate,
            json.order,
            json.isOwner
        );             
    } 
    
    
    function SecondQuestion(
        id, 
        title, 
        description,
        parentId,
        createDate,
        order,
        isOwner
    ) {
        var self = this;
        self.Id = id;
        self.Title = title;
        self.Description = description;
        self.ParentId = parentId;
        self.CreateDate = createDate;
        self.Order = order;
        self.IsOwner = isOwner;
        self.Editing = false;
        
        self.pack = function() {
            return {
                id:         this.Id,
                title:      this.Title,
                description:this.Description, 
                parentId:   this.ParentId,
                order:      this.Order                      
            }
        }         
    }     
    
    SecondQuestion.unpack = function(json) {
        return new SecondQuestion(
            json.id,
            json.title,
            json.description,
            json.parentId,
            json.createDate,
            json.order,
            json.isOwner
        );
    }        
    
    function SecondAnswer(
        id, 
        title, 
        description,
        questionId,
        createDate,
        order,
        isOwner
    ) {
        var self = this;
        self.Id = id;
        self.Title = title;
        self.Description = description;
        self.QuestionId = questionId;
        self.CreateDate = createDate;
        self.Order = order;
        self.IsOwner = isOwner;
        self.Editing = false;
        
        self.pack = function() {
            return {
                id:         this.Id,
                title:      this.Title,
                description:this.Description, 
                questionId: this.QuestionId,
                order:      this.Order                      
            }
        }        
    }     
    
    SecondAnswer.unpack = function(json) {
        return new SecondAnswer(
            json.id,
            json.title,
            json.description,
            json.questionId,
            json.createDate,
            json.order,
            json.isOwner
        );
    }      
    
    //-------------------------------------------------------
    // Модели представления
    
    function PassTestVM(mainQuestionId) {
        var mainQuestionId = mainQuestionId;
        var self = this;
        self.CurrentSecQuestion = ko.observable(0);
        self.Finish             = ko.observable(false);
        
        self.SecondQuestionList = ko.observableArray([]);
        self.SecondQuestion     = ko.observable(null);
        self.SecondAnswerList   = ko.mapping.fromJS([]);
        self.MainAnswerList     = ko.mapping.fromJS([]);
        self.RelMainAnswerList  = ko.mapping.fromJS([]);
        
        self.bind = function() {
            ko.applyBindings(self);
            
            requestAjaxJson('GET', apiUrlBase + "/mainquestion/" + mainQuestionId + "/mainanswer", null, function (json) {                
                self.MainAnswerList(
                    json 
                    ? $.map(json.data, function (item) { return MainAnswer.unpack(item); }) 
                    : []
                );
                self.MainAnswerList.sort(sortQuestionAnswerArray);
            });
            
            requestAjaxJson('GET', apiUrlBase + "/mainquestion/" + mainQuestionId + "/secondaryquestion", null, function (json) {                
                self.SecondQuestionList(
                    json
                    ? $.map(json.data, function (item) { return SecondQuestion.unpack(item); }) 
                    : []
                );
            });            
            //ko.mapping.fromJS(json, mappingOptions(), model);
        }      
        
        self.start = function() {
            self.CurrentSecQuestion(0);
            self.Finish(false);
            self.SecondQuestion(null);
            self.SecondAnswerList([]);
            self.RelMainAnswerList([]);
            self.MainAnswerList().forEach(function(elMa, indMa, arrMa) { elMa.Order = 0; });
            self.nextQuestion();            
        }
        
        self.nextQuestion = function(selectedSecondAnswer) {
            if (selectedSecondAnswer instanceof SecondAnswer) {
                //alert("выбран ответ " + selectedSecondAnswer.Id);
                if (self.CurrentSecQuestion() == 1) {
                    self.MainAnswerList().forEach(function(elMa, indMa, arrMa) { elMa.Order = 0; });
                }
                requestAjaxJson('GET', apiUrlBase + "/secondaryanswer/" + selectedSecondAnswer.Id + "/mainanswer", null, function (json) {                
                    var collection = json 
                        ? $.map(json.data, function (item) { return MainAnswer.unpack(item); })
                        : [];
                    //ko.mapping.fromJS(collection, null, self.SecondAnswerList);
                    self.RelMainAnswerList(collection);                      
                    //---
                    self.RelMainAnswerList().forEach(function(elRel, indRel, arrRel) {
                        self.MainAnswerList().every(function(elMa, indMa, arrMa) {
                            if (elRel.Id == elMa.Id) { elMa.Order++; return false; }
                            return true;
                        });                     
                    });
                    self.MainAnswerList.sort(sortQuestionAnswerArray);                         
                    //---       
                });                
            }
            
            if (self.CurrentSecQuestion() + 1 <= self.SecondQuestionList().length) {
                self.CurrentSecQuestion(self.CurrentSecQuestion() + 1);
                self.SecondQuestion(self.SecondQuestionList()[self.CurrentSecQuestion() - 1]);
                
                self.SecondAnswerList([]);
                requestAjaxJson('GET', apiUrlBase + "/secondaryquestion/" + self.SecondQuestion().Id + "/secondaryanswer", null, function (json) {                
                    var collection = json 
                        ? $.map(json.data, function (item) { return SecondAnswer.unpack(item); })
                        : [];
                    //ko.mapping.fromJS(collection, null, self.SecondAnswerList);
                    self.SecondAnswerList(collection);
                });                      
            } else {
                self.Finish(true);
            }      
        }    
        
        self.getProgress = function() {
            return !self.MainAnswerList().length || !self.CurrentSecQuestion() ? 0 : (self.CurrentSecQuestion()-1)*100/self.MainAnswerList().length;
        }  
    }
    
    function CreateTestVM() {
        self = this;
        
        self.Step = ko.observable(0);
        self.StepList = [
            {id: 0, title: 'Создание решения'},
            {id: 0, title: 'Определение основного вопроса'},
            {id: 0, title: 'Определение ответов на основной вопрос'},
            {id: 0, title: 'Определение вспомогательных вопросов'},
            {id: 0, title: 'Определение ответов на вспомогательные вопросы'}
        ];
                
        self.Messages = ko.mapping.fromJS([]);
        
        self.MainQuestion = ko.mapping.fromJS(new MainQuestion());        
        self.MainAnswerList = ko.mapping.fromJS([]);
        self.SecondQuestionList = ko.mapping.fromJS([]);
        self.SecondAnswerList = ko.mapping.fromJS([]);
        self.CategoryList = ko.observableArray([]);
        
        self.bind = function() {
            ko.applyBindings(self);
            
            requestAjaxJson('GET', apiUrlBase + "/category", null, function (json) {                
                self.CategoryList(
                    json 
                    ? $.map(json.data, function (item) { return Category.unpack(item); }) 
                    : []
                );
                self.CategoryList.sort(sortQuestionAnswerArray);
            });
            /*
            requestAjaxJson('GET', apiUrlBase + "/mainquestion/" + mainQuestionId + "/secondaryquestion", null, function (json) {                
                self.SecondQuestionList(
                    json
                    ? $.map(json.data, function (item) { return SecondQuestion.unpack(item); }) 
                    : []
                );
            });     
            */       
        }          
        
        self.nextStep = function() {
            self.Step(self.Step() + 1);
            
            if (self.Step() == 1) { // создание главного вопроса
                ko.mapping.fromJS(new MainQuestion(), self.MainQuestion);
                self.MainQuestion.Editing(true);           
            }
            
            if (self.Step() == 2) { // добавление ответов
                self.MainQuestion.Editing(false);
                var mainQuestion = ko.mapping.toJS(self.MainQuestion);
                requestAjaxJson(
                    'POST', 
                    apiUrlBase + "/mainquestion", 
                    mainQuestion.pack(), 
                    function (json) {  
                        if (json.data) {
                            ko.mapping.toJS(json.data, self.MainQuestion);
                        }
                    }
                ); 
            }
        }              
    }
    
    var apiUrlBase = '/api';
    
    var sortQuestionAnswerArray = function(left, right) {
        return left.Order == right.Order ? 0 : (left.Order < right.Order ? 1 : -1);
    }  
    
    var requestAjaxJson = function (requestType, serviceUrl, sendData, callback, callbackError) {
        callbackError = callbackError 
            || function (jqXHR, textStatus) {
                if (confirm(jqXHR.status 
                    + " "
                    + textStatus
                    + ":"
                    + jqXHR.statusText)) {
                    alert(jqXHR.responseText);
                }
            }
        $.ajax({
            url: serviceUrl,
            data: JSON.stringify(sendData),
            type: requestType,
            dataType: 'json',
            cache: false,
            contentType: 'application/json; charset=utf-8',
            success: callback,
            error: callbackError
        });
    };

    return {
        PassTestVM: PassTestVM,
        CreateTestVM: CreateTestVM,
        requestAjaxJson: requestAjaxJson
    }    
}();
