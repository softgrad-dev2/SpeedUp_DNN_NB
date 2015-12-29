/**
 * Created by C4off on 10.05.15.
 */
function DetailPageBlockIdGenerator() {

}
// Static variable to generate new Id for new DetailPageBlock
DetailPageBlockIdGenerator.currentId = 0;
DetailPageBlockIdGenerator.generateId = function () {
    return ++DetailPageBlockIdGenerator.currentId;
};

function DetailPageBlock(settings) {
    // generate new id
    this.id = DetailPageBlockIdGenerator.generateId();
    this.parentBlock = null;
    this.element = angular.element('<div blockId="' + this.id + '"></div>');
    this._contentObject = null;
    this.childBlocks = [];
    this.childContainer = null;
    this.settings = settings || {};
    this.fieldInEditMode = null;
    this.currentPageBlock = null;

    Object.defineProperty(this, 'contentObject', {
        get: function () {
            // console.log('getting content of DetailPageBlock');
            return this._contentObject;
        },
        set: function (value) {
//            console.log('setting content 4 detailPage block' + value);
            if (value instanceof ContentObject) {
                value.pageBlock = this;
                this._contentObject = value;
                this.element.empty();
                this.element.append(value.generateContent());
            } else {
                this._contentObject = null;
            }
        }
    });
}
DetailPageBlock.prototype.getRootBlock = function (pageBlock) {
    return pageBlock.parentBlock ? this.getRootBlock(pageBlock.parentBlock) : pageBlock;
};
DetailPageBlock.prototype.getVeryLastChildBlock = function(block){
    if(!block){
        block = this.getRootBlock(this);
    }
    if(!block){
        return null;
    }
    var lastChild = block.getLastChildBlock();

    return (!lastChild || !lastChild.getChildrenCount()) ? lastChild
        : this.getVeryLastChildBlock(lastChild);
};
DetailPageBlock.prototype.getLastChildBlock = function(idx){
    if(!this.childBlocks || idx < 0){
        return null;
    }
    if(!(idx || idx === 0)){
        idx = this.childBlocks.length - 1;
    }
    var block = this.childBlocks[idx];
    if(!block){
        block = this.getLastChildBlock(idx - 1);
    }

    return block;
};
DetailPageBlock.prototype.getNextBlock = function () {
    // try to get first child
    var nextBlock = this.getNextChildBlock();
    if (!nextBlock) {
        // try to get next sibling
        nextBlock = this.getNextSiblingBlock()
    }
    if (!nextBlock) {
        return this.getRootBlock(this);
    }

    return nextBlock;
};
DetailPageBlock.prototype.getPrevBlock = function () {
    // try to get next sibling
    var nextBlock = this.getPrevSiblingBlock();
    if (!nextBlock) {
        if(this.parentBlock){
            return this.parentBlock
        } else{
            return this.getVeryLastChildBlock();
        }
    }

    return nextBlock;
};
DetailPageBlock.prototype.getNextSiblingBlock = function () {
    var nextSibling = null;
    var parentBlock = this.parentBlock;
    if (parentBlock) {
        nextSibling = parentBlock.getNextChildBlock(this);
        if (!nextSibling) {
            return parentBlock.getNextSiblingBlock();
        }
    }

    return nextSibling;
};
DetailPageBlock.prototype.getPrevSiblingBlock = function () {
    var prevSibling = null;
    var parentBlock = this.parentBlock;
    if (parentBlock) {
        prevSibling = parentBlock.getPrevChildBlock(this);
        if (!prevSibling) {
            return parentBlock.getPrevSiblingBlock();
        }
    }

    return prevSibling;
};
DetailPageBlock.prototype.getNextChildBlock = function (childBlock) {
    var nextChild = null;
    var afterMe = false;
    this.childBlocks.some(function (block) {
        if (block) {
            if (!childBlock) { // if we need first child
                nextChild = block;
                return true;
            } else {  // if we need child after it
                if (block.id == childBlock.id) {
                    afterMe = true;
                    return false;
                } else if (afterMe) {
                    nextChild = block;
                    return true;
                }
                return false;
            }
        }
    });

    return nextChild;
};
DetailPageBlock.prototype.getPrevChildBlock = function (childBlock) {
    var potentialPrevChild = null;
    var found = false;
    this.childBlocks.some(function (block) {
        if (block) {
            if (!childBlock) { // if we need last child
                potentialPrevChild = block;
                found = true;
                return true;
            } else if (block.id == childBlock.id) {  // if we need child before it
                if (potentialPrevChild) {
                    found = true;
                }
                return true;
            } else {
                potentialPrevChild = block;
                return false;
            }
        }
    });

    return found ? potentialPrevChild : null;
};
// Method to set 'current' page block (it's needed for keyboard functionality)
DetailPageBlock.prototype.setRootAwareOfCurrent = function (pageBlock, check) {
    var parentBlock = this.getRootBlock(pageBlock);
    if (!check || (check && !parentBlock.currentPageBlock)) {
        parentBlock.currentPageBlock = pageBlock;
    }
}
DetailPageBlock.prototype.showChildren = function () {
    if (this.childContainer && this.childContainer.length) {
        this.childContainer.show();
    }
}
DetailPageBlock.prototype.hideChildren = function () {
    if (this.childContainer && this.childContainer.length) {
        this.childContainer.hide();
    }
}
DetailPageBlock.prototype.substituteBlockBy = function (pageBlock) {
    this.clearBlock();
    this.element.append(pageBlock.element);
    pageBlock.displayer = this.displayer;

    return pageBlock;
}
DetailPageBlock.prototype.getChildrenCount = function () {
    var count = 0;
    this.childBlocks.forEach(function (elem) {
        if (elem) {
            count++;
        }
    });

    return count;
}
DetailPageBlock.prototype.clearBlock = function () {
    // disconnect events
    if(this.contentObject && this.contentObject.element){
        this.contentObject.element.off();
    }
    this.element.empty();
    this.childContainer = null;
    this._contentObject = null;
    this.childBlocks.forEach(function (block) {
        if (block) {
            block.clearBlock();
        }
    });
    this.childBlocks = [];
};
DetailPageBlock.prototype.appendChildBlock = function (childBlock) {
//    console.log('child block id: ' + childBlock.id + ' appended to block id: ' + this.id);
    var content = childBlock.element;
    childBlock.parentBlock = this;

    if (!this.childContainer) {
        this.childContainer = angular.element("<div class=\"childContainer\"></div>");
        this.element.append(this.childContainer);
        // find container to append after.
        this.childContainer.append(content);
    } else { // find a child to append after
        // find minimum id > than current
        var srchBlock = null;
        this.childBlocks.forEach(function (block) {
            if (block.id < childBlock.id) {
                if (!srchBlock || (block.id > srchBlock.id)) {
                    srchBlock = block;
                }
            }
        });
        if (srchBlock) {
            srchBlock.element.after(content);
        } else {
            this.childContainer.prepend(content);

        }
    }

    this.childBlocks['' + childBlock.id] = childBlock;
};
DetailPageBlock.prototype.removeBlock = function () {
    //root block
    if (!this.parentBlock) {
        this.clearBlock();
        this.element.remove();
        delete this;
    } else { // child block
        this.parentBlock.removeChildBlockById(this.id);
    }
}
DetailPageBlock.prototype.removeChildBlockById = function (blockId) {
    blockId = '' + blockId;
    if (this.childBlocks[blockId]) {
        this.childBlocks[blockId].clearBlock();
        this.childBlocks[blockId] = null;
        return true;
    } else {
        return false;
    }
};

function ContentObject() {
    this._content = null;
    this.element = angular.element("<div class=\"ContentObject\"></div>");
    this.pageBlock = null;

    Object.defineProperty(this, 'content', {
        get: function () {
//            console.log('getting content of content object');
            return this.element;
        },
        set: function (value) {
//            console.log('setting content for content object' + value);
            this.element.empty();
            if (angular.isObject(value)) {
                this.element.append(angular.element(value));
            } else {
                this.element.innerHTML(value);
            }
        }
    });
}
ContentObject.prototype.generateContent = function () {
    // TODO: generate content if content is empty, otherwise return content
    return this.content;
};

function DetailObject() {
    // Call the parent's constructor without hard coding the parent
    DetailObject.base.constructor.call(this, arguments);
    this.header = '';
    this._tabStrip = null;
    this._menu = null;
    this._fields = [];

    this._promiseBlocks = [];

    Object.defineProperty(this, 'fields', {
        get: function () {
            return this._fields;
        },
        set: function (value) {
            // if this is promise - put it for later resolving
            if (value && angular.isFunction(value.then)) {
                this._promiseBlocks.push(value.then(function (content) {
                    this._fields = content;
                }));
            } else {
                this._fields = value;
            }
        }
    });
    Object.defineProperty(this, 'tabStrip', {
        get: function () {
            return this._tabStrip;
        },
        set: function (value) {
            // if this is promise - put it for later resolving
            if (value && angular.isFunction(value.then)) {
                this._promiseBlocks.push(value.then(function (content) {
                    this._tabStrip = content;
                }));
            } else {
                this._tabStrip = value;
            }
        }
    });
    Object.defineProperty(this, 'menu', {
        get: function () {
            return this._menu;
        },
        set: function (value) {
            // if this is promise - put it for later resolving
            if (value && angular.isFunction(value.then)) {
                this._promiseBlocks.push(value.then(function (content) {
                    this._menu = content;
                }));
            } else {
                this._menu = value;
            }
        }
    });

    this.pageBlock = null;
}

// Inheriting from ContentObject
Object.inherit(ContentObject, DetailObject, {
    generateContent: function () {
        var _self = this;
        return $q.all(detailObject._promiseBlocks).then(function () {
            _self._promiseBlocks = [];
            var headerBlock = angular.element(_self._header);
            var menuBlock = angular.element(_self._menu);
            var tabStripBlock = angular.element(_self._tabStrip);
            var contentBlock = angular.element(_self._fields);
            _self.content = angular.element('<div></div>').
                append(headerBlock).
                append(menuBlock).
                append(tabStripBlock).
                append(contentBlock);

            return _self.content;
        });
    }
});