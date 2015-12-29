/**
 * Created by C4off on 17.05.15.
 */
var SUConstants = {
    RecordFirstImageColumn: 'RecordFirstImagePath',
    ObjectPropertyNameField: "Name",
    ParentRelationshipPropertyName: "ParentRelationship_Property_Name",
    ImageSizes: {
        h60: '_t_h60',
        h100: '_t_h100',
        h500: '_t_h500',
        h1024: '_t_h1024'
    },
    MainObjectFieldClass: "mainObjectField",
    NotificationCookieName: "notificationPopupShown_Dec_2015_1",
    PropertyDefinitionID: "PropertyDefinition_ID",
    ObjectId: "ObjectEntry_ID"
};
// Functionality to help with class inheritance
Object.defineProperty(Object.prototype, 'inherit', {
    enumerable: false,
    value: function (base, sub, methods) {
        sub.prototype = Object.create(base.prototype);
        sub.prototype.constructor = sub;
        sub.base = base.prototype;

        // Copy the methods passed in to the prototype
        for (var name in methods) {
            sub.prototype[name] = methods[name];
        }
        // so we can define the constructor inline
        return sub;
    }
});