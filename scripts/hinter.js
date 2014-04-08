var Hinter = function () {
    // наследование смотри http://habrahabr.ru/post/131714/
    
    var MessageType = {NOTIFICATION: 0, SUCCESS: 1, WARNING: 2, ERROR: 3};
    
    function Message(text, type) {
        var self = this;
        
        self.text = text;
        self.type = type;
    }    
    
    //-------------------------------------------------------
    // Модели
    
    function BaseModel() {
        var self = this;
        self.Editing    = ko.observable(false);
        self.Edited     = ko.observable(false);
        self.Locked     = ko.observable(false);
    }
    
    BaseModel.save = function(model, callbackSuccess, callbackError) {
        //var model = observableModel();
        model.Edited(model.Editing());
        model.Locked(true);
        model.Editing(false);        
        requestAjaxJson(
            model.Id() ? 'PUT' : 'POST', 
            apiUrlBase + model.getUri() + (model.Id() ? '/' + model.Id() : ''), 
            model.pack(), 
            function (data, textStatus, jqXHR) { 
                //observableModel(model.unpack(data.data));
                if (callbackSuccess) {
                    callbackSuccess(data, textStatus, jqXHR);
                }
            },
            function (jqXHR, textStatus) {
                //--------
                if (confirm(jqXHR.status 
                    + " "
                    + textStatus
                    + ":"
                    + jqXHR.statusText)) {
                    alert(jqXHR.responseText);
                }           
                //----------     
                model.Editing(model.Edited());
                model.Locked(false);
                model.Edited(false);                
                
                if (callbackError) {
                    callbackError(jqXHR, textStatus);
                }
            }
        );
    }
    
    function Category(
        id, 
        title, 
        description,
        parentId,
        order
    ) {
        var self = this;
        ko.utils.extend(self, new BaseModel());        
        
        self.Id             = ko.observable(id);
        self.Title          = ko.observable(title);
        self.Description    = ko.observable(description);
        self.ParentId       = ko.observable(parentId);
        self.Order          = ko.observable(order);
    
        self.getUri = function() {
            return 'category';
        }
    
        self.unpack = Category.unpack;
    
        self.pack = function() {
            return {
                id:         self.Id(),
                title:      self.Title(),
                description:self.Description(), 
                parentId:   self.ParentId(),
                order:      self.Order()
            }
        }
    }
    
    Category.unpack = function(json) {
        return new Category(
            json.id,
            json.title,
            json.description,
            json.parentId,
            json.order
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
        ko.utils.extend(self, new BaseModel());
        
        self.Id             = ko.observable(id);
        self.Title          = ko.observable(title);
        self.Description    = ko.observable(description);
        self.CategoryId     = ko.observable(categoryId);
        self.CreateDate     = ko.observable(createDate);
        self.Order          = ko.observable(order);
        self.IsOwner        = ko.observable(isOwner);     
        
        self.getUri = function() {
            return 'mainquestion';
        }        
        
        self.unpack = MainQuestion.unpack;
        
        self.pack = function() {
            return {
                id:         self.Id(),
                title:      self.Title(),
                description:self.Description(), 
                categoryId: self.CategoryId(),
                order:      self.Order()                      
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
        ko.utils.extend(self, new BaseModel());
        
        self.Id             = ko.observable(id);
        self.Title          = ko.observable(title);
        self.Description    = ko.observable(description);
        self.QuestionId     = ko.observable(questionId);
        self.CreateDate     = ko.observable(createDate);
        self.Order          = ko.observable(order);
        self.IsOwner        = ko.observable(isOwner);
        
        self.getUri = function() {
            return 'mainanswer';
        }          
        
        self.unpack = MainAnswer.unpack;

        self.pack = function() {
            return {
                id:         self.Id(),
                title:      self.Title(),
                description:self.Description(), 
                questionId: self.QuestionId(),
                order:      self.Order()                      
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
        ko.utils.extend(self, new BaseModel());
        
        self.Id             = ko.observable(id);
        self.Title          = ko.observable(title);
        self.Description    = ko.observable(description);
        self.ParentId       = ko.observable(parentId);
        self.CreateDate     = ko.observable(createDate);
        self.Order          = ko.observable(order);
        self.IsOwner        = ko.observable(isOwner);
        
        self.SecondAnswers  = ko.observableArray(); 
        
        self.getUri = function() {
            return 'secondaryquestion';
        }             
        
        self.unpack = SecondQuestion.unpack;
        
        self.pack = function() {
            return {
                id:         self.Id(),
                title:      self.Title(),
                description:self.Description(), 
                parentId:   self.ParentId(),
                order:      self.Order()                      
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
        ko.utils.extend(self, new BaseModel());
        
        self.Id             = ko.observable(id);
        self.Title          = ko.observable(title);
        self.Description    = ko.observable(description);
        self.QuestionId     = ko.observable(questionId);
        self.CreateDate     = ko.observable(createDate);
        self.Order          = ko.observable(order);
        self.IsOwner        = ko.observable(isOwner);

        self.MainAnswers    = ko.observableArray();
        
        self.getUri = function() {
            return 'secondaryanswer';
        }          
        
        self.unpack = SecondAnswer.unpack;
        
        self.pack = function() {
            return {
                id:         self.Id(),
                title:      self.Title(),
                description:self.Description(), 
                questionId: self.QuestionId(),
                order:      self.Order()                     
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
    
    /***************************************************************************
     * 
     * Модель: Прохождение теста
     * 
     ***************************************************************************/        
    function PassTestVM(mainQuestionId) {
        var mainQuestionId = mainQuestionId;
        var self = this;
        self.CurrentSecQuestion = ko.observable(0);
        self.Finish             = ko.observable(false);
        
        self.SecondQuestionList = ko.observableArray([]);
        self.SecondQuestion     = ko.observable(null);
        self.SecondAnswerList   = ko.observableArray([]);
        self.MainAnswerList     = ko.observableArray([]);
        self.RelMainAnswerList  = ko.observableArray([]);
        
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
            self.MainAnswerList().forEach(function(elMa, indMa, arrMa) { elMa.Order(0); });
            self.nextQuestion();            
        }
        
        self.nextQuestion = function(selectedSecondAnswer) {
            if (selectedSecondAnswer instanceof SecondAnswer) {
                //alert("выбран ответ " + selectedSecondAnswer.Id);
                if (self.CurrentSecQuestion() == 1) {
                    self.MainAnswerList().forEach(function(elMa, indMa, arrMa) { elMa.Order(0); });
                }
                requestAjaxJson('GET', apiUrlBase + "/secondaryanswer/" + selectedSecondAnswer.Id() + "/mainanswer", null, function (json) {                
                    var collection = json 
                        ? $.map(json.data, function (item) { return MainAnswer.unpack(item); })
                        : [];
                    //ko.mapping.fromJS(collection, null, self.SecondAnswerList);
                    self.RelMainAnswerList(collection);                      
                    //---
                    self.RelMainAnswerList().forEach(function(elRel, indRel, arrRel) {
                        self.MainAnswerList().every(function(elMa, indMa, arrMa) {
                            if (elRel.Id() == elMa.Id()) { elMa.Order(elMa.Order() - 1); return false; }
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
                requestAjaxJson('GET', apiUrlBase + "/secondaryquestion/" + self.SecondQuestion().Id() + "/secondaryanswer", null, function (json) {                
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
            return !self.MainAnswerList().length || !self.CurrentSecQuestion() ? 0 : Math.round((self.CurrentSecQuestion()-1)*100/self.MainAnswerList().length);
        }  
    }
    
    /***************************************************************************
     * 
     * Модель: Создание теста
     * 
     ***************************************************************************/
    function CreateTestVM() {
        self = this;
        
        self.Step               = ko.observable(0);
        self.SecondQuestionIdx  = ko.observable(-1);
                
        self.MainQuestion       = ko.observable(new MainQuestion());        
        self.MainAnswerList     = ko.observableArray();
        self.SecondQuestionList = ko.observableArray();
        //self.SecondAnswerList   = ko.observableArray();
        self.CategoryList       = ko.observableArray();
        
        self.MainAnswerList.Locked = function() {
            return this().some(function(item) { return item.Locked() });
        }       
        
        self.SecondQuestionList.Locked = function() {
            return this().some(function(item) { 
                return item.Locked() 
                    || item.SecondAnswers().some(function(saItem){ return saItem.Locked(); });  
            });
        }  
        
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
        }      
        
        self.nextStep = function() {
            self.Step(self.Step() + 1);
            
            if (self.Step() == 1) { // создание главного вопроса
                self.MainQuestion(new MainQuestion());
                self.MainQuestion().Editing(true);           
            }
            
            if (self.Step() == 2) { // добавление ответов
                self.addMainAnswer();
            }
            
            if (self.Step() == 3) { // добавление наводящих вопросов с ответами
                self.MainAnswerList().forEach(function(item) {
                    if (!item.Id) {
                        self.saveMainAnswer(item);
                    }
                });
                self.addSecondQuestion();
            }   
            
            if (self.Step() == 4) { // финиш
                self.SecondQuestionIdx(-1);
            }                       
        }
        
        self.saveMainQuestion = function(mainQuestion) {
            BaseModel.save(
                mainQuestion, 
                function(data) {
                    self.MainQuestion(MainQuestion.unpack(data.data));
                    self.nextStep();  
                }
            );
        }      
        
        self.addMainAnswer = function() {
            var newMainAnswer = new MainAnswer();
            newMainAnswer.QuestionId(self.MainQuestion().Id());
            newMainAnswer.Editing(true);
            self.MainAnswerList.push(newMainAnswer);
            newMainAnswer.Order(self.MainAnswerList().length - 1);
        }      
        
        self.saveMainAnswer = function(mainAnswer) {
            BaseModel.save(
                mainAnswer,
                function(data) {
                    var mainAnswerSaved = MainAnswer.unpack(data.data);
                    self.MainAnswerList.replace(mainAnswer, mainAnswerSaved);
                }
            );
        }
        
        self.applyMainAnswers = function() {
            function tryNextStep() {
                if (self.MainAnswerList().every(function(item) {
                    if (item.Editing() || item.Edited()) {return false;}
                    return true;
                })) {
                    self.nextStep();
                }                
            }
            
            self.MainAnswerList().forEach(function(mainAnswer) { 
                if (mainAnswer.Editing()) {               
                    BaseModel.save(
                        mainAnswer,
                        function(data) {
                            var mainAnswerSaved = MainAnswer.unpack(data.data);
                            self.MainAnswerList.replace(mainAnswer, mainAnswerSaved);
                            tryNextStep();
                        }
                    );                
                } 
            });
            tryNextStep();
        }        
        
        self.addSecondQuestion = function() {
            var newSecondQuestion = new SecondQuestion();
            newSecondQuestion.ParentId(self.MainQuestion().Id());
            newSecondQuestion.Editing(true);
            self.SecondQuestionList.push(newSecondQuestion);
            self.SecondQuestionIdx(self.SecondQuestionList().length - 1);
            newSecondQuestion.Order(self.SecondQuestionIdx());
            self.addSecondAnswer(newSecondQuestion);
        }
        
        self.addSecondAnswer = function(secondQuestion) {
            var newSecondAnswer = new SecondAnswer();
            newSecondAnswer.QuestionId(secondQuestion.Id());
            newSecondAnswer.Editing(true);
            secondQuestion.SecondAnswers.push(newSecondAnswer);
            newSecondAnswer.Order(secondQuestion.SecondAnswers().length - 1);            
        }

        self.applySecondQuestion = function(secondQuestion, addSecondQuestion) {
            addSecondQuestion = addSecondQuestion || false;
            var tryNextStep = function() {
                if (secondAnswerList().every(function(item) {
                    if (item.Editing() || item.Edited()) {return false;}
                    return true;
                })) {
                    self.nextStep();
                }                
            }    
            var tryAddSecondQuestion= function() {
                if (secondAnswerList().every(function(item) {
                    if (item.Editing() || item.Edited()) {return false;}
                    return true;
                })) {
                    self.addSecondQuestion();
                }                
            }                     
            
            BaseModel.save(
                secondQuestion,
                function(data) {
                    var secondQuestionSaved = SecondQuestion.unpack(data.data);
                    secondQuestionSaved.SecondAnswers(secondQuestion.SecondAnswers());
                    secondQuestionSaved.SecondAnswers().forEach(function(secondAnswer) {
                       secondAnswer.QuestionId(secondQuestionSaved.Id()); 
                    });                    
                    self.SecondQuestionList.replace(secondQuestion, secondQuestionSaved);
                    self.saveSecondAnswers(secondQuestionSaved.SecondAnswers, addSecondQuestion ? tryAddSecondQuestion : tryNextStep);
                }
            );           
        }
        
        self.saveSecondAnswers = function(secondAnswerList, callbackOnSuccess) {
            secondAnswerList().forEach(function(secondAnswer) {
                if (secondAnswer.Editing()) {
                    BaseModel.save(
                        secondAnswer,
                        function(data) {
                            var secondAnswerSaved = SecondAnswer.unpack(data.data);
                            secondAnswerList.replace(secondAnswer, secondAnswerSaved);
                            self.saveSecondAnswerRel(secondAnswer, callbackOnSuccess)
                        }
                    );     
                }           
            });              
        }
        
        self.saveSecondAnswerRel = function(secondAnswer, callbackOnSuccess) {            
            secondAnswer.MainAnswers().forEach(function(mainAnswer) {
                requestAjaxJson(
                    'POST',
                    apiUrlBase + '/secondaryanswer/' + secondAnswer.Id() + '/link',
                    mainAnswer,
                    function() {
                        callbackOnSuccess();
                    }
                );
            });
        }
    }
    
    var apiUrlBase = '/api';
    
    var sortQuestionAnswerArray = function(left, right, desc) {
        desc = desc || false;
        kf = desc ? -1 : 1;
        
        return left.Order() == right.Order() 
            ? (left.Title() == right.Title() ? 0 : (left.Title() < right.Title() ? -1*kf : 1*kf))
            : (left.Order() < right.Order() ? -1*kf : 1*kf);
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
