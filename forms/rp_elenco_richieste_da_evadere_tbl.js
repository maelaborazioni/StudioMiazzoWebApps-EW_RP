/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"1BFF5450-C1CB-426A-AE2A-CC08BB3BF84D"}
 */
function showInfoRatei(event) 
{
	var _proiezioneRatei = globals.getParameterValue(globals.getDitta(idlavoratore),'CRM') == 'C' ? true : false;
	var frm = forms.rp_list_ratei_reparto_dipendente;
	var ultimoPeriodoPredisposto = globals.getUltimoPeriodoPredisposto(idlavoratore);
	/** @type{Date}*/
	var date = globals.getLastDatePeriodo(ultimoPeriodoPredisposto);
	globals.ma_utl_showFormInDialog(frm.controller.getName()
		                            ,'Situazione ratei Dip. ' 
									+ globals.getNominativo(idlavoratore) 
									+ ' al ' 
									+ globals.dateFormat(date,globals.EU_DATEFORMAT)
									+ ' (ultimo mese calcolato)'
									,null
									,false
									,_proiezioneRatei ? 900 : 700
									,200);
	frm.preparaSituazioneRateiLavoratore(idlavoratore,globals.TODAY,_proiezioneRatei);
}

/**
 * @param {JSEvent} event
 *
 * @properties={typeid:24,uuid:"38D5FAF4-4DED-4268-9BE7-A3F360B25259"}
 */
function showInfo(event)
{
	var frm = forms.rp_elenco_richieste_tbl_info;
	var fs = frm.foundset;
	globals.lookupFoundset(foundset.idlavoratoregiustificativotesta,fs);
	globals.ma_utl_showFormInDialog(frm.controller.getName(),'Note richiesta');
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"B182A6D3-C7B4-4EC3-8371-C3BDA1E318EC"}
 */
function showInfoDetail(event) 
{
	var frm = forms.rp_elenco_richieste_tbl_dettaglio;
	var fs = frm.foundset;
	globals.lookupFoundset(foundset.idlavoratoregiustificativotesta,fs);
	globals.ma_utl_showFormInDialog(frm.controller.getName(),'Dettaglio richiesta');
}

/** *
 * @param _event
 * @param _form
 *
 * @properties={typeid:24,uuid:"19F23B84-3821-43EF-9B50-8C1120A4C0D0"}
 */
function onRecordSelection(_event, _form) {
	
	_super.onRecordSelection(_event, _form);
	
	var frm = forms.rp_elenco_richieste;
	frm.vNote = foundset.note;
	frm.vNoteApp = foundset.noteapp;
}

/** 
 * @param _firstShow
 * @param _event
 *
 * @properties={typeid:24,uuid:"7F01F39C-6AD7-490E-8BD6-777820051E6A"}
 * @AllowToRunInFind
 */
function onShowForm(_firstShow, _event) 
{
   globals.refreshElenco(_event,true);
}