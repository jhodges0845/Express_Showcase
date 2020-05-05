class StringField{
    constructor(name, validations=[]){
        this.errors = [];
        this.text = "";
        this.label = `label for="${name}"`;
        this.validations = validations;
        this.field = `input type="text" placeholder="" name="${name}" `;
        
    }//end constructor
}//end class

class TextAreaField{
    constructor(name, validations=[]){
        this.errors = [];
        this.text = "";
        this.label = `label for="${name}"`;
        this.validations = validations;
        this.field = `textarea type="text" placeholder="" name="${name}" `;
        
    }//end constructor
}// end class

class EmailField{
    constructor(name, validations=[]){
        this.errors = [];
        this.text = "";
        this.label = `label for="${name}"`;
        this.validations = validations;
        this.field= `input type="email" placeholder="" name="${name}"`;
    
    }//end constructor
}//end class

class PasswordField{
    constructor(name, validations=[]){
        this.errors = [];
        this.text = "";
        this.label = `label for="${name}"`;
        this.validations = validations;
        this.field= `input type="password" placeholder="" name="${name}"`;
    }//end constructor
}//end class

module.exports.StringField = StringField;
module.exports.TextAreaField = TextAreaField;
module.exports.EmailField = EmailField;
module.exports.PasswordField = PasswordField;