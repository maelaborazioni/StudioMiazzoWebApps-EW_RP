/**
 * @param {JSEvent} event
 *
 * @properties={typeid:24,uuid:"44206A25-B445-4DEF-AAC4-186EFC1B306F"}
 */
function apriPopUpMenuRichiesteDaEvadere(event)
{
	var enabled = true;
	
    if(idlavoratore == null	
    	||	_to_sec_user$user_id.sec_user_to_sec_user_to_lavoratori 
	              && idlavoratore === _to_sec_user$user_id.sec_user_to_sec_user_to_lavoratori.idlavoratore
		|| globals.ma_utl_hasKey(globals.Key.RICHIESTA_PERMESSI_NO_APPROVAZIONE))
       enabled = false;				  
	
	var source = event.getSource();
	var currFrmName = event.getFormName();
	
	var popUpMenu = plugins.window.createPopupMenu();
	
	if(currFrmName == forms.rp_gestione_richieste_da_evadere_tbl.controller.getName())
	{
		var invia = popUpMenu.addMenuItem('Invia nuovamente comunicazione',reinviaComunicazioneRichiesta);
		invia.methodArguments = [event];
	}
	else
	{
		var rec = foundset.getSelectedRecord();
		if (rec.stato == null) 
		{
			var confirm = popUpMenu.addMenuItem('Conferma permesso', globals.updateStatoRichiesta);
			confirm.methodArguments = [event, 1];
			confirm.enabled = enabled;
	
			var refuse = popUpMenu.addMenuItem('Rifiuta permesso', globals.updateStatoRichiesta);
			refuse.methodArguments = [event, 0];
			refuse.enabled = enabled;
	
			popUpMenu.addSeparator();
			
			var confirmMultiple = popUpMenu.addMenuItem('Conferma multipla', globals.confermaMultipla); 
			confirmMultiple.methodArguments = [event];
			confirmMultiple.enabled = enabled;
						
		}
	}
	
	popUpMenu.addSeparator();
	
	var notes = popUpMenu.addMenuItem('Gestisci note richiesta',openNotesManagement);
	notes.methodArguments = [event];
	notes.enabled = enabled;
	
	popUpMenu.show(source);
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
 * @properties={typeid:24,uuid:"6204E517-117D-428F-894A-2662606DDA7D"}
 */
function openNotesManagement(_itemInd, _parItem, _isSel, _parMenTxt, _menuTxt,event) {
	
	var frm = forms.rp_elenco_richieste_tbl_info;
	var fs = frm.foundset;
	globals.lookupFoundset(foundset.idlavoratoregiustificativotesta,fs);
	globals.ma_utl_setStatus(globals.Status.EDIT,frm.controller.getName());
	globals.ma_utl_showFormInDialog(frm.controller.getName(),'Note richiesta');
}

/**
 * @param {Number} _itemInd
 * @param {Number} _parItem
 * @param {Boolean} _isSel
 * @param {String} _parMenTxt
 * @param {String} _menuTxt 
 * @param {JSEvent} event
 *
 * @properties={typeid:24,uuid:"161668AC-C184-4E1A-A2E4-98BB3A4A8AF8"}
 */
function eliminaRichiesta(_itemInd,_parItem,_isSel,_parMenTxt,_menuTxt,event)
{
	var _answer = globals.ma_utl_showYesNoQuestion('Eliminare la richiesta selezionata?','Elimina richiesta');
    if(_answer)
    {
	 	if(!foundset.deleteRecord(foundset.getSelectedIndex()))
			globals.ma_utl_showWarningDialog('Errore in eliminazione','Elimina richiesta permesso');
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
 * @properties={typeid:24,uuid:"549A6550-F32F-4CC7-9608-E71D27B69760"}
 * @AllowToRunInFind
 */
function onShow(firstShow, event) 
{
	if(databaseManager.getEditedRecords(foundset).length == 0)
		foundset.sort('lavoratori_giustificativitesta_to_lavoratori_giustificativirighe.giorno desc');
	filtraDaEvadere();	
}

/**
 * @AllowToRunInFind
 *
 * @properties={typeid:24,uuid:"B73B1628-F67F-4F22-976C-CAE090D5CAEA"}
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
 * Handle record selected.
 *
 * @param {JSEvent} event the event that triggered the action
 * @param _form
 *
 * @properties={typeid:24,uuid:"FF51FCFB-9487-4DD5-93D7-D7D1254E6433"}
 */
function onRecordSelection(event, _form) 
{
   _super.onRecordSelection(event, _form)
   
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
 * @properties={typeid:24,uuid:"172AAF72-27D6-45B1-AB0E-C8058C17A9E3"}
 */
function updateStatoRichiesta(_itemInd, _parItem, _isSel, _parMenTxt, _menuTxt,event,status) 
{
	var frmName = event ? event.getFormName() : forms.rp_elenco_richieste_da_evadere_tbl.controller.getName();
	gestisciRichiestaDaEvadere(forms[frmName].foundset.getSelectedRecord()['idlavoratoregiustificativotesta'],status,frmName);
	
	var tabIndex = globals.nav.program['RP_ElencoRichieste'].tab.selected;
	globals.refreshElenco(event,tabIndex == 1 ? true : false);
}

/**
 * @param {Number} _itemInd
 * @param {Number} _parItem
 * @param {Boolean} _isSel
 * @param {String} _parMenTxt
 * @param {String} _menuTxt 
 * @param {JSEvent} event
 * 
 * @properties={typeid:24,uuid:"24FFD909-E436-4E75-BB71-F447D9809D9A"}
 */
function confermaMultipla(_itemInd,_parItem,_isSel,_parMenTxt,_menuTxt,event)
{
	/** @type {Array<Number>} */
	var idRichieste = globals.svy_nav_showLookupWindow(event,
		                             null,
									 'RP_ElencoRichieste_Conferma',
									 null,
									 'filterRichiesteDaConfermare',
									 null,
									 null,
									 null,
									 true,
									 null,
									 null,
									 true									 
									 );
	
	if(idRichieste && idRichieste.length > 0)
		globals.updateMultiploStatoRichiesta(idRichieste);
	
}

/**
 * @param {JSFoundset} fs
 * 
 * @properties={typeid:24,uuid:"FE656CF6-A12D-44D3-ACB8-0869DF361BD4"}
 */
function filterRichiesteDaConfermare(fs)
{
	fs.addFoundSetFilterParam('idlavoratore',globals.ComparisonOperator.IN,globals.foundsetToArray(forms.rp_elenco_richieste_da_evadere_tbl.foundset,'idlavoratore'))
	fs.addFoundSetFilterParam('stato','=',null);
	return fs;
}

/**
 * @param {Number} idgiustificativotesta
 * @param {Number} status
 * @param {String} frmName
 *
 * @properties={typeid:24,uuid:"7EC62840-D0D1-459D-9809-DB15156FFF33"}
 */
function gestisciRichiestaDaEvadere(idgiustificativotesta,status,frmName)
{
	try
	{
	    if (forms[frmName].foundset.selectRecord(idgiustificativotesta))
	    {
	    	var idLavoratore = globals.getLavoratoreFromGiustificativo(idgiustificativotesta);
	    	var userId = globals.getUserIdFromIdLavoratore(idLavoratore,globals.svy_sec_lgn_owner_id);
	    	
	    	if(userId == null)
	    		throw new Error('Non è stato possibile identificare l\'utente specifico. Contattare il servizio di assistenza dello Studio');
	    	
	    	var invioMail = userId
			                && !globals.ma_utl_userHasKey(userId,
	    		                                       globals.ma_utl_getSecurityKeyId(globals.Key.NON_INVIARE_MAIL)) 
			                && globals.ma_utl_showYesNoQuestion('Inviare una mail per informare il dipendente?','Invia mail di gestione richiesta');globals.ma_utl_showYesNoQuestion('Inviare una mail per informare il/i dipendenti?','Invia mail di gestione richiesta');
		 	globals.gestisciRichiesta(idgiustificativotesta,status,invioMail);
	    }
	}
	catch(ex)
	{
		globals.ma_utl_showErrorDialog(ex.message,'Gestisci richiesta');
	}
}
/**
 * Perform sort.
 *
 * @param {String} dataProviderID element data provider
 * @param {Boolean} asc sort ascending [true] or descending [false]
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"9BAD947A-65A8-4772-BE38-46625D56C2CA"}
 */
function onSort(dataProviderID, asc, event)
{
	switch(dataProviderID)
	{
		case 'giorno_dal':
		case 'giorno_al':
			globals.refreshElenco(event,true,asc ? ' asc' : ' desc');
			break;
		default:
		    controller.sort(dataProviderID + (asc ? ' asc' : ' desc'), false)
			break;
		
	}
	
}

/**
 * TODO generated, please specify type and doc for the params
 * @param itemInd
 * @param _parItem
 * @param _isSel
 * @param _parMenTxt
 * @param _menuTxt
 * @param _event
 *
 * @properties={typeid:24,uuid:"E150750F-BBB5-4D5C-9366-7DB4F9A61AD7"}
 */
function reinviaComunicazioneRichiesta(itemInd, _parItem, _isSel, _parMenTxt, _menuTxt, _event)
{
	globals.inviaMailRichiestaEsistente(foundset.getSelectedRecord());
}