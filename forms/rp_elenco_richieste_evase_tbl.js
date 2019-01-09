
/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"0B1E9E28-677B-4143-853F-BCA0BA33CB17"}
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
 * @properties={typeid:24,uuid:"AF1C5031-95FF-4F4B-93B1-2EE8FD71C5B0"}
 */
function showInfoDetail(event) 
{
	var frm = forms.rp_elenco_richieste_tbl_dettaglio;
	var fs = frm.foundset;
	globals.lookupFoundset(foundset.idlavoratoregiustificativotesta,fs);
	globals.ma_utl_showFormInDialog(frm.controller.getName(),'Note richiesta');
}

/** *
 * @param _event
 * @param _form
 *
 * @properties={typeid:24,uuid:"1A4D740B-3DA2-445B-ADB4-76AA00EF8E4D"}
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
 * @properties={typeid:24,uuid:"2748132E-393F-48A9-AB50-12AFAC683098"}
 * @AllowToRunInFind
 */
function onShowForm(_firstShow, _event) 
{
   globals.refreshElenco(_event,false);
}

/**
 * Perform the element right-click action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"BE0798BE-907B-489F-9641-67536D890AE1"}
 */
function apriPopupRichiesteEvase(event) {
	
	var source = event.getSource();
	
	var enabled = true;
	
	var loggedLavId = _to_sec_user$user_id.sec_user_to_sec_user_to_lavoratori && _to_sec_user$user_id.sec_user_to_sec_user_to_lavoratori.idlavoratore;
	var currLavId = idlavoratore;
	
	if(currLavId == null || (loggedLavId && currLavId === loggedLavId && !globals.ma_utl_hasKey(globals.Key.RICHIESTA_PERMESSI_AUTO_APPROVAZIONE)))
		enabled = false;
	
	var popUpMenu = plugins.window.createPopupMenu();
    var eliminaItem = popUpMenu.addMenuItem('Elimina la richiesta evasa',globals.eliminaRichiestaEvasa);
    eliminaItem.methodArguments = [event,idlavoratoregiustificativotesta];
    eliminaItem.enabled = enabled;
    
    popUpMenu.show(source);
}

/**
 * Called before the form component is rendered.
 *
 * @param {JSRenderEvent} event the render event
 *
 * @private
 *
 * @properties={typeid:24,uuid:"96C0C6CE-46AF-46C8-97C8-C7D9F14D500B"}
 */
function onRenderInfoRichiesta(event) 
{
	var recRen = event.getRenderable();
	var rec = event.getRecord();
	
	if(rec && rec['note'] != null)
		recRen.enabled = true;
}