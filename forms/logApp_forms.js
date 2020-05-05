var forms = require('./forms');
var fields = require('./fields');

class CreateLogForm extends forms.ExpressForm{
    constructor(){
        super();

        this.location = new fields.StringField('location', [this.Require]);
        this.comment = new fields.TextAreaField('comment', [this.Require]);
    }//end constructor
}//end class

class UpdateLogForm extends forms.ExpressForm{
    constructor(){
        super();

        this.location = new fields.StringField("location", [this.Require]);
        this.comment = new fields.TextAreaField("comment", [this.Require]);
    }//end constructor
}//end class

module.exports.CreateLogForm = CreateLogForm;
module.exports.UpdateLogForm = UpdateLogForm;