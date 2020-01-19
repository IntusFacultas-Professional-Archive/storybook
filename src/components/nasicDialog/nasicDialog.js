<template>
    '<div class="nasic-dialog-container" v-if="dialogConfiguration.show">' +
        '   <transition name="nasic-dialog-backdrop-animation">' +
        '       <div class="nasic-dialog-backdrop" v-if="dialogConfiguration.show" @click="closeDialog" ref="backdrop">' +
        '       </div>' +
        '   </transition>' +
        '   <transition : name="dialogConfiguration.dialogClass">' +
        '      <div v-if="dialogConfiguration.show" : class="dialogClass" ref="dialogBox">' +
        '          <div class="nasic-dialog-content-container">' +
        '             <span : class="dialogConfiguration.titleClass"><span v-html="dialogConfiguration.icon"></span> {{ dialogConfiguration.title }}</span>' +
        '             <div class="nasic-dialog-content">' +
        '                 <div v-html="dialogConfiguration.content"></div>' +
        '                 <form v-if="dialogConfiguration.fields.length > 0">' +
        '                     <div v-for="field in dialogConfiguration.fields">' +
        '                         <label : class="field.labelClass">{{ field.label }}</label>' +
        '                         <div v-if="field.fieldHtml" v-html="field.fieldHtml" v-model="fieldValues[field.id]"></div>' +
        '                         <input v-else : class="field.fieldClass" :type="field.fieldType" v-model="fieldValues[field.id]">' +
        '                     </div>' +
        '                 </form>' +
        '             </div>' +
'           <div class="nasic-dialog-button-container">' +
    '               <button v-for="(button, index) in dialogConfiguration.buttons" @click="callFunction(button)" :class="button.btnClass">{{button.text}} <span v-if="index == autoCloseIndex">({{closeTime}})</span></button>' +
    '           </div>' +
    '          </div>' +
    '      </div>' +
    '   </transition>' +
    '</div>',
</template >

    (function () {
        var NasicDialog = Vue.component('nasic-dialog', {

            data: function () {
                return {
                    enabled: false,
                    autoClose: false,
                    closeTime: 10,
                    intervalId: null,
                    autoCloseIndex: -1,
                    fieldValues: {

                    },
                    dialogConfiguration: {
                        show: false,
                        type: "nasic-default-dialog",
                        title: "Alert",
                        icon: "",
                        titleClass: "nasic-dialog-header",
                        content: "This is an alert.",
                        backgroundDismiss: false,
                        buttons: [],
                        fields: [],
                        dialogClass: "nasic-dialog-animation"
                    }
                }
            },
            props: {
                destruct: {
                    type: Boolean,
                    default: true
                }
            },
            mounted: function () {
                var self = this;
                if (self.destruct) {
                    self.$parent.$alert = alert
                    self.$destroy();
                    self.$el.parentNode.removeChild(self.$el);
                }
            },
            methods: {
                handleAutoClose: function () {
                    var self = this;
                    if (self.closeTime == 0) {
                        clearInterval(self.intervalId)
                        self.callFunction(self.dialogConfiguration.buttons[self.autoCloseIndex])
                    }
                    else {
                        self.closeTime--;
                    }
                },
                beginAutoClose: function () {
                    var self = this;
                    self.intervalId = setInterval(self.handleAutoClose, 1000)
                },
                callFunction: function (button) {
                    var self = this;
                    var close = button.action(self.fieldValues);
                    if (close !== false) {
                        self.close();
                    }
                },
                close: function () {
                    var self = this;
                    self.enabled = false;
                    self.$refs.dialogBox.classList.remove("nasic-dialog-open");
                    self.$refs.dialogBox.classList.add("nasic-dismiss-dialog");
                    self.$refs.backdrop.classList.remove("nasic-dialog-backdrop-open");
                    setTimeout(function () {
                        self.dialogConfiguration.show = false;
                        self.$destroy();
                        self.$el.parentNode.removeChild(self.$el);
                    }, 420);
                },
                open: function () {
                    var self = this;
                    self.dialogConfiguration.show = true;
                    setTimeout(function () {
                        self.$refs.backdrop.classList.add("nasic-dialog-backdrop-open");
                        self.$refs.dialogBox.classList.add("nasic-dialog-open");
                    }, 50)
                },
                closeDialog: function (e) {
                    var self = this;
                    if (!self.enabled) {
                        return;
                    }
                    if (self.dialogConfiguration.backgroundDismiss) {
                        self.close();
                    }
                    else {
                        self.$refs.dialogBox.classList.add("nasic-shake-dialog")
                        setTimeout(function () {
                            self.$refs.dialogBox.classList.remove('nasic-shake-dialog')
                        }, 1000)
                    }
                },
                formatField: function (field) {
                    var self = this;
                    var label = "Label";
                    if (field.label) {
                        label = field.label
                    }
                    var fieldType = 'text';
                    if (field.fieldType) {
                        fieldType = field.fieldType;
                    }
                    var labelClass = ["nasic-dialog-label"];
                    if (field.labelClass) {
                        labelClass = field.labelClass;
                    }
                    var fieldClass = ["nasic-dialog-field"];
                    if (field.fieldClass) {
                        fieldClass = field.fieldClass;
                    }
                    var id = label + "-" + fieldType;
                    if (field.id) {
                        id = field.id
                    }
                    return {
                        id: id,
                        label: label,
                        fieldType: fieldType,
                        fieldClass: fieldClass,
                        labelClass: labelClass,
                    }
                },
                formatButton: function (button) {
                    var self = this;
                    var text = "Button";
                    if (button.text) {
                        text = button.text;
                    }
                    var btnClass = ["nasic-dialog-btn", "nasic-dialog-btn-default"];
                    if (button.btnClass && Array.isArray(button.btnClass) && button.btnClass.length > 0) {
                        for (var x = 0; x < button.btnClass.length; x++) {
                            btnClass.push("nasic-dialog-" + button.btnClass[x]);
                        }
                    }
                    if (button.overrideBtnClass && Array.isArray(button.overrideBtnClass)) {
                        btnClass = button.overrideBtnClass;
                    }
                    var action = function () { };
                    if (button.action) {
                        action = button.action;
                    }
                    var id = Math.round((new Date()).getTime() / 1000);
                    if (button.id) {
                        id = button.id
                    }
                    return {
                        id: id,
                        text: text,
                        btnClass: btnClass,
                        action: action
                    }

                },
                alert: function (options) {
                    var self = this;
                    self.enabled = true;
                    var type = "nasic-default-dialog";
                    if (options.type) {
                        type = "nasic-" + options.type + "-dialog";
                    }
                    self.dialogConfiguration.type = type;
                    var title = "Alert";
                    if (typeof options.title == "string") {
                        title = options.title;
                    }
                    self.dialogConfiguration.title = title;
                    var icon = "";
                    if (options.icon) {
                        icon = options.icon;
                    }
                    self.dialogConfiguration.icon = icon;
                    var titleClass = "nasic-dialog-header";
                    if (options.titleClass) {
                        title = options.titleClass
                    }
                    self.dialogConfiguration.titleClass = titleClass;
                    var content = "This is an alert.";
                    if (typeof options.content == "string") {
                        content = options.content;
                    }
                    self.dialogConfiguration.content = content;
                    var backgroundDismiss = false;
                    if (options.backgroundDismiss) {
                        backgroundDismiss = options.backgroundDismiss;
                    }
                    self.dialogConfiguration.backgroundDismiss = backgroundDismiss;
                    var buttons = [self.formatButton({})]
                    if (options.buttons && Array.isArray(options.buttons)) {
                        buttons = [];
                        for (var x = 0; x < options.buttons.length; x++) {
                            buttons.push(self.formatButton(options.buttons[x]))
                        }
                    }
                    self.dialogConfiguration.buttons = buttons;
                    var fields = []
                    if (options.fields && Array.isArray(options.fields)) {
                        fields = [];
                        for (var x = 0; x < options.fields.length; x++) {
                            fields.push(self.formatField(options.fields[x]))
                        }
                    }
                    self.dialogConfiguration.fields = fields;
                    var autoClose = options.autoClose;
                    if (autoClose) {
                        self.autoClose = true;
                        autoClose = autoClose.split("|");
                        self.closeTime = Math.ceil(parseInt(autoClose[1]) / 1000);
                        for (var x = 0; x < self.dialogConfiguration.buttons.length; x++) {
                            if (self.dialogConfiguration.buttons[x].id == autoClose[0]) {
                                self.autoCloseIndex = x;
                                break;
                            }
                        }
                    }
                    self.open();
                    if (self.autoClose) {
                        self.beginAutoClose();
                    }
                }
            },
            computed: {
                dialogClass: function () {
                    var self = this;
                    return ["nasic-dialog", self.dialogConfiguration.type];
                }
            }
        });
        function alert(options, parent) {
            var instance = new NasicDialog({
                propsData: { destruct: false, }
            });
            instance.$mount();
            instance.$parent = parent;
            instance.$parent.$el.appendChild(instance.$el);
            instance.alert(options);
        }
    })();