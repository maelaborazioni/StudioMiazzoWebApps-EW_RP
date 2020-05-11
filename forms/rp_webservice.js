/**
 * @properties={typeid:24,uuid:"CBECA4F3-6480-4830-8968-0082EA45B8A2"}
 */
function ws_read() {
		
	// Oggetto json da costruire e ritornare
	var object = new Object();

	var dbClient = arguments[0].cliente[0];

	if (dbClient) {
		switch (globals.gestisciRichiestaWS(dbClient, 
			                        parseInt(arguments[0].idgiustificativotesta[0],10),
			                        parseInt(arguments[0].operatore[0],10),
									parseInt(arguments[0].status[0],10),
									true,
									arguments[0].wsurl[0],
									parseInt(arguments[0].userid[0],10)
									,arguments[0].othersid[0].split(',')
									,arguments[0].confirmsid[0].split(',')
									,arguments[0].refusesid[0].split(',')))
		{
		case 200:
			object.code = 200;
			object.message = "Gestione della richiesta avvenuta correttamente!";
			object.message_en = "Request has been successfully handled!";
			break;
		case 401:
			object.code = 401;
			object.message = "La conferma od il rifiuto non sono stati eseguiti.\
		                      Controllare dall'interno dell'applicazione o contattare il servizio di assistenza";
			object.message_en = "Request cannot be handled.\
			                     Log on to the application to verify the request or contact the customer service";
			break;
		case 402:
			object.code = 402;
			object.message = "La gestione della richiesta è avvenuta ma si è verificato un errore durante l'inserimento dell'evento in giornaliera di budget. \
		                      Controllare dall'interno dell'applicazione o contattare il servizio di assistenza";
			object.message_en = "Request has been successfully handled but inserting the event in the presence has failed.\
			                     Log on to the application to verify the request or contact the customer service";
			break;
		case 403:
			object.code = 403;
			object.message = "La richiesta non è più; presente e potrebbe essere stata eliminata dall'utente stesso.\
		                      Controllare dall'interno dell'applicazione o contattare il servizio di assistenza";
			object.message_en = "Request no longer exists. It could be canceled by user.\
				                 Log on to the application to verify the request or contact the customer service";
			break;
		case 404:
		    object.code = 404;
		    object.message = "Errore durante l'update della richiesta. Errore generico.\
	                          Controllare dall'interno dell'applicazione o contattare il servizio di assistenza";
		    object.message_en = "Error during request's update. Generic error.\
		                         Log on to the application to verify the request or contact the customer service";
		     break;
		case 405:
		    object.code = 405;
		    object.message = "La richiesta è già stata gestita in precedenza!\
	                          Controllare dall'interno dell'applicazione o contattare il servizio di assistenza";
		    object.message_en = "Request has already been handled.\
		                         Log on to the application to verify the request or contact the customer service";
		     break;
		case 406:
		    object.code = 406;
		    object.message = "La richiesta è stata gestita ma si sono verificati errori in fase di invio della mail od in inserimento evento in giornaliera di budget. \
	                          Controllare dall'interno dell'applicazione o contattare il servizio di assistenza";
		    object.message_en = "Error during request's handling. Request's specification not found.\
		                         Log on to the application to verify the request or contact the customer service";
		     break;
		case 407:
		    object.code = 407;
		    object.message = "Errore durante la gestione della richiesta. Specifica della richiesta non trovata.\
	                          Controllare dall'interno dell'applicazione o contattare il servizio di assistenza";
		    object.message_en = "Error during request's handling. Request's specification not found.\
		                         Log on to the application to verify the request or contact the customer service";
		     break;
		default:
			object.code = 500;
			object.message = "";
			object.message_en = "";
			break;
		}
	} else {
		object.code = -1;
		object.message = "";
		object.message_en = "";
	}
	
	return object;
	
}

/**
 * @param user
 * @param password
 *
 * @properties={typeid:24,uuid:"090CFDB9-9604-4314-937F-6CDCAB7901CE"}
 */
function ws_authenticate_(user,password)
{
	//check if we should check the hash
//	var _validated = security.authenticate('svy_sec_authenticate', 'svy_sec_validateHash',[{owner:vOwner, framework_db:vFramework_db}])
//
//	if (!_validated) 
//	{
//		plugins.dialogs.showWarningDialog("Can't login","Somebody messed with the security data. Logging in is not possible. Please contact the administrator.","OK");
//		
//		if (application.isInDeveloper())
//		{
//			security.authenticate('svy_sec_authenticate', 'svy_sec_recalculateHash', [{owner:vOwner, framework_db:vFramework_db}]);
//			plugins.dialogs.showWarningDialog("", "Developer: Hash recalculated, login again.", "OK");
//		}
//		return;
//	}
		
	// Call authentication module/method, authentication is done on server not on the client.
    var _authObj = new Object()
	_authObj.username = user
	_authObj.password = password
	_authObj.framework_db = globals.Server.SVY_FRAMEWORK;
	/** @type {{owner_id:String,user_id:String,error:String, success:Boolean}} */
	var _return = security.authenticate('svy_sec_authenticate', 'svy_sec_checkUserPassword_http',[_authObj])
	if(_return.success)
	{
	   _return.operatore = user;	
	   return _return;
	}
	else	
	{
		if(_return.error)
		   application.output("error during ws_authenticate" + _return.error);
		else
		   application.output("error unknown during ws_authenticate");
	}
	return null;
}