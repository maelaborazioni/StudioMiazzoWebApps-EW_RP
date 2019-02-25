/**
 * @type {String}
 * 
 * @properties={typeid:35,uuid:"4B3DD7B1-1EE8-4C4D-85DD-F64741C60CD4"}
 */
var vNote = null;

/**
 * @type {String}
 * 
 * @properties={typeid:35,uuid:"AE3C7746-2BD7-43B6-870B-D7144C4B4593"}
 */
var vNoteApp = null;

/** 
 * @param _firstShow
 * @param _event
 *
 * @properties={typeid:24,uuid:"F0154BE0-5F86-4800-87AE-65CDA13862C6"}
 */
function onShowForm(_firstShow, _event)
{
	_super.onShowForm(_firstShow, _event);
	
	var frm = forms.rp_elenco_richieste_situazione;
	frm.vDal = null;
	frm.vAl = null;
	if(_firstShow)
	   frm.goToBrowseVisualizzaSituazione(_event);
    	
}

/** 
 * @param event
 *
 * @properties={typeid:24,uuid:"A989A1DF-C70A-42E9-9320-BC76AF17B2F6"}
 */
function onHide(event) 
{
	_super.onHide(event);
	
	var frm = forms.rp_elenco_richieste_situazione;
	globals.ma_utl_setStatus(globals.Status.BROWSE,frm.controller.getName());
}

/**
 * Gestisce una richiesta per uno dei dipendenti al di sotto del proprio 
 * gradino nella scala gerarchica
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @properties={typeid:24,uuid:"DCE8B101-3049-468A-ACEF-A2DCBF7A1535"}
 */
function onActionNuovaRichiesta(event) 
{
	// Scelta del dipendente da gestire
	/** @type {Number}*/
	var idLavoratore = null;
	if(event.getElementName() == 'btn_add_richiesta')
		idLavoratore = _to_sec_user$user_id.sec_user_to_sec_user_to_lavoratori.idlavoratore;
	else
	    idLavoratore = globals.svy_nav_showLookupWindow(event,
		                                            null,
													'AG_Lkp_Lavoratori',
													null,
													'FiltraDittaRP',
													null,
													null,
													null,
													true);
	if(idLavoratore)
	{
		// gestire l'inserimento della nuova richiesta
	    var frm = forms.rp_richiesta_permessi;
	    frm.vIdLavoratore = idLavoratore;
	    frm.vDal = null;
	    frm.vAl = null;
	    frm.vIsGestore = true;
	    globals.ma_utl_setStatus(globals.Status.EDIT,frm.controller.getName());
	    globals.ma_utl_showFormInDialog(frm.controller.getName(),'Richiesta permessi per ' + globals.getCodLavoratore(idLavoratore) + ' - ' + globals.getNominativo(idLavoratore) );

	}
	else
		globals.ma_utl_showWarningDialog('Lavoratore non riconosciuto, si prega di riprovare','Nuova richiesta ferie/permessi');
	
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"7F5DDEA2-662B-4FA4-AE1C-A3FB493817F3"}
 */
function onActionNuovaRichiestaMulti(event)
{
	// Scelta del dipendente da gestire
	/** @type {Array<Number>}*/
	var arrIdLavoratore = null;
	
	arrIdLavoratore = globals.svy_nav_showLookupWindow(event,
		                                            null,
													'AG_Lkp_Lavoratori',
													null,
													'FiltraDittaRP',
													null,
													null,
													null,
													true);
	if(arrIdLavoratore.length)
	{
		// gestire l'inserimento della nuova richiesta
	    var frm = forms.rp_richiesta_permessi_multi;
	    frm.vArrIdLavoratore = arrIdLavoratore;
	    frm.vDal = null;
	    frm.vAl = null;
	    frm.vIsGestore = true;
	    globals.ma_utl_setStatus(globals.Status.EDIT,frm.controller.getName());
	    globals.ma_utl_showFormInDialog(frm.controller.getName(),'Imposta periodo di chiusura per più dipendenti');

	}
	else
		globals.ma_utl_showWarningDialog('Nessun lavoratore selezionato','Nuova richiesta ferie/permessi');
}
