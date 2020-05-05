var forms = require('./forms');
var fields = require('./fields');


class RegisterUserForm extends forms.ExpressForm{
    constructor(){
        super();

        this.username = new fields.StringField('username', [this.Require]);
        this.email = new fields.EmailField('email', [this.Require]);
        this.password = new fields.PasswordField('password', [this.Require]);
        this.confirmPassword = new fields.PasswordField('confirmPassword', [this.Require]);
    }//end constructor
}//end class

class LoginForm extends forms.ExpressForm{
    constructor(){
        super();

        this.username = new fields.StringField('username', [this.Require]);
        this.password = new fields.PasswordField('password', [this.Require]);
    }//end constructor

}//end class

class UserAccountForm extends forms.ExpressForm{
    constructor(){
        super();

        this.username = new fields.StringField('username', [this.Require]);
        this.email = new fields.EmailField('email', [this.Require]);
    }//end constructor

}//end class

module.exports.RegisterUserForm = RegisterUserForm;
module.exports.LoginForm = LoginForm;
module.exports.UserAccountForm = UserAccountForm;