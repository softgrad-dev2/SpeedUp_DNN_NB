/**
 * Created by antons on 5/18/15.
 */

//Used to manually test detailPageBlocks
function FakeBlocks() {
    var woBlock = new DetailPageBlock();
    woBlock.contentObject = new ContentObject();
    woBlock.contentObject.content = '<div>wo demo content</div>';
    // WT1
    var wt1Block = new DetailPageBlock();
    wt1Block.contentObject = new ContentObject();
    wt1Block.contentObject.content = '<div>#wt1 demo content</div>';

    var report1Block = new DetailPageBlock();
    report1Block.contentObject = new ContentObject();
    report1Block.contentObject.content = '<div>###wt1 report1 content</div>';

    wt1Block.appendChildBlock(report1Block);

    // WT2
    var wt2Block = new DetailPageBlock();
    wt2Block.contentObject = new ContentObject();
    wt2Block.contentObject.content = '<div>#wt2 demo content</div>';

    woBlock.appendChildBlock(wt1Block);
    woBlock.appendChildBlock(wt2Block);

    this.mainBlock = woBlock;
}

//FakeBlocks.prototype.getContent = function(){
//    return this.mainBlock.generateContent();
//};
FakeBlocks.prototype.displayContent = function () {
    return this.mainBlock.element;
};
FakeBlocks.prototype.addBlocksTest = function () {
    var father = this.mainBlock;

    var newChild = new DetailPageBlock();
    newChild.contentObject = new ContentObject();
    newChild.contentObject.content = '<div>#new WT block</div>';

    father.appendChildBlock(newChild);

    var newReport = new DetailPageBlock();
    newReport.contentObject = new ContentObject();
    newReport.contentObject.content = '<div>###new WT report block</div>';

    newChild.appendChildBlock(newReport);

    var wt1 = father.childBlocks[Object.keys(father.childBlocks)[0]];
    var report1 = wt1.childBlocks[Object.keys(wt1.childBlocks)[0]];

    var newVehicle = new DetailPageBlock();
    newVehicle.contentObject = new ContentObject();
    newVehicle.contentObject.content = '<div>#####new Vehicle block</div>';

    report1.appendChildBlock(newVehicle);
};
FakeBlocks.prototype.removeWt2 = function () {
    var father = this.mainBlock;
    var wt2 = father.childBlocks[Object.keys(father.childBlocks)[1]];
    wt2.removeBlock();
};

FakeBlocks.prototype.removeReport1 = function () {
    var father = this.mainBlock;
    var wt1 = father.childBlocks[Object.keys(father.childBlocks)[0]];
    var report1 = wt1.childBlocks[Object.keys(wt1.childBlocks)[0]];
    report1.removeBlock();
};
FakeBlocks.prototype.removeWo = function () {
    this.mainBlock.removeBlock();
};