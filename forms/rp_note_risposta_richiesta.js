/**
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"B5BBB60A-924D-439A-94A8-904DBC203FD0",variableType:8}
 */
var idRichiesta;
/**
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"D3BA0DBE-B392-411A-96E3-0699BDED1D03",variableType:8}
 */
var statoRichiesta;
/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"93D1BC2B-86F2-4FB0-AB25-79AAB0D73EAF"}
 */
var noteRichiesta;

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"423F68D9-DE63-4A9A-80A7-B83D550141BA"}
 */
function onActionConferma(event) 
{
	globals.ma_utl_setStatus(globals.Status.BROWSE,controller.getName());
	globals.gestisciRichiesta(idRichiesta,statoRichiesta,true,noteRichiesta);
	globals.svy_mod_closeForm(event);
	globals.refreshElenco(event,true);
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"4D7C088E-E656-4764-8F0A-DAB28752BEEE"}
 */
function onActionAnnulla(event) 
{
	globals.ma_utl_setStatus(globals.Status.BROWSE,controller.getName());
	globals.svy_mod_closeForm(event);
}

/**
 * Callback method for when form is shown.
 *
 * @param {Boolean} firstShow form is shown first time after load
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"4FAA644E-D897-47B7-AA36-2DD2CBC2AB37"}
 */
function onShow(firstShow, event) 
{
	globals.ma_utl_setStatus(globals.Status.EDIT,controller.getName());
}
