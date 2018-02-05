/**
 * @param {JSEvent} event
 *
 * @properties={typeid:24,uuid:"B8087014-2A52-4C95-9C91-57A5B338D3E8"}
 */
function selezionaEvento(event) {
	
	var frm = forms.rp_richiesta_permessi_eventi;
	frm.callbackFormName = 'rp_richiesta_permessi_edit_tbl';
	frm.callbackIndex = forms[frm.callbackFormName].foundset.getSelectedIndex();
	globals.ma_utl_setStatus(globals.Status.EDIT,frm.controller.getName());
	globals.ma_utl_showFormInDialog(frm.controller.getName(),'Seleziona evento per richiesta');

}

/**
 * Handle changed data.
 *
 * @param oldValue old value
 * @param newValue new value
 * @param {JSEvent} event the event that triggered the action
 *
 * @returns {Boolean}
 *
 * @private
 *
 * @properties={typeid:24,uuid:"8A7A99DB-4BC4-4B60-BAAA-4B271D3BBB46"}
 */
function onDataChangeGiornoIntero(oldValue, newValue, event) {
	
	if(!newValue)
    {
    	/** @type {Date} */
    	var vDalleOre = foundset['giorno'];
    	foundset['dalleore'] = foundset['alleore'] = vDalleOre;
    }
    else
        foundset['dalleore'] = foundset['alleore'] = null;
	
    return true;
}