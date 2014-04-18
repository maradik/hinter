BbCodeDynamicList = function () {

    var CommentComparisonType = { Older: 0, Newer: 1 };

    var lockLoadingList = Array(false, false);
    var lockLoading = false;
    var isEndOfList = false;
    var controllerName;
    var onLoadDataHandler;

    function onDocumentReady(_controllerName, _onLoadDataHandler, _loadNewItemsInterval) {
        controllerName = _controllerName || "Comment";
        onLoadDataHandler = _onLoadDataHandler;

        if (needLoadOlderList())
            asyncLoadList(CommentComparisonType.Older);

        if (onLoadDataHandler)
            onLoadDataHandler();

        setInterval(function () { asyncLoadList(CommentComparisonType.Newer); }, _loadNewItemsInterval || (5 * 60 * 1000));
    };

    function onWindowScroll() {
        if (needLoadOlderList())
            asyncLoadList(CommentComparisonType.Older);
    };

    function onSubmitCreateItem() {
        asyncLoadList(CommentComparisonType.Newer, false);
    };

    function needLoadOlderList() {
        return !isEndOfList && ($(document).height() - $(window).height() - 100 <= $(window).scrollTop());
    }

    function setLockLoading(type, lock) {
        lockLoading = lock;
        lockLoadingList[type] = lock;
    }

    function asyncLoadList(type, allowCache) {
        if (typeof (allowCache) == 'undefined')
            allowCache = true;

        if (!lockLoading && !lockLoadingList[type]) {
            setLockLoading(type, true);
            var items = $("#listPanel div.CommentHeaderId");
            var id = "";
            if (items && items.length) {
                switch (type) {
                    case CommentComparisonType.Older: id = parseInt(items[items.length - 1].innerText, 10); break;
                    case CommentComparisonType.Newer: id = parseInt(items[0].innerText, 10); break;
                }
            }
            if (id != 0)
                lockLoading = false;

            $.ajax({
                async: true,
                cache: allowCache,
                type: 'GET',
                url: '/' + controllerName + '/List/' + type + '/' + id,
                success: function (data) {
                    if (data) {
                        var listPanel = $('#listPanel');
                        switch (type) {
                            case CommentComparisonType.Older: listPanel.html(listPanel.html() + data); break;
                            case CommentComparisonType.Newer: listPanel.html(data + listPanel.html()); break;
                        }

                        if (onLoadDataHandler)
                            onLoadDataHandler();
                    }
                    else {
                        if (type == CommentComparisonType.Older) {
                            isEndOfList = true;
                            $('#endPageLoading').hide();
                        }
                    }

                    setLockLoading(type, false);

                    if (type == CommentComparisonType.Older && needLoadOlderList())
                        asyncLoadList(type);
                },
                error: function () {
                    setLockLoading(type, false);
                }
            });
            return;
        }

        if (lockLoading && lockLoadingList[type] == false)
            setTimeout(function () { asyncLoadList(type); }, 100);
    }

    return {
        onDocumentReady: onDocumentReady,
        onWindowScroll: onWindowScroll,
        onSubmitCreateItem: onSubmitCreateItem
    }

}();