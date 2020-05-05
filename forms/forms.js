class ExpressForm{
    
    validate_on_submit(form){
        console.log(form);
        let fields = Object.keys(form);
        let has_errors = false;
        for (var i=0; i<= fields.length -1; i++){
            if(form[fields[i]].validations.length > 0){
                for(var j=0; j<= form[fields[i]].validations.length -1; j++){
                    let result = form[fields[i]].validations[j](form[fields[i]].text);
                    //console.log("result: " +result);
                    if(result != null){
                        form[fields[i]].errors.push(result)
                        has_errors = true;
                    }//end if
                }//end for
            }// end if
            //console.log("errors for: " + fields[i] + ": " + form[fields[i]].errors);
        }//end for
        //console.log("has errors: "+ has_errors);
        return !has_errors;
    }//end method

    Require(text){
        //console.log(text);
        if(text.length > 0){
            return null;
        }else{
            return "Please enter data in this field";
        }// end if
    }// end method
    
}//end class

class ExpressFields{
    
}// end class

module.exports.ExpressForm = ExpressForm;