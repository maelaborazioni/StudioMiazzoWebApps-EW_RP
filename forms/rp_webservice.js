/**
 * 
 * @properties={typeid:24,uuid:"CBECA4F3-6480-4830-8968-0082EA45B8A2"}
 */
function ws_read() {
		
	// Oggetto json da costruire e ritornare
	var object = new Object();

	var dbClient = arguments[0].cliente[0];

	if (dbClient) {
		switch (gestisciRichiestaWS(dbClient, 
			                        parseInt(arguments[0].idgiustificativotesta[0],10),
			                        parseInt(arguments[0].operatore[0],10),
									parseInt(arguments[0].status[0],10),
									true,
									arguments[0].wsurl[0],
									parseInt(arguments[0].userid[0],10)
									,arguments[0].othersid[0]
									,arguments[0].confirmsid[0]
									,arguments[0].refusesid[0]))
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
		    object.message = "Errore durante la gestione della richiesta. Specifica della richiesta non trovata.\
	                          Controllare dall'interno dell'applicazione o contattare il servizio di assistenza";
		    object.message_en = "Error during request's handling. Request's specification not found.\
		                         Log on to the application to verify the request or contact the customer service";
		break;
		
		default:
			object.code = -1;
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
 * TODO generated, please specify type and doc for the params
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

/**
 * @param {String} clientDb
 * @param {Number} idgiustificativotesta
 * @param {Number} operatore_id
 * @param {Number} status
 * @param {Boolean} inviaMail
 * @param {String} wsName
 * @param {Number} user_id
 * @param {String} [others_id]
 * @param {String} [confirms_id]
 * @param {String} [refuses_id]
 * 
 * @return {Number}
 * 
 * @properties={typeid:24,uuid:"F1B99816-63AD-457E-9EC6-122F0CA2F4FB"}
 * @AllowToRunInFind
 */
function gestisciRichiestaWS(clientDb, idgiustificativotesta, operatore_id, status, inviaMail, wsName, user_id, others_id, confirms_id, refuses_id)
{ 
	try
	{
		var idDitta = null;
		var sqlDitta = "SELECT idDitta FROM Lavoratori WHERE idLavoratore IN \
		                (SELECT idLavoratore FROM Lavoratori_GiustificativiTesta \
	                     WHERE idLavoratoreGiustificativoTesta = ?)";
		var arrDitta = [idgiustificativotesta];
		var dsDitta = databaseManager.getDataSetByQuery(clientDb, sqlDitta, arrDitta, 1);
		idDitta = dsDitta.getValue(1, 1);
	
		if (!idDitta)
			return 403;
		
		/** @type {JSFoundset<db:/ma_anagrafiche/lavoratori_giustificativitesta>}*/
		var fs = databaseManager.getFoundSet(clientDb, globals.Table.RP_TESTA);
		if (fs.find()) {
			fs.idlavoratoregiustificativotesta = idgiustificativotesta;
			fs.stato = '^';
			if (fs.search()) {
				databaseManager.startTransaction();
	
				/** @type {JSRecord<db:/ma_anagrafiche/lavoratori_giustificativitesta>}*/
				var rec = fs.getSelectedRecord();
	
				// conferma o rifiuta la richiesta
				rec['stato'] = status;
				rec['approvatoil'] = new Date();
				rec['approvatoda'] = globals.getUserName(operatore_id);
	
				if (!databaseManager.commitTransaction()) {
					databaseManager.rollbackTransaction();
					// codice di errore inserimento
					return 401;
				} else {
	
					/** @type {JSFoundset<db:/ma_anagrafiche/lavoratori_giustificativirighe>}*/
					var fsRighe = databaseManager.getFoundSet(clientDb, globals.Table.RP_RIGHE);
					if (fsRighe.find()) {
						fsRighe.idlavoratoregiustificativotesta = idgiustificativotesta;
						if (fsRighe.search()) {
	
							fsRighe.sort('giorno asc');
							var giorno_dal = fsRighe.getRecord(1).giorno;
							fsRighe.sort('giorno desc');
							var giorno_al = fsRighe.getRecord(1).giorno;
							var idEvento = fsRighe.getRecord(1).idevento;
							var dalleOre = null;
							var alleOre = null;
							
							//se la richiesta è stata confermata, inseriamo in giornaliera di budget l'evento riportato in fase di richiesta
							if (status == 1) {
								for (var i = 1; i <= fsRighe.getSize(); i++) {
									var recRiga = fsRighe.getRecord(i);
									dalleOre = recRiga.dalleore;
									alleOre = recRiga.alleore;
									var evParams = globals.inizializzaParametriEvento(idDitta,
										recRiga.giorno.getFullYear() * 100 + recRiga.giorno.getMonth() + 1,
										0,
										[recRiga.giorno.getDate()],
										globals.TipoGiornaliera.BUDGET,
										globals.TipoConnessione.CLIENTE,
										[recRiga.idlavoratore],
										recRiga.idevento,
										recRiga.proprieta ? recRiga.proprieta : "",
										recRiga.giornointero == 0 ? recRiga.ore : 0, //verificare se giorno intero o meno
										recRiga.importo,
										-1,
										'',
										recRiga.giornointero //flag copertura orario teorico
									)
									//TODO da rimuovere!!!
//									wsName = 'http://srv-epiweb/Leaf_Old';
									var saved = salvaEventoWS(wsName, evParams, clientDb);
	
									if (!saved)
									// codice di errore inserimento evento in giornaliera di budget
										return 402;
								}
							}
							
							//invia la mail con la comunicazione con il riscontro della gestione della richiesta
							globals.gestisciInvioComunicazione(rec.datarichiesta,
								                               rec.stato,
															   rec.approvatoil,
															   operatore_id,
															   giorno_dal,
															   giorno_al,
															   dalleOre,
															   alleOre,
															   user_id,
															   idEvento,
															   null,
															   others_id,
															   confirms_id,
															   refuses_id
															   );
	                        return 200;
	
						} else
						// codice di errore recupero giustificativo righe
							return 406;
					} else
					// codice di errore generico
						return 404;
												
				}
	
			}
			return 405;
		}
		return 404;
	}
	catch(ex)
	{
		return 406;
	}

}

/**
 * @param {String} wsUrl
 * @param {Object} _evParams
 * @param {String} dbName
 * 
 * @return {Boolean} bReturn
 * 
 * @properties={typeid:24,uuid:"6579F2CC-EC07-485D-B8D3-C91784A33E78"}
 */
function salvaEventoWS(wsUrl,_evParams,dbName)
{	
	var url = wsUrl + "/Eventi/SalvaWS";
	var responseObj = globals.getWebServiceResponseWS(url,_evParams,dbName);
	return responseObj['returnValue'];
}

///**
// * @properties={typeid:24,uuid:"4934ADC7-20AE-43A3-8B12-B67DB3FC86F6"}
// */
//function ws_test()
//{
//	var object = new Object();
//	object.code = 200;
//	object.message = "Test is OK!";
//
//	return {code : object.code, message : object.message};
//}
//
///**
// * @properties={typeid:24,uuid:"18D02412-8F54-48C4-B87A-C206EF05FD31"}
// */
//function ws_create()
//{
//	var object = new Object();
//	object.code = 200;
//	object.message = "Create is OK!";
//
//	return {code : 200, message : "CULO"}//object;
//}


