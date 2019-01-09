/**
 * Callback method for when form is shown.
 *
 * @param {Boolean} firstShow form is shown first time after load
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"891A9A9F-ACD2-49CF-90F7-56CED470E727"}
 * @AllowToRunInFind
 */
function onShow(firstShow, event) 
{
	if(databaseManager.getEditedRecords(foundset).length == 0)
		foundset.sort('lavoratori_giustificativitesta_to_lavoratori_giustificativirighe.giorno desc');
	filtraEvase();
}


/**
 * @AllowToRunInFind
 *
 * @properties={typeid:24,uuid:"82424D89-E5FA-4D53-AE02-0FD29E4D309C"}
 */
function filtraEvase()
{
	if(foundset.find())
	{
		foundset.stato = [1,2];
		foundset.search();
	}
	
}

/**
 * Perform the element right-click action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"91B4EB6E-41A9-4E09-88E3-CD09A48EE6B8"}
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
 * Perform sort.
 *
 * @param {String} dataProviderID element data provider
 * @param {Boolean} asc sort ascending [true] or descending [false]
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"1583210B-42AC-4965-AEB8-121F549DA58B"}
 */
function onSort(dataProviderID, asc, event) {
	switch(dataProviderID)
	{
		case 'giorno_dal':
		case 'giorno_al':
			globals.refreshElenco(event,false,asc ? ' asc' : ' desc');
			break;
		default:
		    controller.sort(dataProviderID + (asc ? ' asc' : ' desc'), false)
			break;
		
	}
}
