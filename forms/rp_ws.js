/**
 * @AllowToRunInFind
 *
 * @properties={typeid:24,uuid:"D4C00AC8-17CD-4BE4-BD37-9DCC7A5674F8"}
 */
function ws_read()
{
	// Oggetto json da costruire e ritornare
	var object = new Object();
	object.code = 500;
	object.message = "";
	object.message_en = "";
	
	if(arguments == null || arguments[0] == null || arguments[0] == '')
		return object;
	
	var referenceId = arguments[0].reference[0];
	var userId = arguments[0].user[0];
	var status = parseInt(arguments[0].status[0],10);
	
	/** @type {JSFoundSet<db:/ma_framework/notification_requests>}*/
	var fsNotReq = databaseManager.getFoundSet(globals.Server.MA_FRAMEWORK, globals.Table.NOTIFICATION_REQUESTS);
	if(fsNotReq.find())
	{
		fsNotReq.referenceid = referenceId;
		fsNotReq.catalogname = 'Cliente_' + globals.getCatalogFromOwner(globals.getUserOwner(userId));
		
		if(fsNotReq.search())
		{
			var fsNotReqSubConf = globals.getNotificationSubscriberConfirms(fsNotReq.id.toString());
			var arrSubConf = (fsNotReqSubConf && fsNotReqSubConf.getSize()) ? globals.foundsetToArray(fsNotReqSubConf,'userid') : null;
			var fsNotReqSubRej = globals.getNotificationSubscriberRejects(fsNotReq.id.toString());
			var arrSubRej = (fsNotReqSubRej && fsNotReqSubRej.getSize()) ? globals.foundsetToArray(fsNotReqSubRej,'userid') : null;
			var fsNotReqSubNeutral = globals.getNotificationSubscriberNeutrals(fsNotReq.id.toString());
			var arrSubNeutral = (fsNotReqSubNeutral && fsNotReqSubNeutral.getSize()) ? globals.foundsetToArray(fsNotReqSubNeutral,'userid') : null;
			
			switch (globals.gestisciRichiestaWS(fsNotReq.catalogname, 
						                parseInt(fsNotReq.referenceid,10),
						                parseInt(userId,10),
										status,
										true,
										globals.RestServerLink,
										parseInt(fsNotReq.userid,10),
										arrSubNeutral,
										arrSubConf,
										arrSubRej
										)
					)
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
				object.message = "La richiesta non è più presente e potrebbe essere stata eliminata dall'utente stesso.\
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
			// TODO ma a questo punto è necessario eliminare?!?
//			if(object.code == 200)
//				// eliminazione records di operatiorequest con la requestid fornita
//				globals.deleteOpRequestRecs(fsOpReq.request_id);			
		}
		else
		{
			object.code = 407;
			object.message = "Errore durante la gestione della richiesta. Specifica della richiesta non trovata.\
			          Controllare dall'interno dell'applicazione o contattare il servizio di assistenza";
			object.message_en = "Error during request's handling. Request's specification not found.\
			             Log on to the application to verify the request or contact the customer service";
		}
	}
	
	return object;
}