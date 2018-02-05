
/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"4357ACB7-0ED0-4F61-9CA7-2F49347AFEC7"}
 */
function confermaNote(event)
{
	databaseManager.startTransaction();
	if(!databaseManager.commitTransaction())
	{	
		databaseManager.rollbackTransaction();
		globals.ma_utl_showErrorDialog('Salvataggio note non riuscito','Note approvazione richiesta');
	}
	globals.ma_utl_setStatus(globals.Status.BROWSE,controller.getName());
	globals.svy_mod_closeForm(event);
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"5EAE3607-390A-4EAA-85AC-EDFE1017B1D1"}
 */
function annullaNote(event) {
	globals.ma_utl_setStatus(globals.Status.BROWSE,controller.getName());
	globals.svy_mod_closeForm(event);
}
