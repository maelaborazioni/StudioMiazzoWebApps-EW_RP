/**
 * @AllowToRunInFind
 * 
 * @properties={typeid:24,uuid:"B691F62B-6931-4BA8-A56A-38E4E91FFE0E"}
 */
function init(firstShow)
{
	_super.init(firstShow);
	
	if(foundset.find())
	{
		foundset.stato = '^';
		foundset.search();
	}
}

/**   
 * Apre la gestione delle note della richiesta
 *  
 * @param {Number} _itemInd
 * @param {Number} _parItem
 * @param {Boolean} _isSel
 * @param {String} _parMenTxt
 * @param {String} _menuTxt  
 * @param {JSEvent} event
 *
 * @properties={typeid:24,uuid:"70F46DE3-2E75-4B3D-BAB9-4BDAF71E7C9C"}
 */
function openNotesManagement(_itemInd, _parItem, _isSel, _parMenTxt, _menuTxt,event) {
	
	var frm = forms.rp_elenco_richieste_tbl_info;
	var fs = frm.foundset;
	globals.lookupFoundset(foundset.idlavoratoregiustificativotesta,fs);
	globals.ma_utl_setStatus(globals.Status.EDIT,frm.controller.getName());
	globals.ma_utl_showFormInDialog(frm.controller.getName(),'Note richiesta');
}

/**   
 * Esegue l'update dello stato della richiesta (conferma o rifiuto)
 *  
 * @param {Number} _itemInd
 * @param {Number} _parItem
 * @param {Boolean} _isSel
 * @param {String} _parMenTxt
 * @param {String} _menuTxt  
 * @param {JSEvent} event
 * @param {Number} status
 *
 * @properties={typeid:24,uuid:"74134ABF-89D9-44B0-A9CE-46859BA97971"}
 */
function updateStatoRichiesta(_itemInd, _parItem, _isSel, _parMenTxt, _menuTxt,event,status) {

	databaseManager.startTransaction();
	
	// conferma la richiesta
	if(status)
	   forms[event.getFormName()].foundset.getSelectedRecord()['stato'] = 1;
	
       //rifiuta la richiesta
	else
	   forms[event.getFormName()].foundset.getSelectedRecord()['stato'] = 2;
 
	   forms[event.getFormName()].foundset.getSelectedRecord()['approvatoil'] = globals.TODAY;
	   forms[event.getFormName()].foundset.getSelectedRecord()['approvatoda'] = security.getUserName();
	   
	if(!databaseManager.commitTransaction())
	{
		databaseManager.rollbackTransaction();
		globals.ma_utl_showWarningDialog('Errore durante il salvataggio','Setta stato richiesta');
	}
	else
	{
		
		//se la richiesta è stata confermata, inseriamo in giornaliera di budget l'evento riportato in fase di richiesta
		if (status) {
			var fsRighe = lavoratori_giustificativitesta_to_lavoratori_giustificativirighe;
			var idDitta = globals.getDitta(foundset.idlavoratore);
			if (idDitta) {
				for (var i = 1; i <= fsRighe.getSize(); i++) {
					var recRiga = fsRighe.getRecord(i);
					var propPredefEvento = globals.getProprietaPredefinitaEvento(recRiga.lavoratori_giustificativirighe_to_e2eventi.ideventoclasse);
					var evParams = globals.inizializzaParametriEvento(idDitta,
						recRiga.giorno.getFullYear() * 100 + recRiga.giorno.getMonth() + 1,
						[recRiga.giorno.getDate()],
						globals.TipoGiornaliera.BUDGET,
						globals.TipoConnessione.CLIENTE,
						[recRiga.idlavoratore],
						recRiga.idevento,
						propPredefEvento,
						recRiga.giornointero == 0 ? recRiga.ore : 0, //verificare se giorno intero o meno
						recRiga.importo,
						-1,
						'',
						recRiga.giornointero //flag copertura orario teorico
					)
					var saved = globals.salvaEvento(evParams);

					if (!saved) {
						globals.ma_utl_showErrorDialog('Si è verificato un errore...controllare in giornaliera di budget l\'esito della compilazione', 'Porta richiesta permesso in giornaliera di budget');
						return;
					}
				}

			} else
				globals.svy_mod_dialogs_global_showErrorDialog('Errore durante l\'operazione', 'Non è stato possibile ottenere il riferimento alla ditta, contattare lo studio', 'Richiesta permessi');
		}
		
		// comunicazione avvenuta conferma o rifiuto della richiesta
		var emailaddress = globals.getMailLavoratore(idlavoratore);
			
		if(emailaddress && plugins.mail.isValidEmailAddress(emailaddress))
		{
            var properties = globals.setSparkPostSmtpProperties(); 
			var subject = "Comunicazione gestione richiesta ferie e permessi";
			var msgText = "plain msg<html>Gentile utente, <br/> la sua richiesta del giorno " + datarichiesta + " relativa al periodo dal giorno ";
			    msgText += (utils.dateFormat(giorno_dal,globals.EU_DATEFORMAT) + ' al giorno ' + utils.dateFormat(giorno_al,globals.EU_DATEFORMAT));
			    msgText += (" è stata " + (stato == 1 ? 'accettata ' : ' rifutata ') + "in data " + utils.dateFormat(approvatoil,globals.EU_DATEFORMAT) + " dall'operatore " + approvatoda); 
//			    if(noteapp && noteapp != "")
//			    	msgText += (" con la seguente motivazione : " + noteapp); 
//			    msgText += "</html>";
		    var success = plugins.mail.sendMail
			                      (emailaddress, 
			                       'Gestore ferie e permessi <noreply@peoplegest.it>',
								   subject, 
			                       msgText,
								   null,
								   null,
								   null,
								   properties);
			if (!success) 
				 globals.ma_utl_showWarningDialog(plugins.mail.getLastSendMailExceptionMsg(),'Comunicazione gestione richiesta');
					
		}
		else
			globals.ma_utl_showWarningDialog('i18n:ma.msg.notValidEmailAddress','Comunicazione gestione richiesta')
	}
}

/**
 * Callback method for when form is shown.
 *
 * @param {Boolean} firstShow form is shown first time after load
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"0B85CBCA-02CB-44AF-B054-33E457884852"}
 * @AllowToRunInFind
 */
function onShow(firstShow, event) 
{
	filtraDaEvadere();
}

/**
 * @AllowToRunInFind
 *
 * @properties={typeid:24,uuid:"699D4EF9-F706-4362-8E39-CB4E849C2F5C"}
 */
function filtraDaEvadere()
{
	if(foundset.find())
	{
		foundset.stato = '^';
		foundset.search();
	}
}

/**
 * TODO generated, please specify type and doc for the params
 * @param event
 *
 * @properties={typeid:24,uuid:"F8B71551-14FF-432F-84E8-48C4DF3374F9"}
 */
function apriPopUpMenuPR(event)
{
	var enabled = true;
	
    if(_to_sec_user$user_id.sec_user_to_sec_user_to_lavoratori 
    		&& idlavoratore === _to_sec_user$user_id.sec_user_to_sec_user_to_lavoratori.idlavoratore
		|| globals.ma_utl_userOrgHasKey(globals.svy_sec_lgn_user_org_id,globals.Key.RICHIESTA_PERMESSI_NO_APPROVAZIONE))
       enabled = false;				  
	
	var source = event.getSource();
	var popUpMenu = plugins.window.createPopupMenu();
	
	var rec = foundset.getSelectedRecord();
	if (rec.stato == null) 
	{
		var confirm = popUpMenu.addMenuItem('Conferma permesso', globals.updateStatoRichiesta);
		confirm.methodArguments = [event, true];
		confirm.enabled = enabled;

		var refuse = popUpMenu.addMenuItem('Rifiuta permesso', globals.updateStatoRichiesta);
		refuse.methodArguments = [event, false];
		refuse.enabled = enabled;
	}
	
	var notes = popUpMenu.addMenuItem('Gestisci note richiesta',openNotesManagement);
	notes.methodArguments = [event];
	notes.enabled = enabled;
	
	popUpMenu.show(source);
}