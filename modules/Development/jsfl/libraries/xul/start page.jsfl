    function jsGetMRU() {
        var _local5 = new Array();
        var _local2 = new Array();
        var _local3 = new Array();
        var _local1 = new Array();
        var _local4 = jsGetListMRU();
        i = 0;
        while (i < _local4) {
            _local2.push(jsGetItemMRU(i)[0]);
            _local3.push(jsGetItemMRU(i)[1]);
            if (getStringResource("appobject") == "dw") {
                _local1.push(jsGetItemMRU(i)[2]);
            }
            i++;
        }
        _local5.push(_local2);
        _local5.push(_local3);
        if (getStringResource("appobject") == "dw") {
            _local5.push(_local1);
        }
        return(_local5);
    }
    function jsGetListMRU() {
        switch (getStringResource("appobject")) {
            case "fl" : 
                MMExecute("mruTypeArray = fl.mruRecentFileListType");
                MMExecute("mruArray = fl.mruRecentFileList");
                return(Number(MMExecute("mruArray.length")));
                return;
            case "dw" : 
                MMExecute("mruArray = dw.startPage.recentFileList");
                return(Number(MMExecute("mruArray.length")));
                return;
            case "fw" : 
                FWJavascript("mruArray = fw.mruRecentFileList");
                return(Number(FWJavascript("mruArray.length")));
                return;
            case "ps" : 
                return;
            case "ae" : 
                return;
        }
    }
    function jsGetItemMRU(num) {
        var _local1 = new Array();
        switch (getStringResource("appobject")) {
            case "fl" : 
                _local1.push(MMExecute(("mruArray[" + num) + "]"));
                _local1.push(MMExecute(("mruTypeArray[" + num) + "]"));
                break;
            case "dw" : 
                _local1.push(MMExecute(("mruArray[" + num) + "].label"));
                _local1.push(getExtension(_local1[0]));
                _local1.push(MMExecute(("mruArray[" + num) + "].url"));
                break;
            case "fw" : 
                _local1.push(FWJavascript(("mruArray[" + num) + "]"));
                _local1.push(getExtension(_local1[0]));
                break;
            case "ps" : 
                break;
            case "ae" : 
                break;
        }
        return(_local1);
    }
    function jsOpenItemMRU(path, type) {
        switch (getStringResource("appobject")) {
            case "fl" : 
                jsAction = "openDocument";
                if (((type == "as") || (type == "asc")) || (type == "jsfl")) {
                    jsAction = "openScript";
                }
                if (type == "flp") {
                    jsAction = "openProject";
                }
                MMExecute(((("fl." + jsAction) + "(\"") + makeURLFileName(path)) + "\")");
                break;
            case "dw" : 
                MMExecute(("dw.startPage.doAction(\"" + path) + "\")");
                break;
            case "fw" : 
                FWJavascript(("fw.uiOK = true; fw.openDocument('" + path) + "')");
                break;
            case "ps" : 
                ExternalInterface.call("RunJavaScript", ("activeDocument=open(\"" + path) + "\")");
                break;
            case "ae" : 
                break;
        }
    }
    function jsOpenItemOther() {
        switch (getStringResource("appobject")) {
            case "fl" : 
                MMExecute("fl.openFileDialog()");
                return;
            case "dw" : 
                MMExecute("dw.startPage.doAction(\"mminternal:opendocument=\")");
                return;
            case "fw" : 
                FWJavascript("fw.openMultiDocument();");
                return;
            case "ps" : 
                ExternalInterface.call("RunJavaScript", "var theFile=new File(openDialog()); if (theFile.exists) activeDocument=open(theFile);");
                return;
            case "ae" : 
                return;
        }
    }
    function jsGetNew() {
        var _local4 = new Array();
        var _local2 = new Array();
        var _local1 = new Array();
        var _local3 = jsGetListNew();
        i = 0;
        while (i < _local3) {
            _local2.push(jsGetItemNew(i)[0]);
            _local1.push(jsGetItemNew(i)[1]);
            i++;
        }
        _local4.push(_local2);
        _local4.push(_local1);
        return(_local4);
    }
    function jsGetListNew() {
        switch (getStringResource("appobject")) {
            case "fl" : 
                MMExecute("newTypeArray = fl.createNewDocListType");
                MMExecute("newNameArray = fl.createNewDocList");
                return(Number(MMExecute("newNameArray.length")));
                return;
            case "dw" : 
                MMExecute("newNameArray = dw.startPage.newFileList");
                return(Number(MMExecute("newNameArray.length")));
                return;
            case "fw" : 
                return(1);
                return;
            case "ps" : 
                return(1);
                return;
            case "ae" : 
                return;
        }
    }
    function jsGetItemNew(num) {
        var _local1 = new Array();
        switch (getStringResource("appobject")) {
            case "fl" : 
                _local1.push(MMExecute(("newNameArray[" + num) + "]"));
                _local1.push(MMExecute(("newTypeArray[" + num) + "]"));
                break;
            case "dw" : 
                _local1.push(MMExecute(("newNameArray[" + num) + "].label"));
                _local1.push(getExtensionFromInternalURL(MMExecute(("newNameArray[" + num) + "].url")));
                break;
            case "fw" : 
                _local1.push(getStringResource("fireworksdocument"));
                _local1.push("png");
                break;
            case "ps" : 
                _local1.push(getStringResource("photoshopdocument"));
                _local1.push("psd");
                break;
            case "ae" : 
                break;
        }
        return(_local1);
    }
    function jsCreateItemNew(num) {
        switch (getStringResource("appobject")) {
            case "fl" : 
                MMExecute(("fl.createNewDialog(" + num) + ")");
                break;
            case "dw" : 
                MMExecute(("dw.startPage.doAction(newNameArray[" + num) + "].url)");
                break;
            case "fw" : 
                FWJavascript("fw.createDocumentWithDialog();");
                break;
            case "ps" : 
                ExternalInterface.call("RunJavaScript", "var theFile=app.documents.add();");
                break;
            case "ae" : 
                break;
        }
    }
    function jsCreateItemNewMore() {
        switch (getStringResource("appobject")) {
            case "fl" : 
                MMExecute("fl.createNewDialog()");
                return;
            case "dw" : 
                MMExecute("dw.startPage.doAction(\"mminternal:newdocument=\")");
                return;
            case "fw" : 
                return;
            case "ps" : 
                return;
            case "ae" : 
                return;
        }
    }
    function jsGetTemplates() {
        var _local1 = new Array();
        var _local2 = jsGetListTemplates();
        i = 0;
        while (i < _local2) {
            _local1.push(jsGetTemplate(i));
            i++;
        }
        return(_local1);
    }
    function jsGetListTemplates() {
        switch (getStringResource("appobject")) {
            case "fl" : 
                MMExecute("templateNameArray = fl.createNewTemplateList");
                return(Number(MMExecute("templateNameArray.length")));
                return;
            case "dw" : 
                MMExecute("templateNameArray = dw.startPage.templateList");
                return(Number(MMExecute("templateNameArray.length")));
                return;
            case "fw" : 
                return(0);
                return;
            case "ps" : 
                return(0);
                return;
            case "ae" : 
                return(0);
                return;
        }
    }
    function jsGetTemplate(num) {
        var _local1;
        switch (getStringResource("appobject")) {
            case "fl" : 
                _local1 = MMExecute(("templateNameArray[" + num) + "]");
                break;
            case "dw" : 
                _local1 = MMExecute(("templateNameArray[" + num) + "].label");
                break;
            case "fw" : 
                _local1 = "";
                break;
            case "ps" : 
                _local1 = "";
                break;
            case "ae" : 
                _local1 = "";
                break;
        }
        return(_local1);
    }
    function jsCreateItemFromTemplate(num) {
        switch (getStringResource("appobject")) {
            case "fl" : 
                MMExecute(("fl.createNewTemplateDialog(" + num) + ")");
                break;
            case "dw" : 
                MMExecute(("dw.startPage.doAction(templateNameArray[" + num) + "].url)");
                break;
            case "fw" : 
                break;
            case "ps" : 
                break;
            case "ae" : 
                break;
        }
    }
    function jsCreateItemFromTemplateMore() {
        switch (getStringResource("appobject")) {
            case "fl" : 
                MMExecute("fl.createNewTemplateDialog(0)");
                return;
            case "dw" : 
                MMExecute("dw.startPage.doAction(templateNameArray[0].url)");
                return;
            case "fw" : 
                return;
            case "ps" : 
                return;
            case "ae" : 
                return;
        }
    }
    function jsGetPrefShowDlg() {
        var _local1;
        switch (getStringResource("appobject")) {
            case "fl" : 
                _local1 = MMExecute("fl.inStartPageMode");
                break;
            case "dw" : 
                if (Number(MMExecute("dw.startPage.shouldShow")) == 0) {
                    _local1 = false;
                } else {
                    _local1 = true;
                }
                break;
            case "fw" : 
                if (FWJavascript("fw.getPref(\"ShowStartPage\")") == "false") {
                    _local1 = false;
                } else {
                    _local1 = true;
                }
                break;
            case "ps" : 
                _local1 = true;
                break;
            case "ae" : 
                _local1 = true;
                break;
        }
        return(_local1);
    }
    function jsSetPrefShowFalse() {
        switch (getStringResource("appobject")) {
            case "fl" : 
                MMExecute(("alert(\"" + getStringResource("checkboxalert")) + "\")");
                MMExecute("fl.showStartPage(false)");
                break;
            case "dw" : 
                if (MMExecute(("alert(\"" + getStringResource("checkboxalert")) + "\")")) {
                    MMExecute("dw.startPage.doAction(\"mminternal:dontshow=true\")");
                }
                break;
            case "fw" : 
                var _local1 = FWJavascript(("alert(\"" + getStringResource("checkboxalert")) + "\")");
                FWJavascript("fw.setPref(\"ShowStartPage\",false);");
                break;
            case "ps" : 
                break;
            case "ae" : 
                break;
        }
    }
    function jsSetPrefShowTrue() {
        switch (getStringResource("appobject")) {
            case "fl" : 
                MMExecute("fl.showStartPage(true)");
                return;
            case "dw" : 
                MMExecute("dw.startPage.doAction(\"mminternal:dontshow=false\")");
                return;
            case "fw" : 
                FWJavascript("fw.setPref(\"ShowStartPage\",true);");
                return;
            case "ps" : 
                return;
            case "ae" : 
                return;
        }
    }
    function jsIsConnected() {
        switch (getStringResource("appobject")) {
            case "fl" : 
                return(MMExecute("fl.isConnectedToInternet"));
                return;
            case "dw" : 
                return(MMExecute("dw.startPage.isConnectedToInternet"));
                return;
            case "fw" : 
                return(FWJavascript("fw.isConnectedToInternet"));
                return;
            case "ps" : 
                return(false);
                return;
            case "ae" : 
                return(false);
                return;
        }
    }
    function jsGetQueryString() {
        var _local1;
        switch (getStringResource("appobject")) {
            case "fl" : 
                _local1 = MMExecute("fl.getDynamicSWFURL");
                break;
            case "dw" : 
                _local1 = MMExecute("dw.startPage.dynamicSWFParams");
                break;
            case "fw" : 
                _local1 = FWJavascript("fw.getDynamicSWFURL");
                break;
            case "ps" : 
                break;
            case "ae" : 
                break;
        }
        return(_local1);
    }
    function jsParseQueryString(qs) {
        var _local4 = qs.split("&");
        var _local3 = 0;
        while (_local3 < _local4.length) {
            var _local2 = _local4[_local3].split("=");
            switch (_local2[0]) {
                case "api" : 
                    _global.api = _local2[1];
                    break;
                case "lvl" : 
                    _global.lvl = _local2[1];
                    break;
                case "stat" : 
                    _global.stat = _local2[1];
                    break;
                case "lang" : 
                    _global.lang = _local2[1];
                    break;
                case "spfx" : 
                    _global.spfx = _local2[1];
                    break;
                case "prod" : 
                    _global.prod = _local2[1];
                    break;
                case "ver" : 
                    _global.ver = _local2[1];
                    break;
                case "plat" : 
                    _global.plat = _local2[1];
                    break;
                case "tday" : 
                    _global.tday = _local2[1];
                    break;
            }
            _local3++;
        }
    }
    function getRemoteURL() {
        var _local2;
        switch (getStringResource("appobject")) {
            case "fl" : 
            case "dw" : 
            case "fw" : 
            case "ps" : 
            case "ae" : 
                _local2 = getStringResource("urlshim") + "?";
                if (_global.prod != undefined) {
                    _local2 = _local2 + ("&prod=" + _global.prod);
                }
                if (_global.lvl != undefined) {
                    _local2 = _local2 + ("&lvl=" + _global.lvl);
                }
                if (_global.ver != undefined) {
                    _local2 = _local2 + ("&ver=" + _global.ver);
                }
                if (_global.plat != undefined) {
                    _local2 = _local2 + ("&plat=" + _global.plat);
                }
                if (_global.lang != undefined) {
                    _local2 = _local2 + ("&lang=" + _global.lang);
                }
                if (_global.stat != undefined) {
                    _local2 = _local2 + ("&stat=" + _global.stat);
                }
                if (_global.spfx != undefined) {
                    _local2 = _local2 + ("&spfx=" + _global.spfx);
                }
                if (_global.tday != undefined) {
                    _local2 = _local2 + ("&tday=" + _global.tday);
                }
                if (_global.api != undefined) {
                    _local2 = _local2 + ("&api=" + _global.api);
                }
                return(_local2);
                break;
        }
    }
    function getLocalURL() {
        return(getStringResource("localshim"));
    }
    function loadShim(mc_local, mc_remote, xPos, yPos) {
        if (jsIsConnected() == true) {
            mc_remote._lockroot = true;
            mc_remote.loadMovie(getRemoteURL(), "GET");
            donePositioningShim = false;
            checkConnectionInterval = setInterval(this, "setContentLoc", 100, mc_local, mc_remote, xPos, yPos);
        } else {
            mc_local.loadMovie(getLocalURL());
            positionShim(mc_local, mc_remote, xPos, yPos);
            donePositioningShim = true;
        }
    }
    function setContentLoc(mc_local, mc_remote, xPos, yPos) {
        if (isLoaded(mc_remote)) {
            clearInterval(checkConnectionInterval);
            positionShim(mc_local, mc_remote, xPos, yPos);
            donePositioningShim = true;
        }
    }
    function positionShim(mc_local, mc_remote, xPos, yPos) {
        mc_remote._x = (mc_local._x = xPos);
        mc_remote._y = (mc_local._y = yPos);
    }
    function isLoaded(mc) {
        return((mc.getBytesLoaded() >= mc.getBytesTotal()) && (mc.getBytesLoaded() > 0));
    }
    function setDefaults() {
        cBackground = 15658734 /* 0xEEEEEE */;
        cFooter = 15658734 /* 0xEEEEEE */;
        cLinksArea = 16777215 /* 0xFFFFFF */;
        wDialog = 650;
        hDialog = 500;
        tfItemLine.font = "Arial";
        tfItemLine.size = 11;
        tfItemLine["color"] = 0;
        tfItemLine.bold = false;
        tfItemLine.italic = false;
        tfItemLineEmph.font = "Arial";
        tfItemLineEmph.size = 11;
        tfItemLineEmph["color"] = 0;
        tfItemLineEmph.bold = true;
        tfItemLineEmph.italic = false;
        tfHeadLine.font = "Arial";
        tfHeadLine.size = 13;
        tfHeadLine["color"] = 3355443 /* 0x333333 */;
        tfHeadLine.bold = true;
        tfHeadLine.italic = false;
    }
    function doLayout() {
        placeVisual("mc_listbg", "bglist", this, 0, hHeader);
        var _local3 = getWCol();
        var _local2 = 0;
        while (_local2 < (cols.length - 1)) {
            placeVisual("mc_coldivider_" + _local2, "vsepline", this, ((_local2 + 1.5) * xPadding) + ((_local2 + 1) * _local3), hHeader + (hItemLine / 2));
            this["mc_coldivider_" + _local2]._yscale = ((hListArea - hItemLine) / 2) * 100;
            _local2++;
        }
        placeVisual("mc_header", "banner", this, 0, 0);
        placeColor("mc_LinksArea", this, 0, hHeader + hListArea, wDialog, hLinksArea, cLinksArea);
        placeColor("mc_ShimArea", this, wDialog / 2, hHeader + hListArea, wShimArea, hShimArea, cLinksArea);
        placeVisual("mc_biglogo", "iconappxl", this.mc_ShimArea, (wDialog / 2) + xPadding, (hHeader + hListArea) + yPadding);
        this.mc_ShimArea.createEmptyMovieClip("_local", 100);
        this.mc_ShimArea.createEmptyMovieClip("_remote", 200);
        placeVisual("mc_topline_linksarea", "hsepline", this, 0, hHeader + hListArea);
        this.mc_topline_linksarea._xscale = (wDialog / 2) * 100;
        placeVisual("mc_linksdivider_" + _local2, "vsepline", this, wDialog / 2, (hHeader + hListArea) + (hItemLine / 2));
        this["mc_linksdivider_" + _local2]._yscale = ((hLinksArea - hItemLine) / 2) * 100;
        this["mc_linksdivider_" + _local2]._alpha = 50;
        var _local4 = (wDialog / 2) - (xPadding * 3);
        var _local5 = function () {
            getURL (getStringResource("urlquicktour"));
        };
        placeIconBtn("mc_helpLink1", this, "icondochelp", getStringResource("quicktour"), _local5, true, xPadding + xIndentItemLine, (hHeader + hListArea) + yPadding, _local4, true);
        _local5 = function () {
            getURL (getStringResource("urltutorial"));
        };
        placeIconBtn("mc_helpLink2", this, "icondochelp", getStringResource("tutorial"), _local5, false, xPadding + xIndentItemLine, ((hHeader + hListArea) + yPadding) + hItemLine, _local4, true);
        _local5 = function () {
            getURL (getStringResource("urltraining"));
        };
        placeIconBtn("mc_helpLink3", this, "icondochelp", getStringResource("training"), _local5, false, xPadding + xIndentItemLine, ((hHeader + hListArea) + yPadding) + (2 * hItemLine), _local4, true);
        this.attachMovie("hover", "mc_hover", this.getNextHighestDepth(), {_x:0, _y:0, _visible:false});
        placeColor("mc_footerArea", this, 0, (hHeader + hListArea) + hLinksArea, wDialog, hFooter, cFooter);
        placeVisual("mc_topline_footer", "hsepline", this, 0, (hHeader + hListArea) + hLinksArea);
        this.mc_topline_footer._xscale = (wDialog / 2) * 100;
        this.attachMovie("btn_Check", "mc_btnDontshow", this.getNextHighestDepth(), {_x:xPadding + xIndentItemLine, _y:((hHeader + hListArea) + hLinksArea) + 4});
        this.mc_btnDontshow.tabIndex = tabNum + 60;
        this.mc_btnDontshow.mc_text.text = getStringResource("dontshowagain");
        this.mc_btnDontshow.mc_text.setTextFormat(tfItemLine);
        this.mc_btnDontshow.mc_text.autoSize = "left";
        setCheckBoxValue(!jsGetPrefShowDlg());
        this.mc_btnDontshow.onRelease = function () {
            if (this._currentframe == 2) {
                setCheckBoxValue(false);
                jsSetPrefShowTrue();
            } else {
                setCheckBoxValue(true);
                jsSetPrefShowFalse();
            }
        };
        if (debugIsOn) {
            placeLabel("txt_debug", "debug text", this, tfItemLine, (260 + xPadding) + xIndentItemLine, ((hHeader + hListArea) + hLinksArea) + 4, ((wDialog - 260) - (xPadding * 2)) - xIndentItemLine);
        }
        createLists();
        jsParseQueryString(jsGetQueryString());
        loadShim(this.mc_ShimArea._local, this.mc_ShimArea._remote, (wDialog / 2) + 2, hHeader + hListArea);
    }
    function setCheckBoxValue(checked) {
        if (checked) {
            this.mc_btnDontshow.gotoAndStop("on");
        } else {
            this.mc_btnDontshow.gotoAndStop("off");
        }
    }
    function debug(s) {
        if (debugIsOn) {
            this.txt_debug.text = s;
        }
    }
    function getWCol() {
        return((wDialog - (xPadding * (2 + (cols.length - 1)))) / cols.length);
    }
    function placeColor(mcName, mcParent, xPos, yPos, wRect, hRect, col) {
        mcParent.createEmptyMovieClip(mcName, getNextHighestDepth());
        mcParent[mcName].beginFill(col);
        mcParent[mcName].moveTo(xPos, yPos);
        mcParent[mcName].lineTo(xPos + wRect, yPos);
        mcParent[mcName].lineTo(xPos + wRect, yPos + hRect);
        mcParent[mcName].lineTo(xPos, yPos + hRect);
        mcParent[mcName].lineTo(xPos, yPos);
        mcParent[mcName].endFill();
    }
    function placeVisual(mcName, imgRsrc, mcParent, xPos, yPos) {
        mcParent.createEmptyMovieClip(mcName, getNextHighestDepth());
        mcParent[mcName].loadMovie(getImgResource(imgRsrc));
        mcParent[mcName]._x = xPos;
        mcParent[mcName]._y = yPos;
    }
    function placeLabel(mcName, s, mcParent, tf, xPos, yPos, wMax) {
        mcParent.createTextField(mcName, mcParent.getNextHighestDepth(), xPos, yPos, wMax, 23);
        mcParent[mcName].selectable = false;
        mcParent[mcName].text = truncateStringMiddle(tf, s, wMax);
        mcParent[mcName].antiAliasType = "normal";
        mcParent[mcName].setTextFormat(tf);
    }
    function placeIconBtn(mcName, mcParent, iconResource, str, cmd, isBold, xPos, yPos, wMax, lateTab) {
        var _local4 = 6;
        mcParent.createEmptyMovieClip(mcName, getNextHighestDepth());
        mcParent[mcName]._x = xPos;
        mcParent[mcName]._y = yPos;
        placeVisual("icon", iconResource, mcParent[mcName], 0, 1);
        var _local3 = wIcon + _local4;
        if (isBold == true) {
            placeLabel("cap", str, mcParent[mcName], tfItemLineEmph, _local3, 0, wMax - _local3);
        } else {
            placeLabel("cap", str, mcParent[mcName], tfItemLine, _local3, 0, wMax - _local3);
        }
        mcParent[mcName].onRelease = cmd;
        if (lateTab) {
            mcParent[mcName].tabIndex = 50 + (tabNum++);
        } else {
            mcParent[mcName].tabIndex = tabNum++;
        }
        clickableAreas.push(mcParent[mcName]);
        clickWidths.push(wMax);
    }
    function placeList(mcName, mcParent, cap, itemIcons, itemCaps, xPos, yPos, wMax) {
        var _local4 = xPos;
        var _local2 = yPos;
        placeLabel(mcName + "_cap", cap, mcParent, tfHeadLine, _local4, _local2, wMax);
        _local4 = _local4 + xIndentItemLine;
        _local2 = _local2 + hHeadLine;
        var _local1 = 0;
        while (_local1 < itemCaps.length) {
            placeIconBtn((mcName + "_item_") + _local1, mcParent, itemIcons[_local1], itemCaps[_local1], null, false, _local4, _local2, wMax - xIndentItemLine);
            _local2 = _local2 + hItemLine;
            _local1++;
        }
        return(_local2);
    }
    function createLists() {
        var _local4 = getWCol();
        var _local5;
        var _local1;
        var _local2 = 0;
        var _local6 = 0;
        while (_local6 < cols.length) {
            _local5 = xPadding + (_local6 * (xPadding + _local4));
            _local1 = hHeader + yPadding;
            var _local3 = 0;
            while (_local3 < cols[_local6].length) {
                var _local7 = cols[_local6][_local3];
                switch (_local7) {
                    case "recentitems" : 
                        _local1 = createMruList(_local5, _local1, _local4, maxItems[_local2]);
                        break;
                    case "newitems" : 
                        _local1 = createNewList(_local5, _local1, _local4, maxItems[_local2]);
                        break;
                    case "sampleitems" : 
                        _local1 = createSamplesList(_local5, _local1, _local4, maxItems[_local2]);
                        break;
                    case "extenditems" : 
                        _local1 = createExtList(_local5, _local1, _local4, maxItems[_local2]);
                        break;
                }
                _local1 = _local1 + hItemLine;
                _local2++;
                _local3++;
            }
            _local6++;
        }
    }
    function createMruList(xPos, yPos, wMax, maxNumItems) {
        var _local6 = getStringResource("openrecentitem");
        var ary = new Array();
        ary = jsGetMRU();
        var _local4 = new Array();
        var _local5 = new Array();
        var _local9 = new Array();
        var _local3 = ((ary[0].length > (maxNumItems - 1)) ? (maxNumItems - 1) : (ary[0].length));
        var _local8 = ary[0][0];
        if (_local8.length == 0) {
            _local3 = 0;
        }
        var _local2 = 0;
        while (_local2 < _local3) {
            _local4.push(fileType2ImgResource(ary[1][_local2]));
            _local5.push(path2fname(ary[0][_local2]));
            _local2++;
        }
        _local4.push("iconfolder");
        _local5.push(getStringResource("open"));
        var _local7 = placeList("mc_mruList", this, _local6, _local4, _local5, xPos, yPos, wMax);
        var arrayLocation = 0;
        if (getStringResource("appobject") == "dw") {
            arrayLocation = 2;
        }
        if (_local3 > 0) {
            mc_mruList_item_0.onRelease = function () {
                jsOpenItemMRU(ary[arrayLocation][0], ary[1][0]);
            };
        }
        if (_local3 > 1) {
            mc_mruList_item_1.onRelease = function () {
                jsOpenItemMRU(ary[arrayLocation][1], ary[1][1]);
            };
        }
        if (_local3 > 2) {
            mc_mruList_item_2.onRelease = function () {
                jsOpenItemMRU(ary[arrayLocation][2], ary[1][2]);
            };
        }
        if (_local3 > 3) {
            mc_mruList_item_3.onRelease = function () {
                jsOpenItemMRU(ary[arrayLocation][3], ary[1][3]);
            };
        }
        if (_local3 > 4) {
            mc_mruList_item_4.onRelease = function () {
                jsOpenItemMRU(ary[arrayLocation][4], ary[1][4]);
            };
        }
        if (_local3 > 5) {
            mc_mruList_item_5.onRelease = function () {
                jsOpenItemMRU(ary[arrayLocation][5], ary[1][5]);
            };
        }
        if (_local3 > 6) {
            mc_mruList_item_6.onRelease = function () {
                jsOpenItemMRU(ary[arrayLocation][6], ary[1][6]);
            };
        }
        if (_local3 > 7) {
            mc_mruList_item_7.onRelease = function () {
                jsOpenItemMRU(ary[arrayLocation][7], ary[1][7]);
            };
        }
        if (_local3 > 8) {
            mc_mruList_item_8.onRelease = function () {
                jsOpenItemMRU(ary[arrayLocation][8], ary[1][8]);
            };
        }
        if (_local3 > 9) {
            mc_mruList_item_9.onRelease = function () {
                jsOpenItemMRU(ary[arrayLocation][9], ary[1][9]);
            };
        }
        this["mc_mruList_item_" + _local3].onRelease = function () {
            jsOpenItemOther();
        };
        return(_local7);
    }
    function createNewList(xPos, yPos, wMax, maxNumItems) {
        var _local9 = getStringResource("createnew");
        var _local4 = new Array();
        _local4 = jsGetNew();
        var _local5 = new Array();
        var _local6 = new Array();
        var _local12 = new Array();
        var _local7;
        var _local8 = ((getStringResource("appobject") == "dw") ? 2 : 1);
        if (_local4[0].length > (maxNumItems - _local8)) {
            var _local3 = maxNumItems - _local8;
            _local7 = true;
        } else {
            var _local3 = _local4[0].length;
            _local7 = false;
        }
        var _local2 = 0;
        while (_local2 < _local3) {
            _local5.push(fileType2ImgResource(_local4[1][_local2]));
            _local6.push(_local4[0][_local2]);
            _local2++;
        }
        if (getStringResource("appobject") == "dw") {
            _local5.push(fileType2ImgResource("Site"));
            _local6.push(getStringResource("newsite"));
        }
        if (_local7 == true) {
            _local7 = true;
            _local5.push("iconfolder");
            _local6.push(getStringResource("more"));
        }
        var _local10 = placeList("mc_newList", this, _local9, _local5, _local6, xPos, yPos, wMax);
        if (_local3 > 0) {
            mc_newList_item_0.onRelease = function () {
                jsCreateItemNew(0);
            };
        }
        if (_local3 > 1) {
            mc_newList_item_1.onRelease = function () {
                jsCreateItemNew(1);
            };
        }
        if (_local3 > 2) {
            mc_newList_item_2.onRelease = function () {
                jsCreateItemNew(2);
            };
        }
        if (_local3 > 3) {
            mc_newList_item_3.onRelease = function () {
                jsCreateItemNew(3);
            };
        }
        if (_local3 > 4) {
            mc_newList_item_4.onRelease = function () {
                jsCreateItemNew(4);
            };
        }
        if (_local3 > 5) {
            mc_newList_item_5.onRelease = function () {
                jsCreateItemNew(5);
            };
        }
        if (_local3 > 6) {
            mc_newList_item_6.onRelease = function () {
                jsCreateItemNew(6);
            };
        }
        if (_local3 > 7) {
            mc_newList_item_7.onRelease = function () {
                jsCreateItemNew(7);
            };
        }
        if (_local3 > 8) {
            mc_newList_item_8.onRelease = function () {
                jsCreateItemNew(8);
            };
        }
        if (_local3 > 9) {
            mc_newList_item_9.onRelease = function () {
                jsCreateItemNew(9);
            };
        }
        if (getStringResource("appobject") == "dw") {
            this["mc_newList_item_" + _local3].onRelease = function () {
                MMExecute("dw.startPage.doAction(\"mminternal:newsite\")");
            };
        }
        if (_local7 == true) {
            var _local11 = ((getStringResource("appobject") == "dw") ? (_local3 + 1) : (_local3));
            this["mc_newList_item_" + _local11].onRelease = function () {
                jsCreateItemNewMore();
            };
        }
        return(_local10);
    }
    function createSamplesList(xPos, yPos, wMax, maxNumItems) {
        var _local8 = getStringResource("createfromtemplates");
        var _local4 = new Array();
        _local4 = jsGetTemplates();
        var _local5 = new Array();
        var _local6 = new Array();
        var _local11 = new Array();
        var _local3 = ((_local4.length > (maxNumItems - 1)) ? (maxNumItems - 1) : (_local4.length));
        var _local2 = 0;
        while (_local2 < _local3) {
            _local5.push("icondoc");
            _local6.push(_local4[_local2]);
            _local2++;
        }
        var _local7;
        if (_local4.length > (maxNumItems - 1)) {
            _local7 = true;
            _local5.push("iconfolder");
            _local6.push(getStringResource("more"));
        } else {
            _local7 = false;
        }
        var _local9 = placeList("mc_templatesList", this, _local8, _local5, _local6, xPos, yPos, wMax);
        if (_local3 > 0) {
            mc_templatesList_item_0.onRelease = function () {
                jsCreateItemFromTemplate(0);
            };
        }
        if (_local3 > 1) {
            mc_templatesList_item_1.onRelease = function () {
                jsCreateItemFromTemplate(1);
            };
        }
        if (_local3 > 2) {
            mc_templatesList_item_2.onRelease = function () {
                jsCreateItemFromTemplate(2);
            };
        }
        if (_local3 > 3) {
            mc_templatesList_item_3.onRelease = function () {
                jsCreateItemFromTemplate(3);
            };
        }
        if (_local3 > 4) {
            mc_templatesList_item_4.onRelease = function () {
                jsCreateItemFromTemplate(4);
            };
        }
        if (_local3 > 5) {
            mc_templatesList_item_5.onRelease = function () {
                jsCreateItemFromTemplate(5);
            };
        }
        if (_local3 > 6) {
            mc_templatesList_item_6.onRelease = function () {
                jsCreateItemFromTemplate(6);
            };
        }
        if (_local3 > 7) {
            mc_templatesList_item_7.onRelease = function () {
                jsCreateItemFromTemplate(7);
            };
        }
        if (_local3 > 8) {
            mc_templatesList_item_8.onRelease = function () {
                jsCreateItemFromTemplate(8);
            };
        }
        if (_local3 > 9) {
            mc_templatesList_item_9.onRelease = function () {
                jsCreateItemFromTemplate(9);
            };
        }
        if (_local7 == true) {
            this["mc_templatesList_item_" + _local3].onRelease = function () {
                jsCreateItemFromTemplateMore();
            };
        }
        return(_local9);
    }
    function createExtList(xPos, yPos, wMax, maxNumItems) {
        var _local4 = getStringResource("extend");
        var _local2 = new Array();
        var _local3 = new Array();
        _local2.push("exchangeicon");
        _local3.push(getStringResource("exchange"));
        var _local5 = placeList("mc_extList", this, _local4, _local2, _local3, xPos, yPos, wMax);
        this.mc_extList_item_0.onRelease = function () {
            getURL (getStringResource("urlexchange"));
        };
        return(_local5);
    }
    function initLoadConfig() {
        var config_xml = new XML();
        config_xml.ignoreWhite = true;
        config_xml.onLoad = function (success) {
            if (success) {
                parseConfig(config_xml);
                doLayout();
            }
        };
        config_xml.load(configData);
    }
    function parseConfig(config_xml) {
        var _local1 = config_xml.firstChild.firstChild;
        while (_local1 != null) {
            switch (_local1.nodeName) {
                case "layout" : 
                    parseLayout(_local1);
                    break;
                case "strings" : 
                    parseStringResources(_local1);
                    break;
                case "resources" : 
                    parseImgResources(_local1);
                    break;
                case "filetypes" : 
                    parseFileTypes(_local1);
                    break;
                case "dimensions" : 
                    parseDims(_local1);
                    break;
                case "colors" : 
                    parseColors(_local1);
                    break;
                case "fonts" : 
                    parseFonts(_local1);
                    break;
            }
            _local1 = _local1.nextSibling;
        }
    }
    function parseLayout(xN) {
        cols = new Array();
        var _local2 = xN.firstChild;
        while (_local2 != null) {
            if (_local2.nodeName == "column") {
                var _local3 = new Array();
                var _local1 = _local2.firstChild;
                while (_local1 != null) {
                    _local3.push(_local1.nodeName);
                    maxItems.push(strToNum(_local1.attributes.max));
                    _local1 = _local1.nextSibling;
                }
                cols.push(_local3);
            }
            _local2 = _local2.nextSibling;
        }
    }
    function parseFileTypes(xN) {
        ftypes = new Array();
        fticons = new Array();
        var _local2 = xN.firstChild;
        while (_local2 != null) {
            if (_local2.nodeName == "type") {
                var _local1 = _local2.firstChild;
                while (_local1 != null) {
                    switch (_local1.nodeName) {
                        case "ftextension" : 
                            var _local4 = _local1.firstChild.nodeValue;
                            break;
                        case "fticon" : 
                            var _local3 = _local1.firstChild.nodeValue;
                            break;
                    }
                    _local1 = _local1.nextSibling;
                }
            }
            ftypes.push(_local4);
            fticons.push(_local3);
            _local2 = _local2.nextSibling;
        }
    }
    function parseFonts(xN) {
        var _local1 = xN.firstChild;
        while (_local1 != null) {
            switch (_local1.nodeName) {
                case "headline" : 
                    tfHeadLine = parseAFont(_local1);
                    break;
                case "itemline" : 
                    tfItemLine = parseAFont(_local1);
                    break;
                case "itemlineEmph" : 
                    tfItemLineEmph = parseAFont(_local1);
                    break;
            }
            _local1 = _local1.nextSibling;
        }
    }
    function parseAFont(xN) {
        var _local2 = new TextFormat();
        var _local1 = xN.firstChild;
        while (_local1 != null) {
            switch (_local1.nodeName) {
                case "name" : 
                    _local2.font = _local1.firstChild.nodeValue;
                    if (osType == "M") {
                        _local2.font = "Lucida Grande";
                    }
                    break;
                case "size" : 
                    _local2.size = strToNum(_local1.firstChild.nodeValue);
                    break;
                case "bold" : 
                    _local2.bold = ((_local1.firstChild.nodeValue == "true") ? true : false);
                    break;
                case "italic" : 
                    _local2.italic = ((_local1.firstChild.nodeValue == "true") ? true : false);
                    break;
                case "color" : 
                    _local2["color"] = strHexToNum(_local1.firstChild.nodeValue);
                    break;
            }
            _local1 = _local1.nextSibling;
        }
        return(_local2);
    }
    function parseColors(xN) {
        var _local1 = xN.firstChild;
        while (_local1 != null) {
            switch (_local1.nodeName) {
                case "cbackground" : 
                    cBackground = strHexToNum("0x" + _local1.firstChild.nodeValue);
                    break;
                case "clinksarea" : 
                    cLinksArea = strHexToNum("0x" + _local1.firstChild.nodeValue);
                    break;
                case "cfooter" : 
                    cFooter = strHexToNum("0x" + _local1.firstChild.nodeValue);
                    break;
            }
            _local1 = _local1.nextSibling;
        }
    }
    function parseImgResources(xN) {
        rsrcs = new Array();
        rsrcurls = new Array();
        var _local1 = xN.firstChild;
        while (_local1 != null) {
            rsrcs.push(_local1.nodeName);
            rsrcurls.push(_local1.firstChild.nodeValue);
            _local1 = _local1.nextSibling;
        }
    }
    function getImgResource(aname) {
        var _local1 = 0;
        while (_local1 < rsrcs.length) {
            if (rsrcs[_local1] == aname) {
                return(rsrcurls[_local1]);
            }
            _local1++;
        }
        return("");
    }
    function fileType2ImgResource(ftype) {
        var _local1 = 0;
        while (_local1 < ftypes.length) {
            if (ftypes[_local1].toLowerCase() == ftype.toLowerCase()) {
                return(fticons[_local1]);
            }
            _local1++;
        }
        return("icondocsecondary");
    }
    function parseStringResources(xN) {
        rsrcs = new Array();
        rsrcurls = new Array();
        var _local1 = xN.firstChild;
        while (_local1 != null) {
            strnames.push(_local1.nodeName);
            strings.push(_local1.firstChild.nodeValue);
            _local1 = _local1.nextSibling;
        }
    }
    function getStringResource(aname) {
        var _local1 = 0;
        while (_local1 < strnames.length) {
            if (strnames[_local1] == aname) {
                return(strings[_local1]);
            }
            _local1++;
        }
        return("");
    }
    function parseDims(xN) {
        var _local1 = xN.firstChild;
        while (_local1 != null) {
            switch (_local1.nodeName) {
                case "dialog" : 
                    var _local2 = _local1.firstChild;
                    while (_local2 != null) {
                        switch (_local2.nodeName) {
                            case "w" : 
                                wDialog = strToNum(_local2.firstChild.nodeValue);
                                break;
                            case "h" : 
                                hDialog = strToNum(_local2.firstChild.nodeValue);
                                break;
                        }
                        _local2 = _local2.nextSibling;
                    }
                    break;
                case "icon" : 
                    _local2 = _local1.firstChild;
                    while (_local2 != null) {
                        switch (_local2.nodeName) {
                            case "w" : 
                                wIcon = strToNum(_local2.firstChild.nodeValue);
                                break;
                            case "h" : 
                                hIcon = strToNum(_local2.firstChild.nodeValue);
                                break;
                        }
                        _local2 = _local2.nextSibling;
                    }
                    break;
                case "prodicon" : 
                    _local2 = _local1.firstChild;
                    while (_local2 != null) {
                        switch (_local2.nodeName) {
                            case "w" : 
                                wProductIcon = strToNum(_local2.firstChild.nodeValue);
                                break;
                            case "h" : 
                                hProductIcon = strToNum(_local2.firstChild.nodeValue);
                                break;
                        }
                        _local2 = _local2.nextSibling;
                    }
                    break;
                case "header" : 
                    _local2 = _local1.firstChild;
                    while (_local2 != null) {
                        switch (_local2.nodeName) {
                            case "h" : 
                                hHeader = strToNum(_local2.firstChild.nodeValue);
                                break;
                            default : 
                        }
                        _local2 = _local2.nextSibling;
                    }
                    break;
                case "footer" : 
                    _local2 = _local1.firstChild;
                    while (_local2 != null) {
                        switch (_local2.nodeName) {
                            case "h" : 
                                hFooter = strToNum(_local2.firstChild.nodeValue);
                                break;
                            default : 
                        }
                        _local2 = _local2.nextSibling;
                    }
                    break;
                case "listarea" : 
                    _local2 = _local1.firstChild;
                    while (_local2 != null) {
                        switch (_local2.nodeName) {
                            case "h" : 
                                hListArea = strToNum(_local2.firstChild.nodeValue);
                                break;
                            default : 
                        }
                        _local2 = _local2.nextSibling;
                    }
                    break;
                case "linksarea" : 
                    _local2 = _local1.firstChild;
                    while (_local2 != null) {
                        switch (_local2.nodeName) {
                            case "h" : 
                                hLinksArea = strToNum(_local2.firstChild.nodeValue);
                                break;
                            default : 
                        }
                        _local2 = _local2.nextSibling;
                    }
                    wShimArea = wDialog / 2;
                    hShimArea = hLinksArea;
                    break;
                case "itemline" : 
                    _local2 = _local1.firstChild;
                    while (_local2 != null) {
                        switch (_local2.nodeName) {
                            case "h" : 
                                hItemLine = strToNum(_local2.firstChild.nodeValue);
                                break;
                            default : 
                        }
                        _local2 = _local2.nextSibling;
                    }
                    break;
                case "headline" : 
                    _local2 = _local1.firstChild;
                    while (_local2 != null) {
                        switch (_local2.nodeName) {
                            case "h" : 
                                hHeadLine = strToNum(_local2.firstChild.nodeValue);
                                break;
                            default : 
                        }
                        _local2 = _local2.nextSibling;
                    }
                    break;
                case "paddingoverall" : 
                    _local2 = _local1.firstChild;
                    while (_local2 != null) {
                        switch (_local2.nodeName) {
                            case "w" : 
                                xPadding = strToNum(_local2.firstChild.nodeValue);
                                break;
                            case "h" : 
                                yPadding = strToNum(_local2.firstChild.nodeValue);
                                break;
                        }
                        _local2 = _local2.nextSibling;
                    }
                    break;
                case "indentitemline" : 
                    _local2 = _local1.firstChild;
                    while (_local2 != null) {
                        switch (_local2.nodeName) {
                            case "w" : 
                                xIndentItemLine = strToNum(_local2.firstChild.nodeValue);
                                break;
                            default : 
                        }
                        _local2 = _local2.nextSibling;
                    }
                    break;
            }
            _local1 = _local1.nextSibling;
        }
    }
    function testXML() {
        var _local1 = newline;
        _local1 = _local1 + "XML test\n\n";
        _local1 = _local1 + (("Layout (" + cols.length) + " columns)\n");
        _local1 = _local1 + (colCaptions + newline);
        _local1 = _local1 + (cols + newline);
        _local1 = _local1 + (("max. # of items per each list\n" + maxItems) + newline);
        _local1 = _local1 + ("column width is " + getWCol());
        _local1 = _local1 + newline;
        _local1 = _local1 + "string resources:\n";
        _local1 = _local1 + (strnames + newline);
        _local1 = _local1 + (strings + newline);
        _local1 = _local1 + newline;
        _local1 = _local1 + "file types:\n";
        _local1 = _local1 + (ftypes + newline);
        _local1 = _local1 + (ftnames + newline);
        _local1 = _local1 + (fticons + newline);
        _local1 = _local1 + newline;
        _local1 = _local1 + "img resources:\n";
        _local1 = _local1 + (rsrcs + newline);
        _local1 = _local1 + (rsrcurls + newline);
        _local1 = _local1 + newline;
        _local1 = _local1 + "general style information:\n";
        _local1 = _local1 + (("color background: " + cBackground) + newline);
        _local1 = _local1 + (("color footer: " + cFooter) + newline);
        _local1 = _local1 + (("color links arear: " + cLinksArea) + newline);
        _local1 = _local1 + newline;
        _local1 = _local1 + (((("Text format item line: " + tfItemLine.font) + ", ") + tfItemLine.size) + newline);
        _local1 = _local1 + (((("Text format item line emphasis: " + tfItemLineEmph.font) + ", ") + tfItemLineEmph.size) + newline);
        _local1 = _local1 + (((("Text format head line: " + tfHeadLine.font) + ", ") + tfHeadLine.size) + newline);
        _local1 = _local1 + newline;
        _local1 = _local1 + (((("Icon size: " + wIcon) + ", ") + hIcon) + newline);
        _local1 = _local1 + (((("Product icon size: " + wProductIcon) + ", ") + hProductIcon) + newline);
        _local1 = _local1 + (("Header height: " + hHeader) + newline);
        _local1 = _local1 + (("Footer height: " + hFooter) + newline);
        _local1 = _local1 + (("List area size: " + hListArea) + newline);
        _local1 = _local1 + (("Links (shim) area size: " + hLinksArea) + newline);
        _local1 = _local1 + newline;
        _local1 = _local1 + (("Item lineheight: " + hItemLine) + newline);
        _local1 = _local1 + (("Item indentation: " + xIndentItemLine) + newline);
        _local1 = _local1 + (((("Edge Padding: x:" + xPadding) + ", y:") + yPadding) + newline);
        _local1 = _local1 + newline;
        return(_local1);
    }
    function path2fname_test(p) {
        if (osType == "W") {
            return(p.slice(p.lastIndexOf("\\") + 1));
        } else {
            return(p.slice(p.lastIndexOf("/") + 1));
        }
    }
    function strToNum(s) {
        return(parseInt(s));
    }
    function strHexToNum(s) {
        return(parseInt(s, 16));
    }
    function truncateStringMiddle(whichTF, s, w) {
        var _local8;
        var _local3;
        var _local2;
        var _local5 = "...";
        if (whichTF.getTextExtent(s).width <= w) {
            return(s);
        }
        _local2 = s.length;
        var _local1 = 2;
        while (_local1 <= _local2) {
            _local3 = (s.substr(0, (_local2 - _local1) / 2) + _local5) + s.substr(_local2 - ((_local2 - _local1) / 2), (_local2 - _local1) / 2);
            if (whichTF.getTextExtent(_local3).width <= w) {
                return(_local3);
            }
            _local1++;
        }
        return(_local5);
    }
    function getExtension(s) {
        if (s.indexOf(".") == -1) {
            return("");
        }
        var _local1 = s.split(".");
        return(_local1[_local1.length - 1]);
    }
    function getExtensionFromInternalURL(s) {
        if (s.indexOf("=") == -1) {
            return("");
        }
        var _local1 = s.split("=");
        return(_local1[_local1.length - 1]);
    }
    function path2fname(strTemp) {
        var _local1 = 0;
        var _local5 = false;
        var _local3 = "";
        var _local2 = "";
        var _local6 = "/";
        if (osType == "W") {
            _local6 = "\\";
        }
        if (getStringResource("appobject") == "fw") {
            _local6 = "/";
        }
        _local1 = strTemp.length - 1;
        while ((_local1 >= 0) && (_local5 != true)) {
            _local2 = strTemp.charAt(_local1);
            if (_local2 != _local6) {
                _local3 = _local2 + _local3;
                _local1--;
            } else {
                _local5 = true;
            }
        }
        strTemp = _local3;
        _local3 = "";
        _local1 = 0;
        iLen = strTemp.length - 1;
        while (_local1 <= iLen) {
            _local2 = strTemp.charAt(_local1);
            if (_local2 == "%") {
                if ((_local1 + 2) <= iLen) {
                    if (((_local2 + strTemp.charAt(_local1 + 1)) + strTemp.charAt(_local1 + 2)) == "%20") {
                        _local1 = _local1 + 2;
                        _local2 = " ";
                    }
                }
            }
            _local3 = _local3 + _local2;
            _local1++;
        }
        return(_local3);
    }
    function makeFileURL(strTemp) {
        if (osType == "W") {
            return(makeURLFileName(strTemp));
        } else if (osType == "M") {
            return(makeOSXFileName(strTemp));
        }
    }
    function makeURLFileName(strTemp) {
        var _local3 = 0;
        var _local1 = "";
        var _local4;
        var _local2 = "";
        _local4 = strTemp.length;
        while (_local3 < _local4) {
            _local2 = strTemp.charAt(_local3);
            if (_local2 == "\\") {
                _local1 = _local1 + "/";
            } else if (_local2 == ":") {
                _local1 = _local1 + "|";
            } else {
                _local1 = _local1 + _local2;
            }
            _local3++;
        }
        _local1 = "file:///" + _local1;
        return(_local1);
    }
    function makeOSXFileName(strTemp) {
        return("file://" + strTemp);
    }
    function isOver(px, py, aMc) {
        if (aMc.length == 0) {
            return(-1);
        }
        if (aMc.length == 1) {
            var _local3 = aMc[0].getBounds(this);
            if ((((px >= _local3.xMin) && (px <= _local3.xMax)) && (py >= _local3.yMin)) && (py <= (_local3.yMin + hItemLine))) {
                return(0);
            } else {
                return(-1);
            }
        }
        var _local7 = -100000;
        var _local8 = -1;
        var _local2 = 0;
        while (_local2 < aMc.length) {
            var _local3 = aMc[_local2].getBounds(this);
            if (((((px >= _local3.xMin) && (px <= _local3.xMax)) && (py >= _local3.yMin)) && (py <= (_local3.yMin + hItemLine))) && (aMc[_local2].getDepth() > _local7)) {
                _local8 = _local2;
                _local7 = aMc[_local2].getDepth();
            }
            _local2++;
        }
        return(_local8);
    }
    var configData = "resources/config.xml";
    var cols = new Array();
    var colCaptions = new Array();
    var maxItems = new Array();
    var mrus = new Array();
    var ftypes = new Array();
    var fticons = new Array();
    var rsrcs = new Array();
    var rsrcurls = new Array();
    var strnames = new Array();
    var strings = new Array();
    var dims = new Array();
    var cBackground;
    var cFooter;
    var cLinksArea;
    var tfItemLine = new TextFormat();
    var tfItemLineEmph = new TextFormat();
    var tfHeadLine = new TextFormat();
    var wDialog;
    var hDialog;
    var wShimArea;
    var hShimArea;
    var wIcon;
    var hIcon;
    var wProductIcon;
    var hProductIcon;
    var hHeader;
    var hFooter;
    var hListArea;
    var hLinksArea;
    var hItemLine;
    var xIndentItemLine;
    var hHeadLine;
    var xPadding;
    var yPadding;
    var clickableAreas = new Array();
    var clickWidths = new Array();
    var donePositioningShim = true;
    var checkConnectionInterval;
    var nothing = 0;
    var debugIsOn = false;
    var tabNum = 0;
    Stage.showMenu = false;
    Stage.scaleMode = "noScale";
    var osType = System.capabilities.os.substr(0, 1);
    this.onEnterFrame = function () {
        var _local4 = this._xmouse;
        var _local3 = this._ymouse;
        var _local2 = isOver(_local4, _local3, clickableAreas);
        if (_local2 != -1) {
            this.mc_hover._x = clickableAreas[_local2]._x - 4;
            this.mc_hover._y = clickableAreas[_local2]._y - 2;
            this.mc_hover._width = clickWidths[_local2] + 8;
            this.mc_hover._height = hItemLine;
            this.mc_hover._visible = true;
        } else {
            this.mc_hover._visible = false;
        }
        if (donePositioningShim == false) {
            positionShim(this.mc_ShimArea._local, this.mc_ShimArea._remote, (wDialog / 2) + 2, hHeader + hListArea);
        }
    };
    setDefaults();
    initLoadConfig();
    stop();
