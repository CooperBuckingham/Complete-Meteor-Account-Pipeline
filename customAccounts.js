
if (Meteor.isServer) {
  //customize emails sent to users
  Accounts.emailTemplates.siteName = "AwesomeSite";
  Accounts.emailTemplates.from = "AwesomeSite Admin <accounts@example.com>";

  Accounts.emailTemplates.enrollAccount.subject = function (user) {
    return "Welcome to Awesome Town, " + user.profile.name;
  };
  Accounts.emailTemplates.enrollAccount.text = function (user, url) {
   return "You have been selected to participate in building a better future!"
   + " To activate your account, simply click the link below:\n\n"
   + url;
   };
  Accounts.emailTemplates.resetPassword.subject = function (user) {
    return "Reset Password Request for " + user.profile.name;
  };
  Accounts.emailTemplates.resetPassword.text = function (user, url) {
   return "Password reset information for user " + user + ". at " + url + ".";
  };
  Accounts.emailTemplates.verifyEmail.subject = function (user) {
    return "Please Verify your Email for " + user.profile.name;
  };
  Accounts.emailTemplates.verifyEmail.text = function (user, url) {
   return "Please verify email for " + user + ". at " + url + ".";
  };
  //END

  throwError = function(str){
    throw new Meteor.Error(403, str);
      return false;
  };

  Accounts.validateNewUser(function (user) {

    console.log(user);

    if(!user.username){
      return throwError('Username was blank');
    }

    if (user.username.length < 5){
      return throwError('Username needs at least 5 characters');
    }

    user.username = user.username.toLowerCase();

    if(user.username === "root" ){
      return throwError('Reserved username');
    }

    return true;
  });

    // Accounts.onCreateUser(function(options, user) {
    //     // We still want the default hook's 'profile' behavior.
    //     if (options.profile)
    //       user.profile = options.profile;
    //     return user;
    // });

  sendReset = function(user, emailOrDefault){
    Accounts.sendResetPasswordEmail(userId, emailOrDefault);
  }

  // Accounts.sendEnrollmentEmail(userId, [email])
  // Accounts.sendVerificationEmail(userId, [email])
}

if (Meteor.isClient) {

  Accounts.onResetPasswordLink(function(){

  });

  Accounts.onLogin(function(){
  //called on login success
  });

  Accounts.onLoginFailure(function(){
    //on login failure
  });

  Accounts.onEmailVerificationLink(function(token, done){
    tokenEmailConfirm(token);
    done();
  });

  passwordSanity = function(pwd, optPwd){

   if(optPwd && pwd !== optPwd){
      doOptionsChangeError("Confirmed password does not match");
      return false;
    }

    //1 lower, 1 upper, 1 number, 6-15 length, no spaces
    var pass = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?!.*\s).{4,10}$/;
    if(!pass.test(pwd) ){
      doOptionsChangeError("Regex requires: 1 Upper, 6-15, no spaces");
      return false;
    }

     if(JSON.parse(JSON.stringify(pwd)) !== pwd){
      doOptionsChangeError("JSON Test Failed");
      return false;
    }

    return true;
  }

  usernameSanity = function(usr){
    if(JSON.parse(JSON.stringify(usr)) !== usr){
      doOptionsChangeError("user contains illegal characters");
      return false;
    }
    return true;
  }

  logIn = function(){
    var username = $("#input-username").val();
    var password = $("#input-password").val();
    username = username.toLowerCase();


    if(usernameSanity(username) === false){
      return;
    }
    if(passwordSanity(password) === false){
      return;
    }

    Meteor.loginWithPassword({username: username}, password, function(error){
      if(error){
        doOptionsChangeError(error);
      }else{
        Meteor.logoutOtherClients();
      }

    });
  };

  logOut = function(){
    Meteor.logout(function(error){
        if(error){
          //something
        }
    });
  };

  Template.registerHelper('checkCreateIsOpen', function(){
    return Session.get("createIsOpen");
  });

  closeCreateUser = function(){
    Session.set("createIsOpen", false);
  }

  openCreateUser = function(){
    Session.set("createIsOpen", true);
  }

  createUser = function(){
    var username = $('#input-username').val();
    var newPassword = $('#input-password').val();
    var newPasswordAgain = $('#input-password-again').val();

    if(!usernameSanity(username)) return;
    if(!passwordSanity(newPassword, newPasswordAgain)) return;

    var options = {
      //can add email to this option
      username: username,
      password: newPassword,
      profile: {nickname: username }
    };

    disableButton("createUser");

    Accounts.createUser(options, function(error){
        //on create
        if(error){
          console.log("error on create user");
          doOptionsChangeError(error);
        }else{
          console.log("user created");
          closeCreateUser();
        }
        enableButton("createUser");
      });
  }

  closeChangePassword = function(){
    Session.set("changePasswordIsOpen", false);
  };

  openChangePassword = function(){
    Session.set("changePasswordIsOpen", true);
  };

  Template.registerHelper('checkChangePasswordIsOpen', function(){
    return Session.get("changePasswordIsOpen");
  });

  //stores settimout id here so can be cleared later
  //before being set again
  var errTimeoutId = null;
  doOptionsChangeError = function(errOrText){
    var text;
    if(typeof errOrText === "string"){
      text = errOrText;
    }else{
      text = errOrText.reason;
    }
    $("#options-error").text(text);
    clearTimeout(errTimeoutId);
    errTimeoutId = setTimeout(function(){
      $("#options-error").text("");
    }, 5000);

  };

  changePassword = function(){
    var oldPassword = $('#input-password-change-current').val();
    var newPassword = $('#input-password-change-new').val();
    var newPasswordAgain = $('#input-password-change-new-again').val();

    disableButton("change-password");
      //must be logged in
    Accounts.changePassword(oldPassword, newPassword, function(error){
      if(error){
        doOptionsChangeError(error);
      }else{
        //re-enable button
        closeChangePassword();
        $('#input-password-change-current').val("");
        $('#input-password-change-new').val("");
        $('#input-password-change-new-again').val("");
        doOptionsChangeError("password change successful");
      }

      enableButton("change-password");

    });
  };

  forgotPassword = function(){
    var options = {email: "string"};
    Accounts.forgotPassword(options, function(error){
      //forgot password
    });
  };

  tokenPasswordConfirm = function(){
    var token = "string";
    var newPassword = "string"
    Accounts.resetPassword(token, newPassword, function(error){
      //token confirmed
    })
  };

  tokenEmailConfirm = function(token){
    token = token || //pull from somewehre?
    Accounts.verifyEmail(token, function(error){
      //email confirmed
    });
  };

  disableButton = function(str){
    $("#" + str).prop("disabled", true);
  };

  enableButton = function(str){
    $("#" + str).removeProp("disabled");
  };

  toggleOptions = function(){
    console.log("toggle");
    if(Session.get("optionsToggleIsOpen") !== true){
      Session.set("optionsToggleIsOpen", true);
    }else{
      Session.set("optionsToggleIsOpen", false);
    }
  };
}

