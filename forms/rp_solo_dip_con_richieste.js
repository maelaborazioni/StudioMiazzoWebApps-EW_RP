/**
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"26F4B209-7BD7-47EE-9B2C-A52C22000E7D",variableType:4}
 */
var vSoloDipConRichieste = 0;

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
 * @properties={typeid:24,uuid:"6DA5F6BC-6091-46B2-BC7B-B4E612148E48"}
 */
function onDataChangeSoloRichieste(oldValue, newValue, event) {

	var frmNameTemp = 'giorn_visualizza_copertura_tbl_temp_' + globals.objGiornParams[forms.svy_nav_fr_openTabs.vTabNames[forms.svy_nav_fr_openTabs.vSelectedTab]].anno;
	var fs = forms[frmNameTemp].foundset;
	
	if (fs && fs.getSize() > 0) 
	{
		fs.removeFoundSetFilterParam('ftr_soloDipConRichieste');
		if (newValue == 1)
			fs.addFoundSetFilterParam('harichieste', '=', 1, 'ftr_soloDipConRichieste');

		fs.loadAllRecords();
	}
	else
		globals.ma_utl_showWarningDialog('Nessun dipendente con richieste presente','Richiesta permessi');
	return true;
}