var Fastfood = function () {
    //-------------------------------------------------------
    // Модели
    function Menu(id, onDate, name, menuFood) {
        var self = this;
        self.Id = id;
        self.OnDate = onDate;
        self.Name = name;
        self.MenuFood = menuFood;
    }

    function MenuFood(id, name, weight, price, foodType) {
        var self = this;
        self.Id = id;
        self.Name = name;
        self.Weight = weight;
        self.Price = price;
        self.FoodType = ko.observable(foodType);
    }

    function FoodType(id, description) {
        var self = this;
        self.Id = id;
        self.Description = description;
    }

    function Order(id, custName, custPhone, deliveryAddress, createdDate, orderLine)
    {  
        var self = this;
        self.Id = id;
        self.CustName = ko.observable(custName);
        self.CustPhone = ko.observable(custPhone);
        self.DeliveryAddress = deliveryAddress;        
        self.CreatedDate = createdDate;
        self.OrderLine = orderLine;
        self.Cost = 0;
    }

    function OrderLine(id, Qty, menuFood)
    {
        var self = this;
        self.Id = id;
        self.Qty = Qty;       
        self.MenuFood = ko.observable(menuFood);
    }
       
    //-------------------------------------------------------
    // Модели представления
    function MenuVM() {
        var self = this;
        var LoadedElements = 0;

        self.EditId = ko.observable(-1);
        self.MenuList = ko.mapping.fromJS([]);
        self.Message = ko.observable("");
        self.FoodTypes = ko.observableArray([]);
        self.Locked = ko.observable(false);      
        
        self.saveMenu = function (menu) {
            var jsMenu = ko.mapping.toJS(menu);

            for (var i in self.MenuList()) {
                if (jsMenu.OnDate == self.MenuList()[i].OnDate() && jsMenu.Id != self.MenuList()[i].Id()) {
                    self.Message("Ошибка! Меню с такой датой уже существует!");
                    return;
                }
            }

            self.Locked(true);                         
            Fastfood.postAjaxJson("Menu", "Save", JSON.stringify(jsMenu), function (json) {
                ko.mapping.fromJS(json.Message, {}, self.Message);
                if (json.Model) {
                    var menuFromSrv = ko.mapping.fromJS(json.Model, mappingOptions());                    
                    self.MenuList.replace(menu, menuFromSrv);
                    self.EditId(-1);
                }
                self.Locked(false);
            });
        }

        self.editMenu = function(menu) {
            if (self.EditId() != -1) {
                alert("Вначале завершите редактирование другого элемента!");
                return;
            }
            self.EditId(menu.Id());
        }

        self.deleteMenu = function(menu) {
            self.Locked(true);
            if (menu.Id() == 0) {                
                self.MenuList.remove(menu);
                self.EditId(-1);
                self.Locked(false);
            }
            else if (confirm("Удалить меню?")) {
                Fastfood.postAjaxJson("Menu", "Delete", ko.toJSON(menu), function (json) {
                    ko.mapping.fromJS(json.Message, {}, self.Message);
                    if (!json.Error) {
                        self.MenuList.remove(menu);
                        if (self.EditId() == menu.Id())
                            self.EditId(-1);
                    }
                    self.Locked(false);
                });
            }
            else
                self.Locked(false);
        }

        self.addMenu = function() {
            if (self.EditId() != -1) {
                alert("Вначале завершите редактирование другого элемента!");
                return;
            }
            
            var jsMenu = new Menu(0,
                                    Today().formatDate(),
                                    "Новое меню",
                                    [new MenuFood(0, "", 0, 0, self.FoodTypes()[0])]
                                    );          
            self.EditId(jsMenu.Id);
            self.MenuList.unshift(ko.mapping.fromJS(jsMenu));
        }

        self.addMenuFood = function(menu) {
            menu.MenuFood.push(new MenuFood(0, "", 0.000, 0.00, self.FoodTypes()[0]));
        }

        self.deleteMenuFood = function(menuFood, menu) {            
            menu.MenuFood.remove(menuFood);            
        }

        self.bind = function(json) {
            $("#dummyLoading").show(); 
            $("#bindContent").hide();
            getAjaxJson("FoodType", "List", null, function (json) {                
                self.FoodTypes($.map(json, function (item) { return new FoodType(item.Id, item.Description) }));
                applyBindings();
            });
            mappingFromJS(json, self.MenuList);
            applyBindings();
        }

        function applyBindings() {
            LoadedElements++;
            if (LoadedElements == 2) {
                $("#dummyLoading").hide(); 
                $("#bindContent").show();
                ko.applyBindings(self);
            }          
        }

        function mappingFromJS(js, model) {
            ko.mapping.fromJS(js, mappingOptions(), model);
        }

        function mappingOptions() {
            return {
                "OnDate": {
                    update: function (options) {                        
                        return new Date(parseInt(options.data.substr(6))).formatDate();
                    }
                },
                "FoodType": {
                    update: function (options) {
                        return ko.observable(options.data);                        
                    }
                },
                copy: "FoodType.Id",
                copy: "FoodType.Description"
            };
        }
    }

    function OrderVM() {
        var self = this;        
        var LoadedElements = 0;
        
        self.Order = ko.observable();
        self.Message = ko.observable("");
        self.Menu = ko.observable();
        self.Locked = ko.observable(false);
        self.Cost = ko.computed(function () {
            if (!this.Order || !this.Order() || !this.Order().OrderLine())
                return 0;
            var ret = 0;
            for (var i in this.Order().OrderLine()) {
                ret += parseInt(this.Order().OrderLine()[i].Qty(), 10) * parseInt(this.Order().OrderLine()[i].MenuFood().Price, 10);
            }
            return ret;
        }, self);

        function initOrder() {
            var jsOrder = new Order(0, "", "", "", Today().formatDate(), [new OrderLine(0, 1, new MenuFood(0, "", 0, 0, new FoodType(0, "")))]);
            self.Order(ko.mapping.fromJS(jsOrder));
        }

        self.addOrderLine = function (order) {
            order.OrderLine.push(ko.mapping.fromJS(new OrderLine(0, 1, new MenuFood(0, "", 0, 0, new FoodType(0, "")))));
        }

        self.deleteOrderLine = function (orderLine) {
            self.Order().OrderLine.remove(orderLine);
        }

        self.saveOrder = function (order) {
            self.Locked(true);
            var jsOrder = ko.mapping.toJS(order);
            Fastfood.postAjaxJson("Order", "Create", JSON.stringify(jsOrder), function (json) {
                ko.mapping.fromJS(json.Message, {}, self.Message);
                if (json.Error) {

                }
                else {
                    initOrder();
                }
                self.Locked(false);
            });
        }

        self.deleteOrder = function (order) {
            self.Locked(true);
            if (confirm("Удалить заказ?")) {
                Fastfood.postAjaxJson("Order", "Delete", ko.toJSON(order), function (json) {
                    ko.mapping.fromJS(json.Message, {}, self.Message);
                    if (!json.Error) {                        
                        document.location.href = "/order/index";
                    }
                    self.Locked(false);
                });
            }
            else
                self.Locked(false);
        }

        self.bind = function(json) {
            $("#dummyLoading").show();
            $("#bindContent").hide();
            if (!json)
                initOrder();
            else
                self.Order(ko.mapping.fromJS(json, mappingOptions()));
            getAjaxJson("Menu", "Today", null, function (json) {
                if (json) {
                    self.Menu(json);
                    applyBindings();
                }
                else {
                    alert("На сегодня еще не составлено Меню.");
                    document.location.href = "/";
                }
            });            
            applyBindings();
        }

        function applyBindings() {
            LoadedElements++;
            if (LoadedElements == 2) {
                $("#dummyLoading").hide();
                $("#bindContent").show();
                ko.applyBindings(self);
            }
        }

        function mappingFromJS(js, model) {
            ko.mapping.fromJS(js, mappingOptions(), model);
        }

        function mappingOptions() {
            return {
                "CreatedDate": {
                    update: function (options) {
                        return new Date(parseInt(options.data.substr(6))).formatDate();
                    }
                },
                "MenuFood": {
                    update: function (options) {
                        return ko.observable(options.data);
                    }
                },
            };
        }
    };

    function OrderListVM() {
        var self = this;

        self.OrderList = ko.mapping.fromJS([]);
        self.OrderFilter = ko.mapping.fromJS(new Order("", "", "", "", "", null));
        self.Message = ko.observable("");        
        self.Locked = ko.observable(false);
        self.Sorting = ko.mapping.fromJS(new Sorting("Id", SortingType.Asc));
        LoadedElements = 0;

        self.FilteredOrderList = ko.dependentObservable(function () {
            return ko.utils.arrayFilter(this.OrderList(), function (order) {
                if (self.OrderFilter.Id() && order.Id() != self.OrderFilter.Id())
                    return false;
                if (self.OrderFilter.CreatedDate() && order.CreatedDate() != self.OrderFilter.CreatedDate())
                    return false;
                if (self.OrderFilter.CustName() && !(order.CustName().toLowerCase().indexOf(self.OrderFilter.CustName().toLowerCase()) + 1))
                    return false;
                if (self.OrderFilter.CustPhone() && !(order.CustPhone().toLowerCase().indexOf(self.OrderFilter.CustPhone().toLowerCase()) + 1))
                    return false;
                if (self.OrderFilter.DeliveryAddress() && !(order.DeliveryAddress().toLowerCase().indexOf(self.OrderFilter.DeliveryAddress().toLowerCase()) + 1))
                    return false;
                return true;
            });
        }, self);

        self.setSorting = function (field) {
            if ( self.Sorting.Field() == field && self.Sorting.Type() != SortingType.Desc ) 
                self.Sorting.Type(SortingType.Desc);
            else
                self.Sorting.Type(SortingType.Asc);
            self.Sorting.Field(field);                
            sortOrderList();
        }

        self.deleteOrder = function (order) {
            self.Locked(true);
            if (confirm("Удалить заказ?")) {
                Fastfood.postAjaxJson("Order", "Delete", ko.toJSON(order), function (json) {
                    ko.mapping.fromJS(json.Message, {}, self.Message);
                    if (!json.Error) {
                        self.OrderList.remove(order);
                    }
                    self.Locked(false);
                });
            }
            else
                self.Locked(false);
        }

        self.bind = function (json) {
            $("#dummyLoading").show();
            $("#bindContent").hide();
            if (json)
                mappingFromJS(json, self.OrderList);
            sortOrderList();
            applyBindings();
        }

        function sortOrderList() {
            self.OrderList.sort(function (left, right) {
                var tmp;
                if (self.Sorting.Type() == SortingType.Desc) { tmp = left; left = right; right = tmp; }
                return left[self.Sorting.Field()]() == right[self.Sorting.Field()]() ? 0
                    : (left[self.Sorting.Field()]() < right[self.Sorting.Field()]() ? -1 : 1);
            });
        }

        function applyBindings() {
            LoadedElements++;
            if (LoadedElements == 1) {
                $("#dummyLoading").hide();
                $("#bindContent").show();
                ko.applyBindings(self);
            }
        }

        function mappingFromJS(js, model) {
            ko.mapping.fromJS(js, mappingOptions(), model);
        }

        function mappingOptions() {
            return {
                "CreatedDate": {
                    update: function (options) {
                        return new Date(parseInt(options.data.substr(6))).formatDate();
                    }
                },
                "OrderLine": {
                    update: function (options) {
                        return ko.observable(options.data);
                    }
                },
            };
        }
    };

    function FoodTypeVM() {
        var self = this;

        self.EditId = ko.observable(-1);
        self.FoodTypeList = ko.mapping.fromJS([]);
        self.Message = ko.observable("");
        self.Locked = ko.observable(false);

        self.saveFoodType = function (foodType) {
            self.Locked(true);
            var jsFoodType = ko.mapping.toJS(foodType);
            Fastfood.postAjaxJson("FoodType", "Save", JSON.stringify(jsFoodType), function (json) {
                ko.mapping.fromJS(json.Message, {}, self.Message);
                if (json.Model) {
                    var foodTypeFromSrv = ko.mapping.fromJS(json.Model);
                    self.FoodTypeList.replace(foodType, foodTypeFromSrv);
                    self.EditId(-1);
                }
                self.Locked(false);
            });
        }

        self.editFoodType = function (foodType) {
            if (self.EditId() != -1) {
                alert("Вначале завершите редактирование другого элемента!");
                return;
            }
            self.EditId(foodType.Id());
        }

        self.deleteFoodType = function (foodType) {
            self.Locked(true);
            if (foodType.Id() == 0) {
                self.FoodTypeList.remove(foodType);
                self.EditId(-1);
                self.Locked(false);
            }
            else if (confirm("Удалить тип блюда?")) {
                Fastfood.postAjaxJson("FoodType", "Delete", ko.toJSON(foodType), function (json) {
                    ko.mapping.fromJS(json.Message, {}, self.Message);
                    if (!json.Error) {
                        self.FoodTypeList.remove(foodType);
                        if (self.EditId() == foodType.Id())
                            self.EditId(-1);
                    }
                    self.Locked(false);
                });
            }
            else
                self.Locked(false);
        }

        self.addFoodType = function () {
            if (self.EditId() != -1) {
                alert("Вначале завершите редактирование другого элемента!");
                return;
            }

            var jsFoodType = new FoodType(0, "");
            self.EditId(jsFoodType.Id);
            self.FoodTypeList.push(ko.mapping.fromJS(jsFoodType));
        }

        self.bind = function (json) {
            ko.mapping.fromJS(json, {}, self.FoodTypeList);
            ko.applyBindings(self);
        }
    }

    //-------------------------------------------------------
    // Разное

    var SortingType = { Asc: 1, Desc: 2 };
    
    function Sorting(field, type) {
        var self = this;
        self.Type = type;
        self.Field = field;
    }

    function DateStruct(date) {
        var self = this;
        self.StringDate = date.toLocaleDateString();
        self.FormatDate = ko.observable(date.formatDate());
        self.Date = date;
    }

    // from http://lonetechie.com/2012/10/02/knockout-js-and-select-options-binding-pre-selection/ -->
    ko.bindingHandlers.preSelect = {
        update: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
            var val = ko.utils.unwrapObservable(valueAccessor());
            var newOptions = element.getElementsByTagName("option");
            var updateRequired = false;
            for (var i = 0, j = newOptions.length; i < j; i++) {
                if (ko.utils.unwrapObservable(val.value) == ko.selectExtensions.readValue(newOptions[i])[val.key]) {
                    if (!newOptions[i].selected) {
                        ko.utils.setOptionNodeSelectionState(newOptions[i], true);//only sets the selectedindex, object still holds index 0 as selected
                        updateRequired = true;
                    }
                }
            }
            if (updateRequired) {
                var options = allBindingsAccessor().options;
                var selected = ko.utils.arrayFirst(ko.utils.unwrapObservable(options), function (item) {
                    return ko.utils.unwrapObservable(val.value) == item[val.key];
                });
                if (ko.isObservable(bindingContext.$data[val.propertyName])) {
                    bindingContext.$data[val.propertyName](selected); // here we write the correct object back into the $data
                } else {
                    bindingContext.$data[val.propertyName] = selected; // here we write the correct object back into the $data
                }
            }
        }
    };
    // from http://lonetechie.com/2012/10/02/knockout-js-and-select-options-binding-pre-selection/ <--

    function Today(offset) {
        offset = offset || 0;
        var now = new Date();
        var today = new Date(now.getYear(), now.getMonth(), now.getDate());

        today.setTime(today.getTime() + offset * 24 * 60 * 60 * 1000);
        return today;
    };

    var baseUrl = "/",
        serviceUrl = function (controller, action) { return baseUrl + controller + '/' + action; };

    var getAjaxJson = function (controller, action, jsonIn, callback) {
        $.ajax({
            url: serviceUrl(controller, action),
            data: jsonIn,
            type: 'GET',
            dataType: 'json',
            cache: false,
            contentType: 'application/json; charset=utf-8',
            success: function (json) {
                callback(json);
            },
            error: function (jqXHR, textStatus) {
                if (confirm(jqXHR.status + " "
                    + textStatus
                    + ":"
                    + jqXHR.statusText)) {
                    alert(jqXHR.responseText);
                }
            }
        });
    };

    var postAjaxJson = function (controller, action, jsonIn, callback) {
        $.ajax({
            url: serviceUrl(controller, action),
            data: jsonIn,
            type: 'POST',
            dataType: 'json',
            cache: false,
            contentType: 'application/json; charset=utf-8',
            success: function (json) {
                callback(json);
            },
            error: function (jqXHR, textStatus) {
                if (confirm(jqXHR.status
                    + " "
                    + textStatus
                    + ":"
                    + jqXHR.statusText)) {
                    alert(jqXHR.responseText);
                }
            }
        });
    }

    function formatDate() {
        var month = this.getMonth() + 1;
        var day = this.getDate();
        return this.getFullYear() + '-' +
            ((''+month).length < 2 ? '0' : '') + month + '-' +
            ((''+day).length < 2 ? '0' : '') + day;
    }

    Date.prototype.formatDate = formatDate;

    return {
        MenuVM: MenuVM,
        OrderVM: OrderVM,
        OrderListVM: OrderListVM,
        FoodTypeVM: FoodTypeVM,
        getAjaxJson: getAjaxJson,
        postAjaxJson: postAjaxJson
    }
}();
