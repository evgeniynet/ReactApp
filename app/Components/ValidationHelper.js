/* Imports */
import { Messages } from './Constants';
import CommonFunctions from './CommonFunctions';

//Common Validations
/* Validating country  */
function isInvalidCountry(countryName, isShowAlert = true) {
  if (countryName.trim() === '') {
    if (isShowAlert) {
      CommonFunctions.presentAlert(Messages.SelectCountry)
    }
    return true;
  }
  return false;
}

/* Validating mobile number  */
function isInvalidMobile(number, isShowAlert = true) {
  if (number.trim() === '') {
    if (isShowAlert) {
      CommonFunctions.presentAlert(Messages.EnterMobileNumber)
    }
    return true;
  } else if ((number.trim()).length < 10 || (number.trim()).length > 14) {
    if (isShowAlert) {
      CommonFunctions.presentAlert(Messages.EnterValidMobileNuber)
    }
    return true;
  }
  return false;
}

/* Validating email address  */
function isInvalidEmail(email, isShowAlert = true) {
  if (email === '') {
    if (isShowAlert) {
      CommonFunctions.presentAlert(Messages.EnterEmail)
    }
    return true;
  } else if (isInvalidEmailExprastion(email) === false) {
    if (isShowAlert) {
      CommonFunctions.presentAlert(Messages.EnterValidEmail)
    }
    return true;
  }
  return false;
}

/* Validating email address in correct format */
function isInvalidEmailExprastion(email) {
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}

/* Validating domain name  */
function isInvalidDomainName(domain, isShowAlert = true) {
  if (domain === '') {
    if (isShowAlert) {
      CommonFunctions.presentAlert(Messages.EnterDomain)
    }
    return true;
  } else if (isInvalidDomainNameExprastion(domain) === false) {
    if (isShowAlert) {
      CommonFunctions.presentAlert(Messages.EnterValidEmail)
    }
    return true;
  }
  return false;
}

/* Validating domain name in correct format */
function isInvalidDomainNameExprastion(domain) {
  var re = /^[a-z0-9]+([\-\.]{1}[a-z0-9]+)*$/;
  return re.test(domain);
}

/* Validating password  */
function isInvalidPassword(password, isShowAlert = true) {
  if (password === '') {
    if (isShowAlert) {
      CommonFunctions.presentAlert(Messages.EnterPassword)
    }
    return true;
  } else if (password.length < 5) {
    if (isShowAlert) {
      CommonFunctions.presentAlert(Messages.EnterValidPassword)
    }
    return true;
  }
  return false;
}

/* Matching password  */
function isInvalidConfirmPassword(password, confirmPassword, isShowAlert = true) {
  if (confirmPassword === '') {
    if (isShowAlert) {
      CommonFunctions.presentAlert(Messages.EnterConfrimPassword)
    }
    return true;
  } else if (password !== confirmPassword) {
    if (isShowAlert) {
      CommonFunctions.presentAlert(Messages.ConfrimPasswordAndPasswordDoesNotMetch)
    }
    return true;
  }
  return false;
}

/* Validating text is empty or filled  */
function isInvalidDetail(text, message, isShowAlert = true) {
  if (text.trim() === '') {
    if (isShowAlert) {
      CommonFunctions.presentAlert(message)
    }
    return true;
  }
  return false;
}

/* Validating text is empty or filled with number characters */
function isInvalidText(text, length = 0) {
  if (text.trim().length <= length) {
    return true;
  }
  return false;
}

/* Validating amount  */
function isValidAmount(value) {
  var rgx = /^[0-9]*\.?[0-9]*$/;
  return value.match(rgx);
}

/* Exporting methods */
export default {
  isInvalidDetail,
  isInvalidConfirmPassword,
  isInvalidCountry,
  isInvalidMobile,
  isInvalidEmail,
  isInvalidDomainName,
  isInvalidPassword,
  isInvalidText,
  isValidAmount
};