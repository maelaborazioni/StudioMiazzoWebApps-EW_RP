/**
 * @type {Date}
 * 
 * @properties={typeid:35,uuid:"6949248A-3215-4636-9608-07377D26D1F0",variableType:93}
 */
var vDal = null;
/**
 * @type {Date}
 * 
 * @properties={typeid:35,uuid:"DDD25686-320F-4BC6-A8EE-C1101F32A818",variableType:93}
 */
var vAl = null;

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"F891AC5C-F805-4239-ABD2-2A0C2AA2BA9A"}
 */
function confermaModificaRichiesta(event) {
	
	//gestione del commit
	databaseManager.startTransaction();
	
	if(!databaseManager.commitTransaction())
	{
		databaseManager.rollbackTransaction();
		globals.ma_utl_showInfoDialog('Errore durante il salvataggio dei dati, riprovare','Inserimento nuova richiesta');
	    return;
	}
	
	globals.ma_utl_setStatus(globals.Status.BROWSE,controller.getName());
    globals.svy_mod_closeForm(event);
    if(solutionModel.getForm(forms.rp_elenco_richieste_situazione.controller.getName()))
    	globals.refreshElenco(event,true);
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"D7B1ACFE-4B2D-4E2A-9828-35166C738A03"}
 */
function annullaModificaRichiesta(event) 
{
	//gestione del rollback
	databaseManager.rollbackTransaction();
	
    globals.ma_utl_setStatus(globals.Status.BROWSE,controller.getName());
    globals.svy_mod_closeForm(event);
    
}

/**
 * Handle hide window.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @returns {Boolean}
 *
 * @private
 *
 * @properties={typeid:24,uuid:"512B4B67-CF3D-453F-9702-1D8F6104F893"}
 */
function onHide(event) 
{
	annullaModificaRichiesta(event);
	return _super.onHide(event);
}
